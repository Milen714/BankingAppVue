<script setup>
import EmployeeSidebarNav from '@/components/organisms/SidebarNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import DataTable from '@/components/organisms/DataTable.vue'
import PaginationControls from '@/components/organisms/PaginationControls.vue'
import TransactionsList from '@/components/organisms/TransactionsList.vue'
import { onMounted, ref } from 'vue'
import { useTransactionStore } from '@/stores/transaction'

const transactionStore = useTransactionStore()

// Local state for filters and sorting
const ibanSearch = ref('')
const startDateFilter = ref('')
const endDateFilter = ref('')

// Handle search/filter
const handleSearch = async () => {
  await transactionStore.fetchAllTransactions({
    page: 0,
    pageSize: transactionStore.pageSize,
    iban: ibanSearch.value || null,
    startDate: startDateFilter.value || null,
    endDate: endDateFilter.value || null,
    sort: transactionStore.currentSort,
  })
}

// Handle page change
const goToPage = async page => {
  await transactionStore.fetchAllTransactions({
    page,
    pageSize: transactionStore.pageSize,
    iban: transactionStore.filters.iban,
    startDate: transactionStore.filters.startDate,
    endDate: transactionStore.filters.endDate,
    sort: transactionStore.currentSort,
  })
}

// Handle page size change
const handlePageSizeChange = async newSize => {
  await transactionStore.fetchAllTransactions({
    page: 0,
    pageSize: newSize,
    iban: transactionStore.filters.iban,
    startDate: transactionStore.filters.startDate,
    endDate: transactionStore.filters.endDate,
    sort: transactionStore.currentSort,
  })
}

// Initialize on mount
onMounted(async () => {
  await transactionStore.fetchAllTransactions({
    page: 0,
    pageSize: 20,
    sort: 'timestamp,desc',
  })
})
</script>

<template>
  <section class="bg-[#f6efec]">
    <div class="mx-auto flex min-h-[calc(100vh-60px)]">
      <EmployeeSidebarNav />

      <div class="w-full px-3 pb-24 pt-4 md:px-8 md:pb-8 md:pt-6">
        <PortalHeader :title="'Transaction Overview'" :buttons="[]" />

        <!-- Error Message -->
        <section
          v-if="transactionStore.error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
        >
          {{ transactionStore.error }}
        </section>

        <!-- Success Message -->
        <section
          v-if="transactionStore.success"
          class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
        >
          Account status updated successfully
        </section>

        <!-- Filter & Search Section -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <!-- IBAN Search -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase mb-2"> IBAN </label>
              <div class="relative">
                <i class="pi pi-search absolute left-3 top-3 text-gray-400 text-sm"></i>
                <input
                  v-model="ibanSearch"
                  @keyup.enter="handleSearch"
                  type="text"
                  placeholder="Search IBAN..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <!-- Start Date Filter -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase mb-2">
                Start Date
              </label>
              <input
                v-model="startDateFilter"
                @change="handleSearch"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <!-- End Date Filter -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase mb-2">
                End Date
              </label>
              <input
                v-model="endDateFilter"
                @change="handleSearch"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
        <!-- Transactions Section -->
        <section class="mt-8">
          <TransactionsList
            :title="'All Transactions'"
            :transactions="transactionStore.transactions"
          />
        </section>

        <!-- Pagination Section using PaginationControls Component -->
        <PaginationControls
          :current-page="transactionStore.currentPage"
          :total-pages="transactionStore.totalPages"
          :total-elements="transactionStore.totalElements"
          :page-size="transactionStore.pageSize"
          item-label="transactions"
          @page-changed="goToPage"
          @size-changed="handlePageSizeChange"
        />
      </div>
    </div>
  </section>
</template>
