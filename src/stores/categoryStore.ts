import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { DEFAULT_CATEGORIES } from '@/types'
import type { Category } from '@/types'

function generateId(): string {
  return crypto.randomUUID()
}

export const useCategoryStore = defineStore('categories', () => {
  const categories = useLocalStorage<Category[]>('taskflow-categories', DEFAULT_CATEGORIES)

  const allCategories = computed(() => categories.value)

  function getCategoryById(id: string): Category | undefined {
    return categories.value.find((c) => c.id === id)
  }

  function addCategory(name: string, color: string): Category {
    const category: Category = {
      id: generateId(),
      name,
      color,
      isDefault: false,
    }
    categories.value.push(category)
    return category
  }

  function updateCategory(id: string, name: string, color: string): void {
    const index = categories.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], name, color }
    }
  }

  function deleteCategory(id: string): void {
    const index = categories.value.findIndex((c) => c.id === id)
    if (index !== -1 && !categories.value[index].isDefault) {
      categories.value.splice(index, 1)
    }
  }

  return {
    categories,
    allCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
  }
})
