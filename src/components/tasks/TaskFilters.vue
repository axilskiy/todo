<template>
  <div class="flex flex-wrap items-center gap-2">
    <div class="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        v-for="opt in statusOptions"
        :key="opt.value"
        @click="taskStore.setFilterStatus(opt.value)"
        :class="[
          'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
          taskStore.filterStatus === opt.value
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
        ]"
      >
        {{ opt.label }}
      </button>
    </div>

    <select
      :value="taskStore.filterCategory"
      @change="taskStore.setFilterCategory(($event.target as HTMLSelectElement).value)"
      class="input !py-1.5 !text-xs w-auto"
    >
      <option value="all">{{ t('filters.allCategories') }}</option>
      <option v-for="cat in categoryStore.allCategories" :key="cat.id" :value="cat.id">
        {{ cat.name }}
      </option>
    </select>

    <select
      :value="taskStore.filterPriority"
      @change="taskStore.setFilterPriority(($event.target as HTMLSelectElement).value)"
      class="input !py-1.5 !text-xs w-auto"
    >
      <option value="all">{{ t('filters.allPriorities') }}</option>
      <option value="high">{{ t('priority.high') }}</option>
      <option value="medium">{{ t('priority.medium') }}</option>
      <option value="low">{{ t('priority.low') }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTaskStore } from '@/stores/taskStore'
import { useCategoryStore } from '@/stores/categoryStore'
import type { FilterStatus } from '@/types'

const { t } = useI18n()
const taskStore = useTaskStore()
const categoryStore = useCategoryStore()

const statusOptions = computed<{ label: string; value: FilterStatus }[]>(() => [
  { label: t('filters.all'), value: 'all' },
  { label: t('filters.active'), value: 'active' },
  { label: t('filters.completed'), value: 'completed' },
])
</script>
