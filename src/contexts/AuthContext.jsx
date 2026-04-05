import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      // Optionally fetch current user
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  const login = async (email, password) => {
    const resp = await api.post('/login', { email, password })
    const data = resp.data
    if (data && data.token) {
      setToken(data.token)
      setUser(data.user || null)
    }
    return data
  }

  const register = async (payload) => {
    const resp = await api.post('/register', payload)
    const data = resp.data
    if (data && data.token) {
      setToken(data.token)
      setUser(data.user || null)
    }
    return data
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch (e) {
      // ignore
    }
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
