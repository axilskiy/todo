export type Priority = 'low' | 'medium' | 'high'
export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type Theme = 'light' | 'dark'
export type SortField = 'createdAt' | 'priority' | 'title'
export type SortOrder = 'asc' | 'desc'
export type FilterStatus = 'all' | 'active' | 'completed'

export interface Category {
  id: string
  name: string
  color: string
  isDefault: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  categoryId: string
  priority: Priority
  status: TaskStatus
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description: string
  categoryId: string
  priority: Priority
  status: TaskStatus
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export interface DashboardStats {
  total: number
  completed: number
  active: number
  inProgress: number
  completionRate: number
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Todo',
  'in-progress': 'In Progress',
  done: 'Done',
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: '#3b82f6', isDefault: true },
  { id: 'study', name: 'Study', color: '#8b5cf6', isDefault: true },
  { id: 'personal', name: 'Personal', color: '#10b981', isDefault: true },
]
