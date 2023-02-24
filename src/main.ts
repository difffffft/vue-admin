import { createApp } from "vue";
import { pinia } from "@/plugins/app-pinia";

// 第三方组件库样式
import "element-plus/dist/index.css";
import "nprogress/nprogress.css";

// ElementPlus框架
import ElementPlus from "element-plus";
// ElementPlusIcon图标
import ElementPlusIconPlugin from "@/plugins/element-plus-icon";
// ElementPlus中文语言包
import locale from "element-plus/lib/locale/lang/zh-cn";

// MOCK数据
import "@/mock";
// 全局样式
import "@/style/index";

import App from "./App.vue";
import router from "@/router";

// 创建App
const app = createApp(App);

// 使用pinia作为全局状态管理
app.use(pinia);

// 使用路由
app.use(router);

// ElementPlus的图标
app.use(ElementPlusIconPlugin);

// 使用ElementPlus
app.use(ElementPlus, { locale: locale });

// 挂载到页面
app.mount("#app");
