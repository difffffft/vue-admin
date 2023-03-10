interface AppResult {
  code: number;
  data: any;
  message: string;
}

interface DeleteCommonForm {
  // 删除数据的记录的ID
  id: string;
}

// 根据ID查询
interface QueryByIdType {
  id: string;
}

interface UseTempFormType {
  templateId: string;
}

type LoginFormType = {
  phoneNum: string;
  password: string;
  code?: string;
};

interface PageFilterFormType {
  currentPage: number;
  pageSize: number;
}

interface PageUserFilterFormType extends PageFilterFormType {
  nickName: string;
  phoneNum: string;
}

interface TestRoleType {
  id: string;
  insertTime: string;
  updateTime: string;
  roleName: string;
}

interface InsertUserFormType {
  id?: string;
  phoneNum: string;
  nickname: string;
  password?: string;
  comment: string;
  roleList: { id: string }[];
}
interface InsertUpdateUserFormType {
  id?: string;
  phoneNum: string;
  nickname: string;
  password?: string;
  comment: string;
  roleList: string[];
}
interface UpdateUserFormType {
  id: string;
  phoneNum: string;
  nickname: string;
  comment: string;
  roleList: { id: string }[];
}
interface UpdateUserPasswordFormType {
  id: string;
  password: string;
}

interface DeleteUserFormType {
  id: string;
}
interface QueryUserFormType {
  id: string;
  phoneNum: string;
  nickname: string;
  insertTime: string;
  roleList: TestRoleType[];
  comment: string;
}

interface RouteTreeNode {
  label: string;
  path: string;
  children?: RouteTreeNode;
}

// 角色查询结果
interface QueryRoleResultType {
  // 角色编号
  id: string;
  // 角色名称
  roleName: string;
  // 角色创建时间
  createTime: string;
  // 权限列表
  permissionList: string[];
}

interface InsertRoleFormType {
  id?: string;
  roleName: string;
  permissionList: string[];
}

// 模板分页查询条件
interface TempFilterFormType extends PageFilterFormType {
  categoryId: string;
}

// 模板分页查询结果
interface QueryTempFormType {
  id: string;
  fileName: string;
  createTime: string;
  operator: string;
  fileUrl: string;
  fileCategoryId: string;
}
interface TempDeleteCommonForm extends DeleteCommonForm {
  fileUrl: string;
}

// 模板新增条件
interface InsertTempFormType {
  id?: string;
  fileName: string;
  fileCategoryId: string;
  fileUrl: string;
}

// 查询模板分类的结果
interface QueryTempCategoryResponse {
  id: string;
  fileCategoryName: string;
  insertTime: string;
  updateTime: string;
}
interface InsertCategoryFormType {
  fileCategoryName: string;
}
interface UpdateCategoryFormType {
  id: string;
  fileCategoryName: string;
}

interface QueryClauseCategoryListForm {
  tempCategoryId: string;
}

// 条款管理
interface QueryClauseListForm {
  clauseCategoryId: string;
  tempCategoryId: string;
}
interface InsertClauseForm {
  clauseCategoryId: string;
  tempCategoryId: string;
  content: string;
}
interface UpdateClauseForm {
  id: string;
  ccontent: string;
}