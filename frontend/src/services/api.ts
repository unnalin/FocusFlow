import axios from 'axios'

// Determine the API base URL based on environment
// Priority: VITE_API_URL > VITE_API_BASE_URL > default localhost
const getApiBaseUrl = () => {
  // Support both VITE_API_URL (new) and VITE_API_BASE_URL (legacy)
  const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL

  if (apiUrl) {
    // Ensure URL ends with /api/v1
    return apiUrl.endsWith('/api/v1') ? apiUrl : `${apiUrl}/api/v1`
  }

  // Default to localhost for development
  return 'http://localhost:8000/api/v1'
}

const API_BASE_URL = getApiBaseUrl()

// Log API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL)
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: false, // Set to true if using cookies/sessions
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      console.error('Network Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
