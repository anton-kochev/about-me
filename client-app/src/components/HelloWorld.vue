<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="hello-world">
    <h1 class="hello-world__title hello-world__title--green">{{ msg }}</h1>
    <h3 class="hello-world__subtitle">You've successfully created a project</h3>
  </div>
</template>

<style scoped>
.hello-world {
  &__title {
    font-weight: 500;
    font-size: 2.6rem;
    position: relative;
    top: -10px;
    text-align: center;

    &--green {
      // Green modifier styles (will use global .green styles)
    }
  }

  &__subtitle {
    font-size: 1.2rem;
    text-align: center;
  }

  @media (min-width: 1024px) {
    &__title,
    &__subtitle {
      text-align: left;
    }
  }
}
</style>
