import axios from 'axios';

export class ACLEDAPIClient {
  constructor(email, accessKey) {
    this.email = email;
    this.accessKey = accessKey;
    this.baseURL = 'https://api.acleddata.com';
  }

  async getRecentConflicts(days = 30, limit = 1000) {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    const params = {
      key: this.accessKey,
      email: this.email,
      event_date: `${startDateStr}|${endDateStr}`,
      event_date_where: 'BETWEEN',
      // fields 파라미터 제거 - SQL 에러 방지 (모든 필드 반환)
      limit: limit,
      format: 'json'
    };

    try {
      console.log('=== API 요청 날짜 범위 ===');
      console.log('요청 시작 날짜:', startDateStr);
      console.log('요청 종료 날짜:', endDateStr);
      console.log('요청 기간:', days, '일간');
      console.log('현재 시간:', new Date().toISOString());
      
      console.log('Requesting ACLED data with params:', {
        email: this.email,
        accessKey: this.accessKey ? '***' : 'missing',
        dateRange: params.event_date,
        limit: params.limit
      });
      
      // Postman과 비교할 수 있도록 전체 URL 출력
      const urlParams = new URLSearchParams(params);
      const fullUrl = `${this.baseURL}/acled/read?${urlParams.toString()}`;
      console.log('Full API URL (for testing):', fullUrl);
      
      const response = await axios.get(`${this.baseURL}/acled/read`, { params });
      
      // ACLED API 응답 구조 처리
      console.log('=== ACLED API 응답 구조 분석 ===');
      console.log('HTTP Response status:', response.status);
      console.log('Response data keys:', Object.keys(response.data || {}));
      console.log('API success flag:', response.data?.success);
      console.log('API status code:', response.data?.status);
      console.log('Data count:', response.data?.count);
      console.log('Full response data:', response.data);
      
      // ACLED API 응답 형식: { status, success, data: [...] } 또는 { status, success: false, error }
      if (!response.data) {
        throw new Error('No response data received');
      }
      
      // API 에러 체크
      if (response.data.success === false) {
        console.error('=== ACLED API 에러 상세 정보 ===');
        console.error('Full error object:', response.data.error);
        console.error('Error type:', typeof response.data.error);
        console.error('Error keys:', response.data.error ? Object.keys(response.data.error) : 'null');
        
        let errorMsg = 'API returned success: false';
        
        if (response.data.error) {
          if (typeof response.data.error === 'string') {
            errorMsg = response.data.error;
          } else if (typeof response.data.error === 'object') {
            // 객체인 경우 여러 가능한 필드 확인
            errorMsg = response.data.error.message || 
                      response.data.error.detail || 
                      response.data.error.description ||
                      JSON.stringify(response.data.error);
          }
        }
        
        console.error('Final error message:', errorMsg);
        throw new Error(`ACLED API Error: ${errorMsg}`);
      }
      
      // 데이터 추출
      const conflictData = response.data.data;
      if (!Array.isArray(conflictData)) {
        console.error('Expected data array but got:', typeof conflictData, conflictData);
        throw new Error(`Expected data array but got: ${typeof conflictData}`);
      }
      
      console.log(`Successfully loaded ${conflictData.length} conflict events from ${response.data.count} total`);
      
      // 데이터 제한 경고
      if (conflictData.length >= limit && response.data.count > limit) {
        console.warn(`⚠️ API 제한으로 ${limit}개만 표시됨. 실제로는 더 많은 충돌이 있습니다.`);
        console.warn(`총 사용 가능한 데이터: ${response.data.count}개`);
        console.warn(`현재 표시 중: ${conflictData.length}개`);
        console.warn(`누락된 데이터: ${response.data.count - conflictData.length}개`);
      }
      
      // 데이터 비율 표시
      const percentage = response.data.count > 0 ? ((conflictData.length / response.data.count) * 100).toFixed(1) : 0;
      console.log(`표시 비율: ${percentage}% (${conflictData.length}/${response.data.count})`);
      
      // API 메시지 표시 (예: deprecation 알림)
      if (response.data.messages && response.data.messages.length > 0) {
        console.warn('ACLED API Messages:', response.data.messages);
      }
      
      return conflictData;
    } catch (error) {
      if (error.response) {
        console.error('ACLED API Response Error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
        
        if (error.response.status === 401) {
          throw new Error('Invalid ACLED API credentials');
        } else if (error.response.status === 403) {
          throw new Error('ACLED API access forbidden - check your subscription');
        } else if (error.response.status === 429) {
          throw new Error('ACLED API rate limit exceeded');
        }
      } else if (error.request) {
        console.error('ACLED API Network Error:', error.message);
        throw new Error('Network error - check internet connection');
      } else {
        console.error('ACLED API Error:', error.message);
      }
      throw error;
    }
  }

  // 모든 충돌 데이터를 가져오는 메서드 (캐싱 포함)
  async getAllConflicts(days = 30) {
    // 캐시 확인
    const cached = ACLEDCache.getCache();
    if (cached) {
      console.log('캐시된 데이터 사용:', cached.length, '개 이벤트');
      return cached;
    }
    
    console.log('캐시가 없거나 만료됨. API에서 전체 데이터 가져오기 시작...');
    const startTime = performance.now();
    
    try {
      // ACLED API는 한 번에 최대 10000개까지 반환 가능
      // 5일치 데이터(약 5500개)는 한 번에 가져올 수 있음
      const allData = await this.getRecentConflicts(days, 10000);
      
      const endTime = performance.now();
      console.log(`전체 데이터 수집 완료: ${allData.length}개, ${Math.round(endTime - startTime)}ms`);
      
      // 캐싱
      if (allData.length > 0) {
        ACLEDCache.setCache(allData);
      }
      
      return allData;
    } catch (error) {
      console.error('getAllConflicts 실패:', error);
      // 실패 시 기본 limit로 재시도
      console.log('전체 데이터 가져오기 실패, 1000개로 재시도...');
      return await this.getRecentConflicts(days, 1000);
    }
  }

  async getCountryConflicts(country, year = new Date().getFullYear()) {
    const params = {
      key: this.accessKey,
      email: this.email,
      country: country,
      year: year,
      event_type: 'Violence against civilians:OR:Battles:OR:Explosions/Remote violence',
      // fields 파라미터 제거 - SQL 에러 방지
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
      // fields 파라미터 제거 - SQL 에러 방지
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
      console.warn('Invalid ACLED data received:', acledData);
      return [];
    }
    
    console.log(`Transforming ${acledData.length} ACLED events`);
    
    // 날짜 분포 분석
    const dateDistribution = {};
    acledData.forEach(event => {
      const date = event.event_date;
      dateDistribution[date] = (dateDistribution[date] || 0) + 1;
    });
    
    console.log('=== 날짜 분포 분석 ===');
    console.log('고유한 날짜 수:', Object.keys(dateDistribution).length);
    console.log('날짜별 이벤트 수:', dateDistribution);
    
    // 가장 빈번한 날짜들 상위 5개
    const sortedDates = Object.entries(dateDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    console.log('가장 많은 이벤트가 있는 날짜 Top 5:', sortedDates);

    const transformedEvents = acledData.map((event, index) => {
      // 이벤트 구조 디버깅
      if (index < 3) { // 처음 3개 이벤트만 자세히 로깅
        console.log(`Event ${index} structure:`, Object.keys(event));
        console.log(`Event ${index} 날짜 정보:`, {
          event_date: event.event_date,
          year: event.year,
          timestamp: event.timestamp
        });
        console.log(`Event ${index} sample:`, event);
      }
      
      const lat = parseFloat(event.latitude);
      const lng = parseFloat(event.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        console.warn('Invalid coordinates for event:', event);
        return null;
      }
      
      return {
        id: (event.data_date || event.event_id_cnty || Date.now()) + '_' + lat + '_' + lng,
        date: event.event_date,
        type: event.event_type,
        country: event.country,
        latitude: lat,
        longitude: lng,
        fatalities: parseInt(event.fatalities) || 0,
        description: event.notes || event.event_type || 'No description available',
        actor: event.actor1 || 'Unknown',
        severity: this.calculateSeverity(event.event_type, parseInt(event.fatalities) || 0),
        color: this.getMarkerColor(event.event_type, parseInt(event.fatalities) || 0)
      };
    }).filter(event => event !== null);
    
    console.log(`Successfully transformed ${transformedEvents.length} valid events`);
    return transformedEvents;
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

// localStorage 캐싱 클래스
export class ACLEDCache {
  static CACHE_KEY = 'acled_conflicts_data';
  static CACHE_TIME_KEY = 'acled_cache_timestamp';
  static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24시간
  
  static getCache() {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      const timestamp = localStorage.getItem(this.CACHE_TIME_KEY);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < this.CACHE_DURATION) {
          console.log(`캐시 사용 (${Math.round(age / 1000 / 60)}분 경과)`);
          return JSON.parse(cached);
        } else {
          console.log('캐시 만료됨');
          this.clearCache();
        }
      }
    } catch (error) {
      console.error('캐시 읽기 실패:', error);
      this.clearCache();
    }
    return null;
  }
  
  static setCache(data) {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(this.CACHE_TIME_KEY, Date.now().toString());
      console.log(`캐시 저장 완료: ${data.length}개 이벤트`);
    } catch (error) {
      console.error('캐시 저장 실패:', error);
      // localStorage 용량 초과 시 캐시 삭제
      if (error.name === 'QuotaExceededError') {
        this.clearCache();
      }
    }
  }
  
  static clearCache() {
    localStorage.removeItem(this.CACHE_KEY);
    localStorage.removeItem(this.CACHE_TIME_KEY);
    console.log('캐시 삭제됨');
  }
}