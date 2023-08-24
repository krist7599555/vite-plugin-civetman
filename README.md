# vite-plugin-civetman

plugin to spawn [`civetman`](https://www.npmjs.com/package/civetman) on `dev` and `build`

```typescript
import { civetman } from 'vite-plugin-civetman';
import { defineConfig } from 'vite';

export default defineConfig({
  plugin: [
    civetman(),
  ]
})
```
