<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
      <svg class="w-10 h-10 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          :d="icon ?? 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'" />
      </svg>
    </div>
    <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">{{ title }}</h3>
    <p class="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon?: string
}>()
</script>
