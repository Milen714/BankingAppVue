<script setup>
const props = defineProps({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rememberMe: {
    type: Boolean,
    default: false,
  },
  showPassword: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  statusMessage: {
    type: String,
    default: '',
  },
  statusType: {
    type: String,
    default: 'success',
  },
  emailError: {
    type: String,
    default: '',
  },
  passwordError: {
    type: String,
    default: '',
  },
  shouldShowEmailError: {
    type: Boolean,
    default: false,
  },
  shouldShowPasswordError: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'submit',
  'update:email',
  'update:password',
  'update:rememberMe',
  'toggle-password-visibility',
  'focus-field',
  'blur-field',
])
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-[#f8f8f8] p-6 shadow-sm sm:p-7">
    <div class="text-center">
      <h1 class="text-5xl font-semibold text-slate-900">Sign In</h1>
      <p class="mt-2 text-base text-slate-600">Secure access to your DMT Bank accounts.</p>
    </div>

    <form class="mt-6 space-y-5" novalidate @submit.prevent="emit('submit')">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-slate-800" for="email">Email Address</label>
        <div
          class="flex items-center rounded-lg border bg-[#f6f2f1] px-3"
          :class="props.shouldShowEmailError ? 'border-rose-300' : 'border-[#e2c4b8]'"
        >
          <i class="pi pi-envelope mr-2 text-slate-500"></i>
          <input
            id="email"
            :value="props.email"
            type="email"
            autocomplete="email"
            class="h-11 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="you@example.com"
            @input="emit('update:email', $event.target.value)"
            @focus="emit('focus-field', 'email')"
            @blur="emit('blur-field')"
          >
        </div>
        <p v-if="props.shouldShowEmailError" class="mt-1.5 text-xs text-rose-600">{{ props.emailError }}</p>
      </div>

      <div>
        <div class="mb-1.5 flex items-center justify-between">
          <label class="block text-sm font-medium text-slate-800" for="password">Password</label>
          <a href="#" class="text-sm font-medium text-amber-700 hover:text-amber-800">Forgot Password?</a>
        </div>
        <div
          class="flex items-center rounded-lg border bg-[#f6f2f1] px-3"
          :class="props.shouldShowPasswordError ? 'border-rose-300' : 'border-[#e2c4b8]'"
        >
          <i class="pi pi-lock mr-2 text-slate-500"></i>
          <input
            id="password"
            :value="props.password"
            :type="props.showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            class="h-11 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="••••••••"
            @input="emit('update:password', $event.target.value)"
            @focus="emit('focus-field', 'password')"
            @blur="emit('blur-field')"
          >
          <button
            type="button"
            class="ml-2 text-slate-500 transition-colors hover:text-slate-700"
            aria-label="Toggle password visibility"
            @click="emit('toggle-password-visibility')"
          >
            <i :class="props.showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
          </button>
        </div>
        <p v-if="props.shouldShowPasswordError" class="mt-1.5 text-xs text-rose-600">{{ props.passwordError }}</p>
      </div>

      <label class="inline-flex items-center gap-2 text-sm text-slate-700">
        <input
          :checked="props.rememberMe"
          type="checkbox"
          class="h-4 w-4 rounded border-[#d8b8aa] text-amber-700 focus:ring-amber-500"
          @change="emit('update:rememberMe', $event.target.checked)"
        >
        Remember me on this device
      </label>

      <button
        type="submit"
        class="inline-flex h-11 w-full items-center justify-center rounded-lg bg-amber-700 px-4 text-base font-semibold text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="props.isLoading"
      >
        <i v-if="props.isLoading" class="pi pi-spin pi-spinner mr-2"></i>
        {{ props.isLoading ? 'Signing In...' : 'Sign In' }}
      </button>

      <p
        v-if="props.statusMessage"
        class="rounded-lg border px-3 py-2 text-sm"
        :class="props.statusType === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'"
      >
        {{ props.statusMessage }}
      </p>

      <div class="pt-1">
        <div class="relative">
          <div class="h-px bg-[#e2c4b8]"></div>
          <p class="absolute inset-x-0 -top-2.5 mx-auto w-fit bg-[#f8f8f8] px-2 text-sm text-slate-500">
            Or sign in with
          </p>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#bb8f7c] bg-[#f6f2f1] px-4 text-base font-medium text-slate-800 transition-colors hover:bg-[#f2e9e6]"
      >
        <i class="pi pi-star text-sm"></i>
        Biometrics
      </button>
    </form>
  </div>
</template>
