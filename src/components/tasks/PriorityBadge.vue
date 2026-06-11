<template>
  <span :class="['badge', styles[priority].badge]">
    <span :class="['w-1.5 h-1.5 rounded-full', styles[priority].dot]" />
    {{ t(`priority.${priority}`) }}
  </span>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Priority } from '@/types'

const { t } = useI18n()
defineProps<{ priority: Priority }>()

const styles: Record<Priority, { badge: string; dot: string }> = {
  high: {
    badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
  },
  medium: {
    badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500',
    dot: 'bg-yellow-500',
  },
  low: {
    badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    dot: 'bg-green-500',
  },
}
</script>
