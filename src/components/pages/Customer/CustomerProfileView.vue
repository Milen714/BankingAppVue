<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CustomerSidebarNav from '@/components/organisms/CustomerSidebarNav.vue'
import CustomerBottomNav from '@/components/organisms/CustomerBottomNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import FormGroup from '@/components/molecules/FormGroup.vue'
import { useAuthStore } from '@/stores/auth'
import { useProfileSettingsStore } from '@/stores/profileSettings'

const authStore = useAuthStore()
const profileSettingsStore = useProfileSettingsStore()
const router = useRouter()
console.log('Authenticated user:', authStore.user)
// Profile data
const profileData = ref({
  firstName: authStore.user ? authStore.user.firstName : 'John',
  lastName: authStore.user ? authStore.user.lastName : 'Doe',
  email: authStore.user ? authStore.user.email : 'john.doe@example.com',
  phoneNumber: authStore.user ? authStore.user.phoneNumber : '+31 6 12345678',
})

// Edit states for each field
const editingField = ref(null)
const editValues = ref({
  firstName: profileData.value.firstName,
  lastName: profileData.value.lastName,
  email: profileData.value.email,
  phoneNumber: profileData.value.phoneNumber,
})

const isLoading = ref(false)
const showSuccessModal = ref(false)

// Start editing a field
const startEditing = field => {
  editingField.value = field
  editValues.value[field] = profileData.value[field]
}

// Cancel editing
const cancelEditing = () => {
  editingField.value = null
  editValues.value = { ...profileData.value }
}

// Save individual field
const saveField = async field => {
  isLoading.value = true
  try {
    // Simulate API call
    // await new Promise(resolve => setTimeout(resolve, 800))

    // Update profile data
    profileData.value[field] = editValues.value[field]
    profileSettingsStore.updateProfile(profileData.value) // Update global store
    editingField.value = null

    // Show success
    showSuccessModal.value = true
    setTimeout(() => {
      showSuccessModal.value = false
    }, 2000)
  } catch (error) {
    console.error('Error saving field:', error)
  } finally {
    isLoading.value = false
  }
}

// Profile field component
const fields = [
  {
    key: 'firstName',
    label: 'First Name',
    displayLabel: 'First Name',
  },
  {
    key: 'lastName',
    label: 'Last Name',
    displayLabel: 'Last Name',
  },
  {
    key: 'email',
    label: 'Email Address',
    displayLabel: 'Email',
    type: 'email',
  },
  {
    key: 'phoneNumber',
    label: 'Phone Number',
    displayLabel: 'Phone Number',
    type: 'tel',
  },
]
</script>

<template>
  <section class="bg-[#f6efec]">
    <div class="mx-auto flex min-h-[calc(100vh-60px)]">
      <CustomerSidebarNav />

      <div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
        <PortalHeader :title="'Profile Settings'" :buttons="[]" />

        <!-- Profile Content -->
        <section
          class="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#e7c9bd] bg-white p-6 text-center"
        >
          <!-- Profile Header -->
          <div class="mb-6">
            <div
              class="flex h-20 w-20 items-center justify-center rounded-full bg-[#f3e4dc] mx-auto"
            >
              <i class="pi pi-user text-4xl text-[#cc570f]"></i>
            </div>
            <h3 class="mt-4 text-2xl font-semibold text-slate-900">
              {{ profileData.firstName }} {{ profileData.lastName }}
            </h3>
            <p class="text-sm text-slate-600">{{ profileData.email }}</p>
          </div>

          <!-- Editable Fields -->
          <div class="w-full max-w-md space-y-6">
            <div v-for="field in fields" :key="field.key" class="flex flex-col items-start">
              <!-- Display Mode -->
              <div
                v-if="editingField !== field.key"
                class="w-full flex items-center justify-between rounded-lg border border-[#e7c9bd] bg-slate-50 px-4 py-3"
              >
                <div class="flex-1">
                  <label class="text-xs font-semibold text-slate-600 uppercase">{{
                    field.displayLabel
                  }}</label>
                  <p class="mt-1 text-base text-slate-900">{{ profileData[field.key] }}</p>
                </div>
                <button
                  @click="startEditing(field.key)"
                  type="button"
                  class="ml-3 flex-shrink-0 rounded-lg bg-[#cc570f] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b14c0d]"
                >
                  <i class="pi pi-pencil mr-1"></i>
                  Edit
                </button>
              </div>

              <!-- Edit Mode -->
              <div v-else class="w-full space-y-3">
                <FormGroup
                  v-model="editValues[field.key]"
                  :label="field.label"
                  :type="field.type || 'text'"
                  :placeholder="`Enter ${field.label.toLowerCase()}`"
                />
                <div class="flex gap-2">
                  <button
                    @click="saveField(field.key)"
                    :disabled="isLoading"
                    type="button"
                    class="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:bg-slate-300"
                  >
                    <i v-if="isLoading" class="pi pi-spin pi-spinner mr-1"></i>
                    {{ isLoading ? 'Saving...' : 'Save' }}
                  </button>
                  <button
                    @click="cancelEditing"
                    type="button"
                    class="flex-1 rounded-lg border border-[#e7c9bd] bg-white px-3 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <CustomerBottomNav />
  </section>

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

      <h2 class="mb-2 text-center text-2xl font-bold text-slate-900">Profile Updated</h2>

      <p class="text-center text-slate-600">
        Your profile information has been updated successfully.
      </p>
    </div>
  </div>
</template>
