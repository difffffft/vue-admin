import Mock from "mockjs";
import Cookie from "js-cookie";
import { superAdminData, defaultAdminData } from "@/mock/data/login";
import { superAdminRoutesData, defaultAdminRoutesData } from "@/mock/data/routes";

Mock.setup({ timeout: "300-1000" });
Mock.mock("/dev/user/login", (data: any) => {
  let body: LoginFormType = JSON.parse(data.body);
  if (body.username === "admin") {
    return superAdminData;
  }
  return defaultAdminData;
});
Mock.mock("/dev/getRoutes", (data: any) => {
  if (Cookie.get("token") === "super_admin") {
    return superAdminRoutesData;
  }
  if (Cookie.get("token") === "default_admin") {
    return defaultAdminRoutesData;
  }
  return defaultAdminRoutesData;
});
