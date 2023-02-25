import { defineStore } from "pinia";
import { reqGetRoutes } from "@/api";
import {
  useRouter,
  Router,
  RouteRecordRaw,
  RouteRecordName,
  RouteLocationNormalized,
} from "vue-router";
import Cookie from "js-cookie";
import router, { dynamicRoutes } from "@/router";

const loadsh = require("lodash");

export const useAppStore = defineStore("main", {
  state: () => {
    return {
      //侧边折叠
      asideCollapse: false,
      //快捷导航列表
      shortcutList: new Array<RouteLocationNormalized>(),
      //导航当前激活的路由
      shortcutActive: "",
    };
  },
  actions: {
    //TODO:删除逻辑优化
    removeShortcutItem(path: string) {
      // 如果只有一个标签,就不让用户删除,至少保留一个标签给用户使用
      if (this.shortcutList.length <= 1) {
        return;
      }
      // 如果有3个标签,及其以上,就要判断是两边还是删除的中间
      if (this.shortcutList.length >= 2) {
        let i = this.shortcutList.findIndex((item) => item.path === path);
        let p = "";
        if (i === 0) {
          p = this.shortcutList[i + 1].path;
        } else if (i === this.shortcutList.length - 1) {
          p = this.shortcutList[i - 1].path;
        } else {
          p = this.shortcutList[i + 1].path;
        }
        this.shortcutList.splice(i, 1);
        router.push(p);
        return;
      }
    },
  },
});

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      // 动态路由列表
      routes: new Array<AppRouteRecord>(),
      // 用户所拥有的按钮权限
      permissions: ["query", "edit"],
    };
  },
  getters: {
    /**
     * 根据动态路由分析菜单
     * @returns
     */
    menus(): AppRouteRecord[] {
      let res: AppRouteRecord[] = [];

      const hasMenu = (path: string) => {
        let flag = false;
        for (let j = 0; j < this.routes.length; j++) {
          const route = this.routes[j];
          if (route.meta?.hidden) {
            flag = false;
            break;
          }
          if (route.path === path) {
            flag = true;
            break;
          }
        }
        return flag;
      };

      for (let i = 0; i < dynamicRoutes.length; i++) {
        const route = loadsh.cloneDeep(dynamicRoutes[i]);
        if (hasMenu(route.path)) {
          res.push(route);
          continue;
        }
        if (route.children && route.children.length !== 0) {
          let res2: AppRouteRecord[] = [];
          for (let k = 0; k < route.children.length; k++) {
            const route2 = route.children[k];
            if (hasMenu(route2.path)) {
              res2.push(route2);
            }
          }
          route.children = res2;
          if (route.children.length !== 0) {
            res.push(route);
          }
        }
      }
      return res;
    },
  },
  actions: {
    /**
     * 退出登录
     */
    async logout() {
      //清除登录状态
      Cookie.set("token", "");

      //清除已注册的路由
      for (let i = 0; i < useUserStore().routes.length; i++) {
        const route = useUserStore().routes[i];
        router.removeRoute(route.name as RouteRecordName);
      }
      router.removeRoute("NotFoundRedirect")

      //重新加载动态路由
      this.$reset();
      //清除用户信息
      useAppStore().$reset();

      //回到登录页面
      router.replace({ path: "/login" });
    },

    /**
     * 动态获取路由
     */
    async getRoutes(r: Router) {
      try {
        const res = await reqGetRoutes();
        const paths = res.data;
        for (let i = 0; i < paths.length; i++) {
          let path = paths[i];
          for (let k = 0; k < dynamicRoutes.length; k++) {
            const route = loadsh.cloneDeep(dynamicRoutes[k]);
            if (route.path === path) {
              this.routes.push(route);
              r.addRoute("Root", route as RouteRecordRaw);
              break;
            }
            if (route.children) {
              for (let j = 0; j < route.children.length; j++) {
                const route2 = loadsh.cloneDeep(route.children[j]);
                if (route2.path === path) {
                  this.routes.push(route2);
                  r.addRoute("Root", route as RouteRecordRaw);
                  break;
                }
              }
            }
          }
        }
        r.addRoute({
          path: "/:pathMatch(.*)",
          name:"NotFoundRedirect",
          redirect: "/404",
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
});
