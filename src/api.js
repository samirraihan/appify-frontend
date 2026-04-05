import axios from 'axios'

// Prefer build-time Vite env, but provide a robust runtime fallback and
// normalize trailing slashes. This ensures requests go to the API host
// (e.g. http://127.0.0.1:8000/api/v1) instead of the app origin.
const rawEnvBase = import.meta.env.VITE_API_BASE_URL || ''
const normalize = (u) => (u || '').toString().replace(/\/+$/, '')

let baseURL = normalize(rawEnvBase)

if (!baseURL) {
  // If a runtime global is injected (optional), prefer it.
  if (typeof window !== 'undefined' && window.__VITE_API_BASE_URL) {
    baseURL = normalize(window.__VITE_API_BASE_URL)
  }
}

// Final fallback to the local backend URL requested:
if (!baseURL) baseURL = 'http://127.0.0.1:8000/api/v1'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
