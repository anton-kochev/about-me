# JavaScript Cheat Sheet

## Variables and Data Types

### Variable Declaration
- `let variable = value` - Block-scoped variable
- `const constant = value` - Immutable reference
- `var oldStyle = value` - Function-scoped (avoid)

### Data Types
- `string` - Text data
- `number` - Numeric data
- `boolean` - true/false values
- `object` - Complex data structures
- `array` - Ordered list of values

## Functions

### Function Declaration
```javascript
function functionName(params) {
  return result;
}
```

### Arrow Functions
```javascript
const func = (params) => {
  return result;
};
```

## Array Methods
- `array.push(item)` - Add to end
- `array.pop()` - Remove from end
- `array.map(fn)` - Transform elements
- `array.filter(fn)` - Filter elements
- `array.reduce(fn, initial)` - Reduce to single value