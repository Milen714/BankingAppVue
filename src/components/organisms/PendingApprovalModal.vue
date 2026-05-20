<script setup>
import { useRouter } from 'vue-router'

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])
const router = useRouter()

const handleReturnHome = () => {
  emit('close')
  router.push('/')
}

const handleContactSupport = () => {
  // You can replace this with actual support contact logic
  window.location.href = 'mailto:support@dmtbank.com'
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-md rounded-lg bg-white px-6 py-8">
      <!-- Header with icon -->
      <div class="mb-6 flex justify-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <i class="pi pi-hourglass text-2xl text-amber-700"></i>
        </div>
      </div>

      <!-- Title -->
      <h2 class="mb-2 text-center text-2xl font-bold text-slate-900">Account Under Review</h2>

      <!-- Description -->
      <p class="mb-6 text-center text-sm text-slate-600">
        Thank you for registering with DMT Bank. Your account is currently under review by our
        verification team to ensure regulatory compliance and security.
      </p>

      <!-- Next Steps Section -->
      <div class="mb-5 rounded-lg bg-amber-50 p-4">
        <div class="mb-2 flex items-start gap-3">
          <i class="pi pi-info-circle mt-0.5 flex-shrink-0 text-amber-700"></i>
          <div>
            <p class="font-semibold text-slate-900">Next Steps</p>
            <p class="mt-1 text-sm text-slate-700">
              Our team is currently reviewing your information. You will receive an email
              notification once your account has been approved and is ready for use.
            </p>
          </div>
        </div>
      </div>

      <!-- Estimated Timeline Section -->
      <div class="mb-6 rounded-lg bg-amber-50 p-4">
        <div class="flex items-start gap-3">
          <i class="pi pi-clock mt-0.5 flex-shrink-0 text-amber-700"></i>
          <div>
            <p class="font-semibold text-slate-900">Estimated Timeline</p>
            <p class="mt-1 text-sm text-slate-700">Review typically takes 1-2 business days.</p>
          </div>
        </div>
      </div>

      <!-- Return to Home Button -->
      <button
        @click="handleReturnHome"
        class="mb-4 w-full rounded-lg bg-orange-600 py-3 font-medium text-white transition-colors hover:bg-orange-700"
      >
        Return to Home
      </button>

      <!-- Contact Support Link -->
      <div class="text-center">
        <button
          @click="handleContactSupport"
          class="text-sm text-slate-600 underline transition-colors hover:text-slate-900"
        >
          <i class="pi pi-question-circle mr-1 text-xs"></i>
          Contact Support
        </button>
      </div>

      <!-- Security badges -->
      <div
        class="mt-6 flex justify-center gap-4 border-t border-slate-200 pt-4 text-center text-xs text-slate-500"
      >
        <div class="flex items-center gap-1">
          <i class="pi pi-lock text-xs"></i>
          <span>AES-256 Encrypted</span>
        </div>
        <div class="flex items-center gap-1">
          <i class="pi pi-shield text-xs"></i>
          <span>GDPR Compliant</span>
        </div>
      </div>
    </div>
  </div>
</template>
