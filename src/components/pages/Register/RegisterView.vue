<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import LoginBrandHeader from '@/components/organisms/LoginBrandHeader.vue'
import RegisterAuthCard from '@/components/organisms/RegisterAuthCard.vue'
import { useAuthStore } from '@/stores/auth'
import { getPasswordFeedback, isPasswordStrong } from '@/utils/PasswordStrength'

const router = useRouter()
const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phoneNumber = ref('')
const bsnNumber = ref('')
const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const hasSubmitted = ref(false)
const focusedField = ref('')
const statusMessage = ref('')
const statusType = ref('success')

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^\+[1-9]\d{7,14}$/
const bsnPattern = /^\d{9}$/

const errors = computed(() => {
  return {
    firstName: firstName.value.trim() ? '' : 'First name is required.',
    lastName: lastName.value.trim() ? '' : 'Last name is required.',
    email: !email.value.trim()
      ? 'Email is required.'
      : !emailPattern.test(email.value.trim())
        ? 'Enter a valid email address.'
        : '',
    phoneNumber: !phoneNumber.value.trim()
      ? 'Phone number is required.'
      : !phonePattern.test(phoneNumber.value.trim())
        ? 'Use an international format like +31612345678.'
        : '',
    bsnNumber: !bsnNumber.value.trim()
      ? 'BSN number is required.'
      : !bsnPattern.test(bsnNumber.value.trim())
        ? 'BSN must contain exactly 9 digits.'
        : '',
    password: !password.value
      ? 'Password is required.'
      : !isPasswordStrong(password.value)
        ? 'Password does not meet all strength requirements.'
        : '',
    confirmPassword: !confirmPassword.value
      ? 'Please retype your password.'
      : confirmPassword.value !== password.value
        ? 'Passwords do not match.'
        : '',
  }
})

const visibleErrors = computed(() => {
  const currentErrors = errors.value
  return Object.fromEntries(
    Object.entries(currentErrors).map(([key, value]) => [
      key,
      !!value && (hasSubmitted.value || focusedField.value === key),
    ])
  )
})

const isFormValid = computed(() => Object.values(errors.value).every(error => !error))
const passwordFeedback = computed(() => getPasswordFeedback(password.value))

const handleSubmit = async () => {
  hasSubmitted.value = true
  statusMessage.value = ''

  if (!isFormValid.value) {
    return
  }

  isLoading.value = true
  const result = await authStore.register({
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    email: email.value.trim(),
    password: password.value,
    bsnNumber: bsnNumber.value.trim(),
    phoneNumber: phoneNumber.value.trim(),
  })

  if (result.success) {
    statusType.value = 'success'
    statusMessage.value = result.message || 'Account created successfully.'
    isLoading.value = false
    await router.push('/login')
    return
  }

  statusType.value = 'error'
  statusMessage.value = result.message || 'Unable to create account.'
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

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<template>
  <section class="min-h-screen bg-[#f3f4f6] px-4 py-12 sm:px-6 lg:py-16">
    <div class="mx-auto flex min-h-[80vh] w-full max-w-xl flex-col items-center justify-center">
      <LoginBrandHeader brand-name="DMT Bank" />

      <div class="mt-5 w-full">
        <RegisterAuthCard
          :first-name="firstName"
          :last-name="lastName"
          :email="email"
          :phone-number="phoneNumber"
          :bsn-number="bsnNumber"
          :password="password"
          :confirm-password="confirmPassword"
          :show-password="showPassword"
          :show-confirm-password="showConfirmPassword"
          :is-loading="isLoading"
          :status-message="statusMessage"
          :status-type="statusType"
          :errors="errors"
          :visible-errors="visibleErrors"
          :password-feedback="passwordFeedback"
          @submit="handleSubmit"
          @update:first-name="firstName = $event"
          @update:last-name="lastName = $event"
          @update:email="email = $event"
          @update:phone-number="phoneNumber = $event"
          @update:bsn-number="bsnNumber = $event"
          @update:password="password = $event"
          @update:confirm-password="confirmPassword = $event"
          @toggle-password-visibility="togglePasswordVisibility"
          @toggle-confirm-password-visibility="toggleConfirmPasswordVisibility"
          @focus-field="handleFocus"
          @blur-field="handleBlur"
        />
      </div>

      <div class="mt-7 text-center text-sm text-slate-700">
        <p class="mt-1.5">
          Already have an account?
          <RouterLink to="/login" class="font-medium text-amber-700 hover:text-amber-800">
            Sign In
          </RouterLink>
        </p>
      </div>
    </div>
  </section>
</template>
