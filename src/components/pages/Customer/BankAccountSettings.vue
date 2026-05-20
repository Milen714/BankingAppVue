<script setup>
import CustomerSidebarNav from '@/components/organisms/CustomerSidebarNav.vue'
import CustomerBottomNav from '@/components/organisms/CustomerBottomNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import BankAccountInfoCard from '@/components/molecules/BankAccountInfoCard.vue'
import BankAccountSettingsForm from '@/components/molecules/BankAccountSettingsForm.vue'
import { useBankAccountStore } from '@/stores/bankAccount'
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const iban = route.params.iban
const bankAccountStore = useBankAccountStore()
const bankAccount = ref(null)

onMounted(async () => {
  console.log('Settings mounted, fetching account details...')
  await bankAccountStore.fetchMyBankAccounts()
  await bankAccountStore.fetchBankAccountByIban(iban)
  bankAccount.value = bankAccountStore.selectedAccount
})

const handleSaveSettings = settings => {
  console.log('Saving settings:', settings)
  // Add API call here to save settings
  bankAccountStore.updateAccountSettings(bankAccount.value.id, settings)
  setTimeout(() => {
    router.back()
  }, 5000)
}

const handleCancelSettings = () => {
  router.back()
}
</script>

<template>
  <section class="bg-[#f6efec]">
    <div class="mx-auto flex min-h-[calc(100vh-60px)]">
      <CustomerSidebarNav />

      <div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
        <PortalHeader
          :title="bankAccount ? bankAccount.title : 'Account Details'"
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
              linkTo: `/customer/deposit?iban=${bankAccount?.iban}`,
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
            {
              label: 'Settings',
              icon: 'pi pi-cog',
              type: 'secondary',
              linkTo: `/customer/accounts/settings/${bankAccount?.iban}`,
            },
          ]"
        >
        </PortalHeader>
        <!-- Settings Content -->
        <BankAccountInfoCard :bankAccount="bankAccount" />

        <div
          v-if="bankAccountStore.success"
          class="mt-6 rounded-lg bg-green-100 border border-green-400 text-green-700 px-4 py-3 transition-all duration-300"
        >
          <i
            class="pi pi-check text-green-900 p-3 rounded-[200px] border border-green-700 mr-2"
          ></i>
          Account settings updated successfully!
        </div>

        <BankAccountSettingsForm
          v-if="bankAccount"
          :bankAccount="bankAccount"
          class="mt-6"
          @save="handleSaveSettings"
          @cancel="handleCancelSettings"
        />
      </div>

      <CustomerBottomNav />
    </div>
  </section>
</template>
