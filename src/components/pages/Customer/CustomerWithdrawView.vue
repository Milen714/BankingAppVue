<script setup>
import CustomerSidebarNav from '@/components/organisms/SidebarNav.vue'
import CustomerBottomNav from '@/components/organisms/CustomerBottomNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import BankingForm from '@/components/organisms/BankingForm.vue'
import { onMounted, computed } from 'vue'
import { useBankAccountStore } from '@/stores/bankAccount'

const bankAccountStore = useBankAccountStore()

onMounted(async () => {
  await bankAccountStore.fetchMyBankAccounts()
})
const myAccounts = computed(() =>
  bankAccountStore.myAccounts.map(account => ({
    title: account.title ?? 'My Account',
    iban: account.iban,
    balance: `EUR ${account.balance.toFixed(2)}`,
  }))
)

const handleTransferSuccess = () => {
  console.log('Transfer completed successfully')
}
</script>

<template>
  <section class="bg-[#f6efec]">
    <div class="mx-auto flex min-h-[calc(100vh-60px)]">
      <CustomerSidebarNav />

      <div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
        <PortalHeader
          :title="'Withdraw ATM'"
          :buttons="[
            {
              label: 'Request New Account',
              icon: 'pi pi-plus-circle',
              type: 'secondary',
              linkTo: '/customer/request-account',
            },
            {
              label: 'Transfer Funds',
              icon: 'pi pi-money-bill',
              type: 'primary',
              linkTo: '/customer/transfer',
            },
          ]"
        />

        <!-- Withdraw Form -->
        <div class="mt-6 max-w-2xl rounded-lg bg-white p-6">
          <BankingForm
            :type="'WITHDRAWAL'"
            :accounts="myAccounts"
            @success="handleTransferSuccess"
          />
        </div>
      </div>
    </div>

    <CustomerBottomNav />
  </section>
</template>
