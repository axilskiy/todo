<template>
  <div class="space-y-4">
    <div class="card p-4 space-y-3">
      <div class="flex flex-wrap gap-3 items-center justify-between">
        <TaskSearch class="w-full sm:w-72" />
        <TaskSort />
      </div>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <TaskFilters />
        <button
          v-if="hasCompleted"
          @click="handleDeleteCompleted"
          class="btn-secondary text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {{ t('tasks.clearCompleted') }}
        </button>
      </div>
    </div>

    <div
      v-if="taskStore.filteredTasks.length > 0"
      class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <TransitionGroup name="task-list">
        <TaskCard
          v-for="task in taskStore.filteredTasks"
          :key="task.id"
          :task="task"
          @edit="openEdit"
          @delete="handleDelete"
        />
      </TransitionGroup>
    </div>

    <EmptyState
      v-else
      :title="t('tasks.noTasksFound')"
      :description="
        taskStore.searchQuery
          ? t('tasks.noTasksMatchQuery', { query: taskStore.searchQuery })
          : t('tasks.noTasksMatchFilters')
      "
    >
      <button class="btn-primary mt-4" @click="isFormOpen = true">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('tasks.createTask') }}
      </button>
    </EmptyState>

    <TaskForm
      v-if="isFormOpen"
      :edit-task="editingTask ?? undefined"
      @close="closeForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTaskStore } from '@/stores/taskStore'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import TaskFilters from '@/components/tasks/TaskFilters.vue'
import TaskSearch from '@/components/tasks/TaskSearch.vue'
import TaskSort from '@/components/tasks/TaskSort.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { Task } from '@/types'

const { t, n } = useI18n()
const taskStore = useTaskStore()
const toast = useToast()
const { confirm } = useConfirm()

const isFormOpen = ref(false)
const editingTask = ref<Task | null>(null)

const hasCompleted = computed(() => taskStore.tasks.some((t) => t.completed))

function openEdit(task: Task) {
  editingTask.value = task
  isFormOpen.value = true
}

function closeForm() {
  isFormOpen.value = false
  editingTask.value = null
}

async function handleDelete(id: string) {
  const ok = await confirm({
    title: t('confirm.deleteTask'),
    message: t('confirm.deleteTaskMessage'),
    confirmLabel: t('confirm.delete'),
    cancelLabel: t('confirm.cancel'),
    danger: true,
  })
  if (ok) {
    taskStore.deleteTask(id)
    toast.success(t('tasks.taskDeleted'))
  }
}

async function handleDeleteCompleted() {
  const count = taskStore.tasks.filter((t) => t.completed).length
  const ok = await confirm({
    title: t('confirm.clearCompleted'),
    message: t('confirm.clearCompletedMessage', count, { named: { count } }),
    confirmLabel: t('confirm.deleteAll'),
    cancelLabel: t('confirm.cancel'),
    danger: true,
  })
  if (ok) {
    taskStore.deleteCompletedTasks()
    toast.success(t('tasks.deletedCompleted', count, { named: { count } }))
  }
}
</script>

<style scoped>
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.25s ease;
}
.task-list-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.task-list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.task-list-move {
  transition: transform 0.3s ease;
}
</style>
