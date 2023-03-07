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
 * 动态路由，基于用户权限动态去加载
 */
// export const dynamicRoutes: Array<AppRouteRecord> = [
//   {
//     path: "/home",
//     name: "Home",
//     component: () => import("@/pages/home/index.vue"),
//     meta: {
//       title: "首页",
//       icon: "IconHomeFill",
//     },
//   },
//   {
//     path: "/system",
//     name: "System",
//     meta: {
//       title: "系统管理",
//       icon: "Tools",
//     },
//     children: [
//       {
//         path: "/system/user-manage",
//         name: "UserManage",
//         component: () => import("@/pages/user-manage/index.vue"),
//         meta: {
//           title: "用户管理",
//         },
//       },
//       {
//         path: "/system/role-manage",
//         name: "RoleManage",
//         component: () => import("@/pages/role-manage/index.vue"),
//         meta: {
//           title: "角色管理",
//         },
//       },
//     ],
//   },
//   {
//     path: "/temp",
//     name: "Temp",
//     meta: {
//       title: "模板管理",
//       icon: "List",
//     },
//     children: [
//       {
//         path: "/temp/list-manage",
//         name: "TempListManage",
//         component: () => import("@/pages/temp-list-manage/index.vue"),
//         meta: {
//           title: "模板列表",
//         },
//       },
//       {
//         path: "/temp/category-manage",
//         name: "TempCategoryManage",
//         component: () => import("@/pages/temp-category-manage/index.vue"),
//         meta: {
//           title: "模板分类",
//         },
//       },
//     ],
//   },
//   {
//     path: "/use-temp",
//     name: "UseTemp",
//     component: () => import("@/pages/use-temp/index.vue"),
//     meta: {
//       title: "编辑模板",
//       hidden: true,
//       keepAlive: true,
//     },
//   },
// ];

/**
 * 静态路由，每个人都可以访问
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Root",
    component: RootView,
    redirect: "/home",
    children: [],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login/index.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/404",
    name: "NotFound",
    component: () => import("@/pages/error/404.vue"),
    meta: {
      title: "页面不存在",
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
          next();
          NProgress.done();
        }
      }
    }
  }
);

router.afterEach((to, from, failure) => {
  useAppStore().addShortcut(to);
});

export default router;
