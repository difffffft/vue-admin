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
  userList,
} from "@/mock/data/common";

function getQueryParamByKey(url: string, paramName: string) {
  url = decodeURI(url);
  var arrObj = url.split("?");
  if (arrObj.length > 1) {
    var arrPara = arrObj[1].split("&");
    var arr;
    for (var i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");
      if (arr != null && arr[0] == paramName) {
        return decodeURIComponent(arr[1]);
      }
    }
    return "";
  } else {
    return "";
  }
}

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

Mock.mock("/dev/user/getAllUser", (data: any): AppResult => {
  const res = {
    code: 200,
    data: {
      total: 320,
      records: userList,
    },
    message: "一切Ok",
  };
  return res;
});

Mock.mock("/dev/role/getAllRole", (data: any): AppResult => {
  const res = {
    code: 200,
    data: roles,
    message: "一切Ok",
  };
  return res;
});

Mock.mock("/dev/user/deleteByUserId", (data: any): AppResult => {
  let body = JSON.parse(data.body);
  let index = userList.findIndex((item: any) => item.id === body.id);
  if (index !== -1) {
    userList.splice(index, 1);
  }
  return {
    code: 200,
    data: null,
    message: "一切Ok",
  };
});

Mock.mock("/dev/user/insertUser", (data: any): AppResult => {
  let body = JSON.parse(data.body);
  body.id = String(userList.length + 1);
  body.insertTime = "2020-10-26";
  body.roleList = [roles[0]];
  userList.push(body);
  return {
    code: 200,
    data: null,
    message: "一切Ok",
  };
});

Mock.mock("/dev/temp/list", (data: any): AppResult => {
  console.log("z");

  return {
    code: 200,
    data: {
      total: 320,
      list: temps,
    },
    message: "一切Ok",
  };
});

// /dev/permission/getPermissionTree

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

Mock.mock("/dev/clause/updateClauseCategory", (data: any): AppResult => {
  let body: UpdateClauseCategoryForm = JSON.parse(data.body);
  let { id, title } = body;
  let index = clauseTitleList.findIndex((item) => item.id === id);
  if (index !== -1) {
    clauseTitleList[index].title = title;
  }
  return {
    code: 200,
    data: true,
    message: "一切Ok",
  };
});

Mock.mock("/dev/clause/insertClauseCategory", (data: any): AppResult => {
  let body: InsertClauseCategoryForm = JSON.parse(data.body);
  let { title, tempCategoryId } = body;
  clauseTitleList.push({
    id: String(clauseTitleList.length + 2),
    title,
    insertTime: "2023-03-01 12:14:27",
    updateTime: "2023-03-01 12:14:27",
  });
  return {
    code: 200,
    data: true,
    message: "一切Ok",
  };
});

Mock.mock("/dev/clause/deleteClauseCategory", (data: any): AppResult => {
  let body: DeleteCommonForm = JSON.parse(data.body);
  let { id } = body;
  let index = clauseTitleList.findIndex((item) => item.id === id);
  if (index !== -1) {
    clauseTitleList.splice(index, 1);
  }
  return {
    code: 200,
    data: true,
    message: "一切Ok",
  };
});

Mock.mock(
  RegExp("/dev/template/useTemplateById" + ".*"),
  "get",
  (data: any): AppResult => {
    const url = data.url;
    const flag = getQueryParamByKey(url, "flag");

    let key = "";
    let fileUrl = "";

    console.log(flag);

    if (!flag || flag === "0") {
      key = "yyy0111";
      fileUrl =
        "http://124.221.85.86:9000/word-edit/%E5%85%AC%E5%BC%80%E6%8B%9B%E6%A0%87%E7%BB%BC%E5%90%88%E8%AF%84%E6%A0%87%E6%B3%95-%E6%9C%8D%E5%8A%A1A(1).doc";
    } else {
      key = "yyy0222";
      fileUrl = 
        "http://124.221.85.86:9000/word-edit/%E5%85%AC%E5%BC%80%E6%8B%9B%E6%A0%87%E7%BB%BC%E5%90%88%E8%AF%84%E6%A0%87%E6%B3%95-%E6%9C%8D%E5%8A%A1B(1).doc";
    }

    return {
      code: 200,
      data: {
        key,
        fileUrl,
        fileName: "公开招标综合评标法-服务",
        fileType: "doc",
        userId: "xxx",
      },
      message: "一切Ok",
    };
  }
);

Mock.mock(
  RegExp("/dev/template/getTemplateByCategoryId" + ".*"),
  "get",
  (data: any): AppResult => {
    const url = data.url;
    const categoryId = getQueryParamByKey(url, "categoryId");

    // let body: DeleteCommonForm = JSON.parse(data.body);
    // let { id } = body;
    // let index = clauseTitleList.findIndex((item) => item.id === id);
    // if (index !== -1) {
    //   clauseTitleList.splice(index, 1);
    // }

    return {
      code: 200,
      data: {
        records: temps,
        total: temps.length,
      },
      message: "一切Ok",
    };
  }
);

Mock.mock(
  "/dev/clause/getAllClauseListByTempCategoryId",
  (data: any): AppResult => {
    let body: QueryClauseListByTempCategoryIdForm = JSON.parse(data.body);
    let { tempCategoryId } = body;

    let res = clauseTitleList.map((item, index) => {
      item.label = item.title;
      let children = clauseList[index].map((item2) => {
        return {
          id: item2.id,
          label: item2.content,
          biaoxing: false,
        };
      });
      item.biaoxing = '-1'
      item.children = children;
      return item;
    });
    return {
      code: 200,
      data: res,
      message: "一切Ok",
    };
  }
);

Mock.mock("/dev/makeFile", (data: any): AppResult => {
  let body: MakeFileForm = JSON.parse(data.body);
  let { templateId, clauseIdList } = body;

  console.log(templateId);

  return {
    code: 200,
    data: [],
    message: "一切Ok",
  };
});
