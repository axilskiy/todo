<template>
  <div
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    :class="[
      'card p-3 cursor-grab active:cursor-grabbing group transition-all duration-150 hover:shadow-md select-none',
      isDragging ? 'opacity-40 scale-95' : '',
    ]"
  >
    <div class="flex items-start justify-between gap-2 mb-2">
      <h4
        :class="[
          'text-sm font-medium leading-tight',
          task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white',
        ]"
      >
        {{ task.title }}
      </h4>
      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          @click.stop="$emit('edit', task)"
          class="p-1 rounded text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click.stop="$emit('delete', task.id)"
          class="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <p v-if="task.description" class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
      {{ task.description }}
    </p>

    <div class="flex items-center justify-between gap-2 flex-wrap">
      <div class="flex items-center gap-1.5">
        <PriorityBadge :priority="task.priority" />
        <CategoryBadge :category-id="task.categoryId" />
      </div>
      <span class="text-xs text-gray-400 dark:text-gray-500">
        {{ formatDate(task.createdAt) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '@/types'
import PriorityBadge from '@/components/tasks/PriorityBadge.vue'
import CategoryBadge from '@/components/tasks/CategoryBadge.vue'

const props = defineProps<{ task: Task }>()
defineEmits<{
  edit: [task: Task]
  delete: [id: string]
}>()

const isDragging = ref(false)

function onDragStart(e: DragEvent) {
  isDragging.value = true
  e.dataTransfer?.setData('taskId', props.task.id)
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

function onDragEnd() {
  isDragging.value = false
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
