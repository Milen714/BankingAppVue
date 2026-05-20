<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const hasSubmitted = ref(false)
const focusedField = ref('')
const statusMessage = ref('')
const statusType = ref('success')

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

const isFormValid = computed(() => !emailError.value && !passwordError.value)

const shouldShowEmailError = computed(
  () => (hasSubmitted.value || focusedField.value === 'email') && !!emailError.value
)

const shouldShowPasswordError = computed(
  () => (hasSubmitted.value || focusedField.value === 'password') && !!passwordError.value
)

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
  })

  if (result.success) {
    statusType.value = 'success'
    statusMessage.value = result.message
    isLoading.value = false
    router.push('/')
    return
  }

  statusType.value = 'error'
  statusMessage.value = result.message
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
</script>

<template>
  <section class="relative min-h-screen overflow-hidden bg-slate-100">
    <div
      class="absolute inset-0 bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef4fb_42%,_#e2e8f0_100%)]"
    ></div>
    <div
      class="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(30,64,175,0.12),_transparent_58%)]"
    ></div>
    <div class="absolute -left-24 top-24 h-64 w-64 rounded-full bg-blue-200/50 blur-3xl"></div>
    <div class="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-slate-300/40 blur-3xl"></div>
    <div
      class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/80 to-transparent"
    ></div>

    <div
      class="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
    >
      <div class="grid w-full items-center gap-6 md:gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
        <div class="hidden lg:block">
          <div class="max-w-lg">
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

            <h1 class="mt-8 text-4xl font-semibold leading-tight text-slate-950 xl:text-[3.25rem]">
              Sign in to your account
            </h1>

            <p class="mt-5 max-w-lg text-lg leading-8 text-slate-600">
              Check balances, review recent activity, and manage your banking in one place.
            </p>

            <div class="mt-10 grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
              <div class="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold text-slate-900">Secure access</p>
                    <p class="mt-1 text-sm text-slate-500">Designed for a clear sign-in flow</p>
                  </div>
                  <div
                    class="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200"
                  >
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M4 10L12 4l8 6v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9z"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9 20v-6h6v6"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div class="mt-6 rounded-2xl bg-slate-950 px-5 py-5 text-white">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Session status
                      </p>
                      <p class="mt-2 text-2xl font-semibold">Ready to sign in</p>
                    </div>
                    <div
                      class="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300"
                    >
                      Secure
                    </div>
                  </div>
                  <div class="mt-5 grid grid-cols-3 gap-2">
                    <div class="h-2 rounded-full bg-white/15"></div>
                    <div class="h-2 rounded-full bg-blue-400/60"></div>
                    <div class="h-2 rounded-full bg-emerald-400/60"></div>
                  </div>
                  <div class="mt-4 grid grid-cols-2 gap-3">
                    <div class="rounded-2xl bg-white/5 px-4 py-3">
                      <p class="text-xs uppercase tracking-[0.14em] text-slate-400">Device</p>
                      <p class="mt-2 text-sm font-semibold text-white">Trusted browser</p>
                    </div>
                    <div class="rounded-2xl bg-white/5 px-4 py-3">
                      <p class="text-xs uppercase tracking-[0.14em] text-slate-400">Access</p>
                      <p class="mt-2 text-sm font-semibold text-white">Personal account</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div class="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"
                    >
                      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M12 3l7 4v5c0 4.4-2.9 8.5-7 9-4.1-.5-7-4.6-7-9V7l7-4z"
                          stroke="currentColor"
                          stroke-width="1.8"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9.5 12.5l1.8 1.8 3.7-4.1"
                          stroke="currentColor"
                          stroke-width="1.8"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-slate-900">Protected sign in</p>
                      <p class="mt-1 text-sm text-slate-500">
                        Extra checks can be added after login.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm">
                  <p class="text-sm font-semibold text-slate-900">Need help signing in?</p>
                  <p class="mt-2 text-sm leading-6 text-slate-600">
                    Use the password link on the form or create an account if you are new to online
                    banking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="relative w-full max-w-lg justify-self-center animate-[fade-in_450ms_ease-out]">
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
                  Sign in to your account
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  Use your email and password to continue.
                </p>
              </div>
              <div
                class="hidden rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-right sm:block"
              >
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Protected
                </p>
                <p class="mt-1 text-sm text-emerald-800">TLS secured</p>
              </div>
            </div>
          </div>

          <div
            class="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:rounded-[2rem]"
          >
            <div class="h-1.5 bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500"></div>
            <div class="p-5 sm:p-8">
              <div class="mb-8">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm font-semibold text-blue-700">Welcome back</p>
                    <h2 class="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">Login</h2>
                  </div>
                  <div
                    class="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-right sm:block lg:hidden"
                  >
                    <p class="text-xs font-semibold text-emerald-700">Protected</p>
                    <p class="mt-1 text-sm text-emerald-800">TLS secured</p>
                  </div>
                </div>
                <p class="mt-3 text-sm leading-6 text-slate-600">Enter your details below.</p>
              </div>

              <div
                class="mb-6 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
              >
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm"
                >
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 16v.01M7 10V8a5 5 0 1110 0v2m-9 0h8a1 1 0 011 1v7a1 1 0 01-1 1H8a1 1 0 01-1-1v-7a1 1 0 011-1z"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <span>Your session is protected while you sign in.</span>
              </div>

              <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700" for="email">
                    Email address
                  </label>
                  <div
                    class="group rounded-2xl border bg-slate-50 transition duration-200 ease-out focus-within:-translate-y-0.5 focus-within:border-blue-700 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
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

                <div class="space-y-2">
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <label class="text-sm font-medium text-slate-700" for="password">
                      Password
                    </label>
                    <a
                      href="#"
                      class="text-sm font-medium text-blue-700 transition hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div
                    class="group flex rounded-2xl border bg-slate-50 transition duration-200 ease-out focus-within:-translate-y-0.5 focus-within:border-blue-700 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
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
                      autocomplete="current-password"
                      placeholder="Enter your password"
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

                <button
                  type="submit"
                  class="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-blue-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
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
                  {{ isLoading ? 'Signing in...' : 'Login' }}
                </button>

                <p
                  v-if="statusMessage"
                  class="rounded-2xl border px-4 py-3 text-sm animate-[fade-in_250ms_ease-out]"
                  :class="
                    statusType === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-rose-200 bg-rose-50 text-rose-700'
                  "
                >
                  {{ statusMessage }}
                </p>
              </form>

              <div
                class="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <p class="text-sm text-slate-600">
                  Don&apos;t have an account?
                  <RouterLink
                    to="/register"
                    class="font-semibold text-blue-700 transition hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    Sign up
                  </RouterLink>
                </p>
                <p class="text-xs text-slate-400">Secure sign in</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
