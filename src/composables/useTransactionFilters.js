import { ref } from 'vue'
import { useTransactionStore } from '@/stores/transaction'

export function useTransactionFilters(ownerId = null) {
  const transactionStore = useTransactionStore()

  // Local state for filters and sorting
  const ibanSearch = ref('')
  const startDateFilter = ref('')
  const endDateFilter = ref('')
  const typeFilter = ref('All')
  const amountComparisonType = ref('Eq')
  const amountValue = ref('')

  // Helper function to build amount parameters
  const buildAmountParams = () => {
    const amountParams = {}
    if (amountValue.value) {
      if (amountComparisonType.value === 'Lt') amountParams.amountLt = amountValue.value
      else if (amountComparisonType.value === 'Gt') amountParams.amountGt = amountValue.value
      else if (amountComparisonType.value === 'Eq') amountParams.amountEq = amountValue.value
    }
    return amountParams
  }

  // Handle search/filter
  const handleSearch = async () => {
    const typeValue = typeFilter.value === 'All' ? null : typeFilter.value
    const amountParams = buildAmountParams()

    const filterOptions = {
      page: 0,
      pageSize: transactionStore.pageSize,
      iban: ibanSearch.value || null,
      startDate: startDateFilter.value || null,
      endDate: endDateFilter.value || null,
      type: typeValue,
      ...amountParams,
      sort: transactionStore.currentSort,
    }

    if (ownerId) {
      filterOptions.ownerId = ownerId
    }

    await transactionStore.fetchAllTransactions(filterOptions)
  }

  // Handle page change
  const goToPage = async page => {
    const amountParams = buildAmountParams()

    const filterOptions = {
      page,
      pageSize: transactionStore.pageSize,
      iban: transactionStore.filters.iban,
      startDate: transactionStore.filters.startDate,
      endDate: transactionStore.filters.endDate,
      type: transactionStore.filters.type,
      ...amountParams,
      sort: transactionStore.currentSort,
    }

    if (ownerId) {
      filterOptions.ownerId = ownerId
    }

    await transactionStore.fetchAllTransactions(filterOptions)
  }

  // Handle page size change
  const handlePageSizeChange = async newSize => {
    const amountParams = buildAmountParams()

    const filterOptions = {
      page: 0,
      pageSize: newSize,
      iban: transactionStore.filters.iban,
      startDate: transactionStore.filters.startDate,
      endDate: transactionStore.filters.endDate,
      type: transactionStore.filters.type,
      ...amountParams,
      sort: transactionStore.currentSort,
    }

    if (ownerId) {
      filterOptions.ownerId = ownerId
    }

    await transactionStore.fetchAllTransactions(filterOptions)
  }

  return {
    // Filters
    ibanSearch,
    startDateFilter,
    endDateFilter,
    typeFilter,
    amountComparisonType,
    amountValue,
    // Methods
    handleSearch,
    goToPage,
    handlePageSizeChange,
  }
}
