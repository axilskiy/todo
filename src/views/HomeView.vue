<template>
  <div class="space-y-6">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardCard
        :label="t('dashboard.totalTasks')"
        :value="stats.total"
        icon-bg="bg-blue-100 dark:bg-blue-900/30"
      >
        <template #icon>
          <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </template>
      </DashboardCard>

      <DashboardCard
        :label="t('dashboard.completed')"
        :value="stats.completed"
        icon-bg="bg-green-100 dark:bg-green-900/30"
      >
        <template #icon>
          <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </DashboardCard>

      <DashboardCard
        :label="t('dashboard.active')"
        :value="stats.active"
        icon-bg="bg-yellow-100 dark:bg-yellow-900/30"
      >
        <template #icon>
          <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </DashboardCard>

      <DashboardCard
        :label="t('dashboard.inProgress')"
        :value="stats.inProgress"
        icon-bg="bg-purple-100 dark:bg-purple-900/30"
      >
        <template #icon>
          <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </template>
      </DashboardCard>
    </div>

    <div class="card p-5">
      <h2 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">{{ t('dashboard.overallProgress') }}</h2>
      <ProgressBar
        :percentage="stats.completionRate"
        :label="t('dashboard.completionRate')"
        :show-percent="true"
        :color="progressColor"
      />
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {{ t('dashboard.tasksCompleted', { completed: stats.completed, total: stats.total }) }}
      </p>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <div class="card p-5">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">{{ t('dashboard.byPriority') }}</h2>
        <div class="space-y-3">
          <div v-for="p in priorityStats" :key="p.key" class="flex items-center gap-3">
            <span :class="['w-2.5 h-2.5 rounded-full flex-shrink-0', p.dot]" />
            <span class="text-sm text-gray-600 dark:text-gray-400 w-16">{{ p.label }}</span>
            <div class="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                :class="['h-full rounded-full transition-all duration-700', p.bar]"
                :style="{ width: stats.total > 0 ? `${(p.count / stats.total) * 100}%` : '0%' }"
              />
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white w-6 text-right">{{ p.count }}</span>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('dashboard.recentTasks') }}</h2>
          <RouterLink to="/tasks" class="text-xs text-primary-600 dark:text-primary-400 hover:underline">{{ t('dashboard.viewAll') }}</RouterLink>
        </div>
        <div v-if="recentTasks.length > 0" class="space-y-2">
          <div
            v-for="task in recentTasks"
            :key="task.id"
            class="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
          >
            <div
              :class="[
                'w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                task.completed ? 'bg-primary-500 border-primary-500' : 'border-gray-300 dark:border-gray-600',
              ]"
            >
              <svg v-if="task.completed" class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span
              :class="[
                'flex-1 text-sm truncate',
                task.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200',
              ]"
            >
              {{ task.title }}
            </span>
            <PriorityBadge :priority="task.priority" />
          </div>
        </div>
        <EmptyState
          v-else
          :title="t('dashboard.noTasks')"
          :description="t('dashboard.noTasksDesc')"
        />
      </div>
    </div>

    <div class="card p-5">
      <h2 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">{{ t('dashboard.byCategory') }}</h2>
      <div class="flex flex-wrap gap-3">
        <div
          v-for="cat in categoryStats"
          :key="cat.id"
          class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800"
        >
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: cat.color }" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ cat.name }}</span>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ cat.count }}</span>
        </div>
        <div
          v-if="categoryStats.length === 0"
          class="text-sm text-gray-400 dark:text-gray-500"
        >
          {{ t('dashboard.noTasksInCategories') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTaskStore } from '@/stores/taskStore'
import { useCategoryStore } from '@/stores/categoryStore'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import ProgressBar from '@/components/dashboard/ProgressBar.vue'
import PriorityBadge from '@/components/tasks/PriorityBadge.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const { t } = useI18n()
const taskStore = useTaskStore()
const categoryStore = useCategoryStore()

const stats = computed(() => taskStore.dashboardStats)

const progressColor = computed(() => {
  const rate = stats.value.completionRate
  if (rate >= 80) return 'green'
  if (rate >= 40) return 'primary'
  return 'yellow'
})

const recentTasks = computed(() => [...taskStore.tasks].slice(0, 5))

const priorityStats = computed(() => {
  const all = taskStore.tasks
  return [
    {
      key: 'high',
      label: t('priority.high'),
      count: all.filter((t) => t.priority === 'high').length,
      dot: 'bg-red-500',
      bar: 'bg-red-500',
    },
    {
      key: 'medium',
      label: t('priority.medium'),
      count: all.filter((t) => t.priority === 'medium').length,
      dot: 'bg-yellow-500',
      bar: 'bg-yellow-500',
    },
    {
      key: 'low',
      label: t('priority.low'),
      count: all.filter((t) => t.priority === 'low').length,
      dot: 'bg-green-500',
      bar: 'bg-green-500',
    },
  ]
})

const categoryStats = computed(() => {
  const all = taskStore.tasks
  return categoryStore.allCategories
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      count: all.filter((t) => t.categoryId === cat.id).length,
    }))
    .filter((c) => c.count > 0)
})
</script>
