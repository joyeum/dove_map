import React, { useState, useEffect } from 'react'

const PrivacyNotice = () => {
  const [showNotice, setShowNotice] = useState(false)
  const [acceptedCookies, setAcceptedCookies] = useState(false)

  useEffect(() => {
    // 쿠키 동의 상태 확인
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      setShowNotice(true)
    } else {
      setAcceptedCookies(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
    setAcceptedCookies(true)
    setShowNotice(false)
    
    // Google Analytics 활성화 (이미 로드된 경우)
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      })
    }
  }

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
    setShowNotice(false)
    
    // Google Analytics 비활성화
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      })
    }
  }

  if (!showNotice) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg z-50">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <p>
            이 웹사이트는 사용자 경험 개선을 위해 쿠키와 Google Analytics를 사용합니다. 
            개인 식별 정보는 수집하지 않습니다.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
          >
            거부
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors"
          >
            동의
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrivacyNotice 