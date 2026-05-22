import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/utils/axios.js'
import { useAuthStore } from './auth.js'

export const useBankAccountStore = defineStore('bankAccount', () => {
  // State
  const myAccounts = ref([])
  const mySavingsAccounts = ref([])
  const myCurrentAccounts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const selectedAccount = ref(null)

  // Pagination & Filter State
  const accounts = ref([]) // For admin/employee view with filtering
  const currentPage = ref(0)
  const pageSize = ref(20)
  const totalElements = ref(0)
  const totalPages = ref(0)
  const currentSort = ref('id,asc')
  const filters = ref({
    ownerId: null,
    iban: null,
    status: null,
    firstName: null,
    lastName: null,
  })
  // Actions
  /**
   * Fetch all bank accounts for the logged in user from the API
   * @param {boolean} force - Force refresh even if accounts are already cached
   */
  async function fetchMyBankAccounts(force = false) {
    const authStore = useAuthStore()
    if (myAccounts.value.length > 0 && !force) {
      return // Already have accounts, no need to fetch again
    }

    // Always wait for auth to be ready
    if (authStore.loading) {
      await authStore.fetchLoggedInUser()
    }

    if (!authStore.isLoggedIn) {
      error.value = 'You must be logged in to view your bank accounts.'
      return
    }

    loading.value = true
    error.value = null
    try {
      const response = await axios.get('/accounts?ownerId=' + authStore.user.id)
      console.log('Fetched bank accounts:', response.data)
      myAccounts.value = response.data.data
      sortAccountsByType()
    } catch (err) {
      error.value = err.response?.data || 'An error occurred while fetching bank accounts.'
    } finally {
      loading.value = false
    }
  }

  async function fetchBankAccountByIban(iban) {
    const account =
      myAccounts.value.find(acc => acc.iban === iban) ||
      accounts.value.find(acc => acc.iban === iban)

    if (account) {
      selectedAccount.value = account
      return account
    }

    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`/accounts?iban=${iban}`)
      // Handle both array response (paginated) and direct object response
      const accountData = Array.isArray(response.data.data)
        ? response.data.data[0]
        : response.data.data

      if (!accountData) {
        throw new Error('Account not found')
      }

      selectedAccount.value = accountData
      return selectedAccount.value
    } catch (err) {
      error.value = err.response?.data || 'An error occurred while fetching the bank account.'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }
  /**
   * Sort accounts into savings and current based on their type. This is called after fetching accounts to keep the logic in one place.
   */
  function sortAccountsByType() {
    mySavingsAccounts.value = myAccounts.value.filter(account => account.type === 'SAVINGS')
    myCurrentAccounts.value = myAccounts.value.filter(account => account.type === 'CHECKING')
  }

  /**
   * Fetch recent transactions for the logged in user
   */
  async function requestNewAccount(payload) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post('/accounts', payload)
      await fetchMyBankAccounts(true) // Refresh accounts to reflect new balances, force=true to bypass cache
      return response.data
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'An error occurred while requesting a new account.'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  async function updateAccountSettings(id, updatedData) {
    console.log('Updating account settings for account ID', id, 'with data', updatedData)
    loading.value = true
    error.value = null
    try {
      const response = await axios.put(`/accounts/${id}`, updatedData)
      await fetchMyBankAccounts(true)
      success.value = true
      setTimeout(() => {
        success.value = false
      }, 10000) // Reset success message after 10 seconds
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'An error occurred while updating account settings.'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch bank accounts with pagination, sorting, and filtering (for admin/employee view)
   * @param {Object} options - Query options
   */
  async function fetchAccounts({
    page = 0,
    pageSize: size = 20,
    ownerId = null,
    iban = null,
    status = null,
    firstName = null,
    lastName = null,
    sort = 'id,asc',
  } = {}) {
    loading.value = true
    error.value = null

    // Update local state
    currentPage.value = page
    pageSize.value = size
    currentSort.value = sort
    filters.value = { ownerId, iban, status, firstName, lastName }

    try {
      const params = {
        page,
        size,
      }

      // Add optional parameters
      if (ownerId) params.ownerId = ownerId
      if (iban) params.iban = iban
      if (status) params.status = status
      if (firstName) params.firstName = firstName
      if (lastName) params.lastName = lastName
      if (sort) params.sort = sort

      const response = await axios.get('/accounts', { params })
      console.log('Fetched accounts:', response.data)
      accounts.value = response.data.data
      totalElements.value = response.data.totalElements || 0
      totalPages.value = response.data.totalPages || 1
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'An error occurred while fetching accounts.'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  /**
   * Update account status (approve/reject)
   */
  async function updateAccountStatus(accountId, status) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.put(`/accounts/${accountId}`, {
        status: status,
      })
      success.value = true
      setTimeout(() => {
        success.value = false
      }, 5000)
      // Refresh the accounts list
      await fetchAccounts({
        page: currentPage.value,
        pageSize: pageSize.value,
        ownerId: filters.value.ownerId,
        iban: filters.value.iban,
        status: filters.value.status,
        firstName: filters.value.firstName,
        lastName: filters.value.lastName,
        sort: currentSort.value,
      })
      return response.data
    } catch (err) {
      error.value =
        err.response?.data?.message || 'An error occurred while updating account status.'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  return {
    myAccounts,
    mySavingsAccounts,
    myCurrentAccounts,
    selectedAccount,
    loading,
    error,
    success,
    accounts,
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    currentSort,
    filters,
    fetchMyBankAccounts,
    fetchBankAccountByIban,
    sortAccountsByType,
    requestNewAccount,
    updateAccountSettings,
    fetchAccounts,
    updateAccountStatus,
  }
})
