<template>
  <div class="card p-3 sm:p-5 flex items-center sm:items-start gap-3 sm:gap-4 hover:shadow-md transition-shadow duration-200">
    <div :class="['w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0', iconBg]">
      <slot name="icon" />
    </div>
    <div class="min-w-0">
      <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">{{ label }}</p>
      <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{{ value }}</p>
      <p v-if="sub" class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{{ sub }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  sub?: string
  iconBg: string
}>()
</script>
