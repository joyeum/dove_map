import React, { useState, useEffect } from 'react';
import { BarChart3, AlertTriangle, MapPin, TrendingUp, Globe } from 'lucide-react';
import { ACLEDAPIClient } from '../services/acledAPI';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalConflicts: 0,
    affectedCountries: 0,
    highIntensityConflicts: 0,
    totalFatalities: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConflictStats = async () => {
      const email = import.meta.env.VITE_ACLED_EMAIL;
      const accessKey = import.meta.env.VITE_ACLED_ACCESS_KEY;

      if (!email || !accessKey) {
        setError('ACLED API credentials not configured');
        setLoading(false);
        return;
      }

      try {
        const acledClient = new ACLEDAPIClient(email, accessKey);
        const conflictData = await acledClient.getRecentConflicts(30);
        
        const uniqueCountries = new Set(conflictData.map(d => d.country));
        const highIntensity = conflictData.filter(d => d.fatalities > 5).length;
        const totalFatalities = conflictData.reduce((sum, d) => sum + (d.fatalities || 0), 0);
        
        setStats({
          totalConflicts: conflictData.length,
          affectedCountries: uniqueCountries.size,
          highIntensityConflicts: highIntensity,
          totalFatalities: totalFatalities
        });
      } catch (err) {
        console.error('Failed to load conflict stats:', err);
        setError('Failed to load conflict data');
      } finally {
        setLoading(false);
      }
    };

    loadConflictStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">충돌 현황 대시보드</h1>
        <p className="text-gray-600 mt-2">ACLED 데이터 기반 전 세계 충돌 현황을 한눈에 확인하세요.</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">총 충돌 사건</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '-' : stats.totalConflicts.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">영향받은 국가</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '-' : stats.affectedCountries}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">고강도 충돌</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '-' : stats.highIntensityConflicts}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">총 사상자</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '-' : stats.totalFatalities.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 데이터 설명 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">데이터 출처</h3>
        <p className="text-sm text-blue-800">
          이 대시보드는 ACLED (Armed Conflict Location & Event Data Project)의 최근 30일 데이터를 기반으로 합니다.
          충돌 데이터는 실시간으로 업데이트되며, 정치적 폭력, 시민 불안, 전략적 발전 등을 포함합니다.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage; 