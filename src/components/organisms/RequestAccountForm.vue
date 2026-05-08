<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import FormGroup from '@/components/molecules/FormGroup.vue'
import { useBankAccountStore } from '@/stores/bankAccount'

const router = useRouter()
const authStore = useAuthStore()
const bankAccountStore = useBankAccountStore()

const emit = defineEmits(['success'])

const accountType = ref(null)
const title = ref('')
const absoluteLimit = ref('')
const dailyLimit = ref('')
const isLoading = ref(false)
const showSuccessModal = ref(false)
const successMessage = ref('')

const accountTypes = [
  {
    id: 'CHECKING',
    label: 'Checking',
    description: 'Daily spending, bill payments, and ATM access.',
    icon: 'pi pi-credit-card',
  },
  {
    id: 'SAVINGS',
    label: 'Savings',
    description: 'High interest rates for your long-term goals.',
    icon: 'pi pi-star-fill',
  },
]

const handleSubmit = async () => {
  // Validation
  if (!accountType.value || !title.value.trim() || !absoluteLimit.value || !dailyLimit.value) {
    return
  }

  isLoading.value = true

  try {
    const payload = {
      type: accountType.value,
      title: title.value.trim(),
      balance: 0, // New accounts start with 0 balance
      absoluteLimit: parseFloat(absoluteLimit.value),
      dailyLimit: parseFloat(dailyLimit.value),
      ownerId: authStore.user?.id,
    }

    console.log('Submitting account request:', payload)

    await bankAccountStore.requestNewAccount(payload)

    successMessage.value = `Your ${accountType.value.toLowerCase()} account request has been submitted!`
    showSuccessModal.value = true

    // Reset form
    accountType.value = null
    title.value = ''
    absoluteLimit.value = ''
    dailyLimit.value = ''

    emit('success')
  } catch (error) {
    console.error('Error submitting account request:', error)
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
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Account Type Selection -->
    <div>
      <label class="mb-3 block text-sm font-semibold text-slate-900">CHOOSE ACCOUNT TYPE</label>
      <div class="grid gap-4 sm:grid-cols-2">
        <button
          v-for="type in accountTypes"
          :key="type.id"
          type="button"
          @click="accountType = type.id"
          class="rounded-xl border-2 p-4 text-left transition-all"
          :class="
            accountType === type.id
              ? 'border-[#cc570f] bg-[#fff4ed]'
              : 'border-[#e7c9bd] bg-white hover:border-[#d4a89f]'
          "
        >
          <div class="flex items-start gap-3">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f8e6de] text-[#cc570f]">
              <i :class="type.icon"></i>
            </span>
            <div>
              <h3 class="font-semibold text-slate-900">{{ type.label }}</h3>
              <p class="mt-1 text-sm text-slate-600">{{ type.description }}</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Account Title Input -->
    <FormGroup
      v-model="title"
      label="ACCOUNT TITLE"
      type="text"
      placeholder="e.g., Holiday Fund, Recurring Main"
      helper-text="This name will appear on your statements and mobile app"
    />

    <!-- Absolute Limit Input -->
    <FormGroup
      v-model="absoluteLimit"
      label="ABSOLUTE LIMIT (EUR)"
      type="number"
      placeholder="e.g., 1000.00"
      helper-text="Maximum balance limit for this account"
      step="0.01"
      min="0"
    />

    <!-- Daily Limit Input -->
    <FormGroup
      v-model="dailyLimit"
      label="DAILY LIMIT (EUR)"
      type="number"
      placeholder="e.g., 500.00"
      helper-text="Maximum you can withdraw per day"
      step="0.01"
      min="0"
    />

    <!-- Note on Approval -->
    <div class="rounded-lg bg-[#fff4ed] p-4">
      <div class="flex gap-3">
        <span class="flex-shrink-0 text-[#cc570f]">
          <i class="pi pi-info-circle mt-0.5"></i>
        </span>
        <div>
          <p class="font-semibold text-slate-900">Note on Approval</p>
          <p class="mt-1 text-sm text-slate-700">
            The new account will be automatically linked to your profile upon internal approval. Most accounts are
            activated within 24 hours.
          </p>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="!accountType || !title.trim() || !absoluteLimit || !dailyLimit || isLoading"
      class="w-full rounded-lg bg-[#cc570f] py-3 font-medium text-white transition-colors hover:bg-[#b14c0d] disabled:bg-slate-300 disabled:text-slate-500"
    >
      <i v-if="isLoading" class="pi pi-spin pi-spinner mr-2"></i>
      {{ isLoading ? 'Submitting...' : 'Submit Request' }}
      <i v-if="!isLoading" class="pi pi-arrow-right ml-2"></i>
    </button>

    <p class="text-center text-xs text-slate-500">
      By clicking submit, you agree to the EuroBank Account Terms & Conditions.
    </p>
  </form>

  <!-- Success Modal -->
  <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-md rounded-lg bg-white px-6 py-8">
      <div class="mb-4 flex justify-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <i class="pi pi-check text-2xl text-emerald-700"></i>
        </div>
      </div>

      <h2 class="mb-2 text-center text-2xl font-bold text-slate-900">Request Submitted</h2>

      <p class="mb-6 text-center text-slate-600">{{ successMessage }}</p>

      <p class="mb-6 text-center text-sm text-slate-600">
        You will receive an email notification once your account has been approved and is ready for use.
      </p>

      <button
        @click="closeSuccessModal"
        class="w-full rounded-lg bg-[#cc570f] py-2.5 font-medium text-white transition-colors hover:bg-[#b14c0d]"
      >
        Done
      </button>
    </div>
  </div>
</template>
