import { ref } from 'vue'

interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

const isOpen = ref(false)
const options = ref<ConfirmOptions>({ title: '', message: '' })
let resolveCallback: ((value: boolean) => void) | null = null

export function useConfirm() {
  function confirm(opts: ConfirmOptions): Promise<boolean> {
    options.value = opts
    isOpen.value = true
    return new Promise((resolve) => {
      resolveCallback = resolve
    })
  }

  function onConfirm() {
    isOpen.value = false
    resolveCallback?.(true)
    resolveCallback = null
  }

  function onCancel() {
    isOpen.value = false
    resolveCallback?.(false)
    resolveCallback = null
  }

  return { confirm, isOpen, options, onConfirm, onCancel }
}
