import http from "@/utils/request.util";

// 获取所有条款分类
export const reqGetClauseCategoryList = (data: QueryClauseCategoryListForm) =>
  http.post("/clause/getClauseCategoryList", data);