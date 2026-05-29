<script setup>
defineProps({
  ibanSearch: {
    type: String,
    default: '',
  },
  startDateFilter: {
    type: String,
    default: '',
  },
  endDateFilter: {
    type: String,
    default: '',
  },
  typeFilter: {
    type: String,
    default: 'All',
  },
  amountComparisonType: {
    type: String,
    default: 'Eq',
  },
  amountValue: {
    type: [String, Number],
    default: '',
  },
  hideIbanField: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:ibanSearch',
  'update:startDateFilter',
  'update:endDateFilter',
  'update:typeFilter',
  'update:amountComparisonType',
  'update:amountValue',
  'search',
])

const updateIban = value => {
  emit('update:ibanSearch', value)
}

const updateStartDate = value => {
  emit('update:startDateFilter', value)
  emit('search')
}

const updateEndDate = value => {
  emit('update:endDateFilter', value)
  emit('search')
}

const updateType = value => {
  emit('update:typeFilter', value)
  emit('search')
}

const updateAmountComparison = value => {
  emit('update:amountComparisonType', value)
  emit('search')
}

const updateAmountValue = value => {
  emit('update:amountValue', value)
  emit('search')
}

const clearFilters = () => {
  emit('update:ibanSearch', '')
  emit('update:startDateFilter', '')
  emit('update:endDateFilter', '')
  emit('update:typeFilter', 'All')
  emit('update:amountComparisonType', 'Eq')
  emit('update:amountValue', '')
}

const handleSearch = () => {
  emit('search')
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      <!-- IBAN Search -->
      <div v-if="!hideIbanField">
        <label class="block text-xs font-semibold text-gray-700 uppercase mb-2"> IBAN </label>
        <div class="relative">
          <i class="pi pi-search absolute left-3 top-3 text-gray-400 text-sm"></i>
          <input
            :value="ibanSearch"
            @input="updateIban($event.target.value)"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Search IBAN..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <!-- Start Date Filter -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 uppercase mb-2"> Start Date </label>
        <input
          :value="startDateFilter"
          @change="updateStartDate($event.target.value)"
          type="date"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <!-- End Date Filter -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 uppercase mb-2"> End Date </label>
        <input
          :value="endDateFilter"
          @change="updateEndDate($event.target.value)"
          type="date"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <!-- Transaction Type Filter -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 uppercase mb-2">
          Transaction Type
        </label>
        <select
          :value="typeFilter"
          @change="updateType($event.target.value)"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option>All</option>
          <option value="DEPOSIT">Deposit</option>
          <option value="TRANSFER">Transfer</option>
          <option value="WITHDRAWAL">Withdrawal</option>
        </select>
      </div>

      <!-- Amount Filter (Combined) -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 uppercase mb-2">Amount</label>
        <div class="flex gap-2">
          <select
            :value="amountComparisonType"
            @change="updateAmountComparison($event.target.value)"
            class="w-32 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="Eq">Equals</option>
            <option value="Lt">Less Than</option>
            <option value="Gt">Greater Than</option>
          </select>
          <input
            :value="amountValue"
            @change="updateAmountValue($event.target.value)"
            type="number"
            placeholder="Enter amount..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3 mt-4 pt-4 border-t border-gray-200">
      <button
        @click="clearFilters"
        class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        Clear Filters
      </button>
      <button
        @click="handleSearch"
        class="px-6 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        Search
      </button>
    </div>
  </div>
</template>
