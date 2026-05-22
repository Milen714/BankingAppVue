import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/utils/axios.js'
import { useAuthStore } from './auth.js'
import { useBankAccountStore } from './bankAccount.js'

export const useTransactionStore = defineStore('transaction', () => {
  // State
  const transactions = ref([])
  const selectedTransaction = ref(null)
  const recentTransactions = ref([])
  const selectedAccountTransactions = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)

  // Pagination & Filter State
  const currentPage = ref(0)
  const pageSize = ref(20)
  const totalElements = ref(0)
  const totalPages = ref(0)
  const currentSort = ref('timestamp,desc')
  const filters = ref({
    iban: null,
    ownerId: null,
    startDate: null,
    endDate: null,
    type: null,
  })

  /**
   * Perform a transfer between accounts using the API
   * @param {*} payload
   * @returns
   */
  async function executeTransaction(payload) {
    const bankAccountStore = useBankAccountStore()
    loading.value = true
    error.value = null
    try {
      const response = await axios.post('/transactions', payload)
      await bankAccountStore.fetchMyBankAccounts(true) // Refresh accounts to reflect new balances, force=true to bypass cache
      return response.data
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'An error occurred while executing the transfer.'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch transactions for a specific account
   * @param {string} iban - The IBAN of the account for which to fetch transactions
   */
  async function fetchAccountTransactions(iban) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`/transactions?iban=${iban}`)
      recentTransactions.value = response.data.data
      console.log('Fetched transactions for account', iban, response.data)
    } catch (err) {
      error.value = err.response?.data || 'An error occurred while fetching transactions.'
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch recent transactions for the logged in user
   */
  async function fetchRecentTransactions() {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn) {
      error.value = 'You must be logged in to view transactions.'
      return
    }

    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`/transactions?ownerId=${authStore.user.id}`)
      recentTransactions.value = response.data.data
      console.log('Fetched recent transactions:', response.data)
    } catch (err) {
      error.value = err.response?.data || 'An error occurred while fetching transactions.'
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch all transactions with pagination, sorting, and filtering (for admin/employee view)
   * @param {Object} options - Query options
   */
  async function fetchAllTransactions({
    page = 0,
    pageSize: size = 20,
    iban = null,
    ownerId = null,
    startDate = null,
    endDate = null,
    type = null,
    sort = 'timestamp,desc',
  } = {}) {
    loading.value = true
    error.value = null

    // Update local state
    currentPage.value = page
    pageSize.value = size
    currentSort.value = sort
    filters.value = { iban, ownerId, startDate, endDate, type }

    try {
      const params = {
        page,
        size,
      }

      // Add optional parameters
      if (iban) params.iban = iban
      if (ownerId) params.ownerId = ownerId
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      if (sort) params.sort = sort
      if (type) params.type = type

      const response = await axios.get('/transactions', { params })
      console.log('Fetched all transactions:', response.data)
      transactions.value = response.data.data
      totalElements.value = response.data.totalElements || 0
      totalPages.value = response.data.totalPages || 1
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'An error occurred while fetching transactions.'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  return {
    transactions,
    selectedTransaction,
    recentTransactions,
    selectedAccountTransactions,
    loading,
    error,
    success,
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    currentSort,
    filters,
    executeTransaction,
    fetchAccountTransactions,
    fetchRecentTransactions,
    fetchAllTransactions,
  }
})
