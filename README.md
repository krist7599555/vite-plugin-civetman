# vite-plugin-civetman

<!-- markdownlint-disable -->
<img style="margin: 30px auto; display: flex; border-radius: 50px" width="100"  src="https://user-images.githubusercontent.com/18894/184558519-b675a903-7490-43ba-883e-0d8addacd4b9.png">

Plugin to spawn [`civetman`](https://www.npmjs.com/package/civetman) on `vite dev` and `vite build`. For lazy person who don't want to run `civetman dev` command in another terminal.

Learn more about [`👉 @danielx/civet`](https://civet.dev), modern way to write `typescript`.

```typescript
import { civetman } from 'vite-plugin-civetman';
import { defineConfig } from 'vite';

export default defineConfig({
  plugin: [
    civetman(),
  ]
})
```

[🍿 source code](https://github.com/krist7599555/vite-plugin-civetman/blob/master/index.ts) is easy to read. so please try to read it.