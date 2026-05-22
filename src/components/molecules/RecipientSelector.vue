<script setup>
import { ref, computed } from 'vue'
import { useBankAccountStore } from '@/stores/bankAccount'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  myAccounts: {
    type: Array,
    required: true,
  },
  fromIban: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'recipient-selected'])

const bankAccountStore = useBankAccountStore()
const activeTab = ref('own') // 'own' or 'external'
const firstName = ref('')
const lastName = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const showDropdown = ref(false)
const selectedRecipient = ref(null)
let searchTimeout = null

// Available own accounts (exclude FROM account)
const availableOwnAccounts = computed(() => {
  console.log('Filtering own accounts, fromIban:', props.fromIban)
  console.log('My accounts:', props.myAccounts)
  console.log(
    'Filtered accounts:',
    bankAccountStore.myAccounts.filter(account => account.iban !== props.fromIban)
  )
  return bankAccountStore.myAccounts.filter(
    account => account.iban !== bankAccountStore.selectedAccount?.iban
  )
})

// Handle own account selection
const selectOwnAccount = account => {
  selectedRecipient.value = {
    iban: account.iban,
    title: account.title,
    type: 'own',
  }
  emit('update:modelValue', account.iban)
  emit('recipient-selected', selectedRecipient.value)
  showDropdown.value = false
}

