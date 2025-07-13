import React, { useState, useEffect } from 'react';
import PeaceMap from '../components/map/PeaceMap';
import { AlertTriangle, MapPin, Globe, Calendar, BarChart3, Info, Heart } from 'lucide-react';
import { ACLEDAPIClient } from '../services/acledAPI';

const HomePage = () => {
  const [showConflicts, setShowConflicts] = useState(true);
  const [stats, setStats] = useState([
    { label: '활성 충돌', value: '-', icon: AlertTriangle, color: 'text-red-500' },
    { label: '영향받은 국가', value: '-', icon: Globe, color: 'text-blue-500' },
    { label: '충돌 지역', value: '-', icon: MapPin, color: 'text-orange-500' },
    { label: '최근 30일', value: '-', icon: Calendar, color: 'text-purple-500' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const email = import.meta.env.VITE_ACLED_EMAIL;
      const accessKey = import.meta.env.VITE_ACLED_ACCESS_KEY;

      if (!email || !accessKey) {
        setLoading(false);
        return;
      }

      try {
        const acledClient = new ACLEDAPIClient(email, accessKey);
        const conflictData = await acledClient.getRecentConflicts(30);
        
        const uniqueCountries = new Set(conflictData.map(d => d.country));
        const uniqueLocations = new Set(conflictData.map(d => `${d.latitude},${d.longitude}`));
        
        setStats([
          { label: '활성 충돌', value: conflictData.length.toLocaleString(), icon: AlertTriangle, color: 'text-red-500' },
          { label: '영향받은 국가', value: uniqueCountries.size.toString(), icon: Globe, color: 'text-blue-500' },
          { label: '충돌 지역', value: uniqueLocations.size.toString(), icon: MapPin, color: 'text-orange-500' },
          { label: '최근 30일', value: '데이터', icon: Calendar, color: 'text-purple-500' }
        ]);
      } catch (error) {
        console.error('Failed to load statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

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
              비둘기 지도
            </h1>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              전 세계 충돌 현황을 실시간으로 모니터링
            </p>
            <p className="text-lg opacity-75 max-w-2xl mx-auto">
              ACLED(Armed Conflict Location & Event Data) 데이터를 기반으로
              전 세계의 충돌과 분쟁 현황을 시각화합니다.
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
              <span className="text-sm text-gray-600">충돌 마커를 클릭하여 상세 정보를 확인하세요</span>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showConflicts}
                  onChange={() => setShowConflicts(!showConflicts)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">충돌 지역 표시</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 비둘기 지도 */}
      <div className="h-96 md:h-[600px] w-full">
        <PeaceMap
          center={[20, 0]}
          zoom={2}
          showConflicts={showConflicts}
        />
      </div>

      {/* 설명 섹션 */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ACLED 데이터 기반 충돌 모니터링
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              실시간 충돌 데이터를 통해 전 세계의 분쟁 현황을 파악하고,
              평화를 위한 인식을 높이는 플랫폼입니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">실시간 데이터</h3>
              <p className="text-gray-600">
                ACLED API를 통해 최신 충돌 데이터를 실시간으로 업데이트합니다.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">충돌 위치 표시</h3>
              <p className="text-gray-600">
                충돌 발생 위치를 지도에 표시하고 심각도에 따라 색상으로 구분합니다.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">상세 정보 제공</h3>
              <p className="text-gray-600">
                각 충돌의 유형, 날짜, 사상자 수 등 상세한 정보를 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 