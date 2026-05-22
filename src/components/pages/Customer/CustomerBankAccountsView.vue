<script setup>
import CustomerSidebarNav from '@/components/organisms/SidebarNav.vue'
import CustomerBottomNav from '@/components/organisms/CustomerBottomNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import CustomerAccountsList from '@/components/organisms/CustomerAccountsList.vue'
import { useBankAccountStore } from '@/stores/bankAccount'
import { onMounted, computed } from 'vue'

const bankAccountStore = useBankAccountStore()

onMounted(async () => {
  console.log('Portal mounted, fetching accounts...')
  await bankAccountStore.fetchMyBankAccounts()
})

const currentAccounts = computed(() => bankAccountStore.myCurrentAccounts)

const savingsAccounts = computed(() => bankAccountStore.mySavingsAccounts)
</script>

<template>
  <section class="bg-[#f6efec]">
    <div class="mx-auto flex min-h-[calc(100vh-60px)]">
      <CustomerSidebarNav />

      <div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
        <PortalHeader
          :title="'Bank Accounts'"
          :buttons="[
            {
              label: 'Transfer',
              icon: 'pi pi-arrow-up',
              type: 'primary',
              linkTo: '/customer/transfer',
            },
            {
              label: 'Deposit ATM',
              icon: 'pi pi-arrow-down',
              type: 'primary',
              linkTo: '/customer/deposit',
            },
            {
              label: 'Withdraw ATM',
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

        <!-- Accounts Section -->
        <CustomerAccountsList
          :current-accounts="currentAccounts"
          :savings-accounts="savingsAccounts"
          :is-loading="bankAccountStore.loading"
        />
      </div>
    </div>

    <CustomerBottomNav />
  </section>
</template>
