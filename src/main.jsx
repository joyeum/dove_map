import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import './styles/globals.css'

// Google Analytics 동적 로딩
const loadGoogleAnalytics = () => {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID
  
  if (gaId && import.meta.env.PROD) {
    // gtag 스크립트 동적 로딩
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)

    // gtag 초기화
    window.dataLayer = window.dataLayer || []
    function gtag(){window.dataLayer.push(arguments)}
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', gaId)
    
    console.log('📊 Google Analytics 로드됨:', gaId)
  } else if (import.meta.env.DEV) {
    console.log('🔧 개발 환경: Google Analytics 비활성화')
  }
}

// 환경변수 검증 (필요한 경우 여기에 추가)
// 현재는 모든 환경변수가 선택사항이므로 검증하지 않음

// Google Analytics 로드
loadGoogleAnalytics()

// React 앱 마운트
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
) 