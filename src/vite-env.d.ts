/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "mockjs";

declare module "js-cookie";

declare module "nprogress";

declare module "pubsub-js" {
  interface callback {
    (eventName: string, any: any);
  }
  export default class {
    static subscribe: (eventName, callback) => void;
    static unsubscribe: (eventName: string) => void;
  }
}

/**
import { Plugin } from "vite";
interface Options {
    fileRegex?: RegExp;
}
declare const _default: (options?: Options) => Plugin;
export { Options, _default as default };
 */