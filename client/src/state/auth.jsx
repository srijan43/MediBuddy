import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { api, setAccessToken } from '../utils/api'

const AuthContext = createContext(null)

const LS_KEY = 'medibuddy_auth'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (parsed?.token) {
          setAccessToken(parsed.token)
          setToken(parsed.token)
        }
      } catch {
        // ignore
      }
    }
    setLoading(false)
  }, [])

  async function refreshMe() {
    const { data } = await api.get('/me')
    setUser(data.user)
    setProfile(data.profile)
  }

  async function login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password })
    setAccessToken(data.token)
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem(LS_KEY, JSON.stringify({ token: data.token }))
    toast.success('Welcome back')
    await refreshMe()
  }

  async function signup(payload) {
    const { data } = await api.post('/auth/signup', payload)
    setAccessToken(data.token)
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem(LS_KEY, JSON.stringify({ token: data.token }))
    toast.success('Account created')
    await refreshMe()
  }

  function logout() {
    setAccessToken(null)
    setToken(null)
    setUser(null)
    setProfile(null)
    localStorage.removeItem(LS_KEY)
    toast.success('Logged out')
  }

  const value = useMemo(
    () => ({ token, user, profile, loading, login, signup, logout, refreshMe }),
    [token, user, profile, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

