import Mock from "mockjs";
import Cookie from "js-cookie";
import { superAdminData, defaultAdminData } from "@/mock/data/login";
import { MockSuperAdminRoutes, MockAdminRoutes } from "@/mock/data/routes";
import {
  roles,
  temps,
  tempCategoryList,
  clauseTitleList,
  clauseList,
} from "@/mock/data/common";

Mock.setup({ timeout: "300-1000" });

Mock.mock("/dev/user/login", (data: any): AppResult => {
  let body: LoginFormType = JSON.parse(data.body);
  if (body.phoneNum === "admin") {
    return superAdminData;
  }
  return defaultAdminData;
});

Mock.mock(
  "/dev/permission/getAllPermissionListByToken",
  (data: any): AppResult => {
    if (Cookie.get("token") === "super_admin") {
      return MockSuperAdminRoutes;
    }
    return MockAdminRoutes;
  }
);

const UserList = new Array();
for (let i = 0; i < 10; i++) {
  let r = i % 2 === 0 ? [roles[0]] : roles;
  UserList.push({
    id: String(i),
    username: "小明" + i,
    nickname: "xxxxxx",
    email: "xxx@qq.com",
    createTime: "2020-10-26",
    roles: r,
    bz: "备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注",
  });
}

// 用户列表mock
Mock.mock("/dev/user/list", (data: any): AppResult => {
  const res = {
    code: 200,
    data: {
      total: 320,
      list: UserList,
    },
    message: "一切Ok",
  };
  return res;
});

// 删除mock
Mock.mock("/dev/user/delete", (data: any): AppResult => {
  let body = JSON.parse(data.body);
  let index = UserList.findIndex((item: any) => item.id === body.id);
  if (index !== -1) {
    UserList.splice(index, 1);
  }
  return {
    code: 200,
    data: null,
    message: "一切Ok",
  };
});

Mock.mock("/dev/user/insert", (data: any): AppResult => {
  let body: InsertUserFormType = JSON.parse(data.body);
  UserList.push(body);
  return {
    code: 200,
    data: null,
    message: "一切Ok",
  };
});

// 查询所有角色mock
Mock.mock("/dev/role/list/all", (data: any): AppResult => {
  return {
    code: 200,
    data: roles,
    message: "一切Ok",
  };
});

// 查询所有角色mock
Mock.mock("/dev/temp/list", (data: any): AppResult => {
  return {
    code: 200,
    data: {
      total: 320,
      list: temps,
    },
    message: "一切Ok",
  };
});

// 根据id查模板信息
Mock.mock("/dev/temp/byid", (data: any): AppResult => {
  let body: QueryByIdType = JSON.parse(data.body);
  const { id } = body;
  const temp = temps[temps.findIndex((item) => item.id === id)];
  return {
    code: 200,
    data: temp,
    message: "一切Ok",
  };
});

// 查询所有模板分类
Mock.mock("/dev/temp/delete", (data: any): AppResult => {
  let body: QueryByIdType = JSON.parse(data.body);
  const { id } = body;
  const i = temps.findIndex((item) => item.id === id);
  if (i !== -1) {
    temps.splice(i, 1);
  }
  return {
    code: 200,
    data: true,
    message: "一切Ok",
  };
});

// 查询所有模板分类
Mock.mock("/dev/category/getAllTemplateCategory", (data: any): AppResult => {
  return {
    code: 200,
    data: tempCategoryList,
    message: "一切Ok",
  };
});

// 获取所有标题
Mock.mock("/dev/clause/getClauseCategoryList", (data: any): AppResult => {
  return {
    code: 200,
    data: clauseTitleList,
    message: "一切Ok",
  };
});

// 根据条款分类ID，获取条款列表具体内容
Mock.mock("/dev/clause/getClauseList", (data: any): AppResult => {
  let body: any = JSON.parse(data.body);
  const { clauseCategoryId } = body;
  switch (clauseCategoryId) {
    case "1":
      return {
        code: 200,
        data: clauseList[0],
        message: "一切Ok",
      };
    case "2":
      return {
        code: 200,
        data: clauseList[1],
        message: "一切Ok",
      };
    case "3":
      return {
        code: 200,
        data: clauseList[2],
        message: "一切Ok",
      };
  }

  return {
    code: 100,
    data: [],
    message: "无数据",
  };
});

Mock.mock("/dev/clause/insertClause", (data: any): AppResult => {
  let body: any = JSON.parse(data.body);
  const { clauseCategoryId, content } = body;
  switch (clauseCategoryId) {
    case "1":
      clauseList[0].push({
        id: String(clauseList[0].length + 1),
        content,
      });
      break;
    case "2":
      clauseList[1].push({
        id: String(clauseList[1].length + 1),
        content,
      });
      break;
    case "3":
      clauseList[2].push({
        id: String(clauseList[2].length + 1),
        content,
      });
      break;
  }
  return {
    code: 200,
    data: true,
    message: "新增成功",
  };
});

Mock.mock("/dev/clause/deleteClause", (data: any): AppResult => {
  let body: DeleteCommonForm = JSON.parse(data.body);
  let { id } = body;
  let i1 = 0;
  let i2 = 0;
  for (let i = 0; i < clauseList.length; i++) {
    let clauses = clauseList[i];
    let index = clauses.findIndex((item) => item.id === id);
    if (index !== -1) {
      i1 = i;
      i2 = index;
      clauseList[i1].splice(i2, 1);
      break;
    }
  }
  return {
    code: 200,
    data: true,
    message: "一切Ok",
  };
});

Mock.mock("/dev/clause/updateClause", (data: any): AppResult => {
  let body: UpdateClauseForm = JSON.parse(data.body);
  let { id, ccontent } = body;
  let i1 = 0;
  let i2 = 0;
  for (let i = 0; i < clauseList.length; i++) {
    let clauses = clauseList[i];
    let index = clauses.findIndex((item) => item.id === id);
    if (index !== -1) {
      i1 = i;
      i2 = index;
      clauseList[i1][i2].content = ccontent;
      break;
    }
  }
  return {
    code: 200,
    data: true,
    message: "一切Ok",
  };
});
