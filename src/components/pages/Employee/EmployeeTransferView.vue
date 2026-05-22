<script setup>
import EmployeeSidebarNav from '@/components/organisms/SidebarNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import BankingForm from '@/components/organisms/BankingForm.vue'
import BankAccountInfoCard from '@/components/molecules/BankAccountInfoCard.vue'
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBankAccountStore } from '@/stores/bankAccount'

const route = useRoute()
const router = useRouter()
const bankAccountStore = useBankAccountStore()
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    const iban = route.params.iban
    if (iban) {
      // Fetch the specific account to transfer FROM
      await bankAccountStore.fetchBankAccountByIban(iban)
      // Set it as selected for display
    }
  } finally {
    isLoading.value = false
  }
})

const bankAccount = computed(() => bankAccountStore.selectedAccount)

// All accounts available in the system for transfer TO selection
const allAccounts = computed(() =>
  bankAccountStore.myAccounts.map(account => ({
    title: account.title ?? 'Account',
    iban: account.iban,
    balance: `EUR ${account.balance.toFixed(2)}`,
  }))
)

const handleTransferSuccess = () => {
  console.log('Transfer completed successfully')
  router.push(`/employee/account-management`)
}
</script>

<template>
  <section class="bg-[#f6efec]">
    <div class="mx-auto flex min-h-[calc(100vh-60px)]">
      <EmployeeSidebarNav />

      <div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
        <PortalHeader
          :title="bankAccount ? `Transfer from ${bankAccount.title}` : 'Account Transfer'"
          :buttons="[
            {
              label: 'Back to Account',
              icon: 'pi pi-arrow-left',
              type: 'secondary',
              linkTo: `/employee/account-management/${bankAccount?.iban}`,
            },
          ]"
        />

        <!-- Bank Account Info Card -->
        <BankAccountInfoCard
          v-if="bankAccount && !isLoading"
          :bankAccount="bankAccount"
          class="mb-8"
        />

        <!-- Transfer Form -->
        <div v-if="!isLoading" class="mt-6 max-w-2xl rounded-lg bg-white p-6">
          <BankingForm
            :type="'TRANSFER'"
            :accounts="allAccounts"
            @success="handleTransferSuccess"
          />
        </div>

        <!-- Loading State -->
        <div v-else class="flex justify-center py-12">
          <i class="pi pi-spin pi-spinner text-3xl text-gray-400"></i>
        </div>
      </div>
    </div>
  </section>
</template>
