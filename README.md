# 🕊️ Dove Map

> **"전 세계의 평화를 상징하는 비둘기 지도"**

갈등을 평화로 바꾸고, 전쟁 대신 희망을 모으는 글로벌 플랫폼입니다.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-blue.svg)](https://reactjs.org/)
[![OpenStreetMap](https://img.shields.io/badge/Map-OpenStreetMap-orange.svg)](https://www.openstreetmap.org/)
[![Development Status](https://img.shields.io/badge/Status-Prototype-yellow.svg)](https://github.com/yourusername/dove-map)

## 🚧 현재 구현 상황

**이 프로젝트는 현재 프로토타입/데모 버전입니다.**

### ✅ 완성된 기능들
- 🗺️ **인터랙티브 평화 지도**: OpenStreetMap 기반 실시간 지도 (완료)
- 🙏 **평화 기원 시스템**: 지도 클릭을 통한 평화 기원 등록 (완료)
- 📊 **페이지 구조**: 대시보드, 뉴스, 스토리, 이니셔티브 페이지 (완료)
- 🎨 **반응형 UI**: 모바일 최적화된 현대적 디자인 (완료)
- 🔧 **개발 환경**: Vite + React + Tailwind CSS (완료)

### 🔄 개발 중인 기능들
- 📈 **실시간 차트**: Chart.js 기반 데이터 시각화 (UI만 완료)
- 🌐 **ACLED API 연동**: 실제 분쟁 데이터 연동 완료 ✅
- 💾 **데이터베이스**: 사용자 기원 데이터 저장 시스템
- 🔐 **사용자 인증**: 로그인/회원가입 시스템

## 📋 목업 데이터 사용 현황

**⚠️ 현재 모든 데이터는 개발용 목업 데이터입니다.**

### 사용 중인 목업 데이터:
- **평화 기원**: 5개 지역 (우크라이나, 팔레스타인, 시리아, 레바논, 이라크)
- **분쟁 지역**: 4개 지역 (우크라이나, 가자, 시리아, 나이지리아)
- **뉴스**: 4개 샘플 뉴스 기사
- **스토리**: 3개 희망 스토리 사례
- **이니셔티브**: 4개 평화 프로젝트 사례
- **통계**: 모든 숫자는 시연용 임시 데이터

## ✨ 목표 기능 (구현 계획)

- 🌍 **실시간 글로벌 평화 지도**: 전 세계 평화와 분쟁 현황을 실시간으로 시각화 ✅
- 🙏 **평화 기원 시스템**: 사용자들이 특정 지역을 위해 평화를 기원할 수 있는 인터랙티브 기능 ✅
- 📊 **평화 지수 대시보드**: 국가별 평화 점수 및 통계 제공 🔄
- 🕊️ **평화 이니셔티브 추적**: 전 세계 평화 노력과 외교적 성과 모니터링 🔄
- 📰 **실시간 평화 뉴스**: AI 기반 평화 관련 뉴스 큐레이션 🔄
- 🌟 **희망 스토리**: 갈등에서 평화로 전환된 성공 사례들 🔄

**범례**: ✅ 완료 | 🔄 목업 데이터로 UI 완료, API 연동 대기 | ⏳ 개발 중

## 🚀 빠른 시작

### 사전 요구사항

- Node.js v18 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/yourusername/dove-map.git
cd dove-map

# 의존성 설치
npm install

# 개발 서버 시작 (데모 버전)
npm run dev

# 빌드
npm run build
```

### 💡 데모 버전 체험하기

현재 버전은 **목업 데이터**를 사용하므로 환경 변수 설정 없이도 바로 실행할 수 있습니다!

1. 브라우저에서 `http://localhost:3001` 접속
2. 지도를 클릭하여 평화 기원 체험
3. 각 페이지의 UI/UX 확인

### 환경 변수 설정 (ACLED API 연동)

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# ACLED API (무료 회원가입 필요) - 연동 완료!
VITE_ACLED_EMAIL=your-email@example.com
VITE_ACLED_ACCESS_KEY=your-access-key

# News API (무료 티어 100req/day) - 예정
VITE_NEWS_API_KEY=your-news-api-key

# 기타 설정
VITE_APP_URL=http://localhost:3001
VITE_APP_NAME=Dove Map
VITE_DEV_MODE=true
```

**📋 ACLED API 설정 방법:**
1. [ACLED Developer Portal](https://developer.acleddata.com/) 회원가입
2. API 키 발급 (이메일로 전송)
3. 위 환경 변수에 정보 입력
4. 앱 실행 시 자동으로 실제 분쟁 데이터 로드!

## 🗺️ 사용된 무료 API

### 지도 서비스
- **[OpenStreetMap](https://www.openstreetmap.org/)**: 무료 지도 타일
- **[Nominatim](https://nominatim.openstreetmap.org/)**: 무료 지오코딩 서비스

### 분쟁/평화 데이터
- **[ACLED](https://acleddata.com/)**: Armed Conflict Location & Event Data
- **[UCDP](https://ucdp.uu.se/)**: Uppsala Conflict Data Program  
- **[GDELT](https://www.gdeltproject.org/)**: Global Database of Events, Language, and Tone

### 기타 데이터
- **[REST Countries](https://restcountries.com/)**: 국가 정보 API
- **[World Bank Open Data](https://datahelpdesk.worldbank.org/)**: 경제/사회 지표
- **[News API](https://newsapi.org/)**: 실시간 뉴스 (무료 티어)

## 🏗️ 기술 스택

### Frontend (현재 구현됨)
- **React 18** - UI 라이브러리 ✅
- **Vite** - 빠른 개발 환경 ✅
- **Tailwind CSS** - 스타일링 ✅
- **Leaflet.js** - 인터랙티브 지도 ✅
- **Lucide React** - 아이콘 라이브러리 ✅

### 데이터 & 차트 (부분 구현)
- **Chart.js** - 데이터 시각화 🔄
- **Axios** - HTTP 클라이언트 🔄
- **Date-fns** - 날짜 처리 ✅

### Backend (향후 계획)
- **Node.js/Express** - 서버 API ⏳
- **Prisma** - 데이터베이스 ORM ⏳
- **PostgreSQL** - 메인 데이터베이스 ⏳
- **Redis** - 캐싱 (선택사항) ⏳

### 배포 및 인프라 (향후 계획)
- **Vercel** - 프론트엔드 배포 ⏳
- **Railway/Supabase** - 데이터베이스 호스팅 ⏳
- **GitHub Actions** - CI/CD ⏳

## �� 프로젝트 구조 (현재)

```
dove-map/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── map/            # 지도 관련 컴포넌트 ✅
│   │   ├── layout/         # 레이아웃 컴포넌트 ✅
│   │   └── common/         # 공통 컴포넌트 ✅
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── HomePage.jsx    # 메인 페이지 ✅
│   │   ├── DashboardPage.jsx # 대시보드 ✅
│   │   ├── AboutPage.jsx   # 소개 페이지 ✅
│   │   └── ...            # 기타 페이지들 ✅
│   ├── styles/             # 스타일 파일
│   │   └── globals.css     # 전역 스타일 ✅
│   └── utils/              # 유틸리티 함수들 ✅
├── public/                 # 정적 파일 ✅
├── docs/                   # 문서 파일들 ✅
├── package.json           # 의존성 관리 ✅
├── vite.config.js         # Vite 설정 ✅
├── tailwind.config.js     # Tailwind 설정 ✅
└── README.md              # 프로젝트 문서 ✅
```

### 향후 추가 예정 구조

```
├── src/
│   ├── services/          # API 클라이언트 ✅ (ACLED 완료)
│   ├── hooks/             # 커스텀 훅 ⏳
│   ├── contexts/          # React 컨텍스트 ⏳
│   └── types/             # TypeScript 타입 정의 ⏳
├── server/                # 백엔드 서버 ⏳
└── tests/                 # 테스트 파일 ⏳
```

## 🔧 데이터 구조 및 API 연동

### ACLED API 연동 완료 ✅

실제 분쟁 데이터를 ACLED API에서 가져와 지도에 표시합니다:

```javascript
// src/services/acledAPI.js
import { ACLEDAPIClient, PeaceMapDataTransformer } from './acledAPI.js';

const acledClient = new ACLEDAPIClient(email, accessKey);
const conflictData = await acledClient.getRecentConflicts(30);
const transformedData = PeaceMapDataTransformer.transformACLEDData(conflictData);
```

### 평화 기원 데이터 예시 (목업)

```javascript
// src/components/map/PeaceMap.jsx
const mockPeaceWishes = [
  {
    id: 1,
    lat: 50.4501,
    lng: 30.5234,
    country: '우크라이나',
    city: '키이우',
    wishes: 15243,
    message: '평화를 기원합니다'
  },
  // ... 더 많은 목업 데이터
];
```

### 분쟁 지역 데이터 예시

```javascript
// src/components/map/PeaceMap.jsx
const mockConflicts = [
  {
    id: 1,
    lat: 49.8397,
    lng: 24.0297,
    country: '우크라이나',
    region: '서부',
    intensity: 'high',
    description: '진행 중인 분쟁'
  },
  // ... 더 많은 목업 데이터
];
```

### 향후 API 구조 (계획)

```javascript
// 실제 API 연동 시 예상 구조
const response = await fetch('/api/wishes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    country: 'Ukraine',
    lat: 50.4501,
    lng: 30.5234,
    message: '평화를 기원합니다',
    anonymous: true
  })
});
```

## 🎨 컴포넌트 사용법 (현재 구현)

### 평화 지도 컴포넌트

```jsx
import PeaceMap from '../components/map/PeaceMap';

function HomePage() {
  return (
    <div className="h-96 md:h-[600px] w-full">
      <PeaceMap
        center={[20, 0]}
        zoom={2}
        showConflicts={true}
        showPeaceZones={true}
        enableWishing={true}
      />
    </div>
  );
}
```

### 레이아웃 컴포넌트

```jsx
import Layout from './components/layout/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        {/* 기타 라우트들 */}
      </Routes>
    </Layout>
  );
}
```

### 현재 구현된 주요 컴포넌트들

- `PeaceMap` - 인터랙티브 지도 (완전 구현)
- `Header` - 네비게이션 헤더 (완료)
- `Footer` - 사이트 푸터 (완료)
- `Layout` - 메인 레이아웃 래퍼 (완료)
- 각종 페이지 컴포넌트들 (목업 데이터로 완료)

## 🌟 기여하기

프로젝트에 기여해주셔서 감사합니다! 

### 기여 방법

1. Fork 본 저장소
2. Feature 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

### 개발 가이드라인

- **코드 스타일**: Prettier + ESLint 설정 준수
- **커밋 메시지**: [Conventional Commits](https://www.conventionalcommits.org/) 형식
- **테스트**: 새로운 기능에는 테스트 코드 작성
- **문서화**: README 및 코드 주석 업데이트

## 📊 실제 API 연동 계획

### 무료 API 사용 예정

| API | 무료 제한 | 제한사항 | 연동 상태 | 가이드 |
|-----|-----------|----------|----------|---------|
| ACLED | 무제한 | 이메일 가입 필요 | ✅ 완료 | 📖 [가이드](./docs/ACLED-API-Guide.md) |
| UCDP | 무제한 | 없음 | ⏳ 계획됨 | 📝 준비 중 |
| GDELT | 무제한 | 속도 제한 있음 | ⏳ 계획됨 | 📝 준비 중 |
| OpenStreetMap | 무제한 | 과도한 요청 금지 | ✅ 사용 중 | ✅ 적용됨 |
| News API | 100회/일 | 개발용만 무료 | ⏳ 계획됨 | 📝 준비 중 |
| REST Countries | 무제한 | 없음 | ⏳ 계획됨 | 📝 준비 중 |

### 현재 상태
- **지도 데이터**: OpenStreetMap 연동 완료
- **분쟁/평화 데이터**: ACLED API 연동 완료 ✅
- **뉴스 데이터**: 목업 데이터 사용 중
- **통계 데이터**: 시연용 고정 값 사용 중

## 🔒 개인정보 보호

- 사용자 평화 기원은 익명으로 처리 가능
- IP 주소나 개인정보는 저장하지 않음
- GDPR 및 개인정보보호법 준수

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE) 하에 배포됩니다.

## 📚 상세 문서

### API 연동 가이드
- 📖 **[ACLED API 가이드](./docs/ACLED-API-Guide.md)**: 분쟁 데이터 API 완전 가이드
- 🛠️ **[ACLED 구현 코드](./docs/acled-api-spec.js)**: 실행 가능한 구현 예시
- 📋 **[전체 문서 목록](./docs/README.md)**: 모든 문서 및 가이드 목록

### 기능별 상세 가이드
- 📊 **[고급 기능](./docs/advanced-features.md)**: 차트, 알림, 커스텀 기능
- 🔍 **[분석 규칙](./docs/analytics-rules.md)**: 데이터 분석 및 평화 지수 계산
- 🔗 **[선택적 통합](./docs/optional-integrations.md)**: 소셜 미디어, 외부 서비스
- 🚀 **[배포 가이드](./docs/post-development.md)**: 프로덕션 배포 및 유지보수

## 🤝 지원 및 연락

### 현재 개발 상황 문의
- **이슈 리포트**: [GitHub Issues](https://github.com/yourusername/dove-map/issues)
- **기능 제안**: [GitHub Discussions](https://github.com/yourusername/dove-map/discussions)
- **개발 협력**: GitHub Pull Request 환영

### 데모 버전 피드백
현재 프로토타입 버전에 대한 피드백을 기다리고 있습니다:
- UI/UX 개선 사항
- 추가 기능 아이디어
- 실제 API 연동 우선순위 제안

## 🗓️ 개발 로드맵

### Phase 1: 프로토타입 (현재 완료)
- [x] 기본 UI/UX 구성
- [x] 인터랙티브 지도 구현
- [x] 목업 데이터 기반 데모
- [x] 반응형 디자인

### Phase 2: 실제 데이터 연동 (진행 중)
- [x] ACLED API 연동 (분쟁 데이터) ✅
- [ ] News API 연동 (뉴스 데이터)
- [ ] Chart.js 기반 데이터 시각화
- [ ] 실시간 업데이트 시스템

### Phase 3: 백엔드 구축 (예정)
- [ ] 사용자 인증 시스템
- [ ] 데이터베이스 설계
- [ ] 평화 기원 데이터 영구 저장
- [ ] 관리자 대시보드

### Phase 4: 고급 기능 (예정)
- [ ] AI 기반 뉴스 분석
- [ ] 소셜 공유 기능
- [ ] 다국어 지원
- [ ] PWA 지원

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들 덕분에 가능했습니다:

- [OpenStreetMap](https://www.openstreetmap.org/) - 자유로운 지도 데이터
- [ACLED](https://acleddata.com/) - 분쟁 데이터 제공
- [UCDP](https://ucdp.uu.se/) - 학술적 분쟁 연구
- [React](https://reactjs.org/) & [Vite](https://vitejs.dev/) - 개발 프레임워크

---

<div align="center">

**🕊️ 함께 평화로운 세상을 만들어 나가요 🕊️**

**현재 상태**: 프로토타입 완료, ACLED API 연동 완료 ✅

[GitHub 저장소](https://github.com/yourusername/dove-map) • [이슈 등록](https://github.com/yourusername/dove-map/issues) • [기여하기](CONTRIBUTING.md)

</div># wishing_peace_map
# wishing_peace_map
# wishing_peace_map
# wishing_peace_map
# wishing_peace_map
