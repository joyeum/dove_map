import React from 'react';
import { Heart, Globe, Users, Shield, Target, Zap } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: Globe,
      title: '실시간 글로벌 평화 지도',
      description: '전 세계 평화와 분쟁 현황을 실시간으로 시각화합니다.'
    },
    {
      icon: Heart,
      title: '평화 기원 시스템',
      description: '사용자들이 특정 지역을 위해 평화를 기원할 수 있는 인터랙티브 기능을 제공합니다.'
    },
    {
      icon: Target,
      title: '평화 지수 대시보드',
      description: '국가별 평화 점수 및 통계를 제공하여 현황을 파악할 수 있습니다.'
    },
    {
      icon: Users,
      title: '평화 이니셔티브 추적',
      description: '전 세계 평화 노력과 외교적 성과를 모니터링합니다.'
    },
    {
      icon: Zap,
      title: '실시간 평화 뉴스',
      description: 'AI 기반 평화 관련 뉴스 큐레이션을 제공합니다.'
    },
    {
      icon: Shield,
      title: '희망 스토리',
      description: '갈등에서 평화로 전환된 성공 사례들을 공유합니다.'
    }
  ];

  const apiSources = [
    {
      name: 'ACLED',
      description: 'Armed Conflict Location & Event Data',
      type: '분쟁 데이터',
      status: '무료'
    },
    {
      name: 'UCDP',
      description: 'Uppsala Conflict Data Program',
      type: '분쟁 연구',
      status: '무료'
    },
    {
      name: 'OpenStreetMap',
      description: '오픈소스 지도 서비스',
      type: '지도 데이터',
      status: '무료'
    },
    {
      name: 'REST Countries',
      description: '국가 정보 API',
      type: '국가 데이터',
      status: '무료'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 섹션 */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          평화 지도 소개
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          전 세계의 평화를 함께 기원하는 희망 지도입니다. 
          갈등을 평화로 바꾸고, 전쟁 대신 희망을 모으는 글로벌 플랫폼입니다.
        </p>
      </div>

      {/* 미션 섹션 */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 mb-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">우리의 미션</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            평화 지도는 전 세계 사람들이 함께 평화를 기원하고, 분쟁 지역의 상황을 모니터링하며, 
            평화를 위한 노력을 공유하는 플랫폼입니다. 우리는 기술을 통해 평화의 메시지를 전파하고, 
            전 세계적인 평화 운동에 기여하고자 합니다.
          </p>
        </div>
      </div>

      {/* 주요 기능 섹션 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">주요 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 기술 스택 섹션 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">기술 스택</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Frontend</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• React 18</li>
                <li>• Tailwind CSS</li>
                <li>• Leaflet.js</li>
                <li>• Chart.js</li>
                <li>• Lucide React</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">개발 도구</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Vite</li>
                <li>• ESLint</li>
                <li>• PostCSS</li>
                <li>• Autoprefixer</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">배포</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Vercel</li>
                <li>• GitHub Actions</li>
                <li>• 정적 사이트 배포</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 데이터 소스 섹션 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">사용된 무료 API</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apiSources.map((api, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{api.name}</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  {api.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{api.description}</p>
              <p className="text-sm text-gray-500">카테고리: {api.type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 개인정보 보호 섹션 */}
      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">개인정보 보호</h2>
        <div className="space-y-4 text-gray-700">
          <p>• 사용자 평화 기원은 익명으로 처리 가능합니다.</p>
          <p>• IP 주소나 개인정보는 저장하지 않습니다.</p>
          <p>• GDPR 및 개인정보보호법을 준수합니다.</p>
          <p>• 모든 데이터는 평화 증진 목적으로만 사용됩니다.</p>
        </div>
      </div>

      {/* 기여하기 섹션 */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">함께 참여하세요</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          평화 지도는 오픈소스 프로젝트입니다. 
          개발자, 디자이너, 평화 활동가 모두가 함께 참여하여 더 나은 세상을 만들어갈 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://github.com/yourusername/wishing-peace-map" 
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub에서 보기
          </a>
          <a 
            href="mailto:peace@wishingpeacemap.org" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            문의하기
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 