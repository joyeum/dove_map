import React from 'react';
import { Heart, Github, Mail, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 로고 및 설명 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">비둘기 지도</h3>
                <p className="text-sm text-gray-500">Dove Map</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              전 세계의 평화를 함께 기원하는 희망 지도입니다. 
              갈등을 평화로 바꾸고, 전쟁 대신 희망을 모으는 글로벌 플랫폼입니다.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">빠른 링크</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-600 hover:text-gray-900">비둘기 지도</a></li>
              <li><a href="/dashboard" className="text-gray-600 hover:text-gray-900">대시보드</a></li>
              <li><a href="/stories" className="text-gray-600 hover:text-gray-900">희망 스토리</a></li>
            </ul>
          </div>

          {/* 리소스 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">리소스</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-gray-600 hover:text-gray-900">소개</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">개인정보보호</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">이용약관</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">API 문서</a></li>
            </ul>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2024 Dove Map. MIT 라이선스 하에 배포됩니다.
            </p>
            <p className="text-sm text-gray-500 mt-2 md:mt-0">
              🕊️ 함께 평화로운 세상을 만들어 나가요 🕊️
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 