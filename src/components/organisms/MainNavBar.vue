<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const authStore = useAuthStore()

const route = useRoute()
const uiStore = useUIStore()

const isMobileMenuOpen = computed(() => uiStore.isNavMenuOpen)

const isActive = path => route.path.includes(path)

const logOut = () => {
  authStore.logout()
  router.push('/login')
  if (uiStore.isNavMenuOpen) {
    uiStore.toggleNavMenu()
  }
}

const closeMenuOnSelect = () => {
  if (uiStore.isNavMenuOpen) {
    uiStore.toggleNavMenu()
  }
}
</script>

<template>
  <nav
    class="fixed top-0 z-1000 w-full border-b border-slate-200 bg-[#f7f8fa] px-4 py-3 shadow-sm md:px-8"
  >
    <div class="mx-auto flex w-full max-w-7xl items-center">
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2"
        aria-label="Go to homepage"
        @click="closeMenuOnSelect"
      >
        <span class="text-lg leading-none">🏦</span>
        <span class="text-2xl font-semibold leading-none tracking-tight text-slate-800"
          >DMT Bank</span
        >
      </RouterLink>

      <ul class="ml-auto hidden items-center gap-3 md:flex">
        <li>
          <RouterLink
            to="/about"
            class="rounded-md px-2.5 py-2 text-base font-medium text-slate-600 transition-colors hover:text-slate-900"
            :class="isActive('/about') ? 'text-slate-900' : ''"
          >
            About
          </RouterLink>
        </li>
        <li v-if="authStore.isLoggedIn">
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            aria-label="Notifications"
          >
            <i class="pi pi-bell text-base"></i>
          </button>
        </li>
        <li v-if="!authStore.isLoggedIn">
          <RouterLink
            to="/login"
            class="inline-flex items-center rounded-xl border border-[#d7c8b2] bg-[#efe4d4] px-4 py-2 text-sm font-semibold text-[#5f4b32] transition-colors hover:bg-[#e7d8c3]"
          >
            Login
          </RouterLink>
        </li>
        <li v-if="!authStore.isLoggedIn">
          <RouterLink
            to="/register"
            class="inline-flex items-center rounded-xl bg-[#f08a12] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#dd7f11]"
          >
            Register
          </RouterLink>
        </li>
        <li v-if="authStore.isLoggedIn && !authStore.isEmployee">
          <RouterLink
            to="/customer"
            class="block rounded-lg border border-[#d7c8b2] px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#e7d8c3]"
            :class="
              isActive('/customer') ? 'bg-[#e7d8c3] text-[#4a3821]' : 'bg-[#efe4d4] text-[#5f4b32]'
            "
          >
            Customer Dashboard
          </RouterLink>
        </li>
        <li v-if="authStore.isLoggedIn && authStore.isEmployee">
          <RouterLink
            to="/employee"
            class="block rounded-lg border border-[#d7c8b2] px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#e7d8c3]"
            :class="
              isActive('/employee') ? 'bg-[#e7d8c3] text-[#4a3821]' : 'bg-[#efe4d4] text-[#5f4b32]'
            "
          >
            Employee Dashboard
          </RouterLink>
        </li>
        <li v-if="authStore.isLoggedIn">
          <button
            type="button"
            class="block rounded-lg border border-[#d7c8b2] px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#e7d8c3]"
            @click="logOut"
          >
            Logout
          </button>
        </li>
      </ul>

      <button
        type="button"
        class="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg text-xl text-slate-800 transition-colors hover:bg-slate-100 md:hidden"
        :aria-label="isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
        @click="uiStore.toggleNavMenu"
      >
        <i :class="isMobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
      </button>
    </div>

    <div
      class="mx-auto max-w-7xl overflow-hidden transition-all duration-200 md:hidden"
      :class="isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'"
    >
      <ul class="mt-3 space-y-2 border-t border-slate-200 pt-3">
        <li>
          <RouterLink
            to="/about"
            class="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            :class="isActive('/about') ? 'bg-slate-200 text-slate-900' : ''"
            @click="closeMenuOnSelect"
          >
            About
          </RouterLink>
        </li>
        <li v-if="authStore.isLoggedIn">
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            aria-label="Notifications"
            @click="closeMenuOnSelect"
          >
            <i class="pi pi-bell"></i>
            Notifications
          </button>
        </li>
        <li v-if="!authStore.isLoggedIn">
          <RouterLink
            to="/login"
            class="block rounded-lg border border-[#d7c8b2] bg-[#efe4d4] px-3 py-2 text-sm font-semibold text-[#5f4b32] transition-colors hover:bg-[#e7d8c3]"
            @click="closeMenuOnSelect"
          >
            Login
          </RouterLink>
        </li>
        <li v-if="!authStore.isLoggedIn">
          <RouterLink
            to="/register"
            class="block rounded-lg bg-[#f08a12] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#dd7f11]"
            @click="closeMenuOnSelect"
          >
            Register
          </RouterLink>
        </li>
        <li v-if="authStore.isLoggedIn && !authStore.isEmployee">
          <RouterLink
            to="/customer"
            class="block rounded-lg border border-[#d7c8b2] bg-[#efe4d4] px-3 py-2 text-sm font-semibold text-[#5f4b32] transition-colors hover:bg-[#e7d8c3]"
            :class="isActive('/customer') ? 'bg-[#e7d8c3] text-[#4a3821]' : ''"
            @click="closeMenuOnSelect"
          >
            Customer Dashboard
          </RouterLink>
        </li>
        <li v-if="authStore.isLoggedIn && authStore.isEmployee">
          <RouterLink
            to="/employee"
            class="block rounded-lg border border-[#d7c8b2] bg-[#efe4d4] px-3 py-2 text-sm font-semibold text-[#5f4b32] transition-colors hover:bg-[#e7d8c3]"
            :class="isActive('/employee') ? 'bg-[#e7d8c3] text-[#4a3821]' : ''"
            @click="closeMenuOnSelect"
          >
            Employee Dashboard
          </RouterLink>
        </li>
        <li v-if="authStore.isLoggedIn">
          <button
            type="button"
            class="block rounded-lg border border-[#d7c8b2] px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#e7d8c3]"
            @click="logOut"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>
