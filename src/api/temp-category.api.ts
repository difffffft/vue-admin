import http from "@/utils/request.util";

// 获取所有的模板分类
export const reqGetTempCategoryList = () =>
  http.get("/category/getAllTemplateCategory");