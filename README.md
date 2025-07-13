# 🕊️ Dove Map

> **"전 세계 충돌 현황을 실시간으로 모니터링하는 평화 지도"**

ACLED 데이터 기반으로 전 세계의 충돌과 분쟁 현황을 시각화하는 플랫폼입니다.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-blue.svg)](https://reactjs.org/)
[![OpenStreetMap](https://img.shields.io/badge/Map-OpenStreetMap-orange.svg)](https://www.openstreetmap.org/)

## ✨ 주요 기능

- 🌍 **실시간 충돌 지도**: ACLED API를 통한 최신 충돌 데이터 시각화
- 📊 **충돌 통계 대시보드**: 지역별, 시간별 충돌 현황 분석
- 🔍 **상세 정보 제공**: 각 충돌의 유형, 날짜, 사상자 수 등 상세 정보
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 환경 지원

## 🚀 빠른 시작

### 사전 요구사항

- Node.js v18 이상
- npm 또는 yarn
- ACLED API 계정 (무료)

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/yourusername/dove-map.git
cd dove-map

# 의존성 설치
npm install

# 환경 변수 설정 (아래 참고)
cp env.example .env.local

# 개발 서버 시작
npm run dev

# 빌드
npm run build
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# ACLED API (필수 - 무료 회원가입: https://acleddata.com/register/)
VITE_ACLED_EMAIL=your-email@example.com
VITE_ACLED_ACCESS_KEY=your-access-key

# Google Analytics (선택사항)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# 애플리케이션 설정
VITE_APP_URL=http://localhost:3001
VITE_APP_NAME=Dove Map
VITE_NODE_ENV=development
```

### ACLED API 설정 방법

1. [ACLED Developer Portal](https://developer.acleddata.com/) 회원가입
2. 이메일로 API 키 수신
3. 위 환경 변수에 이메일과 API 키 입력
4. 앱 실행 시 자동으로 실제 충돌 데이터 로드

## 🏗️ 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **Vite** - 빠른 개발 환경
- **Tailwind CSS** - 스타일링
- **Leaflet.js** - 인터랙티브 지도
- **Lucide React** - 아이콘 라이브러리

### API & 데이터
- **ACLED API** - Armed Conflict Location & Event Data
- **OpenStreetMap** - 지도 타일 서비스

## 📊 데이터 구조

### ACLED 충돌 데이터
```javascript
{
  id: 'event_id',
  lat: 31.5204,
  lng: 74.3587,
  country: 'Pakistan',
  region: 'South Asia',
  date: '2024-01-15',
  type: 'Battles',
  fatalities: 3,
  description: 'Armed clash between...',
  intensity: 'high' // high, medium, low
}
```

## 🌐 서버리스 사용자 추적 아이디어

서버 없이 사용자 수를 추적할 수 있는 방법들:

1. **Google Analytics API**
   - 실시간 활성 사용자 수 표시
   - 일별/월별 방문자 통계

2. **GitHub API**
   - 저장소 스타 수, 포크 수 표시
   - 커뮤니티 참여도 지표

3. **Shields.io 배지 서비스**
   - 정적 뷰 카운터 배지
   - 동적 통계 배지 생성

4. **LocalStorage 기반 카운터**
   - 브라우저 핑거프린팅으로 고유 방문자 추적
   - 익명 통계 수집

## 📁 프로젝트 구조

```
dove-map/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── map/            # 지도 관련 컴포넌트
│   │   ├── layout/         # 레이아웃 컴포넌트
│   │   └── common/         # 공통 컴포넌트
│   ├── pages/              # 페이지 컴포넌트
│   ├── services/           # API 클라이언트
│   │   └── acledAPI.js     # ACLED API 통합
│   ├── styles/             # 스타일 파일
│   └── utils/              # 유틸리티 함수
├── public/                 # 정적 파일
├── docs/                   # 문서
├── package.json           
├── vite.config.js         
├── tailwind.config.js     
└── README.md              
```

## 🤝 기여하기

프로젝트에 기여해주셔서 감사합니다!

1. Fork 본 저장소
2. Feature 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE) 하에 배포됩니다.

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들 덕분에 가능했습니다:

- [ACLED](https://acleddata.com/) - 충돌 데이터 제공
- [OpenStreetMap](https://www.openstreetmap.org/) - 자유로운 지도 데이터
- [React](https://reactjs.org/) & [Vite](https://vitejs.dev/) - 개발 프레임워크

---

<div align="center">

**🕊️ 평화를 위한 인식과 이해를 높이는 데이터 시각화 🕊️**

[GitHub 저장소](https://github.com/yourusername/dove-map) • [이슈 등록](https://github.com/yourusername/dove-map/issues) • [기여하기](CONTRIBUTING.md)

</div>