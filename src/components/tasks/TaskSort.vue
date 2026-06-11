<template>
  <div class="flex items-center gap-2">
    <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{{ t('sort.sortBy') }}</span>
    <div class="flex gap-1">
      <button
        v-for="opt in sortOptions"
        :key="opt.field"
        @click="taskStore.setSortField(opt.field)"
        :class="[
          'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
          taskStore.sortField === opt.field
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
        ]"
      >
        {{ opt.label }}
        <svg
          v-if="taskStore.sortField === opt.field"
          :class="['w-3 h-3 transition-transform', taskStore.sortOrder === 'desc' ? 'rotate-180' : '']"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTaskStore } from '@/stores/taskStore'
import type { SortField } from '@/types'

const { t } = useI18n()
const taskStore = useTaskStore()

const sortOptions = computed<{ label: string; field: SortField }[]>(() => [
  { label: t('sort.date'), field: 'createdAt' },
  { label: t('sort.priority'), field: 'priority' },
  { label: t('sort.name'), field: 'title' },
])
</script>
