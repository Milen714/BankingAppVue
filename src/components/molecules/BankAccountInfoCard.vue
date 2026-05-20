<script setup>
defineProps({
  bankAccount: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="flex items-start justify-between">
      <div class="flex-1 flex flex-col md:flex-row justify-between">
        <div>
          <p class="mb-1 text-xs font-semibold uppercase text-gray-500">Active Account</p>
          <h3 class="mb-6 text-2xl font-bold text-gray-900">{{ bankAccount?.title }}</h3>

          <div class="rounded-lg bg-[#f3e4dc] px-4 py-3">
            <span class="font-mono font-medium text-lg text-gray-900">{{ bankAccount?.iban }}</span>
          </div>
        </div>

        <div class="flex items-center">
          <div>
            <p class="text-xs font-semibold uppercase text-gray-500">Available Balance</p>
            <p class="text-3xl font-bold text-gray-900">
              EUR {{ bankAccount?.balance.toFixed(2) }}
            </p>
          </div>
          <div
            class="ml-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#b54d08] text-center text-2xl font-bold text-white"
          >
            <i class="pi pi-wallet"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
