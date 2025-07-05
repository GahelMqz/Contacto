/// <reference types="vite/client" />
// src/vue-shims.d.ts o src/env.d.ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
