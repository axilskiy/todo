<template>
  <Teleport to="body">
    <!-- Bottom-sheet on mobile, centered modal on sm+ -->
    <div
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      @click.self="$emit('close')"
    >
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')" />
      <div class="relative card w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-xl animate-slide-up flex flex-col">
        <div class="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">
            {{ editTask ? t('taskForm.editTask') : t('taskForm.newTask') }}
          </h2>
          <button @click="$emit('close')" class="btn-ghost p-1.5 rounded-lg !min-h-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="px-4 sm:px-6 py-4 space-y-4 overflow-y-auto">
          <div>
            <label class="label" for="task-title">{{ t('taskForm.titleLabel') }}</label>
            <input
              id="task-title"
              v-model="form.title"
              type="text"
              class="input"
              :placeholder="t('taskForm.titlePlaceholder')"
              required
              autofocus
            />
          </div>

          <div>
            <label class="label" for="task-desc">{{ t('taskForm.descriptionLabel') }}</label>
            <textarea
              id="task-desc"
              v-model="form.description"
              class="input resize-none !min-h-0"
              rows="3"
              :placeholder="t('taskForm.descriptionPlaceholder')"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label" for="task-category">{{ t('taskForm.categoryLabel') }}</label>
              <select id="task-category" v-model="form.categoryId" class="input">
                <option v-for="cat in categoryStore.allCategories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="label" for="task-priority">{{ t('taskForm.priorityLabel') }}</label>
              <select id="task-priority" v-model="form.priority" class="input">
                <option value="low">{{ t('priority.low') }}</option>
                <option value="medium">{{ t('priority.medium') }}</option>
                <option value="high">{{ t('priority.high') }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="label" for="task-status">{{ t('taskForm.statusLabel') }}</label>
            <select id="task-status" v-model="form.status" class="input">
              <option value="todo">{{ t('status.todo') }}</option>
              <option value="in-progress">{{ t('status.inProgress') }}</option>
              <option value="done">{{ t('status.done') }}</option>
            </select>
          </div>

          <!-- Full-width stacked buttons on mobile, side-by-side on sm+ -->
          <div class="flex flex-col-reverse sm:flex-row gap-3 pt-2 pb-1">
            <button type="button" class="btn-secondary w-full sm:flex-1" @click="$emit('close')">{{ t('taskForm.cancel') }}</button>
            <button type="submit" class="btn-primary w-full sm:flex-1" :disabled="!form.title.trim()">
              {{ editTask ? t('taskForm.saveChanges') : t('taskForm.createTask') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTaskStore } from '@/stores/taskStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useToast } from '@/composables/useToast'
import type { Task, TaskFormData } from '@/types'

const { t } = useI18n()
const props = defineProps<{ editTask?: Task }>()
const emit = defineEmits<{ close: [] }>()

const taskStore = useTaskStore()
const categoryStore = useCategoryStore()
const toast = useToast()

const defaultCategoryId = categoryStore.allCategories[0]?.id ?? ''

const form = reactive<TaskFormData>({
  title: '',
  description: '',
  categoryId: defaultCategoryId,
  priority: 'medium',
  status: 'todo',
})

onMounted(() => {
  if (props.editTask) {
    form.title = props.editTask.title
    form.description = props.editTask.description
    form.categoryId = props.editTask.categoryId
    form.priority = props.editTask.priority
    form.status = props.editTask.status
  }
})

function handleSubmit() {
  if (!form.title.trim()) return
  if (props.editTask) {
    taskStore.updateTask(props.editTask.id, { ...form })
    toast.success(t('taskForm.taskUpdated'))
  } else {
    taskStore.addTask({ ...form })
    toast.success(t('taskForm.taskCreated'))
  }
  emit('close')
}
</script>
