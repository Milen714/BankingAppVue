<script setup>
import { ref } from 'vue'
import { useBankAccountStore } from '@/stores/bankAccount'
import { useAuthStore } from '@/stores/auth'

const bankAccountStore = useBankAccountStore()
const authStore = useAuthStore()

const props = defineProps({
  bankAccount: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['save', 'cancel'])

const accountTitle = ref('')
const dailySpendingLimit = ref(props.bankAccount?.dailyLimit || 2500)
const absoluteLimit = ref(props.bankAccount?.absoluteLimit || null)

const quickSelectLimits = [500, 1000, 2500, 5000]

const handleSave = () => {
  if (!authStore.isEmployee) {
    absoluteLimit.value = null // Customers cannot set absolute limit
  }
  emit('save', {
    title: accountTitle.value ? accountTitle.value : props.bankAccount.title,
    dailyLimit: dailySpendingLimit.value,
    absoluteLimit: absoluteLimit.value,
  })
}

const handleCancel = () => {
  emit('cancel')
}

const selectLimit = limit => {
  dailySpendingLimit.value = limit
}
const selectAbsoluteLimit = limit => {
  absoluteLimit.value = limit
}
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="space-y-6">
      <!-- Account Title -->
      <div>
        <label class="mb-2 block text-sm font-semibold text-gray-900">Account Title</label>
        <input
          v-model="accountTitle"
          type="text"
          :placeholder="bankAccount?.title"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-[#b54d08] focus:outline-none focus:ring-2 focus:ring-[#f08a12] focus:ring-opacity-20"
        />
        <p class="mt-1 text-xs text-gray-500">
          This name will appear on your dashboard and statements.
        </p>
      </div>

      <!-- Daily Spending Limit -->
      <div>
        <div class="mb-4 flex items-baseline justify-between">
          <label class="text-sm font-semibold text-gray-900">Daily Spending Limit</label>
          <span class="text-2xl font-bold text-[#b54d08]"
            >€{{ dailySpendingLimit.toLocaleString() }}</span
          >
        </div>

        <!-- Range Slider -->
        <input
          v-model="dailySpendingLimit"
          type="range"
          min="500"
          max="10000"
          step="100"
          class="mb-4 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#b54d08]"
        />

        <div class="mb-6 flex justify-between text-xs text-gray-500">
          <span>€500</span>
          <span>€10,000</span>
        </div>

        <!-- Quick Select Buttons -->
        <div class="grid grid-cols-4 gap-3">
          <button
            v-for="limit in quickSelectLimits"
            :key="limit"
            @click="selectLimit(limit)"
            :class="{
              'border-[#b54d08] bg-[#f5ede4] text-[#b54d08] font-semibold':
                dailySpendingLimit === limit,
              'border-gray-300 bg-white text-gray-700 hover:border-gray-400':
                dailySpendingLimit !== limit,
            }"
            class="rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
          >
            €{{ limit.toLocaleString() }}
          </button>
        </div>
      </div>
      <!-- Absolute Limit -->
      <div v-if="authStore.isEmployee">
        <div class="mb-4 flex items-baseline justify-between">
          <label class="text-sm font-semibold text-gray-900">Absolute Limit</label>
          <span class="text-2xl font-bold text-[#b54d08]"
            >€{{
              props.bankAccount.absoluteLimit
                ? props.bankAccount.absoluteLimit.toLocaleString()
                : 'N/A'
            }}</span
          >
        </div>
        <input
          type="number"
          v-model="absoluteLimit"
          class="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#b54d08] focus:outline-none focus:ring-2 focus:ring-[#f08a12] focus:ring-opacity-20"
        />
        <div class="mb-6 flex justify-between text-xs text-gray-500">
          <span
            >€{{
              props.bankAccount.absoluteLimit
                ? props.bankAccount.absoluteLimit.toLocaleString()
                : 'N/A'
            }}</span
          >
        </div>
        <p class="text-sm text-gray-500">
          The absolute limit is the maximum negative balance allowed on this account. It cannot be
          changed from this interface. Please contact the system administrator if you wish to modify
          it.
        </p>
      </div>

      <!-- Info Alert -->
      <div class="rounded-lg bg-[#fef3e6] px-4 py-3 flex gap-3">
        <div class="flex-shrink-0 text-[#b54d08]">
          <i class="pi pi-info-circle text-lg"></i>
        </div>
        <p class="text-sm text-[#8b4513]">
          Changing these settings may trigger a secondary authentication request for security
          purposes.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-4">
        <button
          @click="handleSave"
          class="flex-1 rounded-lg bg-[#b54d08] px-4 py-3 font-semibold text-white transition-all hover:bg-[#9d4207] flex items-center justify-center gap-2"
        >
          <i class="pi pi-check"></i>
          {{ bankAccountStore.loading ? 'Saving...' : 'Save Changes' }}
        </button>
        <button
          v-if="!bankAccountStore.success"
          @click="handleCancel"
          class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
