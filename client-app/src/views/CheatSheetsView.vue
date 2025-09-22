<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { marked } from 'marked'
import { useCheatSheetsStore } from '@/stores/cheatSheets'

const cheatSheetsStore = useCheatSheetsStore()

// Use storeToRefs to maintain reactivity for state and getters
const {
  categories,
  selectedCategoryId,
  selectedCategory,
  isLoading,
  currentContent,
  hasError,
  errorMessage
} = storeToRefs(cheatSheetsStore)

// Actions can be destructured normally (they don't need reactivity)
const {
  selectCategory,
  loadCategories,
  refreshCurrentContent
} = cheatSheetsStore

// Convert markdown to HTML
const htmlContent = computed(() => {
  if (!currentContent.value) return ''
  return marked(currentContent.value)
})

onMounted(() => {
  loadCategories()
})
</script>

<template>
  <div class="cheat-sheets">
    <aside class="cheat-sheets__sidebar">
      <nav class="cheat-sheets__nav">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="[
            'cheat-sheets__nav-button',
            { 'cheat-sheets__nav-button--active': selectedCategoryId === category.id }
          ]"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </nav>
    </aside>

    <main class="cheat-sheets__content">
      <h1 v-if="selectedCategory" class="cheat-sheets__title">
        {{ selectedCategory.name }} Cheat Sheet
      </h1>
      <div class="cheat-sheets__body">
        <div v-if="isLoading" class="cheat-sheets__loading">
          Loading...
        </div>
        <div v-else-if="hasError" class="cheat-sheets__error">
          <p>{{ errorMessage }}</p>
          <button @click="refreshCurrentContent()" class="cheat-sheets__retry-btn">
            Retry
          </button>
        </div>
        <div v-else-if="htmlContent" class="cheat-sheets__content-html" v-html="htmlContent"></div>
        <p v-else class="cheat-sheets__placeholder">Select a category to view cheat sheet content.</p>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped></style>
