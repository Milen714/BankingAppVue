<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import LoginAuthCard from '@/components/organisms/LoginAuthCard.vue'
import LoginBrandHeader from '@/components/organisms/LoginBrandHeader.vue'
import PendingApprovalModal from '@/components/organisms/PendingApprovalModal.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const hasSubmitted = ref(false)
const focusedField = ref('')
const statusMessage = ref('')
const statusType = ref('success')
const showPendingApprovalModal = ref(false)

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const emailError = computed(() => {
  if (!email.value.trim()) {
    return 'Email is required.'
  }

  if (!emailPattern.test(email.value)) {
    return 'Enter a valid email address.'
  }

  return ''
})

const passwordError = computed(() => {
  if (!password.value.trim()) {
    return 'Password is required.'
  }

  return ''
})

const shouldShowEmailError = computed(
  () => (hasSubmitted.value || focusedField.value === 'email') && !!emailError.value
)

const shouldShowPasswordError = computed(
  () => (hasSubmitted.value || focusedField.value === 'password') && !!passwordError.value
)

const isFormValid = computed(() => !emailError.value && !passwordError.value)

const handleSubmit = async () => {
  hasSubmitted.value = true
  statusMessage.value = ''

  if (!isFormValid.value) {
    return
  }

  isLoading.value = true
  const result = await authStore.login({
    email: email.value.trim(),
    password: password.value,
    rememberMe: rememberMe.value,
  })

  // Handle pending approval status
  if (result.status === 'pending_approval') {
    isLoading.value = false
    showPendingApprovalModal.value = true
    // Clear the form
    email.value = ''
    password.value = ''
    hasSubmitted.value = false
    return
  }

  if (result.success) {
    statusType.value = 'success'
    statusMessage.value = result.message || 'Signed in successfully.'
    isLoading.value = false

    // Ensure user is loaded before checking role
    if (!authStore.user) {
      await authStore.fetchLoggedInUser()
    }

    if (authStore.user?.role === 'ROLE_CUSTOMER') {
      await router.push('/customer')
      return
    }
    if (authStore.user?.role === 'ROLE_EMPLOYEE') {
      await router.push('/employee')
      return
    }

    return
  }

  statusType.value = 'error'
  statusMessage.value = result.message || 'Unable to sign in.'
  isLoading.value = false
}

const handleFocus = fieldName => {
  focusedField.value = fieldName
}

const handleBlur = () => {
  focusedField.value = ''
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleModalClose = () => {
  showPendingApprovalModal.value = false
}
</script>

<template>
  <section class="min-h-screen bg-[#f3f4f6] px-4 py-12 sm:px-6 lg:py-16">
    <div class="mx-auto flex min-h-[80vh] w-full max-w-md flex-col items-center justify-center">
      <LoginBrandHeader brand-name="DMT Bank" />

      <div class="mt-5 w-full">
        <LoginAuthCard
          :email="email"
          :password="password"
          :remember-me="rememberMe"
          :show-password="showPassword"
          :is-loading="isLoading"
          :status-message="statusMessage"
          :status-type="statusType"
          :email-error="emailError"
          :password-error="passwordError"
          :should-show-email-error="shouldShowEmailError"
          :should-show-password-error="shouldShowPasswordError"
          @submit="handleSubmit"
          @update:email="email = $event"
          @update:password="password = $event"
          @update:remember-me="rememberMe = $event"
          @toggle-password-visibility="togglePasswordVisibility"
          @focus-field="handleFocus"
          @blur-field="handleBlur"
        />
      </div>

      <div class="mt-7 text-center text-sm text-slate-700">
        <p class="mt-1.5">
          Don't have an account?
          <RouterLink to="/register" class="font-medium text-amber-700 hover:text-amber-800">
            Open an Account
          </RouterLink>
        </p>
      </div>
    </div>

    <!-- Pending Approval Modal -->
    <PendingApprovalModal :is-open="showPendingApprovalModal" @close="handleModalClose" />
  </section>
</template>
