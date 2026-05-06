<script setup>
const items = [
  { key: 'Overview', label: 'Overview', icon: 'pi pi-th-large', active: true },
  { key: 'Bank Accounts', label: 'Bank Accounts', icon: 'pi pi-building-columns', active: false },
  { key: 'Transfers', label: 'Transfers', icon: 'pi pi-arrow-right-arrow-left', active: false },
  { key: 'Transactions', label: 'Transactions', icon: 'pi pi-receipt', active: false },
]
</script>

<template>
  <aside class="hidden w-[250px] shrink-0 border-r border-slate-200 bg-[#f5f6f7] md:flex md:flex-col">
    <div class="border-b border-slate-200 px-5 py-5">
      <p class="text-2xl font-semibold text-slate-900">Customer Portal</p>
      <p class="text-sm text-slate-500">Secure Banking</p>
    </div>

    <nav class="flex-1 px-3 py-5">
      <ul class="space-y-1.5">
        <li v-for="item in items" :key="item.key">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium"
            :class="item.active ? 'bg-[#f3e4dc] text-[#cc570f]' : 'text-slate-600 hover:bg-slate-100'"
          >
            <i :class="[item.icon, 'text-sm']"></i>
            {{ item.label }}
          </button>
        </li>
      </ul>
    </nav>

    <div class="border-t border-slate-200 px-4 py-4">
      <button type="button" class="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <i class="pi pi-cog"></i>
        Settings
      </button>
    </div>
  </aside>
</template>
