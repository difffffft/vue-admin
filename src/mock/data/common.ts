export const roles = [
  {
    id: "0",
    roleName: "开发人员",
    insertTime: "2023-02-28 13:40:44",
  },
  {
    id: "1",
    roleName: "运营人员",
    insertTime: "2023-02-28 13:40:44",
  },
];

export const userList = <any>[];
for (let i = 0; i < 5; i++) {
  let r = i % 2 === 0 ? [roles[0]] : roles;
  userList.push({
    id: String(i),
    phoneNum: "xxxxxx",
    nickname: "小明" + i,
    insertTime: "2020-10-26",
    roleList: r,
    comment: "备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注",
  });
}

export const temps = [
  {
    id: "0",
    fileName: "XXXXXX.doc",
    insertTime: "2023-03-01 12:14:27",
    operator: "小王",
    link: "https://sxl1234.oss-cn-hangzhou.aliyuncs.com/animal/1_1676555304321.docx",
  },
  {
    id: "1",
    fileName: "YYYYYY.doc",
    insertTime: "2023-03-01 12:14:27",
    operator: "小张",
    link: "https://sxl1234.oss-cn-hangzhou.aliyuncs.com/animal/1_1676555524391.docx",
  },
  {
    id: "2",
    fileName: "ZZZZZZ.doc",
    insertTime: "2023-03-01 12:14:27",
    operator: "小李",
    link: "https://sxl1234.oss-cn-hangzhou.aliyuncs.com/animal/1_1676555721094.docx",
  },
];

export const clauseList = [
  [
    {
      id: "1001",
      content:
        "应答人应为中华人民共和国境内注册的独立法人单位，具有合法有效的企业法人营业执照、税务登记证及组织机构代码证或证照合一的营业执照；",
    },
    {
      id: "1002",
      content:
        "应答人须是中华人民共和国境内具有独立承担民事责任能力的法人，或具备国家认可经营资格的其他组织。",
    },
    {
      id: "1003",
      content: "应答人须是xxxxxxxxxxxxxxxxxxxxxxxxxxx",
    },
  ],
  [
    {
      id: "2001",
      content:
        "条款AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    },
    {
      id: "2002",
      content:
        "条款BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    },
    {
      id: "2003",
      content:
        "条款CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    },
  ],
  [
    {
      id: "3001",
      content:
        "条款DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
    },
    {
      id: "3002",
      content:
        "条款EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
    },
    {
      id: "3003",
      content:
        "条款FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
    },
  ],
];

export const clauseTitleList = [
  {
    id: "1",
    title: "资质要求",
    insertTime: "2023-03-01 12:14:27",
    updateTime: "2023-03-01 12:14:27",
  },
  {
    id: "2",
    title: "信誉要求",
    insertTime: "2023-03-01 12:14:27",
    updateTime: "2023-03-01 12:14:27",
  },
  {
    id: "3",
    title: "业绩要求",
    insertTime: "2023-03-01 12:14:27",
    updateTime: "2023-03-01 12:14:27",
  },
];

export const tempCategoryList = [
  {
    id: "1",
    fileCategoryName: "服务最低价",
    insertTime: "2023-03-01 12:14:27",
    updateTime: "2023-03-01 12:14:27",
  },
  {
    id: "2",
    fileCategoryName: "货物最低价",
    insertTime: "2023-03-01 12:14:27",
    updateTime: "2023-03-01 12:14:27",
  },
  {
    id: "3",
    fileCategoryName: "服务综合评估",
    insertTime: "2023-03-01 12:14:27",
    updateTime: "2023-03-01 12:14:27",
  },
  {
    id: "4",
    fileCategoryName: "货物综合评估",
    insertTime: "2023-03-01 12:14:27",
    updateTime: "2023-03-01 12:14:27",
  },
];
