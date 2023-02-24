/**
 * 超级管理员的所能访问的路由
 */
export const superAdminUserData: AppResult = {
  code: 200,
  msg: "一切OK",
  data: ["/home", "/system/user", "/system/role", "/system/route","/temp-manage","/use-temp"],
};

/**
 * 普通管理员的所能访问的路由
 */
export const defaultAdminUserData: AppResult = {
  code: 200,
  msg: "一切OK",
  data: ["/home"],
};
