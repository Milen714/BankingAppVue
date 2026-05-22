<script setup>
import EmployeeSidebarNav from '@/components/organisms/SidebarNav.vue'
import CustomerBottomNav from '@/components/organisms/CustomerBottomNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import { useBankAccountStore } from '@/stores/bankAccount'
// import { use } from '@/stores/bankAccount'
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import RecentEventsCard from '@/components/molecules/RecentEventsCard.vue'

const bankAccountStore = useBankAccountStore()
const userStore = useUserStore()

onMounted(() => {
  userStore.fetchUsers({ role: 'ROLE_EMPLOYEE' })
})
</script>

<template>
  <!-- <i  class="pi pi-spin pi-spinner  mr-2"></i> -->
  <section class="bg-[#f6efec]">
    <div class="mx-auto flex min-h-[calc(100vh-60px)]">
      <EmployeeSidebarNav />

      <div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
        <PortalHeader
          :title="'Overview'"
          :buttons="[
            {
              label: 'Transfer',
              icon: 'pi pi-arrow-up',
              type: 'primary',
              linkTo: '/customer/transfer',
            },
            {
              label: 'Deposit',
              icon: 'pi pi-arrow-down',
              type: 'primary',
              linkTo: '/customer/deposit',
            },
            {
              label: 'Withdraw Funds',
              icon: 'pi pi-money-bill',
              type: 'primary',
              linkTo: '/customer/withdraw',
            },
            {
              label: 'Request New Account',
              icon: 'pi pi-plus-circle',
              type: 'secondary',
              linkTo: '/customer/request-account',
            },
          ]"
        />

        <!-- Error Message -->
        <section
          v-if="bankAccountStore.error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        >
          {{ bankAccountStore.error }}
        </section>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RecentEventsCard type="accountRequests" />
          <RecentEventsCard type="registrationRequests" />
        </div>
      </div>
    </div>

    <CustomerBottomNav />
  </section>
</template>
