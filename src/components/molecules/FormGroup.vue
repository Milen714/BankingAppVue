<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  helperText: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const handleInput = event => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div>
    <label class="mb-2 block text-sm font-semibold text-slate-900">{{ label }}</label>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      v-bind="$attrs"
      @input="handleInput"
      class="w-full rounded-lg border px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors"
      :class="
        error
          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20'
          : 'border-[#e7c9bd] bg-white focus:border-[#cc570f] focus:outline-none focus:ring-2 focus:ring-[#cc570f]/20'
      "
    />
    <p v-if="error" class="mt-1.5 text-xs text-red-600">{{ error }}</p>
    <p v-else-if="helperText" class="mt-1.5 text-xs text-slate-500">{{ helperText }}</p>
  </div>
</template>
