import axios from 'axios'
import config from '../config.js'

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: config.apiDomain,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Store token in memory (also persisted in localStorage for page reloads)
let authToken = localStorage.getItem('auth_token') || null
let refreshToken = localStorage.getItem('refresh_token') || null

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false
let refreshSubscribers = []

/**
 * Subscribe to token refresh completion
 * This allows multiple requests to wait for a single refresh call
 */
const onRefreshed = callback => {
  refreshSubscribers.push(callback)
}

/**
 * Notify all subscribers that token has been refreshed
 */
const notifyRefreshed = newToken => {
  refreshSubscribers.forEach(callback => callback(newToken))
  refreshSubscribers = []
}

// Request interceptor to add token to all requests
apiClient.interceptors.request.use(
  config => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor to handle token refresh on 401
 */
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Check if error is 401 and not a refresh request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // Wait for token refresh to complete, then retry
        return new Promise(resolve => {
          onRefreshed(newToken => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(apiClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Call refresh endpoint with refresh token
        const refreshResponse = await axios.post(
          `${config.apiDomain}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              'Content-Type': 'application/json',
            },
          }
        )

        const { token: newAuthToken, refreshToken: newRefreshToken } = refreshResponse.data

        // Update tokens in memory and localStorage
        authToken = newAuthToken
        refreshToken = newRefreshToken
        localStorage.setItem('auth_token', newAuthToken)
        localStorage.setItem('refresh_token', newRefreshToken)

        // Update authorization header for the failed request
        originalRequest.headers.Authorization = `Bearer ${newAuthToken}`

        // Notify all pending requests with new token
        notifyRefreshed(newAuthToken)
        isRefreshing = false

        // Retry original request with new token
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed (refresh token expired or invalid) - redirect to login
        console.error('Token refresh failed:', refreshError)
        isRefreshing = false
        authToken = null
        refreshToken = null
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')

        // Redirect to login page
        window.location.href = '/BankingAppVue/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

/**
 * Set the authentication token
 * This will be automatically added to all subsequent requests
 * @param {string} token - The authentication token
 */
export function setAuthToken(token) {
  authToken = token
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

export function setRefreshToken(token) {
  refreshToken = token
  if (token) {
    localStorage.setItem('refresh_token', token)
  } else {
    localStorage.removeItem('refresh_token')
  }
}

/**
 * Get the current authentication token
 * @returns {string|null} The authentication token or null
 */
export function getAuthToken() {
  return authToken
}

export default apiClient
