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
import routerMap from "@/router/router.map";

export const useAppStore = defineStore("main", {
  state: () => {
    return {
      // 侧边折叠
      asideCollapse: false,
      // 快捷导航列表
      shortcutList: <AppRouteRecord[]>[],
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
          this.shortcutList[i].meta.menuTitle = title;
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
        // 只能添加用户可访问的路由,name作为唯一标识
        const userStore = useUserStore();
        //只能添加用户可访问的路由,name作为唯一标识
        for (let i = 0; i < userStore.routesNameList.length; i++) {
          let name = userStore.routesNameList[i];
          if (name === toRoute.name) {
            this.shortcutList.push(toRoute as unknown as AppRouteRecord);
            break;
          }
        }
      }
      this.shortcutActive = toRoute.path;
      this.shortcutActiveFullpath = toRoute.fullPath;
      //修改标题
      toRoute.meta.title && PubSub.publish("setTitle", toRoute.meta.menuTitle);
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
        let p = null;
        if (i === 0) {
          p = this.shortcutList[i + 1].fullPath;
        } else if (i === this.shortcutList.length - 1) {
          p = this.shortcutList[i - 1].fullPath;
        } else {
          p = this.shortcutList[i + 1].fullPath;
        }
        this.shortcutList.splice(i, 1);

        //跳转全路径
        router.push(p as string);
        return;
      }
    },
  },
});

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      // 用户是否已经获取过路由
      // 默认没有获取，需要动态请求
      routesFlag: false,
      // 动态路由列表(带层级的，可作为左侧菜单)
      routesList: <AppRouteRecord[]>[],
      // 扁平的Name列表
      routesNameList: <string[]>[],
    };
  },
  actions: {
    /**
     * 退出登录
     */
    async logout() {
      //清除登录状态
      Cookie.set("token", "");

      //清除已注册的路由
      for (let i = 0; i < this.routesNameList.length; i++) {
        const name = this.routesNameList[i];
        router.removeRoute(name);
      }
      //清楚404
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
      // 注册路由的方法
      let registerRoute = (item: AppRouteRecord) => {
        let route = lodash.cloneDeep(item);
        let { name } = route;
        route["component"] = null;
        if (routerMap.has(name)) {
          route["component"] = routerMap.get(name);
          this.routesNameList.push(name);
          r.addRoute("Root", route as RouteRecordRaw);
        }
      };
      // 递归遍历
      let traverse = (list: AppRouteRecord[]) => {
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          registerRoute(item);
          if (item.children && item.children.length > 0) {
            traverse(item.children);
          }
        }
      };

      try {
        // 1.从后端拿到路由列表
        let res = await reqGetRoutes();
        let routes: AppRouteRecord[] = res.data;
        this.routesList = lodash.cloneDeep(routes);

        // 2.利用递归算法动态注册路由
        traverse(routes);

        // 3.添加一个404
        r.addRoute({
          path: "/:pathMatch(.*)",
          name: "NotFoundRedirect",
          redirect: "/404",
        });

        // 4.修改状态
        this.routesFlag = true;

        // 5.跳转到指定的路由
        r.push(to.fullPath);
      } catch (error) {
        console.log(error);

        this.routesFlag = true;

        r.push({ path: "/login", query: { callback: to.fullPath } });
      } finally {
        NProgress.done();
      }
    },
  },
});
