import React from 'react';
import { Heart, Calendar, MapPin, User } from 'lucide-react';

const StoriesPage = () => {
  const stories = [
    {
      id: 1,
      title: "우크라이나 키이우의 평화 기원",
      content: "전 세계 사람들이 우크라이나의 평화를 위해 기원하고 있습니다.",
      country: "우크라이나",
      date: "2024-03-15",
      wishes: 12543,
      author: "익명"
    },
    {
      id: 2,
      title: "팔레스타인과 이스라엘의 화해를 위한 기도",
      content: "오랜 갈등 속에서도 평화를 염원하는 사람들의 마음이 모이고 있습니다.",
      country: "팔레스타인",
      date: "2024-03-14",
      wishes: 8934,
      author: "익명"
    },
    {
      id: 3,
      title: "시리아 알레포의 재건을 위한 희망",
      content: "전쟁의 상처를 딛고 일어서는 시리아 사람들을 위한 응원의 메시지들입니다.",
      country: "시리아",
      date: "2024-03-13",
      wishes: 6789,
      author: "익명"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">희망 스토리</h1>
        <p className="text-gray-600 mt-2">갈등에서 평화로 전환된 성공 사례들과 희망의 메시지를 확인하세요.</p>
      </div>

      {/* 필터 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
            전체
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
            최근
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
            인기
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
            성공 사례
          </button>
        </div>
      </div>

      {/* 스토리 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div key={story.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">{story.country}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Heart className="w-4 h-4" />
                <span>{story.wishes.toLocaleString()}</span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{story.content}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{story.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{story.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 더 보기 버튼 */}
      <div className="mt-8 text-center">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          더 많은 스토리 보기
        </button>
      </div>
    </div>
  );
};

export default StoriesPage; 