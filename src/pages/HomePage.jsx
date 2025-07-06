import React, { useState } from 'react';
import PeaceMap from '../components/map/PeaceMap';
import { Heart, MapPin, Globe, Users, BarChart3, Info } from 'lucide-react';

const HomePage = () => {
  const [mapFilters, setMapFilters] = useState({
    showConflicts: true,
    showPeaceZones: true,
    enableWishing: true
  });

  const toggleFilter = (filterName) => {
    setMapFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const stats = [
    { label: '총 평화 기원', value: '152,347', icon: Heart, color: 'text-red-500' },
    { label: '참여 국가', value: '87', icon: Globe, color: 'text-blue-500' },
    { label: '평화 지역', value: '234', icon: MapPin, color: 'text-green-500' },
    { label: '활성 사용자', value: '24,891', icon: Users, color: 'text-purple-500' }
  ];

  return (
    <div className="w-full">
      {/* 히어로 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              평화 지도
            </h1>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              전 세계의 평화를 함께 기원하는 희망 지도
            </p>
            <p className="text-lg opacity-75 max-w-2xl mx-auto">
              갈등을 평화로 바꾸고, 전쟁 대신 희망을 모으는 글로벌 플랫폼입니다.
              지도를 클릭하여 평화를 기원해보세요.
            </p>
          </div>
        </div>
      </div>

      {/* 통계 섹션 */}
      <div className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 지도 컨트롤 섹션 */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">지도를 클릭하여 평화를 기원하세요</span>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={mapFilters.showPeaceZones}
                  onChange={() => toggleFilter('showPeaceZones')}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">평화 기원 표시</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={mapFilters.showConflicts}
                  onChange={() => toggleFilter('showConflicts')}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">분쟁 지역 표시</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={mapFilters.enableWishing}
                  onChange={() => toggleFilter('enableWishing')}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">평화 기원 활성화</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 평화 지도 */}
      <div className="h-96 md:h-[600px] w-full">
        <PeaceMap
          center={[20, 0]}
          zoom={2}
          showConflicts={mapFilters.showConflicts}
          showPeaceZones={mapFilters.showPeaceZones}
          enableWishing={mapFilters.enableWishing}
        />
      </div>

      {/* 설명 섹션 */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              평화 지도는 어떻게 작동하나요?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              전 세계 사람들이 함께 평화를 기원하고, 분쟁 지역의 상황을 모니터링하며, 
              평화를 위한 노력을 공유하는 플랫폼입니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">지도에서 클릭</h3>
              <p className="text-gray-600">
                평화를 기원하고 싶은 지역을 지도에서 클릭하면 평화 기원 양식이 나타납니다.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">평화 메시지 작성</h3>
              <p className="text-gray-600">
                해당 지역의 평화를 위한 진심어린 메시지를 작성하고 익명으로 기원할 수 있습니다.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">전 세계와 공유</h3>
              <p className="text-gray-600">
                당신의 평화 기원이 지도에 표시되어 전 세계 사람들과 평화의 메시지를 공유합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 