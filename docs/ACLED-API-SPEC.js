/**
 * ACLED API 실행 가능한 구현 코드
 * Wishing Peace Map 프로젝트용
 * 
 * 📖 읽기 쉬운 가이드: docs/ACLED-API-Guide.md
 * 🛠️ 실행 코드: docs/acled-api-spec.js (이 파일)
 * 
 * @version 1.0.0
 * @author Wishing Peace Map Team
 */

class ACLEDAPIClient {
    constructor(email, apiKey) {
        this.baseURL = 'https://api.acleddata.com';
        this.email = email;
        this.apiKey = apiKey;
        
        // 기본 파라미터
        this.defaultParams = {
            key: apiKey,
            email: email,
            format: 'json'
        };
    }

    // 1. 메인 ACLED 데이터 가져오기
    async getConflictData(params = {}) {
        const queryParams = { 
            ...this.defaultParams, 
            limit: 5000, // 기본 제한: 5000개
            ...params 
        };
        
        const url = `${this.baseURL}/acled/read?${new URLSearchParams(queryParams)}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(`API Error: ${data.error?.message || 'Unknown error'}`);
            }
            
            return {
                success: true,
                count: data.count,
                lastUpdate: data.last_update,
                data: data.data,
                messages: data.messages
            };
        } catch (error) {
            console.error('ACLED API 오류:', error);
            return { success: false, error: error.message };
        }
    }

    // 2. 최근 분쟁 데이터 (Peace Map용)
    async getRecentConflicts(days = 30) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        
        return await this.getConflictData({
            event_date: `${startDate.toISOString().split('T')[0]}|${endDate.toISOString().split('T')[0]}`,
            event_date_where: 'BETWEEN',
            fields: 'event_date,event_type,country,admin1,admin2,latitude,longitude,fatalities,notes,actor1,actor2',
            limit: 1000
        });
    }

    // 3. 특정 국가의 평화 지수용 데이터
    async getPeaceIndexData(countryName, year = 2024) {
        // 폭력 사건들
        const violentEvents = await this.getConflictData({
            country: countryName,
            year: year,
            event_type: 'Violence against civilians|Battles|Explosions/Remote violence',
            fields: 'event_date,event_type,fatalities,sub_event_type'
        });

        // 시위/폭동 (덜 심각한 사건들)
        const protestEvents = await this.getConflictData({
            country: countryName,
            year: year,
            event_type: 'Protests|Riots',
            fields: 'event_date,event_type,fatalities'
        });

        return {
            violent: violentEvents,
            protests: protestEvents,
            peaceScore: this.calculatePeaceScore(violentEvents, protestEvents)
        };
    }

    // 4. 지역별 데이터 (지도 표시용)
    async getRegionalData(bounds) {
        // bounds = { north, south, east, west }
        return await this.getConflictData({
            latitude: `${bounds.south}|${bounds.north}`,
            latitude_where: 'BETWEEN',
            longitude: `${bounds.west}|${bounds.east}`,
            longitude_where: 'BETWEEN',
            fields: 'event_date,event_type,country,latitude,longitude,fatalities,notes',
            limit: 2000
        });
    }

    // 5. 국가별 월간 트렌드
    async getMonthlyTrend(countryName, months = 6) {
        const results = [];
        const currentDate = new Date();

        for (let i = 0; i < months; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            
            const startDate = date.toISOString().split('T')[0];
            const endDate = nextMonth.toISOString().split('T')[0];

            const monthData = await this.getConflictData({
                country: countryName,
                event_date: `${startDate}|${endDate}`,
                event_date_where: 'BETWEEN',
                fields: 'event_date,event_type,fatalities'
            });

            if (monthData.success) {
                results.push({
                    month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
                    events: monthData.count,
                    fatalities: monthData.data?.reduce((sum, event) => 
                        sum + (parseInt(event.fatalities) || 0), 0) || 0
                });
            }
        }

        return results.reverse(); // 오래된 것부터 정렬
    }

    // 6. 여러 형식으로 데이터 다운로드
    async downloadData(params, format = 'json') {
        const queryParams = { 
            ...this.defaultParams, 
            ...params 
        };
        
        let url = `${this.baseURL}/acled/read`;
        
        // 형식에 따라 URL 수정
        switch (format) {
            case 'csv':
                url += '.csv';
                break;
            case 'xml':
                url += '.xml';
                break;
            case 'txt':
                url += '.txt';
                break;
            default:
                // json은 기본값
        }
        
        url += '?' + new URLSearchParams(queryParams);
        
        const response = await fetch(url);
        
        if (format === 'json') {
            return await response.json();
        } else {
            return await response.text();
        }
    }

    // 7. 복잡한 쿼리 (OR 조건 사용)
    async getComplexQuery(orConditions, andConditions = {}) {
        // OR 조건 예시: { country: ['Ukraine', 'Syria'], event_type: ['Battles', 'Violence against civilians'] }
        // AND 조건 예시: { year: 2024, fatalities_where: '>', fatalities: 0 }
        
        const params = { ...this.defaultParams, ...andConditions };
        
        // OR 조건 처리
        Object.keys(orConditions).forEach(field => {
            if (Array.isArray(orConditions[field])) {
                params[field] = orConditions[field].join(':OR:');
            }
        });

        return await this.getConflictData(params);
    }

    // 8. 페이지네이션으로 대량 데이터 가져오기
    async getAllData(params, maxPages = 10) {
        const allData = [];
        let page = 1;
        let hasMoreData = true;

        while (hasMoreData && page <= maxPages) {
            const pageData = await this.getConflictData({
                ...params,
                page: page
            });

            if (pageData.success && pageData.data && pageData.data.length > 0) {
                allData.push(...pageData.data);
                page++;
                
                // 5000개씩 반환되므로, 5000개보다 적으면 마지막 페이지
                if (pageData.data.length < 5000) {
                    hasMoreData = false;
                }
            } else {
                hasMoreData = false;
            }
        }

        return {
            success: true,
            totalCount: allData.length,
            data: allData
        };
    }

    // 9. 평화 점수 계산 (내부 함수)
    calculatePeaceScore(violentEvents, protestEvents) {
        const violent = violentEvents.success ? violentEvents.data || [] : [];
        const protests = protestEvents.success ? protestEvents.data || [] : [];
        
        const totalViolentEvents = violent.length;
        const totalProtests = protests.length;
        const totalFatalities = violent.reduce((sum, event) => 
            sum + (parseInt(event.fatalities) || 0), 0);
        
        // 평화 점수 계산 (0-10, 높을수록 평화로움)
        let score = 10;
        score -= Math.min(totalViolentEvents * 0.1, 5); // 폭력 사건 감점
        score -= Math.min(totalProtests * 0.05, 2); // 시위 감점
        score -= Math.min(totalFatalities * 0.01, 3); // 사상자 감점
        
        return {
            score: Math.max(0, Math.round(score * 10) / 10),
            violentEvents: totalViolentEvents,
            protests: totalProtests,
            fatalities: totalFatalities,
            status: score > 8 ? 'peaceful' : score > 5 ? 'moderate' : 'conflict'
        };
    }

    // 10. 삭제된 데이터 확인
    async getDeletedData(params = {}) {
        const queryParams = { 
            ...this.defaultParams, 
            ...params 
        };
        
        const url = `${this.baseURL}/deleted/read?${new URLSearchParams(queryParams)}`;
        const response = await fetch(url);
        return await response.json();
    }

    // 11. 액터(참여자) 정보 가져오기
    async getActors(params = {}) {
        const queryParams = { 
            ...this.defaultParams, 
            ...params 
        };
        
        const url = `${this.baseURL}/actor/read?${new URLSearchParams(queryParams)}`;
        const response = await fetch(url);
        return await response.json();
    }

    // 12. 국가 정보 가져오기
    async getCountries(params = {}) {
        const queryParams = { 
            ...this.defaultParams, 
            ...params 
        };
        
        const url = `${this.baseURL}/country/read?${new URLSearchParams(queryParams)}`;
        const response = await fetch(url);
        return await response.json();
    }

    // 13. 지역 정보 가져오기
    async getRegions(params = {}) {
        const queryParams = { 
            ...this.defaultParams, 
            ...params 
        };
        
        const url = `${this.baseURL}/region/read?${new URLSearchParams(queryParams)}`;
        const response = await fetch(url);
        return await response.json();
    }
}

// Peace Map용 데이터 변환 함수들
class PeaceMapDataTransformer {
    static transformACLEDData(acledData) {
        if (!acledData.success || !acledData.data) return [];

        return acledData.data.map(event => ({
            id: event.event_id_cnty,
            date: event.event_date,
            type: this.categorizeEventType(event.event_type),
            subType: event.sub_event_type,
            country: event.country,
            region: event.admin1,
            city: event.admin2,
            location: event.location,
            coordinates: {
                lat: parseFloat(event.latitude),
                lng: parseFloat(event.longitude)
            },
            casualties: parseInt(event.fatalities) || 0,
            description: event.notes,
            actors: {
                primary: event.actor1,
                secondary: event.actor2
            },
            severity: this.getSeverityLevel(parseInt(event.fatalities) || 0),
            source: 'ACLED'
        })).filter(event => 
            event.coordinates.lat && 
            event.coordinates.lng && 
            !isNaN(event.coordinates.lat) && 
            !isNaN(event.coordinates.lng)
        );
    }

    static categorizeEventType(eventType) {
        const typeMap = {
            'Battles': 'conflict',
            'Violence against civilians': 'violence',
            'Explosions/Remote violence': 'violence',
            'Protests': 'protest',
            'Riots': 'unrest',
            'Strategic developments': 'diplomatic'
        };
        return typeMap[eventType] || 'other';
    }

    static getSeverityLevel(fatalities) {
        if (fatalities === 0) return 'low';
        if (fatalities < 5) return 'medium';
        if (fatalities < 20) return 'high';
        return 'critical';
    }

    static getMarkerColor(type, severity) {
        const colorMap = {
            conflict: { low: '#ff9ff3', medium: '#ff6b6b', high: '#ee5a24', critical: '#8b0000' },
            violence: { low: '#ffa502', medium: '#ff7675', high: '#d63031', critical: '#74b9ff' },
            protest: { low: '#a29bfe', medium: '#6c5ce7', high: '#5f3dc4', critical: '#3742fa' },
            unrest: { low: '#fd79a8', medium: '#e84393', high: '#c44569', critical: '#8e44ad' },
            diplomatic: { low: '#00b894', medium: '#00a085', high: '#078f6f', critical: '#0d7377' }
        };
        
        return colorMap[type]?.[severity] || '#636e72';
    }
}

// 사용 예시
async function initWishingPeaceMap() {
    // 환경 변수에서 API 정보 가져오기
    const acled = new ACLEDAPIClient(
        process.env.ACLED_EMAIL || 'your-email@example.com',
        process.env.ACLED_API_KEY || 'your-api-key'
    );

    try {
        console.log('🕊️ Wishing Peace Map 데이터 수집 시작...');

        // 1. 최근 글로벌 분쟁 데이터
        const recentConflicts = await acled.getRecentConflicts(30);
        console.log('✅ 최근 30일 분쟁:', recentConflicts.count, '건');

        // 2. 한국 평화 지수
        const koreaData = await acled.getPeaceIndexData('South Korea');
        console.log('🇰🇷 한국 평화 점수:', koreaData.peaceScore.score);

        // 3. 우크라이나 상황
        const ukraineData = await acled.getPeaceIndexData('Ukraine');
        console.log('🇺🇦 우크라이나 평화 점수:', ukraineData.peaceScore.score);

        // 4. 지도용 데이터 변환
        const mapData = PeaceMapDataTransformer.transformACLEDData(recentConflicts);
        console.log('🗺️ 지도용 데이터:', mapData.length, '개 마커');

        // 5. 평화로운 국가들 찾기
        const peacefulCountries = await acled.getComplexQuery(
            { event_type: ['Strategic developments'] }, // 외교적 발전
            { year: 2024, limit: 100 }
        );

        return {
            conflicts: mapData,
            peaceScores: {
                korea: koreaData.peaceScore,
                ukraine: ukraineData.peaceScore
            },
            peaceful: peacefulCountries,
            summary: {
                totalEvents: recentConflicts.count,
                lastUpdate: recentConflicts.lastUpdate
            }
        };

    } catch (error) {
        console.error('❌ 데이터 수집 실패:', error);
        return null;
    }
}

// Next.js API 라우트 예시
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const data = await initWishingPeaceMap();
        res.status(200).json({
            success: true,
            data: data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// 환경 변수 설정 (.env.local)
/*
ACLED_EMAIL=your-email@example.com
ACLED_API_KEY=your-api-key-from-developer-portal
NEXT_PUBLIC_APP_NAME=Wishing Peace Map
*/