import Mock from "mockjs";
import Cookie from "js-cookie";
import { superAdminData, defaultAdminData } from "@/mock/data/login";
import { superAdminUserData, defaultAdminUserData } from "@/mock/data/user";

Mock.setup({ timeout: "300-1000" });
Mock.mock("/dev-api/login", (data: any) => {
  let body: LoginFormType = JSON.parse(data.body);
  if (body.username === "admin") {
    return superAdminData;
  }
  return defaultAdminData;
});
Mock.mock("/dev-api/getRoutes", (data: any) => {
  if (Cookie.get("token") === "super_admin") {
    return superAdminUserData;
  }
  if (Cookie.get("token") === "default_admin") {
    return defaultAdminUserData;
  }
});
