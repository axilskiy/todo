<template>
  <span
    v-if="category"
    class="badge"
    :style="{ backgroundColor: category.color + '22', color: category.color, borderColor: category.color + '44' }"
    style="border: 1px solid;"
  >
    {{ category.name }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'

const props = defineProps<{ categoryId: string }>()
const categoryStore = useCategoryStore()
const category = computed(() => categoryStore.getCategoryById(props.categoryId))
</script>
