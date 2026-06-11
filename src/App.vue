<template>
  <div class="min-h-screen flex overflow-x-hidden">
    <!-- Mobile backdrop -->
    <Transition name="fade">
      <div
        v-if="uiStore.isSidebarOpen"
        class="fixed inset-0 z-30 bg-black/50 md:hidden"
        @click="uiStore.toggleSidebar"
      />
    </Transition>

    <AppSidebar />
    <div class="flex-1 flex flex-col min-w-0 transition-all duration-300">
      <AppHeader />
      <main class="flex-1 p-4 md:p-6 overflow-auto">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
    <ToastContainer />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const uiStore = useUiStore()
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
