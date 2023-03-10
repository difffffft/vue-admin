import http from "@/utils/request.util";

// 根据条款分类ID，获取条款列表具体内容
export const reqGetClauseList = (data: QueryClauseListForm) =>
  http.post("/clause/getClauseList", data);

// 新增条款
export const reqInsertClause = (data: InsertClauseForm) =>
  http.post("/clause/insertClause", data);

// 修改条款
export const reqUpdateClause = (data: UpdateClauseForm) =>
  http.post("/clause/updateClause", data);

// 删除条款
export const reqDeleteClause = (data: DeleteCommonForm) =>
  http.post("/clause/deleteClause", data);
