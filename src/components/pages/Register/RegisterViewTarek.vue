<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { RouterLink } from 'vue-router'

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const hasSubmitted = ref(false)
const focusedField = ref('')
const statusMessage = ref('')

let loadingTimer = null

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fullNameError = computed(() => {
  if (!fullName.value.trim()) {
    return 'Full name is required.'
  }

  return ''
})

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

  if (password.value.length < 8) {
    return 'Password must be at least 8 characters.'
  }

  return ''
})

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value.trim()) {
    return 'Please confirm your password.'
  }

  if (confirmPassword.value !== password.value) {
    return 'Passwords do not match.'
  }

  return ''
})

const isFormValid = computed(() => {
  return (
    !fullNameError.value && !emailError.value && !passwordError.value && !confirmPasswordError.value
  )
})

const shouldShowFullNameError = computed(
  () => (hasSubmitted.value || focusedField.value === 'fullName') && !!fullNameError.value
)

const shouldShowEmailError = computed(
  () => (hasSubmitted.value || focusedField.value === 'email') && !!emailError.value
)

const shouldShowPasswordError = computed(
  () => (hasSubmitted.value || focusedField.value === 'password') && !!passwordError.value
)

const shouldShowConfirmPasswordError = computed(
  () =>
    (hasSubmitted.value || focusedField.value === 'confirmPassword') && !!confirmPasswordError.value
)