// Debounced search for external recipients
const handleSearch = async () => {
  // Clear existing timeout
  if (searchTimeout) clearTimeout(searchTimeout)

  // Don't search if both fields are empty
  if (!firstName.value && !lastName.value) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      isSearching.value = true
      const results = await bankAccountStore.searchRecipientAccounts(
        firstName.value,
        lastName.value
      )
      searchResults.value = results || []
    } catch (error) {
      console.error('Search error:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 300) // Debounce for 300ms
}

// Handle external recipient selection
const selectExternalRecipient = account => {
  selectedRecipient.value = {
    iban: account.iban,
    title: account.ownerName,
    type: 'external',
  }
  emit('update:modelValue', account.iban)
  emit('recipient-selected', selectedRecipient.value)
  showDropdown.value = false
}

// Switch tabs
const switchTab = tab => {
  activeTab.value = tab
  showDropdown.value = false
  selectedRecipient.value = null
  firstName.value = ''
  lastName.value = ''
  searchResults.value = []
}

// Get display text for selected recipient
const displayText = computed(() => {
  if (selectedRecipient.value) {
    return `${selectedRecipient.value.title} - ${selectedRecipient.value.iban}`
  }
  return activeTab.value === 'own' ? 'Select an account' : 'Search for recipient'
})
</script>

<template>
  <div class="space-y-3">
    <!-- Tabs -->
    <div class="flex gap-2 border-b border-gray-200">
      <button
        @click="switchTab('own')"
        :class="[
          'px-4 py-2 font-medium text-sm transition-colors border-b-2',
          activeTab === 'own'
            ? 'border-[#cc570f] text-[#cc570f]'
            : 'border-transparent text-slate-600 hover:text-slate-900',
        ]"
      >
        Own Account
      </button>
      <button
        @click="switchTab('external')"
        :class="[
          'px-4 py-2 font-medium text-sm transition-colors border-b-2',
          activeTab === 'external'
            ? 'border-[#cc570f] text-[#cc570f]'
            : 'border-transparent text-slate-600 hover:text-slate-900',
        ]"
      >
        External Recipient
      </button>
    </div>

    <!-- Own Account Tab -->
    <div v-if="activeTab === 'own'" class="space-y-2">
      <label class="block text-sm font-semibold text-slate-900">SELECT ACCOUNT</label>
      <div class="relative">
        <button
          @click="showDropdown = !showDropdown"
          :disabled="disabled"
          class="w-full rounded-lg border border-[#e7c9bd] bg-white px-4 py-2.5 text-slate-900 text-left transition-colors focus:border-[#cc570f] focus:outline-none focus:ring-2 focus:ring-[#cc570f]/20 disabled:bg-slate-100 disabled:text-slate-500"
        >
          <div class="flex justify-between items-center">
            <span>{{ displayText }}</span>
            <i class="pi" :class="showDropdown ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
          </div>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="showDropdown && activeTab === 'own'"
          class="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e7c9bd] rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto"
        >
          <div v-if="availableOwnAccounts.length === 0" class="p-4 text-center text-slate-500">
            No other accounts available
          </div>
          <button
            v-for="account in availableOwnAccounts"
            :key="account.iban"
            @click.stop="selectOwnAccount(account)"
            type="button"
            class="w-full text-left px-4 py-3 hover:bg-[#f3e4dc] border-b border-gray-100 last:border-b-0 transition-colors"
          >
            <div class="font-medium text-slate-900">{{ account.title }}</div>
            <div class="text-sm text-slate-600 font-mono">{{ account.iban }}</div>
            <div class="text-xs text-slate-500 mt-1">EUR {{ account.balance.toFixed(2) }}</div>
          </button>
        </div>
      </div>
    </div>

    <!-- External Recipient Tab -->
    <div v-if="activeTab === 'external'" class="space-y-3">
      <!-- Search Fields -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">FIRST NAME</label>
          <input
            v-model="firstName"
            @input="handleSearch"
            :disabled="disabled"
            type="text"
            placeholder="e.g., John"
            class="w-full rounded-lg border border-[#e7c9bd] bg-white px-4 py-2.5 text-slate-900 transition-colors focus:border-[#cc570f] focus:outline-none focus:ring-2 focus:ring-[#cc570f]/20 disabled:bg-slate-100 disabled:text-slate-500"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">LAST NAME</label>
          <input
            v-model="lastName"
            @input="handleSearch"
            :disabled="disabled"
            type="text"
            placeholder="e.g., Smith"
            class="w-full rounded-lg border border-[#e7c9bd] bg-white px-4 py-2.5 text-slate-900 transition-colors focus:border-[#cc570f] focus:outline-none focus:ring-2 focus:ring-[#cc570f]/20 disabled:bg-slate-100 disabled:text-slate-500"
          />
        </div>
      </div>

      <!-- Recipient Results Dropdown -->
      <div v-if="firstName || lastName" class="relative">
        <div
          class="w-full border border-[#e7c9bd] rounded-lg bg-white shadow-sm"
          @click="showDropdown = !showDropdown"
        >
          <button
            class="w-full text-left px-4 py-2.5 flex justify-between items-center text-slate-900 hover:bg-[#f3e4dc] transition-colors"
          >
            <span v-if="isSearching" class="text-slate-600 text-sm">
              <i class="pi pi-spin pi-spinner mr-2"></i>Searching...
            </span>
            <span v-else-if="selectedRecipient" class="font-medium text-slate-900">
              {{ selectedRecipient.title }} - {{ selectedRecipient.iban }}
            </span>
            <span v-else class="text-slate-500 text-sm">
              {{
                searchResults.length > 0 ? `${searchResults.length} result(s) found` : 'No results'
              }}
            </span>
            <i class="pi" :class="showDropdown ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
          </button>

          <!-- Results Dropdown -->
          <div
            v-if="showDropdown && !isSearching && searchResults.length > 0"
            class="border-t border-gray-100 max-h-64 overflow-y-auto"
          >
            <button
              v-for="account in searchResults"
              :key="account.iban"
              @click.stop="selectExternalRecipient(account)"
              type="button"
              class="w-full text-left px-4 py-3 hover:bg-[#f3e4dc] border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div class="font-medium text-slate-900">
                {{ account.ownerName }}
              </div>
              <div class="text-sm text-slate-600 font-mono">{{ account.iban }}</div>
            </button>
          </div>

          <!-- No Results Message -->
          <div
            v-if="
              showDropdown && !isSearching && searchResults.length === 0 && (firstName || lastName)
            "
            class="border-t border-gray-100 p-4 text-center text-slate-500 text-sm"
          >
            No recipients found matching "{{ firstName }} {{ lastName }}"
          </div>
        </div>
      </div>

      <!-- Helper Text -->
      <p class="text-xs text-slate-500">Enter recipient's first and last name to search</p>
    </div>
  </div>
</template>
