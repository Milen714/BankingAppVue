<script setup>
import CustomerSidebarNav from '@/components/organisms/CustomerSidebarNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import RequestAccountForm from '@/components/organisms/RequestAccountForm.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleFormSuccess = () => {
  // Optionally redirect or do something after success
  console.log('Account request submitted successfully')
}
</script>

<template>
  <section class="bg-[#f6efec]">
    <div class="mx-auto flex min-h-[calc(100vh-60px)]">
      <CustomerSidebarNav />

      <div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
        <PortalHeader
          :title="'Request New Account'"
          :buttons="[
            {
              label: 'New Transfer',
              icon: 'pi pi-send',
              type: 'primary',
              linkTo: '/customer/transfer',
            },
            {
              label: 'Withdraw Funds',
              icon: 'pi pi-money-bill',
              type: 'primary',
              linkTo: '/customer/withdraw',
            },
          ]"
        />

        <!-- Request Account Form -->
        <div class="mt-6 max-w-2xl rounded-lg bg-white p-6">
          <RequestAccountForm @success="handleFormSuccess" />
        </div>
      </div>
    </div>

    <!-- <CustomerBottomNav /> -->
  </section>
</template>