const handleSubmit = () => {
  hasSubmitted.value = true
  statusMessage.value = ''

  if (!isFormValid.value) {
    return
  }

  isLoading.value = true

  loadingTimer = window.setTimeout(() => {
    isLoading.value = false
    statusMessage.value = 'Demo account created. No backend request was sent.'
  }, 1400)
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

onBeforeUnmount(() => {
  if (loadingTimer) {
    window.clearTimeout(loadingTimer)
  }
})
</script>

<template>
  <section class="relative min-h-screen overflow-hidden bg-slate-100">
    <div
      class="absolute inset-0 bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef4fb_42%,_#e2e8f0_100%)]"
    ></div>
    <div
      class="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.10),_transparent_60%)]"
    ></div>
    <div class="absolute -right-24 top-20 h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl"></div>
    <div class="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl"></div>
    <div
      class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent"
    ></div>

    <div
      class="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
    >
      <div class="grid w-full items-center gap-6 md:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div class="order-2 lg:order-1">
          <div
            class="mb-4 rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur sm:p-5 lg:hidden"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <div
                  class="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  <span
                    class="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs text-white"
                  >
                    B
                  </span>
                  BrightPath
                </div>
                <p class="mt-4 text-xl font-semibold text-slate-950 sm:text-2xl">
                  Create your account
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  Set up your online banking access.
                </p>
              </div>
              <div
                class="hidden rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-right sm:block"
              >
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Protected
                </p>
                <p class="mt-1 text-sm text-emerald-800">Secure setup</p>
              </div>
            </div>
          </div>

          <div
            class="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)] sm:rounded-[2rem]"
          >
            <div class="h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500"></div>
            <div class="p-5 sm:p-8">
              <div class="mb-8">
                <p class="text-sm font-semibold text-emerald-700">New here?</p>
                <h1 class="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">
                  Create your account
                </h1>
                <p class="mt-3 text-sm leading-6 text-slate-600">
                  Fill in your details below to get started.
                </p>
              </div>

              <div
                class="mb-6 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
              >
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm"
                >
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 12a4 4 0 100-8 4 4 0 000 8zM5 20a7 7 0 1114 0"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <span>Create your login details and review the form before continuing.</span>
              </div>

              <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700" for="fullName">
                    Full name
                  </label>
                  <div
                    class="group rounded-2xl border bg-slate-50 transition duration-200 ease-out focus-within:-translate-y-0.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(5,150,105,0.08)]"
                    :class="
                      shouldShowFullNameError
                        ? 'border-rose-300'
                        : 'border-slate-200 hover:border-slate-400'
                    "
                  >
                    <input
                      id="fullName"
                      v-model="fullName"
                      type="text"
                      name="fullName"
                      autocomplete="name"
                      placeholder="Enter your full name"
                      class="w-full rounded-2xl bg-transparent px-4 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      @focus="handleFocus('fullName')"
                      @blur="handleBlur"
                    />
                  </div>
                  <p
                    v-if="shouldShowFullNameError"
                    class="text-sm text-rose-500 animate-[fade-in_200ms_ease-out]"
                  >
                    {{ fullNameError }}
                  </p>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700" for="email">
                    Email address
                  </label>
                  <div
                    class="group rounded-2xl border bg-slate-50 transition duration-200 ease-out focus-within:-translate-y-0.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(5,150,105,0.08)]"
                    :class="
                      shouldShowEmailError
                        ? 'border-rose-300'
                        : 'border-slate-200 hover:border-slate-400'
                    "
                  >
                    <input
                      id="email"
                      v-model="email"
                      type="email"
                      name="email"
                      autocomplete="email"
                      placeholder="name@example.com"
                      class="w-full rounded-2xl bg-transparent px-4 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      @focus="handleFocus('email')"
                      @blur="handleBlur"
                    />
                  </div>
                  <p
                    v-if="shouldShowEmailError"
                    class="text-sm text-rose-500 animate-[fade-in_200ms_ease-out]"
                  >
                    {{ emailError }}
                  </p>
                </div>

                <div class="grid gap-5 sm:grid-cols-2">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700" for="password">
                      Password
                    </label>
                    <div
                      class="group flex rounded-2xl border bg-slate-50 transition duration-200 ease-out focus-within:-translate-y-0.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(5,150,105,0.08)]"
                      :class="
                        shouldShowPasswordError
                          ? 'border-rose-300'
                          : 'border-slate-200 hover:border-slate-400'
                      "
                    >
                      <input
                        id="password"
                        v-model="password"
                        :type="showPassword ? 'text' : 'password'"
                        name="password"
                        autocomplete="new-password"
                        placeholder="Min. 8 characters"
                        class="w-full rounded-l-2xl bg-transparent px-4 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        @focus="handleFocus('password')"
                        @blur="handleBlur"
                      />
                      <button
                        type="button"
                        class="rounded-r-2xl px-4 text-sm font-medium text-slate-500 transition hover:text-slate-800 focus-visible:outline-none focus-visible:text-slate-900"
                        @click="togglePasswordVisibility"
                      >
                        {{ showPassword ? 'Hide' : 'Show' }}
                      </button>
                    </div>
                    <p
                      v-if="shouldShowPasswordError"
                      class="text-sm text-rose-500 animate-[fade-in_200ms_ease-out]"
                    >
                      {{ passwordError }}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700" for="confirmPassword">
                      Confirm password
                    </label>
                    <div
                      class="group flex rounded-2xl border bg-slate-50 transition duration-200 ease-out focus-within:-translate-y-0.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(5,150,105,0.08)]"
                      :class="
                        shouldShowConfirmPasswordError
                          ? 'border-rose-300'
                          : 'border-slate-200 hover:border-slate-400'
                      "
                    >
                      <input
                        id="confirmPassword"
                        v-model="confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        name="confirmPassword"
                        autocomplete="new-password"
                        placeholder="Repeat password"
                        class="w-full rounded-l-2xl bg-transparent px-4 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        @focus="handleFocus('confirmPassword')"
                        @blur="handleBlur"
                      />
                      <button
                        type="button"
                        class="rounded-r-2xl px-4 text-sm font-medium text-slate-500 transition hover:text-slate-800 focus-visible:outline-none focus-visible:text-slate-900"
                        @click="toggleConfirmPasswordVisibility"
                      >
                        {{ showConfirmPassword ? 'Hide' : 'Show' }}
                      </button>
                    </div>
                    <p
                      v-if="shouldShowConfirmPasswordError"
                      class="text-sm text-rose-500 animate-[fade-in_200ms_ease-out]"
                    >
                      {{ confirmPasswordError }}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  class="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-emerald-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                  :disabled="isLoading"
                >
                  <svg
                    v-if="isLoading"
                    class="mr-2 h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-80"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  {{ isLoading ? 'Creating account...' : 'Create account' }}
                </button>

                <p
                  v-if="statusMessage"
                  class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 animate-[fade-in_250ms_ease-out]"
                >
                  {{ statusMessage }}
                </p>
              </form>

              <div
                class="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <p class="text-sm text-slate-600">
                  Already have an account?
                  <RouterLink
                    to="/login"
                    class="font-semibold text-emerald-700 transition hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    Log in
                  </RouterLink>
                </p>
                <p class="text-xs text-slate-400">Secure account setup</p>
              </div>
            </div>
          </div>
        </div>

        <div class="order-1 hidden lg:block lg:order-2">
          <div class="max-w-lg lg:ml-auto">
            <div
              class="inline-flex items-center gap-3 rounded-full border border-slate-300/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur"
            >
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white"
              >
                B
              </span>
              BrightPath
            </div>

            <h2 class="mt-8 text-4xl font-semibold leading-tight text-slate-950 xl:text-[3.25rem]">
              Create your online banking access
            </h2>

            <p class="mt-5 max-w-lg text-lg leading-8 text-slate-600">
              Register once to manage your banking details, balances, and activity in one place.
            </p>

            <div class="mt-10 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
              <div class="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-sm font-semibold text-slate-900">Getting started</p>
                    <p class="mt-1 text-sm text-slate-500">A simple form with clear steps</p>
                  </div>
                  <div
                    class="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                  >
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M12 4h7v7"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M20 4l-9 9"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M20 13v5a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h5"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div class="mt-6 rounded-2xl bg-slate-950 px-5 py-5 text-white">
                  <p class="text-xs uppercase tracking-[0.18em] text-slate-400">What you need</p>
                  <div class="mt-4 space-y-3">
                    <div class="flex items-center gap-3">
                      <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                      <span class="text-sm text-slate-100">Your full name</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                      <span class="text-sm text-slate-100">A valid email address</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                      <span class="text-sm text-slate-100">A secure password</span>
                    </div>
                  </div>
                </div>

                <div class="mt-4 grid grid-cols-2 gap-3">
                  <div class="rounded-2xl bg-slate-50 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.14em] text-slate-400">Form</p>
                    <p class="mt-2 text-base font-semibold text-slate-900">Easy to complete</p>
                  </div>
                  <div class="rounded-2xl bg-slate-50 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.14em] text-slate-400">Check</p>
                    <p class="mt-2 text-base font-semibold text-slate-900">Instant feedback</p>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div class="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700"
                    >
                      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M12 21s7-4.35 7-10V6l-7-3-7 3v5c0 5.65 7 10 7 10z"
                          stroke="currentColor"
                          stroke-width="1.8"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-slate-900">Safer setup</p>
                      <p class="mt-1 text-sm text-slate-500">
                        Clear password requirements and confirmation.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm">
                  <p class="text-sm font-semibold text-slate-900">Easy to review</p>
                  <p class="mt-2 text-sm leading-6 text-slate-600">
                    A clean form with clear labels and helpful validation messages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
