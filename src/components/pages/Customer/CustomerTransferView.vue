<script setup>
import CustomerSidebarNav from '@/components/organisms/SidebarNav.vue'
import CustomerBottomNav from '@/components/organisms/CustomerBottomNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import BankingForm from '@/components/organisms/BankingForm.vue'
import BankAccountInfoCard from '@/components/molecules/BankAccountInfoCard.vue'
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBankAccountStore } from '@/stores/bankAccount'

const route = useRoute()
const bankAccountStore = useBankAccountStore()

onMounted(async () => {
  await bankAccountStore.fetchMyBankAccounts()
  const fromIbanParam = route.query.fromIban?.toString() || ''

  if (fromIbanParam) {
    await bankAccountStore.fetchBankAccountByIban(fromIbanParam)
  } else {
    bankAccountStore.clearSelectedAccount()
  }
})
const currentAccounts = computed(() =>
  bankAccountStore.myCurrentAccounts.map(account => ({
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
          :title="'New Transfer'"
          :buttons="[
            {
              label: 'Request New Account',
              icon: 'pi pi-plus-circle',
              type: 'secondary',
              linkTo: '/customer/request-account',
            },
            {
              label: 'Withdraw ATM',
              icon: 'pi pi-money-bill',
              type: 'primary',
              linkTo: '/customer/withdraw',
            },
          ]"
        />
        <!--Bank Account Info Card-->
        <BankAccountInfoCard
          v-if="bankAccountStore.selectedAccount"
          :bankAccount="bankAccountStore.selectedAccount"
        />

        <!-- Transfer Form -->
        <div class="mt-6 max-w-2xl rounded-lg bg-white p-6">
          <BankingForm
            :type="'TRANSFER'"
            :accounts="currentAccounts"
            @success="handleTransferSuccess"
          />
        </div>
      </div>
    </div>

    <CustomerBottomNav />
  </section>
</template>
