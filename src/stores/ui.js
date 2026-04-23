import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
    const isNavMenuOpen = ref(false)

    const toggleNavMenu = () => {
        isNavMenuOpen.value = !isNavMenuOpen.value
    }

    return {
        isNavMenuOpen,
        toggleNavMenu
    }
})