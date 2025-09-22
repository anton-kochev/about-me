<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Category {
  id: string
  name: string
}

const selectedCategory = ref('')
const categories = ref<Category[]>([])
const content = ref('')
const loading = ref(false)

// Available markdown files (this could be made dynamic with a build-time script)
const availableFiles = ['git', 'javascript', 'vue']

async function loadCategories() {
  const categoryList: Category[] = []

  for (const fileId of availableFiles) {
    try {
      // Fetch the markdown file to check if it exists
      const response = await fetch(`/cheat-sheets/${fileId}.md`)
      if (response.ok) {
        // Convert filename to display name
        const name = fileId.charAt(0).toUpperCase() + fileId.slice(1)
          .replace(/([A-Z])/g, ' $1')
          .replace('javascript', 'JavaScript')
          .replace('vue', 'Vue.js')

        categoryList.push({ id: fileId, name })
      }
    } catch (error) {
      console.warn(`Failed to load ${fileId}.md:`, error)
    }
  }

  categories.value = categoryList
  if (categoryList.length > 0 && !selectedCategory.value) {
    selectedCategory.value = categoryList[0].id
    await loadContent(categoryList[0].id)
  }
}

async function loadContent(categoryId: string) {
  loading.value = true
  try {
    const response = await fetch(`/cheat-sheets/${categoryId}.md`)
    if (response.ok) {
      content.value = await response.text()
    } else {
      content.value = `# ${categoryId} Cheat Sheet\n\nContent not found.`
    }
  } catch (error) {
    content.value = `# Error\n\nFailed to load content for ${categoryId}.`
  } finally {
    loading.value = false
  }
}

async function selectCategory(categoryId: string) {
  selectedCategory.value = categoryId
  await loadContent(categoryId)
}

onMounted(loadCategories)
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
            { 'cheat-sheets__nav-button--active': selectedCategory === category.id }
          ]"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </nav>
    </aside>

    <main class="cheat-sheets__content">
      <h1 v-if="selectedCategory" class="cheat-sheets__title">
        {{ categories.find((c) => c.id === selectedCategory)?.name }} Cheat Sheet
      </h1>
      <div class="cheat-sheets__body">
        <div v-if="loading" class="cheat-sheets__loading">
          Loading...
        </div>
        <pre v-else-if="content" class="cheat-sheets__markdown">{{ content }}</pre>
        <p v-else class="cheat-sheets__placeholder">Select a category to view cheat sheet content.</p>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped></style>
