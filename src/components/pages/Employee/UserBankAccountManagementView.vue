<script setup>
import EmployeeSidebarNav from '@/components/organisms/SidebarNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import DataTable from '@/components/organisms/DataTable.vue'
import PaginationControls from '@/components/organisms/PaginationControls.vue'
import BankAccountTableRow from '@/components/molecules/BankAccountTableRow.vue'
import { onMounted, ref } from 'vue'
import { useBankAccountStore } from '@/stores/bankAccount'

const bankAccountStore = useBankAccountStore()

// Local state for filters and sorting
const ibanSearch = ref('')
const firstNameSearch = ref('')
const lastNameSearch = ref('')
const statusFilter = ref('All')
const pageSize = ref(20)
const currentPage = ref(0)

// Table columns configuration
const columns = [
  { key: 'iban', label: 'IBAN', sortable: true },
  { key: 'owner', label: 'Owner', sortable: false },
  { key: 'title', label: 'Title', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'balance', label: 'Balance', sortable: true },
  { key: 'absoluteLimit', label: 'Abs. Limit', sortable: true },
  { key: 'dailyLimit', label: 'Daily Limit', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false },
]

// Load initial data
onMounted(async () => {
  await fetchAccounts()
})

// Fetch accounts with current filters
async function fetchAccounts(page = 0) {
  const statusValue = statusFilter.value === 'All' ? null : statusFilter.value

  await bankAccountStore.fetchAccounts({
    page,
    pageSize: pageSize.value,
    iban: ibanSearch.value || null,
    firstName: firstNameSearch.value || null,
    lastName: lastNameSearch.value || null,
    status: statusValue,
    sort: bankAccountStore.currentSort,
  })

  currentPage.value = page
}

// Handle sort from DataTable
function handleSort(sortString) {
  bankAccountStore.currentSort = sortString
  fetchAccounts(0)
}

// Handle pagination
function goToPage(page) {
  if (page >= 0 && page < bankAccountStore.totalPages) {
    fetchAccounts(page)
  }
}

// Handle approve/deny
function handleApprove(account) {
  console.log('Approve account:', account)
  bankAccountStore.updateAccountStatus(account.id, 'APPROVED')
}

function handleDeny(account) {
  console.log('Deny account:', account)
  bankAccountStore.updateAccountStatus(account.id, 'REJECTED')
}

// Handle search
function handleSearch() {
  fetchAccounts(0)
}

// Handle page size change
function handlePageSizeChange(newSize) {
  pageSize.value = newSize
  fetchAccounts(0)
}
</script>

<template>
  <section class="bg-[#f6efec]">
    <div class="mx-auto flex min-h-[calc(100vh-60px)]">
      <EmployeeSidebarNav />

      <div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
        <PortalHeader :title="'Bank Account Management'" :buttons="[]" />

        <!-- Error Message -->
        <section
          v-if="bankAccountStore.error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
        >
          {{ bankAccountStore.error }}
        </section>

        <!-- Success Message -->
        <section
          v-if="bankAccountStore.success"
          class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
        >
          Account status updated successfully
        </section>

        <!-- Filter & Search Section -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <!-- First Name Search -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase mb-2">
                First Name
              </label>
              <div class="relative">
                <i class="pi pi-search absolute left-3 top-3 text-gray-400 text-sm"></i>
                <input
                  v-model="firstNameSearch"
                  @keyup.enter="handleSearch"
                  type="text"
                  placeholder="Search first name..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <!-- Last Name Search -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase mb-2">
                Last Name
              </label>
              <div class="relative">
                <i class="pi pi-search absolute left-3 top-3 text-gray-400 text-sm"></i>
                <input
                  v-model="lastNameSearch"
                  @keyup.enter="handleSearch"
                  type="text"
                  placeholder="Search last name..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <!-- Account Status -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase mb-2">
                Status
              </label>
              <select
                v-model="statusFilter"
                @change="handleSearch"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option>All</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Table Section using DataTable Component -->
        <DataTable
          :columns="columns"
          :data="bankAccountStore.accounts"
          :loading="bankAccountStore.loading"
          :current-sort="bankAccountStore.currentSort"
          @sort="handleSort"
        >
          <BankAccountTableRow
            v-for="account in bankAccountStore.accounts"
            :key="account.id"
            :account="account"
            @approve="handleApprove"
            @deny="handleDeny"
          />
        </DataTable>

        <!-- Pagination Section using PaginationControls Component -->
        <PaginationControls
          :current-page="currentPage"
          :total-pages="bankAccountStore.totalPages"
          :total-elements="bankAccountStore.totalElements"
          :page-size="pageSize"
          item-label="accounts"
          @page-changed="goToPage"
          @size-changed="handlePageSizeChange"
        />
      </div>
    </div>
  </section>
</template>
