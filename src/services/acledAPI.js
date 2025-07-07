import axios from 'axios';

export class ACLEDAPIClient {
  constructor(email, accessKey) {
    this.email = email;
    this.accessKey = accessKey;
    this.baseURL = 'https://api.acleddata.com';
  }

  async getRecentConflicts(days = 30) {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    
    const params = {
      key: this.accessKey,
      email: this.email,
      event_date: `${startDate.toISOString().split('T')[0]}|${endDate.toISOString().split('T')[0]}`,
      event_date_where: 'BETWEEN',
      fields: 'event_date,event_type,country,latitude,longitude,fatalities,notes,actor1',
      limit: 1000,
      format: 'json'
    };

    try {
      const response = await axios.get(`${this.baseURL}/acled/read`, { params });
      return response.data.data;
    } catch (error) {
      console.error('ACLED API Error:', error);
      throw error;
    }
  }

  async getCountryConflicts(country, year = new Date().getFullYear()) {
    const params = {
      key: this.accessKey,
      email: this.email,
      country: country,
      year: year,
      event_type: 'Violence against civilians:OR:Battles:OR:Explosions/Remote violence',
      fields: 'event_date,event_type,country,latitude,longitude,fatalities,notes,actor1',
      limit: 5000,
      format: 'json'
    };

    try {
      const response = await axios.get(`${this.baseURL}/acled/read`, { params });
      return response.data.data;
    } catch (error) {
      console.error('ACLED API Error:', error);
      throw error;
    }
  }

  async getRegionalConflicts(minLat, maxLat, minLng, maxLng, days = 30) {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    
    const params = {
      key: this.accessKey,
      email: this.email,
      latitude: `${minLat}|${maxLat}`,
      latitude_where: 'BETWEEN',
      longitude: `${minLng}|${maxLng}`,
      longitude_where: 'BETWEEN',
      event_date: `${startDate.toISOString().split('T')[0]}|${endDate.toISOString().split('T')[0]}`,
      event_date_where: 'BETWEEN',
      fields: 'event_date,event_type,country,latitude,longitude,fatalities,notes,actor1',
      limit: 2000,
      format: 'json'
    };

    try {
      const response = await axios.get(`${this.baseURL}/acled/read`, { params });
      return response.data.data;
    } catch (error) {
      console.error('ACLED API Error:', error);
      throw error;
    }
  }
}

export class PeaceMapDataTransformer {
  static transformACLEDData(acledData) {
    if (!acledData || !Array.isArray(acledData)) {
      return [];
    }

    return acledData.map(event => ({
      id: event.data_date + '_' + event.latitude + '_' + event.longitude,
      date: event.event_date,
      type: event.event_type,
      country: event.country,
      latitude: parseFloat(event.latitude),
      longitude: parseFloat(event.longitude),
      fatalities: parseInt(event.fatalities) || 0,
      description: event.notes || '',
      actor: event.actor1 || 'Unknown',
      severity: this.calculateSeverity(event.event_type, parseInt(event.fatalities) || 0),
      color: this.getMarkerColor(event.event_type, parseInt(event.fatalities) || 0)
    }));
  }

  static calculateSeverity(eventType, fatalities) {
    let baseSeverity = 0;
    
    switch(eventType) {
      case 'Violence against civilians':
        baseSeverity = 3;
        break;
      case 'Battles':
        baseSeverity = 2;
        break;
      case 'Explosions/Remote violence':
        baseSeverity = 3;
        break;
      case 'Protests':
        baseSeverity = 1;
        break;
      default:
        baseSeverity = 1;
    }

    if (fatalities > 50) baseSeverity += 3;
    else if (fatalities > 10) baseSeverity += 2;
    else if (fatalities > 0) baseSeverity += 1;

    return Math.min(baseSeverity, 5);
  }

  static getMarkerColor(eventType, fatalities) {
    const severity = this.calculateSeverity(eventType, fatalities);
    
    if (eventType === 'Protests') {
      return severity > 3 ? '#ff4444' : severity > 2 ? '#ff8800' : severity > 1 ? '#ffcc00' : '#00cc00';
    }
    
    if (eventType === 'Violence against civilians') {
      return severity > 4 ? '#0066cc' : severity > 3 ? '#8B4513' : severity > 2 ? '#ff4444' : '#ff8800';
    }
    
    if (eventType === 'Battles') {
      return severity > 4 ? '#000000' : severity > 3 ? '#8B4513' : severity > 2 ? '#ff4444' : '#9966cc';
    }
    
    return severity > 3 ? '#ff4444' : severity > 2 ? '#ff8800' : '#ffcc00';
  }

  static calculatePeaceScore(events) {
    let score = 10;
    
    const violentEvents = events.filter(e => 
      ['Violence against civilians', 'Battles', 'Explosions/Remote violence'].includes(e.type)
    );
    const protestEvents = events.filter(e => e.type === 'Protests');
    
    score -= Math.min(violentEvents.length * 0.1, 5);
    score -= Math.min(protestEvents.length * 0.05, 2);
    
    const totalFatalities = events.reduce((sum, event) => sum + event.fatalities, 0);
    score -= Math.min(totalFatalities * 0.01, 3);
    
    return {
      score: Math.max(0, Math.round(score * 10) / 10),
      status: score > 8 ? 'peaceful' : score > 5 ? 'moderate' : 'conflict'
    };
  }
}