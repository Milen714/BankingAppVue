import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/utils/axios.js'
import { useAuthStore } from '@/stores/auth';

export const useProfileSettingsStore = defineStore('profileSettings', () => {
    // State
    const loading = ref(false)
    const error = ref(null)
    const successMessage = ref(null)

    const authStore = useAuthStore();

    // Computed property to get current user profile data
    const userProfile = computed(() => authStore.user)

    // Action to update user profile
    async function updateProfile(updatedData) {
        if (!authStore.isLoggedIn) {
            error.value = 'User is not logged in.'
            return
        }
        loading.value = true
        error.value = null
        successMessage.value = null
        try {
            const response = await axios.put(`/users/me`, updatedData)
            authStore.fetchLoggedInUser() // Refresh user data in auth store
            successMessage.value = 'Profile updated successfully.'
        } catch (err) {
            error.value = 'Failed to update profile.'
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        successMessage,
        userProfile,
        updateProfile
    }
})