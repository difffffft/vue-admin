import http from "@/utils/request.util";

// 根据模板分类ID，获取条款分类具体内容
export const reqGetClauseCategoryList = (data: QueryClauseCategoryListForm) =>
  http.post("/clause/getClauseCategoryList", data);

// 新增条款分类
export const reqInsertClauseCategory = (data: InsertClauseCategoryForm) =>
  http.post("/clause/insertClauseCategory", data);

// 修改条款分类
export const reqUpdateClauseCategory = (data: UpdateClauseCategoryForm) =>
  http.post("/clause/updateClauseCategory", data);

// 删除条款分类
export const reqDeleteClauseCategory = (data: DeleteCommonForm) =>
  http.post("/clause/deleteClauseCategory", data);
