<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import FormGroup from '@/components/molecules/FormGroup.vue'
import { useBankAccountStore } from '@/stores/bankAccount'
import { useTransactionStore } from '@/stores/transaction'

const bankAccountStore = useBankAccountStore()
const transactionStore = useTransactionStore()

onMounted(async () => {
  await bankAccountStore.fetchMyBankAccounts()
})

const router = useRouter()
const authStore = useAuthStore()

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: value => ['WITHDRAWAL', 'DEPOSIT', 'TRANSFER'].includes(value),
  },
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
const showErrorModal = ref(false)
const successDetails = ref(null)
const errorMessage = ref('')

// Form validation
const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/

const ibanError = computed(() => {
  // For DEPOSIT, only validate toIban (deposit destination)
  if (props.type === 'DEPOSIT') {
    if (!toIban.value) return ''
    if (!ibanRegex.test(toIban.value)) {
      return 'Please enter a valid IBAN format (e.g., NL91 ABNA 0417 1643 00)'
    }
    return ''
  }

  // For TRANSFER, validate toIban and check it's not same as fromIban
  if (props.type === 'TRANSFER') {
    if (!toIban.value) return ''
    if (!ibanRegex.test(toIban.value)) {
      return 'Please enter a valid IBAN format (e.g., NL91 ABNA 0417 1643 00)'
    }
    if (toIban.value === fromIban.value) {
      return 'Cannot transfer to the same account'
    }
    return ''
  }

  // For WITHDRAWAL, no toIban validation needed
  return ''
})

const amountError = computed(() => {
  if (!amount.value) return ''
  const amountNum = parseFloat(amount.value)
  if (isNaN(amountNum) || amountNum <= 0) {
    return 'Amount must be greater than 0'
  }

  // For DEPOSIT, no balance check needed
  if (props.type === 'DEPOSIT') {
    if (amountNum > 10000) {
      return 'Maximum deposit amount is EUR 10,000'
    }
    return ''
  }

  // For TRANSFER and WITHDRAWAL, check sender's balance
  const selectedAccount = props.accounts.find(acc => acc.iban === fromIban.value)
  if (selectedAccount) {
    const balance = parseFloat(selectedAccount.balance.replace(/[^\d.]/g, ''))
    if (amountNum > balance) {
      return `Insufficient funds. Available: EUR ${balance.toFixed(2)}`
    }
  }

  if (amountNum > 10000) {
    return `Maximum ${props.type === 'WITHDRAWAL' ? 'withdrawal' : 'transfer'} amount is EUR 10,000`
  }

  return ''
})

const isFormValid = computed(() => {
  if (!amount.value || amountError.value) return false

  if (props.type === 'DEPOSIT') {
    // DEPOSIT: needs toIban and amount
    return toIban.value && !ibanError.value
  }

  if (props.type === 'TRANSFER') {
    // TRANSFER: needs fromIban, toIban, and amount
    return fromIban.value && toIban.value && !ibanError.value
  }

  if (props.type === 'WITHDRAWAL') {
    // WITHDRAWAL: needs fromIban and amount
    return fromIban.value
  }

  return false
})

const getSelectedAccountName = () => {
  const account = props.accounts.find(acc => acc.iban === fromIban.value)
  return account ? account.title : 'Unknown Account'
}

const getOperationLabel = () => {
  const labels = {
    DEPOSIT: 'Deposit',
    TRANSFER: 'Transfer',
    WITHDRAWAL: 'Withdrawal',
  }
  return labels[props.type] || 'Transaction'
}

const getOperationButtonLabel = () => {
  return `Review ${getOperationLabel()}`
}

const getFromAccountLabel = () => {
  if (props.type === 'DEPOSIT') return null
  return 'FROM ACCOUNT'
}

const getToAccountLabel = () => {
  if (props.type === 'DEPOSIT') return 'DEPOSIT INTO ACCOUNT'
  if (props.type === 'WITHDRAWAL') return null
  return 'RECIPIENT IBAN'
}

const openConfirmationModal = e => {
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
      amount: parseFloat(amount.value),
      type: props.type,
    }

    // Assemble payload based on operation type
    if (props.type === 'DEPOSIT') {
      payload.fromIban = null
      payload.toIban = toIban.value.replace(/\s/g, '')
    } else if (props.type === 'TRANSFER') {
      payload.fromIban = fromIban.value.replace(/\s/g, '')
      payload.toIban = toIban.value.replace(/\s/g, '')
    } else if (props.type === 'WITHDRAWAL') {
      payload.fromIban = fromIban.value.replace(/\s/g, '')
      payload.toIban = null
    }

    console.log(`Submitting ${props.type.toLowerCase()}:`, payload)

    // Call the transfer API
    await transactionStore.executeTransaction(payload)

    // Assemble success details based on operation type
    const details = {
      amount: parseFloat(amount.value),
      timestamp: new Date().toLocaleString(),
    }

    if (props.type === 'DEPOSIT') {
      details.toIban = toIban.value
    } else if (props.type === 'TRANSFER') {
      details.fromAccount = getSelectedAccountName()
      details.fromIban = fromIban.value
      details.toIban = toIban.value
    } else if (props.type === 'WITHDRAWAL') {
      details.fromAccount = getSelectedAccountName()
      details.fromIban = fromIban.value
    }

    successDetails.value = details
    showSuccessModal.value = true

    // Reset form
    fromIban.value = ''
    toIban.value = ''
    amount.value = ''

    emit('success')
  } catch (error) {
    console.error(`Error processing ${props.type.toLowerCase()}:`, error)
    errorMessage.value =
      error.message || `An error occurred while processing the ${props.type.toLowerCase()}.`
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push('/customer')
}
</script>

