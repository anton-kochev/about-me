<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="app__header">
      <div class="app__title">Anton's personal site. Work in progress</div>
      <nav class="app__nav">
        <RouterLink to="/" class="app__nav-link">Home</RouterLink>
        <RouterLink to="/about" class="app__nav-link">About</RouterLink>
        <RouterLink to="/cheat-sheets" class="app__nav-link">Cheat Sheets</RouterLink>
      </nav>
    </header>

    <main class="app__main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app {
  &__header {
    // Header styles
  }

  &__title {
    text-align: center;
  }

  &__nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
  }

  &__nav-link {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);

    &:first-of-type {
      border: 0;
    }

    &.router-link-exact-active {
      color: var(--color-text);

      &:hover {
        background-color: transparent;
      }
    }
  }

  &__main {
    // Main content styles
  }
}
</style>
