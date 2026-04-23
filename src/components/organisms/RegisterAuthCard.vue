<script setup>
const props = defineProps({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  bsnNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  showPassword: {
    type: Boolean,
    default: false,
  },
  showConfirmPassword: {
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
  errors: {
    type: Object,
    default: () => ({}),
  },
  visibleErrors: {
    type: Object,
    default: () => ({}),
  },
  passwordFeedback: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits([
  'submit',
  'update:firstName',
  'update:lastName',
  'update:email',
  'update:phoneNumber',
  'update:bsnNumber',
  'update:password',
  'update:confirmPassword',
  'toggle-password-visibility',
  'toggle-confirm-password-visibility',
  'focus-field',
  'blur-field',
])

const inputClasses = (hasError) => {
  return hasError ? 'border-rose-300' : 'border-[#e2c4b8]'
}
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-[#f8f8f8] p-6 shadow-sm sm:p-7">
    <div class="text-center">
      <h1 class="text-4xl font-semibold text-slate-900">Create Account</h1>
      <p class="mt-2 text-base text-slate-600">Set up secure access to your DMT Bank account.</p>
    </div>

    <form class="mt-6 space-y-4" novalidate @submit.prevent="emit('submit')">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-800" for="firstName">First Name</label>
          <input
            id="firstName"
            :value="props.firstName"
            type="text"
            class="h-11 w-full rounded-lg border bg-[#f6f2f1] px-3 text-sm text-slate-900 outline-none"
            :class="inputClasses(props.visibleErrors.firstName)"
            placeholder="John"
            @input="emit('update:firstName', $event.target.value)"
            @focus="emit('focus-field', 'firstName')"
            @blur="emit('blur-field')"
          >
          <p v-if="props.visibleErrors.firstName" class="mt-1.5 text-xs text-rose-600">{{ props.errors.firstName }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-800" for="lastName">Last Name</label>
          <input
            id="lastName"
            :value="props.lastName"
            type="text"
            class="h-11 w-full rounded-lg border bg-[#f6f2f1] px-3 text-sm text-slate-900 outline-none"
            :class="inputClasses(props.visibleErrors.lastName)"
            placeholder="Doe"
            @input="emit('update:lastName', $event.target.value)"
            @focus="emit('focus-field', 'lastName')"
            @blur="emit('blur-field')"
          >
          <p v-if="props.visibleErrors.lastName" class="mt-1.5 text-xs text-rose-600">{{ props.errors.lastName }}</p>
        </div>
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-slate-800" for="email">Email Address</label>
        <input
          id="email"
          :value="props.email"
          type="email"
          class="h-11 w-full rounded-lg border bg-[#f6f2f1] px-3 text-sm text-slate-900 outline-none"
          :class="inputClasses(props.visibleErrors.email)"
          placeholder="john.doe@example.com"
          @input="emit('update:email', $event.target.value)"
          @focus="emit('focus-field', 'email')"
          @blur="emit('blur-field')"
        >
        <p v-if="props.visibleErrors.email" class="mt-1.5 text-xs text-rose-600">{{ props.errors.email }}</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-800" for="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            :value="props.phoneNumber"
            type="tel"
            class="h-11 w-full rounded-lg border bg-[#f6f2f1] px-3 text-sm text-slate-900 outline-none"
            :class="inputClasses(props.visibleErrors.phoneNumber)"
            placeholder="+31612345678"
            @input="emit('update:phoneNumber', $event.target.value)"
            @focus="emit('focus-field', 'phoneNumber')"
            @blur="emit('blur-field')"
          >
          <p v-if="props.visibleErrors.phoneNumber" class="mt-1.5 text-xs text-rose-600">{{ props.errors.phoneNumber }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-800" for="bsnNumber">BSN Number</label>
          <input
            id="bsnNumber"
            :value="props.bsnNumber"
            type="text"
            class="h-11 w-full rounded-lg border bg-[#f6f2f1] px-3 text-sm text-slate-900 outline-none"
            :class="inputClasses(props.visibleErrors.bsnNumber)"
            placeholder="123456789"
            @input="emit('update:bsnNumber', $event.target.value)"
            @focus="emit('focus-field', 'bsnNumber')"
            @blur="emit('blur-field')"
          >
          <p v-if="props.visibleErrors.bsnNumber" class="mt-1.5 text-xs text-rose-600">{{ props.errors.bsnNumber }}</p>
        </div>
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-slate-800" for="password">Password</label>
        <div
          class="flex items-center rounded-lg border bg-[#f6f2f1] px-3"
          :class="inputClasses(props.visibleErrors.password)"
        >
          <input
            id="password"
            :value="props.password"
            :type="props.showPassword ? 'text' : 'password'"
            class="h-11 w-full bg-transparent text-sm text-slate-900 outline-none"
            placeholder="SecurePassword123!"
            @input="emit('update:password', $event.target.value)"
            @focus="emit('focus-field', 'password')"
            @blur="emit('blur-field')"
          >
          <button
            type="button"
            class="ml-2 text-slate-500 transition-colors hover:text-slate-700"
            @click="emit('toggle-password-visibility')"
          >
            <i :class="props.showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
          </button>
        </div>
        <p v-if="props.visibleErrors.password" class="mt-1.5 text-xs text-rose-600">{{ props.errors.password }}</p>

        <ul class="mt-2 grid gap-1 text-xs sm:grid-cols-2">
          <li
            v-for="item in props.passwordFeedback"
            :key="item.id"
            class="inline-flex items-center gap-1.5"
            :class="item.valid ? 'text-emerald-700' : 'text-slate-500'"
          >
            <i :class="item.valid ? 'pi pi-check-circle' : 'pi pi-circle'" class="text-[0.72rem]"></i>
            <span>{{ item.text }}</span>
          </li>
        </ul>
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-slate-800" for="confirmPassword">Confirm Password</label>
        <div
          class="flex items-center rounded-lg border bg-[#f6f2f1] px-3"
          :class="inputClasses(props.visibleErrors.confirmPassword)"
        >
          <input
            id="confirmPassword"
            :value="props.confirmPassword"
            :type="props.showConfirmPassword ? 'text' : 'password'"
            class="h-11 w-full bg-transparent text-sm text-slate-900 outline-none"
            placeholder="Retype password"
            @input="emit('update:confirmPassword', $event.target.value)"
            @focus="emit('focus-field', 'confirmPassword')"
            @blur="emit('blur-field')"
          >
          <button
            type="button"
            class="ml-2 text-slate-500 transition-colors hover:text-slate-700"
            @click="emit('toggle-confirm-password-visibility')"
          >
            <i :class="props.showConfirmPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
          </button>
        </div>
        <p v-if="props.visibleErrors.confirmPassword" class="mt-1.5 text-xs text-rose-600">{{ props.errors.confirmPassword }}</p>
      </div>

      <button
        type="submit"
        class="inline-flex h-11 w-full items-center justify-center rounded-lg bg-amber-700 px-4 text-base font-semibold text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="props.isLoading"
      >
        <i v-if="props.isLoading" class="pi pi-spin pi-spinner mr-2"></i>
        {{ props.isLoading ? 'Creating Account...' : 'Create Account' }}
      </button>

      <p
        v-if="props.statusMessage"
        class="rounded-lg border px-3 py-2 text-sm"
        :class="props.statusType === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'"
      >
        {{ props.statusMessage }}
      </p>
    </form>
  </div>
</template>
