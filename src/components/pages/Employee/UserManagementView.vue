<script setup>
import EmployeeSidebarNav from '@/components/organisms/SidebarNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import DataTable from '@/components/organisms/DataTable.vue'
import PaginationControls from '@/components/organisms/PaginationControls.vue'
import UserTableRow from '@/components/molecules/UserTableRow.vue'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// Local state for filters and sorting
const searchQuery = ref('')
const approvalStatusFilter = ref('Pending')
const roleFilter = ref('All')
const pageSize = ref(20)
const currentPage = ref(0)

// Table columns configuration
const columns = [
  { key: 'firstName', label: 'First Name', sortable: true },
  { key: 'lastName', label: 'Last Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phoneNumber', label: 'Phone Number', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'isApproved', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false },
]

// Load initial data
onMounted(async () => {
  await fetchUsers()
})

// Fetch users with current filters
async function fetchUsers(page = 0) {
  const isApprovedValue =
    approvalStatusFilter.value === 'Pending'
      ? false
      : approvalStatusFilter.value === 'Approved'
        ? true
        : null

  await userStore.fetchUsers({
    page,
    pageSize: pageSize.value,
    firstName: searchQuery.value || null,
    role: roleFilter.value === 'All' ? 'ROLE_CUSTOMER' : roleFilter.value,
    isApproved: isApprovedValue,
    sort: userStore.currentSort,
  })

  currentPage.value = page
}

// Handle sort from DataTable
function handleSort(sortString) {
  userStore.currentSort = sortString
  fetchUsers(0)
}

// Handle pagination
function goToPage(page) {
  if (page >= 0 && page < userStore.totalPages) {
    fetchUsers(page)
  }
}
function handleApprove(user) {
  console.log('Approve user:', user)
  userStore.updateUserStatus(user.id, true)
}

function handleDeny(user) {
  console.log('Deny user:', user)
  userStore.updateUserStatus(user.id, false)
}

// Handle search
function handleSearch() {
  fetchUsers(0)
}

// Handle page size change
function handlePageSizeChange(newSize) {
  pageSize.value = newSize
  fetchUsers(0)
}
</script>

<template>
  <section class="bg-[#f6efec]">
    <div class="mx-auto flex min-h-[calc(100vh-60px)]">
      <EmployeeSidebarNav />

      <div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
        <PortalHeader :title="'Pending User Requests'" :buttons="[]" />

        <!-- Error Message -->
        <section
          v-if="userStore.error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
        >
          {{ userStore.error }}
        </section>
        <!-- Success Message -->
        <section
          v-if="userStore.successMessage"
          class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
        >
          {{ userStore.successMessage }}
        </section>

        <!-- Filter & Search Section -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="md:col-span-1">
              <label class="block text-xs font-semibold text-gray-700 uppercase mb-2">
                Search
              </label>
              <div class="relative">
                <i class="pi pi-search absolute left-3 top-3 text-gray-400 text-sm"></i>
                <input
                  v-model="searchQuery"
                  @keyup.enter="handleSearch"
                  type="text"
                  placeholder="Search by name or IBAN..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <!-- Approval Status -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase mb-2">
                Approval Status
              </label>
              <select
                v-model="approvalStatusFilter"
                @change="handleSearch"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option>Pending</option>
                <option>Approved</option>
                <option>All</option>
              </select>
            </div>

            <!-- User Role -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase mb-2">
                User Role
              </label>
              <select
                v-model="roleFilter"
                @change="handleSearch"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option>All</option>
                <option value="ROLE_CUSTOMER">Customer</option>
                <option value="ROLE_EMPLOYEE">Employee</option>
              </select>
            </div>

            <!-- Items Per Page -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase mb-2">
                Has Accounts
              </label>
              <select
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option>All</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Table Section using DataTable Component -->
        <DataTable
          :columns="columns"
          :data="userStore.users"
          :loading="userStore.loading"
          :current-sort="userStore.currentSort"
          @sort="handleSort"
        >
          <UserTableRow
            v-for="user in userStore.users"
            :key="user.id"
            :user="user"
            @approve="handleApprove"
            @deny="handleDeny"
          />
        </DataTable>

        <!-- Pagination Section using PaginationControls Component -->
        <PaginationControls
          :current-page="currentPage"
          :total-pages="userStore.totalPages"
          :total-elements="userStore.totalElements"
          :page-size="pageSize"
          item-label="users"
          @page-changed="goToPage"
          @size-changed="handlePageSizeChange"
        />
      </div>
    </div>
  </section>
</template>
