<template>
  <div class="space-y-4">
    <div class="card p-4">
      <div class="flex flex-wrap gap-3 items-center justify-between">
        <TaskSearch class="w-full sm:w-64" />
        <div class="flex items-center gap-2">
          <select
            :value="taskStore.filterCategory"
            @change="taskStore.setFilterCategory(($event.target as HTMLSelectElement).value)"
            class="input !py-1.5 !text-xs w-auto"
          >
            <option value="all">{{ t('kanban.allCategories') }}</option>
            <option v-for="cat in categoryStore.allCategories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KanbanColumn
        v-for="col in columns"
        :key="col.status"
        :status="col.status"
        :tasks="getColumnTasks(col.status)"
        @drop="handleDrop"
        @edit-task="openEdit"
        @delete-task="handleDelete"
      />
    </div>

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
import { useCategoryStore } from '@/stores/categoryStore'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import KanbanColumn from '@/components/kanban/KanbanColumn.vue'
import TaskSearch from '@/components/tasks/TaskSearch.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import type { Task, TaskStatus } from '@/types'

const { t } = useI18n()
const taskStore = useTaskStore()
const categoryStore = useCategoryStore()
const toast = useToast()
const { confirm } = useConfirm()

const isFormOpen = ref(false)
const editingTask = ref<Task | null>(null)

const columns: { status: TaskStatus }[] = [
  { status: 'todo' },
  { status: 'in-progress' },
  { status: 'done' },
]

const searchQuery = computed(() => taskStore.searchQuery.toLowerCase().trim())

function getColumnTasks(status: TaskStatus): Task[] {
  let tasks = taskStore.tasksByStatus[status]
  if (taskStore.filterCategory !== 'all') {
    tasks = tasks.filter((t) => t.categoryId === taskStore.filterCategory)
  }
  if (searchQuery.value) {
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.value) ||
        t.description.toLowerCase().includes(searchQuery.value),
    )
  }
  return tasks
}

function handleDrop(taskId: string, status: TaskStatus) {
  const task = taskStore.getTaskById(taskId)
  if (!task || task.status === status) return
  taskStore.moveTask(taskId, status)
  const statusLabel = t(`status.${status === 'in-progress' ? 'inProgress' : status}`)
  toast.info(t('kanban.movedTo', { status: statusLabel }))
}

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
    message: t('confirm.deleteTaskShort'),
    confirmLabel: t('confirm.delete'),
    cancelLabel: t('confirm.cancel'),
    danger: true,
  })
  if (ok) {
    taskStore.deleteTask(id)
    toast.success(t('tasks.taskDeleted'))
  }
}
</script>
