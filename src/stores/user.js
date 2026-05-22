import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/utils/axios.js'
import { useAuthStore } from '@/stores/auth'

export const useUserStore = defineStore('user', () => {
  // State
  const loading = ref(false)
  const error = ref(null)
  const successMessage = ref(null)
  const authStore = useAuthStore()
  const users = ref([])
  const selectedUser = ref(null)

  // Pagination & Filter State
  const currentPage = ref(0)
  const pageSize = ref(20)
  const totalElements = ref(0)
  const totalPages = ref(0)
  const currentSort = ref('lastName,asc')
  const filters = ref({
    firstName: null,
    lastName: null,
    role: 'ROLE_CUSTOMER',
    isApproved: true,
  })

  // Computed property to get current user profile data
  const userProfile = computed(() => authStore.user)

  // Actions
  async function fetchUsers({
    page = 0,
    pageSize: size = 20,
    firstName = null,
    lastName = null,
    role = 'ROLE_CUSTOMER',
    isApproved = true,
    sort = 'lastName,asc',
  } = {}) {
    loading.value = true
    error.value = null
    successMessage.value = null

    // Update local state
    currentPage.value = page
    pageSize.value = size
    currentSort.value = sort
    filters.value = { firstName, lastName, role, isApproved }

    try {
      const params = {
        page,
        pageSize: size,
        firstName,
        lastName,
        role,
        isApproved,
        sort,
      }
      const response = await axios.get('/users', { params })
      console.log('response data:', response.data)
      users.value = response.data.data
      totalElements.value = response.data.totalElements || 0
      totalPages.value = response.data.totalPages || 1
      console.log('Users state updated:', users.value)
      return response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  async function updateUserStatus(userId, isApproved) {
    loading.value = true
    error.value = null
    successMessage.value = null

    try {
      const response = await axios.put(`/users/${userId}`, {
        isApproved: isApproved,
      })
      await fetchUsers({
        ...filters.value,
        page: currentPage.value,
        pageSize: pageSize.value,
        sort: currentSort.value,
      })
      successMessage.value = 'User status updated successfully.'
      setTimeout(() => {
        successMessage.value = null
      }, 5000) // Clear success message after 5 seconds
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    successMessage,
    users,
    selectedUser,
    userProfile,
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    currentSort,
    filters,
    fetchUsers,
    updateUserStatus,
  }
})
