<template>
  <div class="space-y-4 max-w-2xl">
    <div class="card p-5">
      <h2 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        {{ editingCategory ? t('categories.editCategory') : t('categories.addCategory') }}
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label" for="cat-name">{{ t('categories.nameLabel') }}</label>
            <input
              id="cat-name"
              v-model="form.name"
              type="text"
              class="input"
              :placeholder="t('categories.namePlaceholder')"
              required
            />
          </div>
          <div>
            <label class="label" for="cat-color">{{ t('categories.colorLabel') }}</label>
            <div class="flex items-center gap-2">
              <input
                id="cat-color"
                v-model="form.color"
                type="color"
                class="h-10 w-16 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer bg-transparent p-1"
              />
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="preset in colorPresets"
                  :key="preset"
                  type="button"
                  @click="form.color = preset"
                  :style="{ backgroundColor: preset }"
                  :class="[
                    'w-6 h-6 rounded-full border-2 transition-transform hover:scale-110',
                    form.color === preset ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent',
                  ]"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            v-if="editingCategory"
            type="button"
            class="btn-secondary"
            @click="cancelEdit"
          >
            {{ t('categories.cancel') }}
          </button>
          <button
            type="submit"
            class="btn-primary"
            :disabled="!form.name.trim()"
          >
            {{ editingCategory ? t('categories.saveChanges') : t('categories.addCategory') }}
          </button>
        </div>
      </form>
    </div>

    <div class="card overflow-hidden">
      <div class="px-5 py-3 border-b border-gray-200 dark:border-gray-800">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
          {{ t('categories.title') }}
          <span class="ml-2 text-xs font-normal text-gray-500">({{ categoryStore.allCategories.length }})</span>
        </h2>
      </div>

      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <div
          v-for="cat in categoryStore.allCategories"
          :key="cat.id"
          class="flex items-center gap-4 px-5 py-3 group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div
            class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
            :style="{ backgroundColor: cat.color + '22' }"
          >
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: cat.color }" />
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ cat.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('categories.taskCount', getTaskCount(cat.id), { named: { count: getTaskCount(cat.id) } }) }}
              <span v-if="cat.isDefault" class="ml-1 text-primary-600 dark:text-primary-400">{{ t('categories.isDefault') }}</span>
            </p>
          </div>

          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click="startEdit(cat)"
              class="btn-ghost p-1.5 rounded-lg text-xs"
              :title="t('categories.editCategory')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              v-if="!cat.isDefault"
              @click="handleDelete(cat.id)"
              class="btn-ghost p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              :title="t('confirm.deleteCategory')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCategoryStore } from '@/stores/categoryStore'
import { useTaskStore } from '@/stores/taskStore'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import type { Category } from '@/types'

const { t } = useI18n()
const categoryStore = useCategoryStore()
const taskStore = useTaskStore()
const toast = useToast()
const { confirm } = useConfirm()

const editingCategory = ref<Category | null>(null)

const form = reactive({ name: '', color: '#3b82f6' })

const colorPresets = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#06b6d4', '#84cc16',
]

function getTaskCount(categoryId: string): number {
  return taskStore.tasks.filter((t) => t.categoryId === categoryId).length
}

function startEdit(cat: Category) {
  editingCategory.value = cat
  form.name = cat.name
  form.color = cat.color
}

function cancelEdit() {
  editingCategory.value = null
  form.name = ''
  form.color = '#3b82f6'
}

function handleSubmit() {
  if (!form.name.trim()) return
  if (editingCategory.value) {
    categoryStore.updateCategory(editingCategory.value.id, form.name.trim(), form.color)
    toast.success(t('categories.categoryUpdated'))
    cancelEdit()
  } else {
    categoryStore.addCategory(form.name.trim(), form.color)
    toast.success(t('categories.categoryCreated'))
    form.name = ''
    form.color = '#3b82f6'
  }
}

async function handleDelete(id: string) {
  const taskCount = getTaskCount(id)
  const ok = await confirm({
    title: t('confirm.deleteCategory'),
    message: taskCount > 0
      ? t('confirm.deleteCategoryWithTasks', taskCount, { named: { count: taskCount } })
      : t('confirm.deleteCategoryMessage'),
    confirmLabel: t('confirm.delete'),
    cancelLabel: t('confirm.cancel'),
    danger: true,
  })
  if (ok) {
    categoryStore.deleteCategory(id)
    toast.success(t('categories.categoryDeleted'))
  }
}
</script>
