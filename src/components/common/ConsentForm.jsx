import React, { useState } from 'react'
import { setPrivacyConsent } from '../../utils/privacy'

const ConsentForm = ({ 
  consentType, 
  title, 
  description, 
  onSubmit, 
  children 
}) => {
  const [consented, setConsented] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleConsentChange = (e) => {
    setConsented(e.target.checked)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!consented) {
      alert('개인정보 수집 및 이용에 동의해주세요.')
      return
    }

    // 동의 상태 저장
    setPrivacyConsent(consentType, true)
    
    // 폼 데이터 처리
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {children}
      
      <div className="border-t pt-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id={`consent-${consentType}`}
            checked={consented}
            onChange={handleConsentChange}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            required
          />
          <div className="text-sm">
            <label htmlFor={`consent-${consentType}`} className="font-medium text-gray-700">
              개인정보 수집 및 이용에 동의합니다. (필수)
            </label>
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              {showDetails ? '접기' : '자세히 보기'}
            </button>
          </div>
        </div>
        
        {showDetails && (
          <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-600">
            <h4 className="font-medium mb-2">{title}</h4>
            <p className="mb-2">{description}</p>
            <div className="space-y-1">
              <p><strong>수집목적:</strong> {getCollectionPurpose(consentType)}</p>
              <p><strong>수집항목:</strong> {getCollectionItems(consentType)}</p>
              <p><strong>보유기간:</strong> {getRetentionPeriod(consentType)}</p>
              <p><strong>철회방법:</strong> 이메일 또는 연락처를 통해 철회 요청</p>
            </div>
          </div>
        )}
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        disabled={!consented}
      >
        제출하기
      </button>
    </form>
  )
}

// 수집 목적 반환
const getCollectionPurpose = (type) => {
  const purposes = {
    newsletter: '뉴스레터 발송',
    contact: '문의사항 답변',
    feedback: '피드백 처리 및 서비스 개선',
    event: '이벤트 참여 및 결과 안내'
  }
  return purposes[type] || '서비스 제공'
}

// 수집 항목 반환
const getCollectionItems = (type) => {
  const items = {
    newsletter: '이메일 주소',
    contact: '이름, 이메일 주소, 연락처, 문의내용',
    feedback: '이메일 주소, 피드백 내용',
    event: '이름, 이메일 주소, 연락처'
  }
  return items[type] || '이메일 주소'
}

// 보유 기간 반환
const getRetentionPeriod = (type) => {
  const periods = {
    newsletter: '구독 해지 시까지',
    contact: '문의 처리 완료 후 1년',
    feedback: '피드백 처리 완료 후 6개월',
    event: '이벤트 종료 후 3개월'
  }
  return periods[type] || '목적 달성 시까지'
}

export default ConsentForm 