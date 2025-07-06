# 🔌 선택적 서비스 연동 가이드 (Optional Integrations)

> **필요에 따라 연동할 수 있는 외부 서비스들**

## 🤖 Gemini 2.0 Flash API 연동

### 1단계: API 키 발급
1. [Google AI Studio](https://aistudio.google.com/) 접속
2. "Get API key" 클릭
3. 새 프로젝트 생성 또는 기존 프로젝트 선택
4. API 키 복사

### 2단계: 환경변수 설정
```bash
# .env 파일에 추가
VITE_GEMINI_API_KEY=your_api_key_here
```

### 3단계: useGemini 훅 생성
`src/hooks/useGemini.js`:
```javascript
import { useState } from 'react'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent'

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateContent = async (prompt, options = {}) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    
    if (!apiKey) {
      throw new Error('Gemini API 키가 설정되지 않았습니다.')
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 1000,
            topP: options.topP || 0.8,
            topK: options.topK || 40,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }

      const data = await response.json()
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!content) {
        throw new Error('응답에서 콘텐츠를 찾을 수 없습니다.')
      }

      return content
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateContent,
    isLoading,
    error
  }
}
```

## 🗄️ Supabase 연동

### 1단계: Supabase 프로젝트 생성
1. [Supabase](https://supabase.com/) 접속
2. "New Project" 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호 설정
4. 리전 선택 (Seoul 권장)

### 2단계: 환경변수 설정
```bash
# .env 파일에 추가
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3단계: Supabase 클라이언트 설치
```bash
npm install @supabase/supabase-js
```

### 4단계: useSupabase 훅 생성
`src/hooks/useSupabase.js`:
```javascript
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export const useSupabase = (tableName) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 데이터 조회
  const fetchData = async (options = {}) => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase.from(tableName).select('*')
      
      if (options.filter) {
        query = query.eq(options.filter.column, options.filter.value)
      }
      
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending 
        })
      }

      const { data, error } = await query
      
      if (error) throw error
      
      setData(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 데이터 삽입
  const insert = async (newData) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert(newData)
        .select()

      if (error) throw error

      setData(prev => [...prev, ...data])
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 데이터 업데이트
  const update = async (id, updates) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error

      setData(prev => 
        prev.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      )
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 데이터 삭제
  const remove = async (id) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)

      if (error) throw error

      setData(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    fetchData,
    insert,
    update,
    remove: remove
  }
}

// 인증 관련 훅
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 인증 상태 변화 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut
  }
}
```

---

> 💡 **팁**: 모든 서비스를 한 번에 연동할 필요는 없습니다. 프로젝트 요구사항에 맞춰 필요한 것만 선택적으로 적용하세요! 