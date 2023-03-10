import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";
import RootView from "@/pages/index.vue";
import Cookie from "js-cookie";
import NProgress from "nprogress";
import { useAppStore, useUserStore } from "@/store";

/**
 * 静态路由，每个人都可以访问
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Root",
    component: RootView,
    // redirect: "/home",
    children: [],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login/index.vue"),
    meta: {
      menuTitle: "登录",
    },
  },
  {
    path: "/404",
    name: "NotFound",
    component: () => import("@/pages/error/404.vue"),
    meta: {
      menuTitle: "页面不存在",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const token = Cookie.get("token");
    NProgress.start();
    if (to.path === "/login" || to.path === "/404") {
      next();
      NProgress.done();
    } else {
      if (!token) {
        next({ path: "/login", query: { callback: to.fullPath } });
        NProgress.done();
      } else {
        const userStore = useUserStore();
        if (userStore.routesFlag === false) {
          next();
          /**
           * 根据不同账号,动态注册不同的路由
           */
          await userStore.getRoutes(router, to);
        } else {
          /**
           * 直接访问
           */
          if (to.path === "/") {
            let path = useUserStore().routesHomePath;
            if (path) {
              next({ path, query: { ...to.query } });
              NProgress.done();
            } else {
              next();
              NProgress.done();
            }
          } else {
            next();
            NProgress.done();
          }
        }
      }
    }
  }
);

router.afterEach((to, from, failure) => {
  useAppStore().addShortcut(to);
});

export default router;
