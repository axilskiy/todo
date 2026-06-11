import { useUiStore } from '@/stores/uiStore'

export function useToast() {
  const uiStore = useUiStore()

  function success(message: string) {
    uiStore.addToast({ type: 'success', message })
  }

  function error(message: string) {
    uiStore.addToast({ type: 'error', message })
  }

  function warning(message: string) {
    uiStore.addToast({ type: 'warning', message })
  }

  function info(message: string) {
    uiStore.addToast({ type: 'info', message })
  }

  return { success, error, warning, info }
}
