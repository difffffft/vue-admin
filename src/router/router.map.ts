/**
 * 菜单懒加载，需要动态注册
 */
const routerMap = new Map<string, () => Promise<any>>();
routerMap.set("Home", () => import("@/pages/home/index.vue"));
routerMap.set("UserManage", () => import("@/pages/user-manage/index.vue"));
routerMap.set("RoleManage", () => import("@/pages/role-manage/index.vue"));
routerMap.set("TempListManage", () => import("@/pages/temp-list-manage/index.vue"));
routerMap.set("TempCategoryManage", () => import("@/pages/temp-category-manage/index.vue"));
routerMap.set("UseTemp", () => import("@/pages/use-temp/index.vue"));
routerMap.set("ClauseListManage", () => import("@/pages/clause-list-manage/index.vue"));
routerMap.set("ClauseCategoryManage", () => import("@/pages/clause-category-manage/index.vue"));
routerMap.set("MakeFile", () => import("@/pages/make-file/index.vue"));
export default routerMap;