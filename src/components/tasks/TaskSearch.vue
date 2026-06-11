<template>
  <div class="relative">
    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      :value="taskStore.searchQuery"
      @input="taskStore.setSearchQuery(($event.target as HTMLInputElement).value)"
      type="text"
      class="input !pl-9 !pr-8"
      :placeholder="t('search.placeholder')"
    />
    <button
      v-if="taskStore.searchQuery"
      @click="taskStore.setSearchQuery('')"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
    >
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTaskStore } from '@/stores/taskStore'

const { t } = useI18n()
const taskStore = useTaskStore()
</script>
