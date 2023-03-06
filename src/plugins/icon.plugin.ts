import { App, Component } from "vue";

/**
 * ElementPlus的所有Icon
 */
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

/**
 * 自定义的Icon，导入
 * 1.图标下载网站：https://tablericons.com/
 *                https://www.iconfont.cn/collections/detail?cid=19238
 * 2.下载SVG格式的ICON，导入src/assets/icon/xxx.svg
 * 3.修改svg文件，颜色值为currentColor
 * 4.在此处导入，并全局注册Icon
 */
import IconHome from "~icons/custom/home.svg";
import IconHomeFill from "~icons/custom/home-fill.svg";


export default {
  install(app: App<Element>) {

    /**
     * 注册所有的ElementPlusIcon
     */
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }

    /**
     * 注册所有的自定义Icon
     */
    app.component("IconHome", IconHome as unknown as Component);
    app.component("IconHomeFill", IconHomeFill as unknown as Component);
  },
};
