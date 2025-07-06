import React from 'react';
import { BarChart3, Users, MapPin, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">평화 지수 대시보드</h1>
        <p className="text-gray-600 mt-2">전 세계 평화 현황과 통계를 한눈에 확인하세요.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">총 평화 기원</p>
              <p className="text-2xl font-bold text-gray-900">152,347</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">평화 지역</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">분쟁 지역</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">평화 지수</p>
              <p className="text-2xl font-bold text-gray-900">7.2</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 평화 기원 현황</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">차트 영역 (Chart.js 구현 예정)</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">지역별 평화 지수</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">차트 영역 (Chart.js 구현 예정)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 