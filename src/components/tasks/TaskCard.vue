<template>
  <div
    :class="[
      'card p-4 group transition-all duration-200 hover:shadow-md active:scale-[0.99]',
      task.completed ? 'opacity-70' : '',
    ]"
  >
    <div class="flex items-start gap-3">
      <button
        @click="taskStore.toggleComplete(task.id)"
        :class="[
          'flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
          task.completed
            ? 'border-primary-500 bg-primary-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400',
        ]"
      >
        <svg v-if="task.completed" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </button>

      <div class="flex-1 min-w-0">
        <h3
          :class="[
            'text-sm font-medium truncate',
            task.completed
              ? 'line-through text-gray-400 dark:text-gray-500'
              : 'text-gray-900 dark:text-white',
          ]"
        >
          {{ task.title }}
        </h3>
        <p v-if="task.description" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
          {{ task.description }}
        </p>
        <div class="flex flex-wrap items-center gap-2 mt-2">
          <PriorityBadge :priority="task.priority" />
          <CategoryBadge :category-id="task.categoryId" />
          <span class="text-xs text-gray-400 dark:text-gray-500 ml-auto">
            {{ formatDate(task.createdAt) }}
          </span>
        </div>
      </div>

      <!-- Actions: always visible on mobile, hover-reveal on desktop -->
      <div class="flex-shrink-0 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          @click="$emit('edit', task)"
          class="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
          title="Edit"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="$emit('delete', task.id)"
          class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          title="Delete"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Task } from '@/types'
import { useTaskStore } from '@/stores/taskStore'
import PriorityBadge from './PriorityBadge.vue'
import CategoryBadge from './CategoryBadge.vue'

defineProps<{ task: Task }>()
defineEmits<{
  edit: [task: Task]
  delete: [id: string]
}>()

const taskStore = useTaskStore()
const { locale } = useI18n()

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
    month: 'short',
    day: 'numeric',
  })
}
</script>
