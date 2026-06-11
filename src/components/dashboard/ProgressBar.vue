<template>
  <div class="space-y-1.5">
    <div v-if="label || showPercent" class="flex justify-between items-center">
      <span v-if="label" class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</span>
      <span v-if="showPercent" class="text-sm font-semibold text-gray-900 dark:text-white">{{ percentage }}%</span>
    </div>
    <div class="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        :class="['h-full rounded-full transition-all duration-700 ease-out', colorClass]"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  percentage: number
  label?: string
  showPercent?: boolean
  color?: 'primary' | 'green' | 'yellow' | 'red'
}>()

const colorClass = computed(() => {
  const map = {
    primary: 'bg-primary-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }
  return map[props.color ?? 'primary']
})
</script>
