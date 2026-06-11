import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: HomeView,
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/views/TasksView.vue'),
    },
    {
      path: '/kanban',
      name: 'kanban',
      component: () => import('@/views/KanbanView.vue'),
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/CategoriesView.vue'),
    },
  ],
})

export default router
