import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { PRIORITY_ORDER } from '@/types'
import type {
  Task,
  TaskFormData,
  TaskStatus,
  FilterStatus,
  SortField,
  SortOrder,
  DashboardStats,
} from '@/types'

function generateId(): string {
  return crypto.randomUUID()
}

export const useTaskStore = defineStore('tasks', () => {
  const tasks = useLocalStorage<Task[]>('taskflow-tasks', [])
  const filterStatus = ref<FilterStatus>('all')
  const filterCategory = ref<string>('all')
  const filterPriority = ref<string>('all')
  const searchQuery = ref('')
  const sortField = ref<SortField>('createdAt')
  const sortOrder = ref<SortOrder>('desc')

  const filteredTasks = computed<Task[]>(() => {
    let result = [...tasks.value]

    if (filterStatus.value === 'active') {
      result = result.filter((t) => !t.completed)
    } else if (filterStatus.value === 'completed') {
      result = result.filter((t) => t.completed)
    }

    if (filterCategory.value !== 'all') {
      result = result.filter((t) => t.categoryId === filterCategory.value)
    }

    if (filterPriority.value !== 'all') {
      result = result.filter((t) => t.priority === filterPriority.value)
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
      )
    }

    result.sort((a, b) => {
      let comparison = 0
      if (sortField.value === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortField.value === 'priority') {
        comparison = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      } else if (sortField.value === 'title') {
        comparison = a.title.localeCompare(b.title)
      }
      return sortOrder.value === 'asc' ? comparison : -comparison
    })

    return result
  })

  const tasksByStatus = computed(() => ({
    todo: tasks.value.filter((t) => t.status === 'todo'),
    'in-progress': tasks.value.filter((t) => t.status === 'in-progress'),
    done: tasks.value.filter((t) => t.status === 'done'),
  }))

  const dashboardStats = computed<DashboardStats>(() => {
    const total = tasks.value.length
    const completed = tasks.value.filter((t) => t.completed).length
    const active = tasks.value.filter((t) => !t.completed).length
    const inProgress = tasks.value.filter((t) => t.status === 'in-progress').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, active, inProgress, completionRate }
  })

  function addTask(data: TaskFormData): Task {
    const now = new Date().toISOString()
    const task: Task = {
      id: generateId(),
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      priority: data.priority,
      status: data.status,
      completed: data.status === 'done',
      createdAt: now,
      updatedAt: now,
    }
    tasks.value.unshift(task)
    return task
  }

  function updateTask(id: string, data: Partial<TaskFormData>): void {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index === -1) return
    const updated = {
      ...tasks.value[index],
      ...data,
      completed: data.status !== undefined ? data.status === 'done' : tasks.value[index].completed,
      updatedAt: new Date().toISOString(),
    }
    tasks.value[index] = updated
  }

  function deleteTask(id: string): void {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index !== -1) tasks.value.splice(index, 1)
  }

  function toggleComplete(id: string): void {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    task.completed = !task.completed
    task.status = task.completed ? 'done' : 'todo'
    task.updatedAt = new Date().toISOString()
  }

  function moveTask(id: string, status: TaskStatus): void {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    task.status = status
    task.completed = status === 'done'
    task.updatedAt = new Date().toISOString()
  }

  function deleteCompletedTasks(): void {
    tasks.value = tasks.value.filter((t) => !t.completed)
  }

  function getTaskById(id: string): Task | undefined {
    return tasks.value.find((t) => t.id === id)
  }

  function setSearchQuery(q: string): void {
    searchQuery.value = q
  }

  function setFilterStatus(status: FilterStatus): void {
    filterStatus.value = status
  }

  function setFilterCategory(id: string): void {
    filterCategory.value = id
  }

  function setFilterPriority(priority: string): void {
    filterPriority.value = priority
  }

  function setSortField(field: SortField): void {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortOrder.value = 'asc'
    }
  }

  return {
    tasks,
    filteredTasks,
    tasksByStatus,
    dashboardStats,
    filterStatus,
    filterCategory,
    filterPriority,
    searchQuery,
    sortField,
    sortOrder,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    moveTask,
    deleteCompletedTasks,
    getTaskById,
    setSearchQuery,
    setFilterStatus,
    setFilterCategory,
    setFilterPriority,
    setSortField,
  }
})
