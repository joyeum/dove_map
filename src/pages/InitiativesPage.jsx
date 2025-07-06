import React from 'react';
import { Users, Target, Calendar, MapPin, ChevronRight } from 'lucide-react';

const InitiativesPage = () => {
  const initiatives = [
    {
      id: 1,
      title: "우크라이나 평화 재건 이니셔티브",
      description: "전후 우크라이나의 평화로운 재건을 위한 국제 협력 프로젝트",
      organization: "유엔 개발계획(UNDP)",
      status: "진행 중",
      startDate: "2024-01-15",
      endDate: "2025-12-31",
      location: "우크라이나",
      participants: 45,
      goals: ["인프라 재건", "사회 안정", "경제 회복"],
      progress: 65
    },
    {
      id: 2,
      title: "중동 평화 대화 포럼",
      description: "중동 지역의 지속가능한 평화를 위한 다자간 대화 플랫폼",
      organization: "중동 평화 연구소",
      status: "진행 중",
      startDate: "2023-06-01",
      endDate: "2024-12-31",
      location: "요르단",
      participants: 28,
      goals: ["대화 증진", "신뢰 구축", "협력 강화"],
      progress: 80
    },
    {
      id: 3,
      title: "아프리카 청년 평화 대사 프로그램",
      description: "아프리카 청년들이 평화 구축에 참여하는 리더십 프로그램",
      organization: "아프리카 연합",
      status: "모집 중",
      startDate: "2024-04-01",
      endDate: "2024-11-30",
      location: "케냐",
      participants: 120,
      goals: ["청년 리더십", "평화 교육", "지역 협력"],
      progress: 25
    },
    {
      id: 4,
      title: "시리아 인도적 지원 연대",
      description: "시리아 난민과 국내 실향민을 위한 인도적 지원 네트워크",
      organization: "국제적십자위원회",
      status: "완료",
      startDate: "2023-03-01",
      endDate: "2024-02-29",
      location: "시리아",
      participants: 89,
      goals: ["인도적 지원", "의료 서비스", "교육 지원"],
      progress: 100
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case '진행 중':
        return 'bg-green-100 text-green-800';
      case '모집 중':
        return 'bg-blue-100 text-blue-800';
      case '완료':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">평화 이니셔티브</h1>
        <p className="text-gray-600 mt-2">전 세계 평화 구축을 위한 다양한 이니셔티브와 프로젝트를 확인하세요.</p>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">총 이니셔티브</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">진행 중</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">참여자</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">완료</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <Target className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* 이니셔티브 목록 */}
      <div className="space-y-6">
        {initiatives.map((initiative) => (
          <div key={initiative.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{initiative.title}</h3>
                  <p className="text-sm text-gray-500">{initiative.organization}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(initiative.status)}`}>
                {initiative.status}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{initiative.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">시작일</p>
                  <p className="text-sm font-medium">{formatDate(initiative.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">종료일</p>
                  <p className="text-sm font-medium">{formatDate(initiative.endDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">위치</p>
                  <p className="text-sm font-medium">{initiative.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">참여자</p>
                  <p className="text-sm font-medium">{initiative.participants}명</p>
                </div>
              </div>
            </div>
            
            {/* 진행률 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">진행률</span>
                <span className="text-sm text-gray-500">{initiative.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${initiative.progress}%` }}
                ></div>
              </div>
            </div>
            
            {/* 목표 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">주요 목표</p>
                <div className="flex flex-wrap gap-1">
                  {initiative.goals.map((goal, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                <span>자세히 보기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 더 보기 버튼 */}
      <div className="mt-8 text-center">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          더 많은 이니셔티브 보기
        </button>
      </div>
    </div>
  );
};

export default InitiativesPage; 