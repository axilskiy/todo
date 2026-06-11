<template>
  <Teleport to="body">
    <!-- Full width on mobile (with margin), top-right on sm+ -->
    <div class="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-[360px] z-50 flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <ToastItem
          v-for="toast in uiStore.toasts"
          :key="toast.id"
          :toast="toast"
          class="pointer-events-auto"
          @dismiss="uiStore.removeToast(toast.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'
import ToastItem from './ToastItem.vue'

const uiStore = useUiStore()
</script>

<style>
.toast-enter-active {
  animation: slideInRight 0.3s ease-out;
}
.toast-leave-active {
  animation: slideOutRight 0.2s ease-in forwards;
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slideOutRight {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(100%); }
}
</style>
