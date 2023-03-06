/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "mockjs";

declare module "js-cookie";

declare module "nprogress";

declare module "lodash" {
  export default class {
    static debounce(fun: (args: any) => void, time: number);
    static cloneDeep<T>(obj: T): T;
  }
}

declare module "pubsub-js" {
  interface callback {
    (eventName: string, any: any);
  }
  export default class {
    static publish(arg0: string, title: unknown) {
      throw new Error("Method not implemented.");
    }
    static subscribe: (eventName, callback) => void;
    static unsubscribe: (eventName: string) => void;
  }
}

declare interface Window {
  DocsAPI: any;
}

interface AppRouteRecord {
  path: string;
  name: string;
  fullPath?: string;
  component?: () => Promise<any>;
  meta?: {
    title: string;
    keepAlive?: boolean;
    icon?: string;
    hidden?: boolean;
  };
  children?: AppRouteRecord[];
}

interface AppMenus {
  menus: AppRouteRecord[];
  flattenMenus: AppRouteRecord[];
}
