<script setup>
import CustomerAccountCompactCard from '@/components/molecules/CustomerAccountCompactCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  accounts: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <section class="mb-6">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <i class="pi pi-inbox text-lg text-[#cc570f]"></i>
        <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
      </div>
      <button class="text-slate-400 hover:text-slate-600">
        <i class="pi pi-plus text-lg"></i>
      </button>
    </div>

    <div class="space-y-3">
      <div
        v-for="(account, index) in accounts"
        :key="account.title"
        class="rounded-xl border border-[#e7c9bd] bg-white transition-all hover:shadow-md"
      >
        <!-- Compact Account Header -->
        <CustomerAccountCompactCard
          :title="account.title"
          :iban="account.iban"
          :balance="account.balance"
          :status="account.status"
          :icon="account.icon"
          :pending="account.pending"
          :is-expanded="false"
        />
      </div>
    </div>
  </section>
</template>
