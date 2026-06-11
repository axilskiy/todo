<template>
  <!-- Sidebar: on mobile slides in/out as overlay; on desktop collapses to icon bar -->
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
      uiStore.isSidebarOpen
        ? 'w-60 translate-x-0'
        : 'w-60 -translate-x-full md:translate-x-0 md:w-16',
    ]"
  >
    <div class="flex items-center gap-3 px-4 py-5 border-b border-gray-200 dark:border-gray-800">
      <div class="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>
      <Transition name="fade">
        <span v-if="uiStore.isSidebarOpen" class="font-bold text-gray-900 dark:text-white text-lg whitespace-nowrap">TaskFlow</span>
      </Transition>
    </div>

    <nav class="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 group"
        :class="[
          $route.path === item.to
            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
        ]"
        :title="!uiStore.isSidebarOpen ? item.label : ''"
        @click="handleNavClick"
      >
        <component :is="item.icon" class="flex-shrink-0 w-5 h-5" />
        <Transition name="fade">
          <span v-if="uiStore.isSidebarOpen" class="whitespace-nowrap">{{ item.label }}</span>
        </Transition>
      </RouterLink>
    </nav>

    <div class="p-2 border-t border-gray-200 dark:border-gray-800 space-y-1">
      <button
        @click="uiStore.toggleTheme"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :title="!uiStore.isSidebarOpen ? t(uiStore.theme === 'dark' ? 'nav.lightMode' : 'nav.darkMode') : ''"
      >
        <SunIcon v-if="uiStore.theme === 'dark'" class="flex-shrink-0 w-5 h-5" />
        <MoonIcon v-else class="flex-shrink-0 w-5 h-5" />
        <Transition name="fade">
          <span v-if="uiStore.isSidebarOpen" class="whitespace-nowrap">
            {{ t(uiStore.theme === 'dark' ? 'nav.lightMode' : 'nav.darkMode') }}
          </span>
        </Transition>
      </button>

      <button
        @click="toggleLocale"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :title="!uiStore.isSidebarOpen ? (locale === 'ru' ? 'EN' : 'RU') : ''"
      >
        <GlobeIcon class="flex-shrink-0 w-5 h-5" />
        <Transition name="fade">
          <span v-if="uiStore.isSidebarOpen" class="whitespace-nowrap">
            {{ locale === 'ru' ? 'English' : 'Русский' }}
          </span>
        </Transition>
      </button>
    </div>
  </aside>

  <!-- Spacer: 0 on mobile when closed, w-16 on desktop when closed, w-60 when open -->
  <div
    :class="uiStore.isSidebarOpen ? 'w-60' : 'w-0 md:w-16'"
    class="transition-all duration-300 flex-shrink-0"
  />
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/uiStore'
import { setLocale } from '@/i18n'
import type { SupportedLocale } from '@/i18n'

const uiStore = useUiStore()
const { t, locale } = useI18n()

function toggleLocale() {
  const next: SupportedLocale = locale.value === 'en' ? 'ru' : 'en'
  setLocale(next)
}

function handleNavClick() {
  if (window.innerWidth < 768) {
    uiStore.isSidebarOpen = false
  }
}

const HomeIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
])

const TaskIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' })
])

const KanbanIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' })
])

const CategoryIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' })
])

const SunIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' })
])

const MoonIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' })
])

const GlobeIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
])

const navItems = computed(() => [
  { to: '/', label: t('nav.dashboard'), icon: HomeIcon },
  { to: '/tasks', label: t('nav.tasks'), icon: TaskIcon },
  { to: '/kanban', label: t('nav.kanban'), icon: KanbanIcon },
  { to: '/categories', label: t('nav.categories'), icon: CategoryIcon },
])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
