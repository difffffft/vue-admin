export const MockSuperAdminRoutes: AppResult = {
  code: 200,
  message: "一切OK",
  data: [
    {
      path: "/home",
      name: "Home",
      meta: {
        menuTitle: "首页",
        menuIcon: "IconHomeFill",
        menuHidden: false,
        keepAlive: false,
      },
      children: [],
    },
    {
      path: "/system",
      name: "System",
      meta: {
        menuTitle: "系统管理",
        menuIcon: "Tools",
        menuHidden: false,
        keepAlive: false,
      },
      children: [
        {
          path: "/system/user-manage",
          name: "UserManage",
          meta: {
            menuTitle: "用户管理",
            menuIcon: "Tools",
            menuHidden: false,
            keepAlive: false,
          },
          children: [],
        },
        {
          path: "/system/role-manage",
          name: "RoleManage",
          meta: {
            menuTitle: "角色管理",
            menuIcon: "Tools",
            menuHidden: false,
            keepAlive: false,
          },
          children: [],
        },
        {
          path: "/system/log-manage",
          name: "LogManage",
          meta: {
            menuTitle: "日志管理",
            menuIcon: "Tools",
            menuHidden: false,
            keepAlive: false,
          },
          children: [
            {
              path: "/system/log-manage/caozuo",
              name: "LogCaozuoManage",
              meta: {
                menuTitle: "操作日志",
                menuIcon: "Tools",
                menuHidden: false,
                keepAlive: false,
              },
              children: [],
            },
            {
              path: "/system/log-manage/login",
              name: "LogLoginManage",
              meta: {
                menuTitle: "登录日志",
                menuIcon: "Tools",
                menuHidden: false,
                keepAlive: false,
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      path: "/temp",
      name: "Temp",
      meta: {
        menuTitle: "模板管理",
        menuIcon: "List",
        menuHidden: false,
        keepAlive: false,
      },
      children: [
        {
          path: "/temp/list-manage",
          name: "TempListManage",
          meta: {
            menuTitle: "模板列表",
            menuIcon: "List",
            menuHidden: false,
            keepAlive: false,
          },
          children: [],
        },
        {
          path: "/temp/category-manage",
          name: "TempCategoryManage",
          meta: {
            menuTitle: "模板分类",
            menuIcon: "List",
            menuHidden: false,
            keepAlive: false,
          },
          children: [],
        },
      ],
    },
    {
      path: "/use-temp",
      name: "UseTemp",
      meta: {
        menuTitle: "编辑模板",
        menuIcon: "List",
        menuHidden: true,
        keepAlive: true,
      },
      children: [],
    },
  ],
};

export const MockAdminRoutes: AppResult = {
  code: 200,
  message: "一切OK",
  data: [
    {
      path: "/home",
      name: "Home",
      meta: {
        menuTitle: "首页",
        menuIcon: "IconHomeFill",
        menuHidden: false,
        keepAlive: false,
      },
      children: [],
    },
    {
      path: "/temp",
      name: "Temp",
      meta: {
        menuTitle: "模板管理",
        menuIcon: "List",
        menuHidden: false,
        keepAlive: false,
      },
      children: [
        {
          path: "/temp/list-manage",
          name: "TempListManage",
          meta: {
            menuTitle: "模板列表",
            menuIcon: "List",
            menuHidden: false,
            keepAlive: false,
          },
          children: [],
        },
        {
          path: "/temp/category-manage",
          name: "TempCategoryManage",
          meta: {
            menuTitle: "模板分类",
            menuIcon: "List",
            menuHidden: false,
            keepAlive: false,
          },
          children: [],
        },
      ],
    },
    {
      path: "/use-temp",
      name: "UseTemp",
      meta: {
        menuTitle: "编辑模板",
        menuIcon: "List",
        menuHidden: true,
        keepAlive: true,
      },
      children: [],
    },
  ],
};