<template>
  <form @submit="openConfirmationModal" class="space-y-6">
    <!-- From Account Selection (TRANSFER & WITHDRAWAL only) -->
    <div v-if="props.type !== 'DEPOSIT'">
      <label class="mb-2 block text-sm font-semibold text-slate-900">{{
        getFromAccountLabel()
      }}</label>
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

    <!-- To Account / Recipient IBAN (TRANSFER & DEPOSIT only) -->
    <FormGroup
      v-if="props.type !== 'WITHDRAWAL'"
      v-model="toIban"
      :label="getToAccountLabel()"
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
      :helper-text="`Maximum ${props.type.toLowerCase()}: EUR 10,000 per transaction`"
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
          <p class="font-semibold text-slate-900">Secure {{ getOperationLabel() }}</p>
          <p class="mt-1 text-sm text-slate-700">
            All {{ props.type.toLowerCase() }}s are encrypted and monitored for security. You will
            receive a confirmation email once the transaction is processed.
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
      {{ isLoading ? 'Processing...' : getOperationButtonLabel() }}
      <i v-if="!isLoading" class="pi pi-arrow-right ml-2"></i>
    </button>

    <p class="text-center text-xs text-slate-500">
      By submitting, you agree to the EuroBank {{ getOperationLabel() }} Terms & Conditions.
    </p>
  </form>

  <!-- Confirmation Modal -->
  <div
    v-if="showConfirmationModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-6">
      <h2 class="mb-4 text-2xl font-bold text-slate-900">Confirm {{ getOperationLabel() }}</h2>

      <div class="space-y-4 rounded-lg bg-[#f3f4f6] p-4">
        <!-- From Account (TRANSFER & WITHDRAWAL) -->
        <div v-if="props.type !== 'DEPOSIT'" class="flex justify-between">
          <span class="text-slate-600">From Account:</span>
          <span class="font-semibold text-slate-900">{{ getSelectedAccountName() }}</span>
        </div>
        <div v-if="props.type !== 'DEPOSIT'" class="flex justify-between">
          <span class="text-slate-600">From IBAN:</span>
          <span class="font-mono text-sm text-slate-900">{{ fromIban }}</span>
        </div>

        <!-- To IBAN (TRANSFER & DEPOSIT) -->
        <div
          v-if="props.type !== 'WITHDRAWAL'"
          class="flex justify-between border-t border-slate-300 pt-4"
        >
          <span class="text-slate-600">{{
            props.type === 'DEPOSIT' ? 'Deposit Into IBAN:' : 'Recipient IBAN:'
          }}</span>
          <span class="font-mono text-sm text-slate-900">{{ toIban }}</span>
        </div>

        <!-- Amount -->
        <div class="flex justify-between border-t border-slate-300 pt-4">
          <span class="text-lg font-semibold text-slate-900">Amount:</span>
          <span class="text-2xl font-bold text-[#cc570f]"
            >EUR {{ parseFloat(amount).toFixed(2) }}</span
          >
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
  <div
    v-if="showSuccessModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div class="w-full max-w-md rounded-lg bg-white px-6 py-8">
      <div class="mb-4 flex justify-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <i class="pi pi-check text-2xl text-emerald-700"></i>
        </div>
      </div>

      <h2 class="mb-2 text-center text-2xl font-bold text-slate-900">
        {{ getOperationLabel() }} Successful
      </h2>

      <p class="mb-6 text-center text-slate-600">
        Your {{ props.type.toLowerCase() }} has been processed successfully.
      </p>

      <div v-if="successDetails" class="space-y-3 rounded-lg bg-[#f3f4f6] p-4">
        <!-- From Account (TRANSFER & WITHDRAWAL) -->
        <div v-if="props.type !== 'DEPOSIT'" class="flex justify-between">
          <span class="text-sm text-slate-600">From:</span>
          <span class="text-sm font-semibold text-slate-900">{{ successDetails.fromAccount }}</span>
        </div>

        <!-- To IBAN (TRANSFER & DEPOSIT) -->
        <div v-if="props.type !== 'WITHDRAWAL'" class="flex justify-between">
          <span class="text-sm text-slate-600">{{
            props.type === 'DEPOSIT' ? 'Deposit Into:' : 'Recipient IBAN:'
          }}</span>
          <span class="text-sm font-mono text-slate-900">{{ successDetails.toIban }}</span>
        </div>

        <!-- Amount -->
        <div class="flex justify-between border-t border-slate-300 pt-3">
          <span class="text-sm font-semibold text-slate-900">Amount:</span>
          <span class="text-lg font-bold text-[#cc570f]"
            >EUR {{ successDetails.amount.toFixed(2) }}</span
          >
        </div>

        <!-- Timestamp -->
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

  <!-- Error Modal -->
  <div
    v-if="showErrorModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-6">
      <div class="mb-4 flex items-center justify-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <i class="pi pi-times text-xl text-red-600"></i>
        </div>
      </div>

      <h2 class="mb-2 text-center text-2xl font-bold text-slate-900">
        {{ getOperationLabel() }} Failed
      </h2>
      <p class="mb-6 text-center text-slate-600">{{ errorMessage }}</p>

      <button
        @click="closeErrorModal"
        class="w-full rounded-lg bg-slate-900 py-2.5 font-medium text-white transition-colors hover:bg-slate-800"
      >
        Try Again
      </button>
    </div>
  </div>
</template>
