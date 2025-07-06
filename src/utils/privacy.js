// 개인정보 및 쿠키 관련 유틸리티 함수들

/**
 * 쿠키 동의 상태 확인
 * @returns {boolean|null} true: 동의, false: 거부, null: 미선택
 */
export const getCookieConsent = () => {
  const consent = localStorage.getItem('cookieConsent')
  if (consent === 'accepted') return true
  if (consent === 'declined') return false
  return null
}

/**
 * 쿠키 동의 상태 설정
 * @param {boolean} accepted - 동의 여부
 */
export const setCookieConsent = (accepted) => {
  const consentValue = accepted ? 'accepted' : 'declined'
  localStorage.setItem('cookieConsent', consentValue)
  localStorage.setItem('cookieConsentDate', new Date().toISOString())
  
  // Google Analytics consent 업데이트
  if (window.gtag) {
    window.gtag('consent', 'update', {
      'analytics_storage': accepted ? 'granted' : 'denied'
    })
  }
}

/**
 * 쿠키 동의 날짜 확인
 * @returns {Date|null} 동의한 날짜 또는 null
 */
export const getCookieConsentDate = () => {
  const date = localStorage.getItem('cookieConsentDate')
  return date ? new Date(date) : null
}

/**
 * 개인정보 수집 동의 상태 확인
 * @param {string} type - 수집 유형 (예: 'newsletter', 'contact')
 * @returns {boolean}
 */
export const getPrivacyConsent = (type) => {
  return localStorage.getItem(`privacyConsent_${type}`) === 'accepted'
}

/**
 * 개인정보 수집 동의 상태 설정
 * @param {string} type - 수집 유형
 * @param {boolean} accepted - 동의 여부
 */
export const setPrivacyConsent = (type, accepted) => {
  const key = `privacyConsent_${type}`
  if (accepted) {
    localStorage.setItem(key, 'accepted')
    localStorage.setItem(`${key}_date`, new Date().toISOString())
  } else {
    localStorage.removeItem(key)
    localStorage.removeItem(`${key}_date`)
  }
}

/**
 * 모든 개인정보 관련 데이터 삭제
 */
export const clearAllPrivacyData = () => {
  const keys = Object.keys(localStorage).filter(key => 
    key.startsWith('cookieConsent') || key.startsWith('privacyConsent')
  )
  
  keys.forEach(key => localStorage.removeItem(key))
  
  // Google Analytics consent 리셋
  if (window.gtag) {
    window.gtag('consent', 'update', {
      'analytics_storage': 'denied'
    })
  }
}

/**
 * 개인정보 보호 설정 요약 조회
 * @returns {object} 현재 설정 상태
 */
export const getPrivacySummary = () => {
  return {
    cookieConsent: getCookieConsent(),
    cookieConsentDate: getCookieConsentDate(),
    privacyConsents: Object.keys(localStorage)
      .filter(key => key.startsWith('privacyConsent_'))
      .reduce((acc, key) => {
        const type = key.replace('privacyConsent_', '').replace('_date', '')
        if (!type.includes('_date')) {
          acc[type] = localStorage.getItem(key) === 'accepted'
        }
        return acc
      }, {})
  }
} 