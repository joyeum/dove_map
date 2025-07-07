import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
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

// 평화 기원 아이콘 생성
const peaceIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
  className: 'peace-icon'
});

// 분쟁 지역 아이콘 생성
const conflictIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
  className: 'conflict-icon'
});

// 지도 클릭 이벤트 핸들러
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
};

const PeaceMap = ({ 
  center = [20, 0], 
  zoom = 2, 
  showConflicts = true, 
  showPeaceZones = true, 
  enableWishing = true 
}) => {
  const [peaceWishes, setPeaceWishes] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showWishModal, setShowWishModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 목업 데이터 - 평화 기원
  const mockPeaceWishes = [
    { id: 1, lat: 50.4501, lng: 30.5234, country: '우크라이나', city: '키이우', wishes: 15243, message: '평화를 기원합니다' },
    { id: 2, lat: 31.7683, lng: 35.2137, country: '팔레스타인', city: '예루살렘', wishes: 8934, message: '화해와 평화를 위해' },
    { id: 3, lat: 36.2021, lng: 37.1343, country: '시리아', city: '알레포', wishes: 6789, message: '시리아의 평화를 기원합니다' },
    { id: 4, lat: 33.8938, lng: 35.5018, country: '레바논', city: '베이루트', wishes: 4567, message: '레바논의 안정을 위해' },
    { id: 5, lat: 33.3152, lng: 44.3661, country: '이라크', city: '바그다드', wishes: 3456, message: '이라크의 평화를 위해' }
  ];

  useEffect(() => {
    const loadConflictData = async () => {
      const email = import.meta.env.VITE_ACLED_EMAIL;
      const accessKey = import.meta.env.VITE_ACLED_ACCESS_KEY;

      if (!email || !accessKey) {
        console.warn('ACLED API credentials not found, using mock data');
        setConflicts([
          { id: 1, lat: 49.8397, lng: 24.0297, country: '우크라이나', region: '서부', intensity: 'high', description: '진행 중인 분쟁' },
          { id: 2, lat: 31.3547, lng: 34.3088, country: '가자', region: '가자 지구', intensity: 'high', description: '분쟁 지역' },
          { id: 3, lat: 35.2269, lng: 38.9968, country: '시리아', region: '북부', intensity: 'medium', description: '불안정 지역' },
          { id: 4, lat: 9.0820, lng: 8.6753, country: '나이지리아', region: '북부', intensity: 'medium', description: '보안 우려 지역' }
        ]);
        setPeaceWishes(mockPeaceWishes);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const acledClient = new ACLEDAPIClient(email, accessKey);
        const conflictData = await acledClient.getRecentConflicts(30);
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
        
        setPeaceWishes(mockPeaceWishes);
      } catch (err) {
        console.error('Failed to load ACLED data:', err);
        setError('Failed to load conflict data');
        setConflicts([]);
        setPeaceWishes(mockPeaceWishes);
      } finally {
        setLoading(false);
      }
    };

    loadConflictData();
  }, []);

  const handleMapClick = (latlng) => {
    if (enableWishing) {
      setSelectedPosition(latlng);
      setShowWishModal(true);
    }
  };

  const handleWishSubmit = (wishData) => {
    const newWish = {
      id: Date.now(),
      lat: selectedPosition.lat,
      lng: selectedPosition.lng,
      wishes: 1,
      ...wishData
    };
    setPeaceWishes([...peaceWishes, newWish]);
    setShowWishModal(false);
    setSelectedPosition(null);
  };

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute top-4 left-4 z-[1000] bg-blue-100 px-4 py-2 rounded-md">
          Loading conflict data...
        </div>
      )}
      
      {error && (
        <div className="absolute top-4 left-4 z-[1000] bg-red-100 px-4 py-2 rounded-md text-red-700">
          {error}
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
        
        {enableWishing && <MapClickHandler onMapClick={handleMapClick} />}
        
        {/* 평화 기원 마커 */}
        {showPeaceZones && peaceWishes.map((wish) => (
          <Marker
            key={`peace-${wish.id}`}
            position={[wish.lat, wish.lng]}
            icon={peaceIcon}
          >
            <Popup>
              <div className="p-2 min-w-48">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {wish.country} {wish.city && `- ${wish.city}`}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{wish.message}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">
                    💙 {wish.wishes.toLocaleString()}명이 기원 중
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* 분쟁 지역 마커 */}
        {showConflicts && conflicts.map((conflict) => (
          <Marker
            key={`conflict-${conflict.id}`}
            position={[conflict.lat, conflict.lng]}
            icon={conflictIcon}
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
                    style={{ backgroundColor: getIntensityColor(conflict.intensity) }}
                  >
                    {conflict.intensity === 'high' ? '고위험' : 
                     conflict.intensity === 'medium' ? '중위험' : '저위험'}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* 평화 기원 모달 */}
      {showWishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">평화 기원하기</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleWishSubmit({
                country: formData.get('country'),
                city: formData.get('city'),
                message: formData.get('message'),
                anonymous: formData.get('anonymous') === 'on'
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    국가
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 우크라이나"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    도시 (선택사항)
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 키이우"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    평화 메시지
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이 지역의 평화를 위한 메시지를 남겨주세요..."
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="anonymous"
                    id="anonymous"
                    className="mr-2"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700">
                    익명으로 기원하기
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowWishModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  평화 기원하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeaceMap; 