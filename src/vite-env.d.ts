/// <reference types="vite/client" />


declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "mockjs";

declare module "js-cookie";

declare module "nprogress";