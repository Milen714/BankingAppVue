<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import FormGroup from '@/components/molecules/FormGroup.vue'

const router = useRouter()
const authStore = useAuthStore()

const props = defineProps({
  accounts: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['success'])

const fromIban = ref('')
const toIban = ref('')
const amount = ref('')
const isLoading = ref(false)
const showConfirmationModal = ref(false)
const showSuccessModal = ref(false)
const successDetails = ref(null)

// Form validation
const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/

const ibanError = computed(() => {
  if (!toIban.value) return ''
  if (!ibanRegex.test(toIban.value)) {
    return 'Please enter a valid IBAN format (e.g., NL91 ABNA 0417 1643 00)'
  }
  if (toIban.value === fromIban.value) {
    return 'Cannot transfer to the same account'
  }
  return ''
})

const amountError = computed(() => {
  if (!amount.value) return ''
  const amountNum = parseFloat(amount.value)
  if (isNaN(amountNum) || amountNum <= 0) {
    return 'Amount must be greater than 0'
  }
  
  const selectedAccount = props.accounts.find(acc => acc.iban === fromIban.value)
  if (selectedAccount) {
    const balance = parseFloat(selectedAccount.balance.replace(/[^\d.]/g, ''))
    if (amountNum > balance) {
      return `Insufficient funds. Available: EUR ${balance.toFixed(2)}`
    }
  }
  
  if (amountNum > 10000) {
    return 'Maximum transfer amount is EUR 10,000'
  }
  
  return ''
})

const isFormValid = computed(() => {
  return fromIban.value && toIban.value && amount.value && !ibanError.value && !amountError.value
})

const getSelectedAccountName = () => {
  const account = props.accounts.find(acc => acc.iban === fromIban.value)
  return account ? account.title : 'Unknown Account'
}

const openConfirmationModal = (e) => {
  e.preventDefault()
  if (!isFormValid.value) return
  showConfirmationModal.value = true
}

const closeConfirmationModal = () => {
  showConfirmationModal.value = false
}

const handleTransfer = async () => {
  closeConfirmationModal()
  isLoading.value = true

  try {
    const payload = {
      fromIban: fromIban.value.replace(/\s/g, ''),
      toIban: toIban.value.replace(/\s/g, ''),
      amount: parseFloat(amount.value),
      type: 'TRANSFER',
    }

    console.log('Submitting transfer:', payload)

    // TODO: Replace with actual API call
    // const response = await axios.post('/transfers', payload)

    // Simulate API response
    await new Promise((resolve) => setTimeout(resolve, 1500))

    successDetails.value = {
      fromAccount: getSelectedAccountName(),
      fromIban: fromIban.value,
      toIban: toIban.value,
      amount: parseFloat(amount.value),
      timestamp: new Date().toLocaleString(),
    }

    showSuccessModal.value = true

    // Reset form
    fromIban.value = ''
    toIban.value = ''
    amount.value = ''

    emit('success')
  } catch (error) {
    console.error('Error processing transfer:', error)
  } finally {
    isLoading.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push('/customer')
}
</script>

<template>
  <form @submit="openConfirmationModal" class="space-y-6">
    <!-- From Account Selection -->
    <div>
      <label class="mb-2 block text-sm font-semibold text-slate-900">FROM ACCOUNT</label>
      <select
        v-model="fromIban"
        class="w-full rounded-lg border border-[#e7c9bd] bg-white px-4 py-2.5 text-slate-900 transition-colors focus:border-[#cc570f] focus:outline-none focus:ring-2 focus:ring-[#cc570f]/20"
      >
        <option value="">Select an account</option>
        <option v-for="account in accounts" :key="account.iban" :value="account.iban">
          {{ account.title }} - {{ account.iban }} ({{ account.balance }})
        </option>
      </select>
    </div>

    <!-- Recipient IBAN -->
    <FormGroup
      v-model="toIban"
      label="RECIPIENT IBAN"
      type="text"
      placeholder="e.g., NL05 ILAO 4805 3158 73"
      :error="ibanError"
      helper-text="Enter the recipient's IBAN in a valid format"
    />

    <!-- Amount -->
    <FormGroup
      v-model="amount"
      label="AMOUNT (EUR)"
      type="number"
      placeholder="e.g., 50.00"
      :error="amountError"
      helper-text="Maximum transfer: EUR 10,000 per transaction"
      step="0.01"
      min="0"
    />

    <!-- Security Info -->
    <div class="rounded-lg bg-[#fff4ed] p-4">
      <div class="flex gap-3">
        <span class="flex-shrink-0 text-[#cc570f]">
          <i class="pi pi-shield mt-0.5"></i>
        </span>
        <div>
          <p class="font-semibold text-slate-900">Secure Transfer</p>
          <p class="mt-1 text-sm text-slate-700">
            All transfers are encrypted and monitored for security. You will receive a confirmation email once the
            transfer is processed.
          </p>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="!isFormValid || isLoading"
      class="w-full rounded-lg bg-[#cc570f] py-3 font-medium text-white transition-colors hover:bg-[#b14c0d] disabled:bg-slate-300 disabled:text-slate-500"
    >
      <i v-if="isLoading" class="pi pi-spin pi-spinner mr-2"></i>
      {{ isLoading ? 'Processing...' : 'Review Transfer' }}
      <i v-if="!isLoading" class="pi pi-arrow-right ml-2"></i>
    </button>

    <p class="text-center text-xs text-slate-500">
      By submitting, you agree to the EuroBank Transfer Terms & Conditions.
    </p>
  </form>

  <!-- Confirmation Modal -->
  <div v-if="showConfirmationModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-md rounded-lg bg-white p-6">
      <h2 class="mb-4 text-2xl font-bold text-slate-900">Confirm Transfer</h2>

      <div class="space-y-4 rounded-lg bg-[#f3f4f6] p-4">
        <div class="flex justify-between">
          <span class="text-slate-600">From Account:</span>
          <span class="font-semibold text-slate-900">{{ getSelectedAccountName() }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-600">From IBAN:</span>
          <span class="font-mono text-sm text-slate-900">{{ fromIban }}</span>
        </div>
        <div class="flex justify-between border-t border-slate-300 pt-4">
          <span class="text-slate-600">Recipient IBAN:</span>
          <span class="font-mono text-sm text-slate-900">{{ toIban }}</span>
        </div>
        <div class="flex justify-between border-t border-slate-300 pt-4">
          <span class="text-lg font-semibold text-slate-900">Amount:</span>
          <span class="text-2xl font-bold text-[#cc570f]">EUR {{ parseFloat(amount).toFixed(2) }}</span>
        </div>
      </div>

      <div class="mt-6 flex gap-3">
        <button
          @click="closeConfirmationModal"
          class="flex-1 rounded-lg border border-[#e7c9bd] bg-white py-2.5 font-medium text-slate-900 transition-colors hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          @click="handleTransfer"
          :disabled="isLoading"
          class="flex-1 rounded-lg bg-[#cc570f] py-2.5 font-medium text-white transition-colors hover:bg-[#b14c0d] disabled:bg-slate-300"
        >
          <i v-if="isLoading" class="pi pi-spin pi-spinner mr-2"></i>
          {{ isLoading ? 'Processing...' : 'Confirm' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Success Modal -->
  <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-md rounded-lg bg-white px-6 py-8">
      <div class="mb-4 flex justify-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <i class="pi pi-check text-2xl text-emerald-700"></i>
        </div>
      </div>

      <h2 class="mb-2 text-center text-2xl font-bold text-slate-900">Transfer Successful</h2>

      <p class="mb-6 text-center text-slate-600">Your transfer has been processed successfully.</p>

      <div v-if="successDetails" class="space-y-3 rounded-lg bg-[#f3f4f6] p-4">
        <div class="flex justify-between">
          <span class="text-sm text-slate-600">From:</span>
          <span class="text-sm font-semibold text-slate-900">{{ successDetails.fromAccount }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-slate-600">Recipient IBAN:</span>
          <span class="text-sm font-mono text-slate-900">{{ successDetails.toIban }}</span>
        </div>
        <div class="flex justify-between border-t border-slate-300 pt-3">
          <span class="text-sm font-semibold text-slate-900">Amount:</span>
          <span class="text-lg font-bold text-[#cc570f]">EUR {{ successDetails.amount.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-xs text-slate-600">Date & Time:</span>
          <span class="text-xs text-slate-900">{{ successDetails.timestamp }}</span>
        </div>
      </div>

      <p class="mt-6 text-center text-xs text-slate-600">
        A confirmation email has been sent to your registered email address.
      </p>

      <button
        @click="closeSuccessModal"
        class="mt-6 w-full rounded-lg bg-[#cc570f] py-2.5 font-medium text-white transition-colors hover:bg-[#b14c0d]"
      >
        Back to Dashboard
      </button>
    </div>
  </div>
</template>
