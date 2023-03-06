import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { ElMessage } from "element-plus";
import Cookie from "js-cookie";


const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 3 * 1000,
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.set("token", Cookie.get("token"));
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: any) => {
    if (!response.data) {
      let message = "接口异常！";
      ElMessage.error(message);
      return Promise.reject({ message });
    } else if (response.data.code !== 200) {
      ElMessage.error(response.data.message);
      return Promise.reject({ message: response.data.message });
    }
    return Promise.resolve(response.data);
  },
  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 302:
          error.message = "重定向了!";
          break;
        case 400:
          error.message = "错误请求";
          break;
        case 401:
          error.message = "未授权，请重新登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = "请求错误,未找到该资源";
          break;
        case 405:
          error.message = "请求方法未允许";
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器端出错";
          break;
        case 501:
          error.message = "网络未实现";
          break;
        case 502:
          error.message = "网络错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网络超时";
          break;
        case 505:
          error.message = "http版本不支持该请求";
          break;
        default:
          error.message = `连接错误${error.response.status}`;
      }
    } else {
      // 超时处理
      if (JSON.stringify(error).includes("timeout")) {
      }
      error.message = "连接服务器失败";
    }
    ElMessage.error(error.message);
    return Promise.reject({ message: error.message });
  }
);

export default service;
