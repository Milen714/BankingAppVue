<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['approve', 'deny'])

const getStatusClass = () => {
  if (props.user.isApproved) {
    return 'bg-emerald-100 text-emerald-800'
  }
  return 'bg-orange-100 text-orange-800'
}

const getStatusLabel = () => {
  return props.user.isApproved ? 'Approved' : 'Pending'
}

const getStatusIcon = () => {
  return props.user.isApproved ? 'pi-check-circle' : 'pi-clock'
}

const getRoleLabel = role => {
  const roleMap = {
    ROLE_CUSTOMER: 'Customer',
    ROLE_EMPLOYEE: 'Employee',
    ROLE_ADMIN: 'Admin',
  }
  return roleMap[role] || role
}
</script>

<template>
  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
    <!-- First Name -->
    <td class="px-4 py-4 text-sm text-gray-900 font-medium">
      {{ user.firstName }}
    </td>

    <!-- Last Name -->
    <td class="px-4 py-4 text-sm text-gray-900">
      {{ user.lastName }}
    </td>

    <!-- Email -->
    <td class="px-4 py-4 text-sm text-gray-600">
      {{ user.email }}
    </td>

    <!-- Phone Number -->
    <td class="px-4 py-4 text-sm text-gray-600">
      {{ user.phoneNumber || 'N/A' }}
    </td>

    <!-- Role -->
    <td class="px-4 py-4 text-sm">
      <span
        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
      >
        {{ getRoleLabel(user.role) }}
      </span>
    </td>

    <!-- Status -->
    <td class="px-4 py-4 text-sm">
      <span
        :class="[
          'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold',
          getStatusClass(),
        ]"
      >
        <i :class="['pi', getStatusIcon()]"></i>
        {{ getStatusLabel() }}
      </span>
    </td>

    <!-- Actions -->
    <td class="flex flex-col items-center gap-2 px-4 py-4 text-sm text-right space-x-2">
      <button
        v-if="!user.isApproved"
        @click="emit('approve', user)"
        class="inline-flex items-center px-4 py-2 bg-orange-700 text-white text-xs font-medium rounded hover:bg-orange-800 transition-colors"
      >
        <i class="pi pi-check mr-1"></i>
        Approve
      </button>
      <button
        v-if="!user.isApproved"
        @click="emit('deny', user)"
        class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
      >
        <i class="pi pi-times mr-1"></i>
        Deny
      </button>
      <span v-else class="text-gray-400 text-xs">No actions available</span>
    </td>
  </tr>
</template>
