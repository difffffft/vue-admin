import http from "@/api/request";

export const reqLogin = (data: LoginFormType) => http.post("/user/login", data)

export const reqGetRoutes = () => http.post("/getRoutes")