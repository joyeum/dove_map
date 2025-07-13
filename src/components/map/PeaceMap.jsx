import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ACLEDAPIClient, PeaceMapDataTransformer } from '../../services/acledAPI.js';

// Leaflet 기본 아이콘 설정
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// CircleMarker 사용으로 conflictIcon 제거됨

// Fallback conflict data for when API fails
const fallbackConflicts = [
  {
    id: 'fallback-1',
    lat: 50.4501,
    lng: 30.5234,
    country: 'Ukraine',
    region: 'Kyiv',
    intensity: 'high',
    description: 'Ongoing conflict in Eastern Europe',
    type: 'Battles',
    fatalities: 25,
    date: '2024-01-15'
  },
  {
    id: 'fallback-2',
    lat: 31.5017,
    lng: 34.4668,
    country: 'Palestine',
    region: 'Gaza',
    intensity: 'high',
    description: 'Violence against civilians',
    type: 'Violence against civilians',
    fatalities: 45,
    date: '2024-01-14'
  },
  {
    id: 'fallback-3',
    lat: 36.2048,
    lng: 38.0118,
    country: 'Syria',
    region: 'Aleppo',
    intensity: 'medium',
    description: 'Remote violence incident',
    type: 'Explosions/Remote violence',
    fatalities: 8,
    date: '2024-01-13'
  },
  {
    id: 'fallback-4',
    lat: 9.0820,
    lng: 8.6753,
    country: 'Nigeria',
    region: 'Plateau',
    intensity: 'medium',
    description: 'Communal violence',
    type: 'Violence against civilians',
    fatalities: 12,
    date: '2024-01-12'
  },
  {
    id: 'fallback-5',
    lat: 33.8869,
    lng: 9.5375,
    country: 'Tunisia',
    region: 'Tunis',
    intensity: 'low',
    description: 'Peaceful protests',
    type: 'Protests',
    fatalities: 0,
    date: '2024-01-11'
  }
];

