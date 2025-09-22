# Vue.js Cheat Sheet

## Template Syntax

### Interpolation
- `{{ variable }}` - Text interpolation
- `{{ method() }}` - Method call

### Directives
- `v-if="condition"` - Conditional rendering
- `v-for="item in items"` - List rendering
- `v-model="data"` - Two-way binding
- `v-on:click="handler"` or `@click="handler"` - Event handling

## Composition API

### Setup Function
```javascript
<script setup>
import { ref, reactive, computed } from 'vue'

const count = ref(0)
const state = reactive({ name: 'Vue' })
const doubled = computed(() => count.value * 2)
</script>
```

### Reactivity
- `ref(value)` - Reactive primitive
- `reactive(object)` - Reactive object
- `computed(() => {})` - Computed property

## Component Communication
- Props - Parent to child
- Emits - Child to parent
- Provide/Inject - Cross-component