import React from 'react';
import { Newspaper, ExternalLink, Clock, Tag } from 'lucide-react';

const NewsPage = () => {
  const news = [
    {
      id: 1,
      title: "UN 평화유지군, 중동 지역 안정화 노력 확대",
      summary: "유엔 평화유지군이 중동 지역의 안정을 위한 새로운 이니셔티브를 발표했습니다.",
      source: "UN News",
      publishedAt: "2024-03-15T10:30:00Z",
      tags: ["UN", "평화유지", "중동"],
      url: "#"
    },
    {
      id: 2,
      title: "유럽 연합, 우크라이나 재건 지원 계획 발표",
      summary: "유럽 연합이 우크라이나의 전후 재건을 위한 대규모 지원 계획을 공개했습니다.",
      source: "EU News",
      publishedAt: "2024-03-14T14:45:00Z",
      tags: ["EU", "우크라이나", "재건"],
      url: "#"
    },
    {
      id: 3,
      title: "아프리카 연합, 지역 평화 협정 체결",
      summary: "아프리카 연합이 여러 국가 간 새로운 평화 협정을 중재했습니다.",
      source: "African Union",
      publishedAt: "2024-03-13T09:15:00Z",
      tags: ["아프리카", "평화협정", "외교"],
      url: "#"
    },
    {
      id: 4,
      title: "국제 적십자, 분쟁 지역 인도적 지원 확대",
      summary: "국제 적십자가 전 세계 분쟁 지역에 대한 인도적 지원을 확대한다고 발표했습니다.",
      source: "ICRC",
      publishedAt: "2024-03-12T16:20:00Z",
      tags: ["적십자", "인도적지원", "분쟁"],
      url: "#"
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">평화 뉴스</h1>
        <p className="text-gray-600 mt-2">전 세계 평화 관련 최신 뉴스와 이니셔티브를 확인하세요.</p>
      </div>

      {/* 필터 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
            전체
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
            최신
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
            UN
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
            평화협정
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
            인도적지원
          </button>
        </div>
      </div>

      {/* 뉴스 목록 */}
      <div className="space-y-6">
        {news.map((article) => (
          <div key={article.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <Newspaper className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">{article.source}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h3>
            <p className="text-gray-600 mb-4">{article.summary}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <a 
                href={article.url}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <span>자세히 보기</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 더 보기 버튼 */}
      <div className="mt-8 text-center">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          더 많은 뉴스 보기
        </button>
      </div>
    </div>
  );
};

export default NewsPage; 