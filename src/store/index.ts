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
import router from "@/router";
import PubSub from "pubsub-js";
import NProgress from "nprogress";
import lodash from "lodash";
import { ElMessage } from "element-plus";
import { getBooleanFromEnv } from "@/utils/env.util";


export const useAppStore = defineStore("main", {
  state: () => {
    return {
      // 侧边折叠
      asideCollapse: false,
      // 快捷导航列表
      shortcutList: new Array<RouteLocationNormalized>(),
      // 导航当前激活的路由的path
      shortcutActive: "",
      // 快捷导航当前激活的路由的全路径
      shortcutActiveFullpath: "",
    };
  },
  actions: {
    /**
     * 主动修改标签的标题
     * @param fullPath 全路径
     * @param title 标题
     */
    renameShortcut(fullPath: string, title: string) {
      for (let i = 0; i < this.shortcutList.length; i++) {
        const item = this.shortcutList[i];
        if (fullPath === item.fullPath) {
          this.shortcutList[i].meta.title = title;
          break;
        }
      }
    },
    /**
     * 根据全路径的不同
     * 添加一个路由到快捷方式
     * @param toRoute 路由
     */
    addShortcut(toRoute: RouteLocationNormalized) {
      if (
        this.shortcutList.findIndex(
          (item) => item.fullPath === toRoute.fullPath
        ) === -1
      ) {
        const userStore = useUserStore();
        //只能添加用户可访问的路由,name作为唯一标识
        for (let i = 0; i < userStore.routes.length; i++) {
          const route = userStore.routes[i];
          if (route.name === toRoute.name) {
            this.shortcutList.push(toRoute);
            break;
          }
        }
      }
      this.shortcutActive = toRoute.path;
      this.shortcutActiveFullpath = toRoute.fullPath;
      //修改标题
      toRoute.meta.title && PubSub.publish("setTitle", toRoute.meta.title);
    },

    /**
     * 从快捷方式中删除一个路由
     * @param fullPath 全路径
     */
    removeShortcutItem(fullPath: string) {
      // 如果只有一个标签,就不让用户删除,至少保留一个标签给用户使用
      if (this.shortcutList.length <= 1) {
        return;
      }
      // 多个标签的逻辑
      if (this.shortcutList.length >= 2) {
        let i = this.shortcutList.findIndex(
          (item) => item.fullPath === fullPath
        );
        let p = "";
        if (i === 0) {
          p = this.shortcutList[i + 1].fullPath;
        } else if (i === this.shortcutList.length - 1) {
          p = this.shortcutList[i - 1].fullPath;
        } else {
          p = this.shortcutList[i + 1].fullPath;
        }
        this.shortcutList.splice(i, 1);

        //跳转全路径
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
     * 根据动态路由的变化自动分析哪些路由是菜单,且是否可以访问和显示
     * 同时计算带层级的和不带层级的
     */
    menus(): AppMenus {
      let res: AppMenus = { menus: [], flattenMenus: [] };

      // 判断某个path是不是菜单里面的,需要显示在侧边栏的
      const isMenu = (path: string): boolean => {
        for (let j = 0; j < this.routes.length; j++) {
          const route = this.routes[j];
          if (route.path === path && route.meta?.hidden !== true) {
            return true;
          }
        }
        return false;
      };

      // 动态深度遍历函数
      const filterListFun = (list: AppRouteRecord[]) => {
        list = lodash.cloneDeep(list);
        let filterList: AppRouteRecord[] = [];

        // 遍历函数
        const traverse = (list: AppRouteRecord[], res2: AppRouteRecord[]) => {
          list.forEach((item) => {
            if (isMenu(item.path)) {
              res2.push(item);
            } else if (item.children) {
              let f: AppRouteRecord[] = [];
              traverse(item.children, f);
              item.children = f;
              if (item.children.length !== 0) {
                res2.push(item);
              }
            }
          });
        };
        // 调用遍历函数
        traverse(list, filterList);
        return filterList;
      };

      // res.menus = filterListFun(dynamicRoutes);
      res.menus = [];

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
      router.removeRoute("NotFoundRedirect");

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
    async getRoutes(r: Router, to: RouteLocationNormalized) {
      // const res = await reqGetRoutes();

      return

      try {
        const res = await reqGetRoutes();
        const paths = res.data;

        const next = (
          list: AppRouteRecord[],
          path: string
        ): AppRouteRecord | false => {
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.path === path) {
              return item;
            }
            if (item.children && item.children.length > 0) {
              let next_res = next(item.children, path);
              if (next_res) {
                return next_res;
              }
            }
          }
          return false;
        };

        for (let i = 0; i < paths.length; i++) {
          let path = paths[i];
          let item = next(dynamicRoutes, path);
          if (item) {
            this.routes.push(item);
            r.addRoute("Root", item as RouteRecordRaw);
          }
        }

        r.addRoute({
          path: "/:pathMatch(.*)",
          name: "NotFoundRedirect",
          redirect: "/404",
        });
        r.push(to.fullPath);
      } catch (error: any) {
        console.log(error);
        r.push({ path: "/login", query: { callback: to.fullPath } });
      } finally {
        NProgress.done();
      }
    },
  },
});
