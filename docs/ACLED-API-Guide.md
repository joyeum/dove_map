# 🔥 ACLED API 완전 가이드

> **Wishing Peace Map 프로젝트용 ACLED API 사용 가이드**

## 🔑 ACLED API 핵심 정보 요약

### 1. 회원가입 및 API 키
- 🔗 **공식 사이트**: https://developer.acleddata.com/
- 📧 **가입 방법**: 이메일로 무료 가입
- 🔑 **API 키 생성**: 개발자 포털에서 생성 (한 번만 표시됨!)
- ⚠️ **주의사항**: API 키는 IP 주소와 연동됨

### 2. API 기본 구조
```javascript
// 기본 URL 패턴
https://api.acleddata.com/{data}/{command}

// 필수 파라미터
?key={api_key}&email={email}

// 지원 형식
.json (기본)
.csv
.xml
.txt
```

### 3. 주요 엔드포인트
- `/acled/read` - 메인 분쟁 데이터
- `/deleted/read` - 삭제된 데이터
- `/actor/read` - 참여자 정보
- `/country/read` - 국가 정보
- `/region/read` - 지역 정보

### 4. 중요한 제한사항
- **기본 제한**: 5,000개 행 (monadic: 10,000개)
- **페이지네이션**: `page=1`, `page=2`...
- **필드 제한**: `fields=country|fatalities|latitude|longitude`
- **복잡한 쿼리**: OR 조건 `:OR:` 사용

### 5. Peace Map 핵심 필드
```javascript
// 지도 표시용 필수 필드
fields: 'event_date,event_type,country,latitude,longitude,fatalities,notes,actor1'

// 평화 지수 계산용
event_type: 'Violence against civilians|Battles|Explosions/Remote violence'
```

### 6. 날짜 필터링
```javascript
// 최근 30일
event_date: '2024-01-01|2024-01-31'
event_date_where: 'BETWEEN'

// 특정 연도
year: 2024
```

## 🚀 빠른 시작

### 1. 환경 변수 설정
```bash
# .env.local
VITE_ACLED_EMAIL=your-email@example.com
VITE_ACLED_ACCESS_KEY=your-api-key
```

### 2. 기본 API 호출
```javascript
const acledData = await fetch(
  `https://api.acleddata.com/acled/read?` +
  `key=${process.env.VITE_ACLED_ACCESS_KEY}&` +
  `email=${process.env.VITE_ACLED_EMAIL}&` +
  `limit=100&format=json`
);
```

### 3. Peace Map용 데이터
```javascript
// 최근 분쟁 데이터
const recentConflicts = await fetch(
  `https://api.acleddata.com/acled/read?` +
  `key=${apiKey}&email=${email}&` +
  `event_date=2024-01-01|2024-01-31&` +
  `event_date_where=BETWEEN&` +
  `fields=event_date,event_type,country,latitude,longitude,fatalities,notes&` +
  `limit=1000&format=json`
);
```

## 📊 주요 사용 사례

### 1. 국가별 평화 지수 계산
```javascript
// 폭력 사건 수집
const violentEvents = await fetch(
  `https://api.acleddata.com/acled/read?` +
  `country=Ukraine&` +
  `event_type=Violence against civilians:OR:Battles:OR:Explosions/Remote violence&` +
  `year=2024`
);

// 평화 점수 계산 로직
const peaceScore = calculateScore(violentEvents);
```

### 2. 지역별 분쟁 현황
```javascript
// 좌표 기반 검색
const regionalData = await fetch(
  `https://api.acleddata.com/acled/read?` +
  `latitude=40|60&latitude_where=BETWEEN&` +
  `longitude=20|40&longitude_where=BETWEEN&` +
  `limit=2000`
);
```

### 3. 월간 트렌드 분석
```javascript
// 월별 데이터 수집
for (let month = 1; month <= 12; month++) {
  const monthlyData = await fetch(
    `https://api.acleddata.com/acled/read?` +
    `country=Syria&` +
    `event_date=2024-${month.toString().padStart(2, '0')}-01|2024-${month.toString().padStart(2, '0')}-31&` +
    `event_date_where=BETWEEN`
  );
}
```

## 🛠️ 고급 기능

### 1. 복잡한 OR 쿼리
```javascript
// 여러 국가 동시 검색
country: 'Ukraine:OR:Syria:OR:Yemen'

