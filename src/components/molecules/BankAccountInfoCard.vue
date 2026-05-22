<script setup>
import { computed } from 'vue'

const props = defineProps({
  bankAccount: {
    type: Object,
    required: true,
  },
})

const ownerInitials = computed(() => {
  if (!props.bankAccount?.owner) return ''
  const first = props.bankAccount.owner.firstName?.[0]?.toUpperCase() || ''
  const last = props.bankAccount.owner.lastName?.[0]?.toUpperCase() || ''
  return first + last
})

const ownerFullName = computed(() => {
  if (!props.bankAccount?.owner) return ''
  return `${props.bankAccount.owner.firstName || ''} ${props.bankAccount.owner.lastName || ''}`.trim()
})

const getStatusClass = () => {
  const statusMap = {
    APPROVED: 'bg-emerald-100 text-emerald-800',
    PENDING: 'bg-orange-100 text-orange-800',
    PENDING_APPROVAL: 'bg-orange-100 text-orange-800',
    REJECTED: 'bg-red-100 text-red-800',
    SUSPENDED: 'bg-gray-100 text-gray-800',
  }
  return statusMap[props.bankAccount?.status] || 'bg-gray-100 text-gray-800'
}

const getStatusIcon = () => {
  const iconMap = {
    APPROVED: 'pi-check-circle',
    PENDING: 'pi-clock',
    PENDING_APPROVAL: 'pi-clock',
    REJECTED: 'pi-times-circle',
    SUSPENDED: 'pi-ban',
  }
  return iconMap[props.bankAccount?.status] || 'pi-info-circle'
}
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="flex items-start justify-between">
      <div class="flex-1 flex flex-col md:flex-row justify-between">
        <div>
          <p class="mb-1 text-xs font-semibold uppercase text-gray-500">Active Account</p>
          <div class="flex items-center gap-3 mb-6">
            <h3 class="text-2xl font-bold text-gray-900">{{ bankAccount?.title }}</h3>
            <span
              v-if="bankAccount?.status"
              :class="[
                'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold',
                getStatusClass(),
              ]"
            >
              <i :class="['pi', getStatusIcon()]"></i>
              {{ bankAccount?.status }}
            </span>
          </div>

          <div class="rounded-lg bg-[#f3e4dc] px-4 py-3 mb-3">
            <span class="font-mono font-medium text-lg text-gray-900">{{ bankAccount?.iban }}</span>
          </div>
          <div v-if="bankAccount?.owner" class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-[#cc570f] text-sm font-bold text-white"
            >
              {{ ownerInitials }}
            </div>
            <div>
              <p class="text-xs font-semibold uppercase text-gray-500">Account Owner</p>
              <p class="text-sm font-medium text-gray-900">{{ ownerFullName }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center">
          <div>
            <p class="text-xs font-semibold uppercase text-gray-500">Available Balance</p>
            <p class="text-3xl font-bold text-gray-900">
              EUR {{ bankAccount?.balance.toFixed(2) }}
            </p>
          </div>
          <div
            class="ml-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#b54d08] text-center text-2xl font-bold text-white"
          >
            <i class="pi pi-wallet"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