const PeaceMap = ({ 
  center = [20, 0], 
  zoom = 2, 
  showConflicts = true
}) => {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  // API 테스트 함수
  const testACLEDAPI = async () => {
    const email = import.meta.env.VITE_ACLED_EMAIL;
    const accessKey = import.meta.env.VITE_ACLED_ACCESS_KEY;
    
    console.log('=== ACLED API 테스트 시작 ===');
    console.log('환경변수 확인:', {
      email: email || 'NOT SET',
      accessKey: accessKey ? 'SET (' + accessKey.substring(0, 5) + '...)' : 'NOT SET'
    });

    if (!email || !accessKey) {
      alert('환경변수가 설정되지 않았습니다!');
      return;
    }

    try {
      const acledClient = new ACLEDAPIClient(email, accessKey);
      console.log('ACLED 클라이언트 생성 완료');
      
      // 전체 데이터 테스트
      const conflictData = await acledClient.getAllConflicts(30);
      console.log('API 응답 성공:', conflictData);
      
      // 콘솔에서 자세한 정보 확인하라고 안내
      const message = `API 성공! ${conflictData.length}개 이벤트 로드\n\n` +
                     `📊 콘솔(F12)에서 상세 정보 확인:\n` +
                     `• 총 사용 가능한 데이터 수\n` +
                     `• 표시 비율\n` +
                     `• API 제한 경고`;
      
      alert(message);
    } catch (error) {
      console.error('API 테스트 실패:', error);
      alert(`API 실패: ${error.message}`);
    }
  };

  useEffect(() => {
    const loadConflictData = async () => {
      const email = import.meta.env.VITE_ACLED_EMAIL;
      const accessKey = import.meta.env.VITE_ACLED_ACCESS_KEY;

      // 환경변수 디버깅
      console.log('Environment variables check:', {
        email: email || 'NOT SET',
        accessKey: accessKey ? 'SET' : 'NOT SET',
        allEnvVars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
      });

      if (!email || !accessKey) {
        console.warn('ACLED API credentials not found. Using fallback data.');
        setConflicts(fallbackConflicts);
        setUsingFallbackData(true);
        setError('API credentials not configured - showing sample data');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const acledClient = new ACLEDAPIClient(email, accessKey);
        // 전체 데이터 가져오기 (캐싱 포함)
        const conflictData = await acledClient.getAllConflicts(30);
        const transformedData = PeaceMapDataTransformer.transformACLEDData(conflictData);
        
        setConflicts(transformedData.map(item => ({
          id: item.id,
          lat: item.latitude,
          lng: item.longitude,
          country: item.country,
          region: item.actor,
          intensity: item.severity > 3 ? 'high' : item.severity > 1 ? 'medium' : 'low',
          description: item.description,
          type: item.type,
          fatalities: item.fatalities,
          date: item.date
        })));
      } catch (err) {
        console.error('Failed to load ACLED data:', err);
        console.log('Using fallback conflict data...');
        setConflicts(fallbackConflicts);
        setUsingFallbackData(true);
        setError('API connection failed - showing sample data');
      } finally {
        setLoading(false);
      }
    };

    loadConflictData();
  }, []);

  // 위험도별 색상, 투명도, 크기 설정
  const getRiskStyle = (intensity, fatalities = 0) => {
    const baseRadius = 6;
    const sizeMultiplier = Math.min(1 + (fatalities / 50), 3); // 사상자에 따른 크기 조정
    
    switch (intensity) {
      case 'high':
        return {
          color: '#dc2626',      // 진한 빨강
          fillColor: '#ef4444',  // 빨강
          fillOpacity: 0.7,
          opacity: 0.9,
          weight: 2,
          radius: baseRadius * sizeMultiplier
        };
      case 'medium':
        return {
          color: '#ea580c',      // 진한 주황
          fillColor: '#f59e0b',  // 주황
          fillOpacity: 0.6,
          opacity: 0.8,
          weight: 2,
          radius: baseRadius * sizeMultiplier
        };
      case 'low':
        return {
          color: '#059669',      // 진한 초록
          fillColor: '#10b981',  // 연한 초록
          fillOpacity: 0.5,
          opacity: 0.7,
          weight: 1,
          radius: baseRadius * Math.max(sizeMultiplier * 0.8, 1)
        };
      default:
        return {
          color: '#4b5563',      // 회색
          fillColor: '#6b7280',
          fillOpacity: 0.4,
          opacity: 0.6,
          weight: 1,
          radius: baseRadius
        };
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* API 테스트 버튼 */}
      <button
        onClick={testACLEDAPI}
        className="absolute top-4 right-4 z-[1000] bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
      >
        API 테스트
      </button>
      
      {loading && (
        <div className="absolute top-4 left-4 z-[1000] bg-blue-100 px-4 py-2 rounded-md">
          Loading conflict data...
        </div>
      )}
      
      {error && (
        <div className={`absolute top-4 left-4 z-[1000] px-4 py-2 rounded-md ${
          usingFallbackData 
            ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {error}
          {usingFallbackData && (
            <div className="text-xs mt-1">
              Showing sample data - Configure ACLED API for real-time data
            </div>
          )}
        </div>
      )}
      
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        style={{ minHeight: '500px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* 분쟁 지역 마커 - 위험도별 색상과 투명도 */}
        {showConflicts && conflicts.map((conflict) => {
          const style = getRiskStyle(conflict.intensity, conflict.fatalities);
          return (
            <CircleMarker
              key={`conflict-${conflict.id}`}
              center={[conflict.lat, conflict.lng]}
              pathOptions={style}
              radius={style.radius}
            >
            <Popup>
              <div className="p-2 min-w-48">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {conflict.country} - {conflict.region}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{conflict.description}</p>
                {conflict.type && (
                  <p className="text-sm text-gray-600 mb-2">
                    Event Type: {conflict.type}
                  </p>
                )}
                {conflict.fatalities !== undefined && (
                  <p className="text-sm text-gray-600 mb-2">
                    Fatalities: {conflict.fatalities}
                  </p>
                )}
                {conflict.date && (
                  <p className="text-xs text-gray-500 mb-2">
                    Date: {conflict.date}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm font-medium px-2 py-1 rounded text-white"
                    style={{ backgroundColor: style.fillColor }}
                  >
                    {conflict.intensity === 'high' ? '🔴 고위험' : 
                     conflict.intensity === 'medium' ? '🟠 중위험' : '🟢 저위험'}
                  </span>
                  {conflict.fatalities > 0 && (
                    <span className="text-xs text-gray-500 ml-2">
                      💀 {conflict.fatalities}명
                    </span>
                  )}
                </div>
              </div>
            </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      
      {/* 색상 범례 */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-3 border">
        <h4 className="text-sm font-semibold mb-2 text-gray-800">충돌 위험도</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ 
                backgroundColor: '#ef4444',
                opacity: 0.7
              }}
            ></div>
            <span className="text-xs text-gray-700">🔴 고위험 (사상자 多)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ 
                backgroundColor: '#f59e0b',
                opacity: 0.6
              }}
            ></div>
            <span className="text-xs text-gray-700">🟠 중위험</span>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ 
                backgroundColor: '#10b981',
                opacity: 0.5
              }}
            ></div>
            <span className="text-xs text-gray-700">🟢 저위험 (시위 등)</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">• 원 크기: 사상자 수 반영</p>
          <p className="text-xs text-gray-500">• 투명도: 겹침 가시화</p>
        </div>
      </div>
    </div>
  );
};

export default PeaceMap; 