// 여러 이벤트 타입
event_type: 'Battles:OR:Violence against civilians'
```

### 2. 페이지네이션
```javascript
// 대량 데이터 수집
for (let page = 1; page <= maxPages; page++) {
  const pageData = await fetch(
    `https://api.acleddata.com/acled/read?` +
    `country=Afghanistan&page=${page}&limit=5000`
  );
}
```

### 3. 다양한 출력 형식
```javascript
// CSV 다운로드
const csvData = await fetch(
  'https://api.acleddata.com/acled/read.csv?' +
  'country=Ukraine&limit=1000'
);

// XML 형식
const xmlData = await fetch(
  'https://api.acleddata.com/acled/read.xml?' +
  'country=Ukraine&limit=1000'
);
```

## 📈 평화 지수 계산 공식

```javascript
function calculatePeaceScore(violentEvents, protestEvents) {
  let score = 10; // 기본 점수
  
  // 폭력 사건 감점
  score -= Math.min(violentEvents.length * 0.1, 5);
  
  // 시위 감점  
  score -= Math.min(protestEvents.length * 0.05, 2);
  
  // 사상자 감점
  const totalFatalities = violentEvents.reduce(
    (sum, event) => sum + (parseInt(event.fatalities) || 0), 0
  );
  score -= Math.min(totalFatalities * 0.01, 3);
  
  return {
    score: Math.max(0, Math.round(score * 10) / 10),
    status: score > 8 ? 'peaceful' : score > 5 ? 'moderate' : 'conflict'
  };
}
```

## 🗺️ 지도 마커 색상 가이드

| 이벤트 타입 | 낮은 심각도 | 중간 심각도 | 높은 심각도 | 심각 |
|-------------|-------------|-------------|-------------|------|
| 전투 (Battles) | 🟣 보라 | 🔴 빨강 | 🟤 갈색 | ⚫ 검정 |
| 폭력 (Violence) | 🟠 주황 | 🔴 빨강 | 🟤 갈색 | 🔵 파랑 |
| 시위 (Protests) | 🟢 초록 | 🟡 노랑 | 🟠 주황 | 🔴 빨강 |

## ⚠️ 주의사항 및 제한

### API 사용 제한
- **일일 요청 제한**: 무제한 (하지만 합리적 사용 권장)
- **동시 연결**: 과도한 요청 시 IP 차단 가능
- **데이터 사용**: 상업적 목적 시 별도 라이센스 필요

### 데이터 품질
- **지연 업데이트**: 실제 사건 발생 후 수일~수주 지연
- **정확성**: 언론 보도 기반이므로 100% 정확하지 않을 수 있음
- **편향성**: 특정 지역에 더 많은 데이터가 있을 수 있음

### 기술적 제한
- **필드 제한**: 한 번에 너무 많은 필드 요청 시 에러
- **JSON 크기**: 매우 큰 응답은 타임아웃 가능
- **캐싱**: 동일한 쿼리 반복 시 캐시된 결과 반환

## 🔗 유용한 링크

- 📚 [공식 API 문서](https://acleddata.com/resources/general-guides/)
- 🛠️ [개발자 포털](https://developer.acleddata.com/)
- 📊 [데이터 사전](https://acleddata.com/resources/general-guides/)
- 💬 [사용자 포럼](https://acleddata.com/about-acled/)
- 🐛 [버그 리포트](mailto:info@acleddata.com)

## 🎯 Peace Map 구현 예시

실제 구현 코드는 [`ACLED-API-SPEC.js`](./ACLED-API-SPEC.js) 파일을 참조하세요:

```javascript
import { ACLEDAPIClient, PeaceMapDataTransformer } from './acled-api-spec.js';

// 클라이언트 초기화
const acled = new ACLEDAPIClient(
  process.env.VITE_ACLED_EMAIL,
  process.env.VITE_ACLED_ACCESS_KEY
);

// 최근 분쟁 데이터 가져오기
const conflicts = await acled.getRecentConflicts(30);
const mapData = PeaceMapDataTransformer.transformACLEDData(conflicts);
```

---

**📝 마지막 업데이트**: 2024년 7월
**✨ 버전**: v1.0.0
**🕊️ 프로젝트**: Wishing Peace Map 