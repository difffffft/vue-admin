/**
 * 超级管理员的所能访问的路由
 */
export const superAdminRoutesData: AppResult = {
  code: 200,
  message: "一切OK",
  data: [
    "/home",
    "/system/user-manage",
    "/system/role-manage",
    "/temp/list-manage",
    "/temp/category-manage",
    "/use-temp",
  ],
};

/**
 * 普通管理员的所能访问的路由
 */
export const defaultAdminRoutesData: AppResult = {
  code: 200,
  message: "一切OK",
  data: ["/home", "/temp/list-manage", "/temp/category-manage", "/use-temp"],
};

export const MockSuperAdminRoutes: AppResult = {
  code: 200,
  message: "一切OK",
  data: [
    {
      name: "Home",
      path: "/home",
      component: "/home",
      children: [],
      meta: {
        menuTitle: "首页",
        menuIcon: "IconHome",
        keepAlive: true,
      },
    },
  ],
};

export const MockAdminRoutes: AppResult = {
  code: 200,
  message: "一切OK",
  data: [
    {
      name: "Home",
      path: "/home",
      component: "/home",
      children: [],
      meta: {
        menuTitle: "首页",
        menuIcon: "IconHome",
        menuHidden: true,
        keepAlive: true,
      },
    },
  ],
};