import { ref, watch } from 'vue'
import type { Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const storedValue = localStorage.getItem(key)
  const initial: T = storedValue !== null ? (JSON.parse(storedValue) as T) : defaultValue

  const state = ref<T>(initial) as Ref<T>

  watch(
    state,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true },
  )

  return state
}
