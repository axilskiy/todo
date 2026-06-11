<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="onCancel"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div class="relative card p-6 w-full max-w-md animate-slide-up">
          <div class="flex items-start gap-4">
            <div
              :class="[
                'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                options.danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30',
              ]"
            >
              <svg
                class="w-5 h-5"
                :class="options.danger ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">{{ options.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ options.message }}</p>
            </div>
          </div>
          <div class="flex gap-3 mt-6 justify-end">
            <button class="btn-secondary" @click="onCancel">
              {{ options.cancelLabel ?? 'Cancel' }}
            </button>
            <button
              :class="options.danger ? 'btn-danger' : 'btn-primary'"
              @click="onConfirm"
            >
              {{ options.confirmLabel ?? 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useConfirm } from '@/composables/useConfirm'

const { isOpen, options, onConfirm, onCancel } = useConfirm()
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
