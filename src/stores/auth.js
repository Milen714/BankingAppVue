import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios, { getAuthToken, setAuthToken as setApiAuthToken } from '@/utils/axios.js'

let responseInterceptorInitialized = false

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(getAuthToken())
  const loading = ref(true)
  const isLoggedIn = computed(() => !!user.value)

  function clearSessionState() {
    clearAuth()
  }

  // Set up axios interceptors to handle expired or invalid sessions
  const setupAxiosInterceptors = () => {
    if (responseInterceptorInitialized) {
      return
    }

    responseInterceptorInitialized = true

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          clearSessionState()
        }
        return Promise.reject(error)
      }
    )
  }

  // Fetch currently logged in user from API
  async function fetchLoggedInUser() {
    if (!token.value) {
      user.value = null
      loading.value = false
      return
    }

    loading.value = true
    try {
      const response = await axios.get(`/users/me`)

      if (response.data.success) {
        user.value = response.data.user
        console.log('Logged in user:', user.value)
      } else {
        clearSessionState()
      }
    } catch (error) {
      console.error('Error fetching logged in user:', error)
      clearSessionState()
    } finally {
      loading.value = false
    }
  }

  async function login(credentials) {
    loading.value = true

    try {
      const response = await axios.post(`/auth/login`, credentials)
      const responseData = response?.data || {}

      const loginSucceeded = responseData.success !== undefined
        ? responseData.success
        : !!(responseData.token || responseData.access_token)

      if (!loginSucceeded) {
        return {
          success: false,
          message: responseData.message || 'Invalid email or password.',
        }
      }

      const authToken = responseData.token || responseData.access_token || responseData.data?.token
      const authUser = responseData.user || responseData.data?.user || null

      if (!authToken) {
        return {
          success: false,
          message: 'Login failed: token missing in server response.',
        }
      }

      setAuthToken(authToken, authUser)

      if (!authUser) {
        await fetchLoggedInUser()
      }

      return {
        success: true,
        message: responseData.message || 'Login successful.',
      }
    } catch (error) {
      clearAuth()
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to sign in. Please try again.',
      }
    } finally {
      loading.value = false
    }
  }

  async function register(payload) {
    loading.value = true

    try {
      const response = await axios.post(`/auth/register`, payload)
      const responseData = response?.data || {}

      const registrationSucceeded = responseData.success !== undefined
        ? responseData.success
        : !responseData.error

      if (!registrationSucceeded) {
        return {
          success: false,
          message: responseData.message || 'Registration failed. Please check your details.',
        }
      }

      const authToken = responseData.token || responseData.access_token || responseData.data?.token
      const authUser = responseData.user || responseData.data?.user || null

      if (authToken) {
        setAuthToken(authToken, authUser)

        if (!authUser) {
          await fetchLoggedInUser()
        }
      }

      return {
        success: true,
        message: responseData.message || 'Registration successful.',
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to register. Please try again.',
      }
    } finally {
      loading.value = false
    }
  }

  // Store token and user after login
  function setAuthToken(newToken, newUser) {
    token.value = newToken
    user.value = newUser
    setApiAuthToken(newToken)
    // Also save to localStorage as backup
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
    }
  }

  // Clear auth state on logout
  function clearAuth() {
    token.value = null
    user.value = null
    loading.value = false
    setApiAuthToken(null)
  }

  // Call backend logout for completeness, then always clear client session.
  async function logout() {
    try {
      await axios.post(`/auth/logout`, {})
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearSessionState()
    }
  }

  return {
    // State
    user,
    token,
    loading,
    isLoggedIn,
    // Actions
    fetchLoggedInUser,
    login,
    register,
    logout,
    setAuthToken,
    clearAuth,
    setupAxiosInterceptors,
  }
})
