<script setup>
const items = [
  { key: 'home', label: 'Home', icon: 'pi pi-home', active: true },
  { key: 'accounts', label: 'Accounts', icon: 'pi pi-id-card', active: false },
  { key: 'transfer', label: 'Transfer', icon: 'pi pi-arrow-right-arrow-left', active: false },
  { key: 'history', label: 'History', icon: 'pi pi-history', active: false },
  { key: 'settings', label: 'Settings', icon: 'pi pi-cog', active: false },
]
</script>

<template>
  <nav class="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-[#f5f6f7] px-2 py-2 md:hidden">
    <ul class="grid grid-cols-5 gap-1">
      <li v-for="item in items" :key="item.key">
        <button
          type="button"
          class="flex w-full flex-col items-center justify-center rounded-lg py-1 text-[10px] font-semibold uppercase tracking-wide"
          :class="item.active ? 'text-[#d75d14]' : 'text-slate-400'"
        >
          <i :class="[item.icon, 'mb-1 text-sm']"></i>
          {{ item.label }}
        </button>
      </li>
    </ul>
  </nav>
</template>
