/**
 * 菜单懒加载，用户
 */
export default {
  Home: () => import("@/pages/home/index.vue"),
  UserManage: () => import("@/pages/user-manage/index.vue"),
  RoleManage: () => import("@/pages/role-manage/index.vue"),
  TempListManage: () => import("@/pages/temp-list-manage/index.vue"),
  TempCategoryManage: () => import("@/pages/temp-category-manage/index.vue"),
  UseTemp: () => import("@/pages/use-temp/index.vue"),
};
