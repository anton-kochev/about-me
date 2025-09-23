import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface Category {
  id: string
}

export interface CheatSheetState {
  content: string
  loading: boolean
  error: string | null
  lastLoaded: number
}

export const useCheatSheetsStore = defineStore('cheatSheets', () => {
  // State
  const categories = ref<Category[]>([])
  const selectedCategoryId = ref('')
  const cheatSheets = ref<Record<string, CheatSheetState>>({})
  const availableFiles = ['angular-senior-interview-brief']

  // Getters
  const selectedCategory = computed(() => {
    return categories.value.find((cat) => cat.id === selectedCategoryId.value)
  })

  const currentCheatSheet = computed(() => {
    return selectedCategoryId.value
      ? cheatSheets.value[selectedCategoryId.value]
      : null
  })

  const isLoading = computed(() => {
    return currentCheatSheet.value?.loading ?? false
  })

  const currentContent = computed(() => {
    return currentCheatSheet.value?.content ?? ''
  })

  const hasError = computed(() => {
    return currentCheatSheet.value?.error !== null
  })

  const errorMessage = computed(() => {
    return currentCheatSheet.value?.error ?? ''
  })

  // Actions
  function initializeCheatSheetState(): CheatSheetState {
    return {
      content: '',
      loading: false,
      error: null,
      lastLoaded: 0,
    }
  }

  function getOrCreateCheatSheet(categoryId: string): CheatSheetState {
    if (!cheatSheets.value[categoryId]) {
      cheatSheets.value[categoryId] = initializeCheatSheetState()
    }
    return cheatSheets.value[categoryId]
  }

  async function loadCategories() {
    const categoryList: Category[] = []

    for (const fileId of availableFiles) {
      try {
        // Initialize state for each category
        getOrCreateCheatSheet(fileId)

        // Fetch the markdown file to check if it exists
        const response = await fetch(`/cheat-sheets/${fileId}.md`)
        if (response.ok) {
          categoryList.push({ id: fileId })
        }
      } catch (error) {
        console.warn(`Failed to load ${fileId}.md:`, error)
        const state = getOrCreateCheatSheet(fileId)
        state.error = `Failed to check availability: ${error}`
      }
    }

    categories.value = categoryList

    // Auto-select first category if none selected
    if (categoryList.length > 0 && !selectedCategoryId.value) {
      await selectCategory(categoryList[0].id)
    }
  }

  async function loadContent(categoryId: string, forceReload = false) {
    const state = getOrCreateCheatSheet(categoryId)

    // Check if content is already loaded and not forcing reload
    if (!forceReload && state.content && !state.error) {
      return
    }

    state.loading = true
    state.error = null

    try {
      const response = await fetch(`/cheat-sheets/${categoryId}.md`)
      if (response.ok) {
        state.content = await response.text()
        state.lastLoaded = Date.now()
      } else {
        state.error = `Content not found (${response.status})`
        state.content = `# ${categoryId} Cheat Sheet\n\nContent not found.`
      }
    } catch (error) {
      state.error = `Failed to load content: ${error}`
      state.content = `# Error\n\nFailed to load content for ${categoryId}.`
    } finally {
      state.loading = false
    }
  }

  async function selectCategory(categoryId: string) {
    selectedCategoryId.value = categoryId
    await loadContent(categoryId)
  }

  async function refreshCurrentContent() {
    if (selectedCategoryId.value) {
      await loadContent(selectedCategoryId.value, true)
    }
  }

  function resetStore() {
    categories.value = []
    selectedCategoryId.value = ''
    cheatSheets.value = {}
  }

  return {
    // State
    categories,
    selectedCategoryId,
    cheatSheets,

    // Getters
    selectedCategory,
    currentCheatSheet,
    isLoading,
    currentContent,
    hasError,
    errorMessage,

    // Actions
    loadCategories,
    loadContent,
    selectCategory,
    refreshCurrentContent,
    resetStore,
  }
})
