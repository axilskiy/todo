<template>
  <div
    :class="[
      'flex flex-col rounded-xl border-2 transition-colors duration-150 min-h-[500px]',
      isDragOver
        ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-900/10'
        : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50',
    ]"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div :class="['flex items-center justify-between px-4 py-3 border-b', borderColorClass]">
      <div class="flex items-center gap-2">
        <div :class="['w-2.5 h-2.5 rounded-full', dotColorClass]" />
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ columnLabel }}</h3>
        <span class="ml-1 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
          {{ tasks.length }}
        </span>
      </div>
    </div>

    <div class="flex-1 p-3 space-y-2 overflow-y-auto">
      <TransitionGroup name="kanban-item">
        <KanbanCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @edit="$emit('editTask', task)"
          @delete="$emit('deleteTask', task.id)"
        />
      </TransitionGroup>

      <div
        v-if="tasks.length === 0"
        class="flex flex-col items-center justify-center py-10 text-center"
      >
        <div class="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p class="text-xs text-gray-400 dark:text-gray-500">{{ t('kanban.dropTasksHere') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Task, TaskStatus } from '@/types'
import KanbanCard from './KanbanCard.vue'

const { t } = useI18n()

const props = defineProps<{
  status: TaskStatus
  tasks: Task[]
}>()

const emit = defineEmits<{
  drop: [taskId: string, status: TaskStatus]
  editTask: [task: Task]
  deleteTask: [id: string]
}>()

const isDragOver = ref(false)

const columnLabel = computed(() => {
  const map: Record<TaskStatus, string> = {
    todo: t('status.todo'),
    'in-progress': t('status.inProgress'),
    done: t('status.done'),
  }
  return map[props.status]
})

const dotColorClass = computed(() => {
  const map: Record<TaskStatus, string> = {
    todo: 'bg-gray-400',
    'in-progress': 'bg-yellow-500',
    done: 'bg-green-500',
  }
  return map[props.status]
})

const borderColorClass = computed(() => {
  const map: Record<TaskStatus, string> = {
    todo: 'border-gray-200 dark:border-gray-800',
    'in-progress': 'border-yellow-200 dark:border-yellow-900',
    done: 'border-green-200 dark:border-green-900',
  }
  return map[props.status]
})

function onDragOver(e: DragEvent) {
  isDragOver.value = true
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(e: DragEvent) {
  isDragOver.value = false
  const taskId = e.dataTransfer?.getData('taskId')
  if (taskId) {
    emit('drop', taskId, props.status)
  }
}
</script>

<style scoped>
.kanban-item-enter-active,
.kanban-item-leave-active {
  transition: all 0.2s ease;
}
.kanban-item-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.kanban-item-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
