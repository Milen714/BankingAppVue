<script setup>
import CustomerSidebarNav from '@/components/organisms/CustomerSidebarNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import TransferForm from '@/components/organisms/TransferForm.vue'

const currentAccounts = [
  {
    title: 'Main Checking',
    iban: 'NL93 INGB 0123 4567 89',
    balance: 'EUR 4,250.00',
    status: 'APPROVED',
    icon: 'pi pi-credit-card',
    pending: false,
    accent: 'bg-orange-100',
  },
  {
    title: 'Holiday Fund',
    iban: 'NL21 INGB 9876 5432 10',
    balance: 'EUR 12,400.00',
    status: 'APPROVED',
    icon: 'pi pi-send',
    pending: false,
    accent: 'bg-slate-100',
  },
]

const handleTransferSuccess = () => {
  console.log('Transfer completed successfully')
}
</script>

<template>
  <section class="bg-[#f6efec]">
    <div class="mx-auto flex min-h-[calc(100vh-60px)] ">
      <CustomerSidebarNav />

      <div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
        <PortalHeader
          :title="'New Transfer'"
          :buttons="[
            { label: 'Request New Account', icon: 'pi pi-plus-circle', type: 'secondary', linkTo: '/customer/request-account' },
            { label: 'Withdraw Funds', icon: 'pi pi-money-bill', type: 'primary', linkTo: '/customer/withdraw' },
          ]"
        />

        <!-- Transfer Form -->
        <div class="mt-6 max-w-2xl rounded-lg bg-white p-6">
          <TransferForm :accounts="currentAccounts" @success="handleTransferSuccess" />
        </div>
      </div>
    </div>

    <!-- <CustomerBottomNav /> -->
  </section>
</template>
