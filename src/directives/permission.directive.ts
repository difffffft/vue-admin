import { App } from "vue";
import { useUserStore } from "@/store/index";

export default {
  install: (app: App): void => {
    app.directive("permission", (el, bindings) => {
      const userStore = useUserStore();
      !userStore.permissions.includes(bindings.value) &&
        el.parentNode.removeChild(el);
    });
  },
};
