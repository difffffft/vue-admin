import http from "@/api/request";

// export const reqGet = () => http.get("/home/getData")

export const reqLogin = (data: LoginFormType) => http.post("/login", data)

export const reqGetRoutes = () => http.post("/getRoutes")