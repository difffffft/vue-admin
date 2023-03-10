import http from "@/utils/request.util";

// 登录
export const reqLogin = (data: LoginFormType) => http.post("/user/login", data);

// 获取路由
export const reqGetRoutes = () =>
  http.post("/permission/getAllPermissionListByToken");

// 获取用户(分页查询)
export const reqGetUserList = (data: PageUserFilterFormType) =>
  http.post("/user/getAllUser", data);

// 删除用户
export const reqDeleteUser = (data: DeleteCommonForm) =>
  http.post("/user/deleteByUserId", data);

// 新增用户
export const reqInsertUser = (data: InsertUserFormType) =>
  http.post("/user/insertUser", data);

// 修改用户
export const reqUpdateUser = (data: UpdateUserFormType) =>
  http.post("/user/updateUser", data);

  // 修改用户
export const reqUpdateUserPassword = (data: UpdateUserPasswordFormType) =>
http.post("/user/updatePasswordById", data);

// 查询除超级管理员外的所有角色
export const reqGetRoleAll = () => http.post("/role/getAllRole");
// 新增角色
export const reqInsertRole = (data: InsertRoleFormType) =>
  http.post("/role/insertRole", data);
// 删除角色
export const reqDeleteRole = (data: DeleteCommonForm) =>
  http.post("/role/deleteRole", data);
// 修改角色
export const reqUpdateRole = (data: InsertRoleFormType) =>
  http.post("/role/updateRole", data);
// 获取权限树
export const reqGetPermissionTree = ()=> http.post("/permission/getPermissionTree");

// 根据分类ID，查询模板的具体信息
export const getTempById = (params: UseTempFormType) =>
  http.get("/template/useTemplateById", { params });
// 查询模板
export const reqGetTempList = (params: TempFilterFormType) =>
  http.get("/template/getTemplateByCategoryId", { params });
// 插入模板
export const reqInsertTemp = (data: InsertTempFormType) =>
  http.post("/template/insertTemplate", data);
// 修改模板
export const reqUpdateTemp = (data: InsertTempFormType) =>
  http.put("/template/updateTemplateById", data);
// 删除模板
export const reqDeleteTemp = (params: TempDeleteCommonForm) =>
  http.delete("/template/deleteTemplateById", { params });

// 获取所有的模板分类
export const reqGetCategoryAll = () =>
  http.get("/category/getAllTemplateCategory");
// 新增模板分类
export const reqInsertCategory = (data: InsertCategoryFormType) =>
  http.post("/category/insertTemplateCategory", data);
// 删除模板分类
export const reqUpdateCategory = (data: UpdateCategoryFormType) =>
  http.put("/category/updateTemplateCategoryById", data);
// 删除模板分类
export const reqDeleteCategory = (params: DeleteCommonForm) =>
  http.delete("/category/deleteTemplateCateById", { params });
