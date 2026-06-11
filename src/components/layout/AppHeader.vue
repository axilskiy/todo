<template>
  <header
    class="sticky top-0 z-30 flex items-center gap-2 px-3 md:px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 transition-all duration-300"
  >
    <button
      @click="uiStore.toggleSidebar"
      class="btn-ghost p-2 rounded-lg flex-shrink-0"
      :title="t('header.toggleSidebar')"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div class="flex-1 min-w-0">
      <h1 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate">{{ pageTitle }}</h1>
    </div>

    <button
      @click="openCreateTask"
      class="btn-primary flex-shrink-0"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span class="hidden sm:inline">{{ t('header.newTask') }}</span>
    </button>
  </header>

  <TaskForm
    v-if="isFormOpen"
    @close="isFormOpen = false"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/uiStore'
import TaskForm from '@/components/tasks/TaskForm.vue'

const uiStore = useUiStore()
const route = useRoute()
const { t } = useI18n()
const isFormOpen = ref(false)

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    '/': t('pages.dashboard'),
    '/tasks': t('pages.tasks'),
    '/kanban': t('pages.kanban'),
    '/categories': t('pages.categories'),
  }
  return map[route.path] ?? 'TaskFlow'
})

function openCreateTask() {
  isFormOpen.value = true
}
</script>
