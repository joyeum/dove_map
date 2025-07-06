# ⚡ 고급 기능 가이드 (Advanced Features)

> **삼쩜삼 네이티브 앱 연동 가이드**
> 
> **📚 공식 문서**: https://jobis.atlassian.net/wiki/spaces/Mobile/pages/727056402

## 📋 네이밍 컨벤션

삼쩜삼 관련 모든 함수는 `szs` 접두사 사용

## 🔗 삼쩜삼 WebView Bridge

### 삼쩜삼 스펙 (참고)
```javascript
// 앱바 설정
window.FlutterWebViewBridge.postMessage(JSON.stringify({
    "method": "newAppBar", 
    "data": {
        "backgroundColor": "#000000",
        "overlay": true
    }
}))

// 컨테이너 색상
window.FlutterWebViewBridge.postMessage(JSON.stringify({
    "method": "containerColor", 
    "data": {
        "color": "#ffffff"
    }
}))

// 리워드 광고
window.FlutterWebViewBridge.postMessage(JSON.stringify({
    "method": "requestRewardedAd", 
    "data": {
        "adUnit": "webview_substitution_reward"
    },
    "callbackId": "szs_" + Date.now()
}))
```

### 기본 호출 방식
```javascript
window.FlutterWebViewBridge.postMessage(
  JSON.stringify({
    method: string,
    data?: object,
    callbackId?: string
  })
)
```

### Callback 처리
```javascript
window.WebBridge = {
  dispatch: function(msg) {
    const response = JSON.parse(msg)
    // response.callbackId, response.data 처리
  }
}
```

## 🌉 SZS Bridge 유틸리티

`src/utils/szsWebViewBridge.js`:
```javascript
class SzsWebViewBridge {
  constructor() {
    this.isReady = false
    this.callbacks = {}
    this.setupInterval = null
    this.init()
  }

  init() {
    if (window.FlutterWebViewBridge) {
      this.isReady = true
      this.setupWebBridge()
      this.startPeriodicSetup()
    }
  }

  setupWebBridge() {
    window.WebBridge = {
      dispatch: (msg) => {
        const response = JSON.parse(msg)
        if (this.callbacks[response.callbackId]) {
          this.callbacks[response.callbackId](response.data)
          delete this.callbacks[response.callbackId]
        }
      }
    }
  }

  sendMessage(method, data = {}) {
    const callbackId = 'szs_' + Date.now()
    window.FlutterWebViewBridge.postMessage(JSON.stringify({
      method,
      data,
      callbackId
    }))
    return callbackId
  }

  // 앱바 설정 (실제 함수명: newAppBar)
  szsNewAppBar(backgroundColor, overlay = true) {
    this.sendMessage('newAppBar', { backgroundColor, overlay })
  }

  // 컨테이너 색상 (실제 함수명: containerColor)
  szsContainerColor(color) {
    this.sendMessage('containerColor', { color })
  }

  // 리워드 광고
  szsRequestRewardedAd(callback) {
    const callbackId = this.sendMessage('requestRewardedAd', { 
      adUnit: 'webview_substitution_reward' 
    })
    if (callback) this.callbacks[callbackId] = callback
  }

  // 광고 DOM 이슈 대응: 주기적 설정
  startPeriodicSetup() {
    this.setupInterval = setInterval(() => {
      this.szsNewAppBar('#000000', true)
      this.szsContainerColor('#ffffff')
    }, 3000) // 3초마다 재설정
  }

  stopPeriodicSetup() {
    if (this.setupInterval) {
      clearInterval(this.setupInterval)
      this.setupInterval = null
    }
  }
}

const szsWebViewBridge = new SzsWebViewBridge()
export default szsWebViewBridge
```

## 📱 광고 처리

```javascript
// 환경별 광고 처리
const showAd = () => {
  if (szsWebViewBridge.isReady) {
    // 앱: 애드몹
    szsWebViewBridge.szsRequestRewardedAd((result) => {
      console.log('광고 결과:', result)
    })
  } else {
    // 웹: 애드센스
    if (window.adsbygoogle) {
      window.adsbygoogle.push({})
    }
  }
}
```

## 🎨 앱 설정

```javascript
// App.jsx에서 초기 설정
useEffect(() => {
  if (szsWebViewBridge.isReady) {
    // 초기 설정
    szsWebViewBridge.szsNewAppBar('#000000', true)
    szsWebViewBridge.szsContainerColor('#ffffff')
    
    // 광고 DOM 이슈로 인한 리셋 방지를 위해 주기적 설정이 자동으로 시작됨
  }
  
  // 컴포넌트 언마운트 시 주기적 설정 중단
  return () => {
    if (szsWebViewBridge.isReady) {
      szsWebViewBridge.stopPeriodicSetup()
    }
  }
}, [])