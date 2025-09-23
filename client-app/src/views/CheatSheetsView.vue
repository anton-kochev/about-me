<script setup lang="ts">
import { useCheatSheetsStore } from '@/stores/cheatSheets'
import { marked } from 'marked'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

const cheatSheetsStore = useCheatSheetsStore()

// Use storeToRefs to maintain reactivity for state and getters
const {
  categories,
  selectedCategoryId,
  selectedCategory,
  isLoading,
  currentContent,
  hasError,
  errorMessage,
} = storeToRefs(cheatSheetsStore)

// Actions can be destructured normally (they don't need reactivity)
const { selectCategory, loadCategories, refreshCurrentContent } =
  cheatSheetsStore

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
            {
              'cheat-sheets__nav-button--active':
                selectedCategoryId === category.id,
            },
          ]"
          @click="selectCategory(category.id)"
        >
          {{ category.id }}
        </button>
      </nav>
    </aside>

    <main class="cheat-sheets__content">
      <div class="cheat-sheets__body">
        <div v-if="isLoading" class="cheat-sheets__loading">Loading...</div>
        <div v-else-if="hasError" class="cheat-sheets__error">
          <p>{{ errorMessage }}</p>
          <button
            @click="refreshCurrentContent()"
            class="cheat-sheets__retry-btn"
          >
            Retry
          </button>
        </div>
        <div
          v-else-if="htmlContent"
          class="cheat-sheets__content-html"
          v-html="htmlContent"
        ></div>
        <p v-else class="cheat-sheets__placeholder">
          Select a category to view cheat sheet content.
        </p>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.cheat-sheets {
  display: flex;
  min-height: 100vh;

  &__sidebar {
    width: 200px;
    background-color: var(--color-background-soft);
  }

  &__nav-button {
    display: block;
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background: none;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text);
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;

    &:hover {
      background-color: var(--color-background-mute);
      border-color: var(--color-border-hover);
    }

    &--active {
      background-color: var(--vt-c-indigo);
      color: white;
      border-color: var(--vt-c-indigo);
    }
  }

  &__content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }

  &__loading,
  &__error {
    text-align: center;
    padding: 2rem;
    color: var(--color-text);
  }

  &__retry-btn {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: var(--vt-c-indigo);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  &__placeholder {
    text-align: center;
    color: var(--color-text);
    font-style: italic;
  }

  // Typography for rendered HTML content
  &__content-html {
    line-height: 1.6;
    color: var(--color-text);

    // Use :deep() to penetrate scoped styles for dynamically inserted content
    :deep(strong),
    :deep(b) {
      font-weight: bold;
    }

    :deep(em),
    :deep(i) {
      font-style: italic;
    }

    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
      font-weight: bold;
      margin: 1.5rem 0 1rem 0;
      color: var(--color-heading);
    }

    :deep(h1) {
      font-size: 2rem;
    }
    :deep(h2) {
      font-size: 1.5rem;
    }
    :deep(h3) {
      font-size: 1.25rem;
    }
    :deep(h4) {
      font-size: 1.125rem;
    }

    :deep(p) {
      margin: 1rem 0;
    }

    :deep(ul),
    :deep(ol) {
      margin: 1rem 0;
      padding-left: 2rem;
    }

    :deep(li) {
      margin: 0.5rem 0;
    }

    :deep(code) {
      display: block;
      width: 100%;
      background-color: var(--color-background-mute);
      padding: 1rem;
      border-radius: 6px;
      font-family:
        'Fira Code', 'Monaco', 'Consolas', 'Courier New', Courier, monospace;
      font-size: 0.9em;
      line-height: 1.4;
      overflow-x: auto;
      margin: 1rem 0;
      border: 1px solid var(--color-border);
      white-space: pre-wrap;
      word-wrap: break-word;

      // Language-specific syntax highlighting colors
      &[class*='language-javascript'],
      &[class*='language-js'] {
        background-color: #f8f8f2;
        color: #272822;
      }

      &[class*='language-typescript'],
      &[class*='language-ts'] {
        background-color: #f4f4f4;
        color: #2d3748;
      }

      &[class*='language-python'] {
        background-color: #f7f7f7;
        color: #3776ab;
      }

      &[class*='language-css'] {
        background-color: #f0f8ff;
        color: #1565c0;
      }

      &[class*='language-html'] {
        background-color: #fff5f5;
        color: #e53e3e;
      }

      &[class*='language-json'] {
        background-color: #f7fafc;
        color: #2d3748;
      }

      &[class*='language-bash'],
      &[class*='language-shell'] {
        background-color: #1a202c;
        color: #68d391;
      }

      @media (prefers-color-scheme: dark) {
        background-color: var(--vt-c-black-soft);
        color: #e2e8f0;
        border-color: var(--color-border);

        &[class*='language-javascript'],
        &[class*='language-js'] {
          background-color: #282c34;
          color: #abb2bf;
        }

        &[class*='language-typescript'],
        &[class*='language-ts'] {
          background-color: #2d3748;
          color: #e2e8f0;
        }

        &[class*='language-python'] {
          background-color: #2d3748;
          color: #63b3ed;
        }

        &[class*='language-css'] {
          background-color: #2a365d;
          color: #63b3ed;
        }

        &[class*='language-html'] {
          background-color: #742a2a;
          color: #fc8181;
        }

        &[class*='language-json'] {
          background-color: #2d3748;
          color: #e2e8f0;
        }

        &[class*='language-bash'],
        &[class*='language-shell'] {
          background-color: #1a202c;
          color: #68d391;
        }
      }
    }

    // Inline code should remain small
    :deep(p code),
    :deep(li code),
    :deep(td code),
    :deep(th code) {
      display: inline;
      width: auto;
      padding: 0.2rem 0.4rem;
      margin: 0;
      background-color: var(--color-background-mute);
      border-radius: 3px;
      border: none;
      white-space: nowrap;
    }

    :deep(pre) {
      background: none;
      padding: 0;
      border-radius: 0;
      overflow: visible;
      margin: 0;

      code {
        // Pre code blocks keep the full-width styling
        margin: 1rem 0;
      }
    }

    blockquote {
      border-left: 4px solid var(--color-border);
      padding-left: 1rem;
      margin: 1rem 0;
      font-style: italic;
    }

    hr {
      border: none;
      border-top: 1px solid var(--color-border);
      margin: 2rem 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }

    th,
    td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }

    th {
      font-weight: bold;
      background-color: var(--color-background-soft);
    }
  }
}
</style>
