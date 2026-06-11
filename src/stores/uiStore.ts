import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import type { Theme, ToastMessage } from '@/types'

function generateId(): string {
  return crypto.randomUUID()
}

export const useUiStore = defineStore('ui', () => {
  const theme = useLocalStorage<Theme>('taskflow-theme', 'light')
  const toasts = ref<ToastMessage[]>([])
  const isSidebarOpen = ref(typeof window !== 'undefined' ? window.innerWidth >= 768 : true)

  watch(
    theme,
    (val) => {
      if (val === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    { immediate: true },
  )

  function toggleTheme(): void {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function toggleSidebar(): void {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function addToast(toast: Omit<ToastMessage, 'id'>): void {
    const id = generateId()
    const duration = toast.duration ?? 3500
    toasts.value.push({ ...toast, id, duration })
    setTimeout(() => removeToast(id), duration)
  }

  function removeToast(id: string): void {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    theme,
    toasts,
    isSidebarOpen,
    toggleTheme,
    toggleSidebar,
    addToast,
    removeToast,
  }
})
