import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import { createHtmlPlugin } from "vite-plugin-html";
import Icons from "unplugin-icons/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";

export default defineConfig(({ command, mode, ssrBuild }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_APP_ENV, VITE_APP_BASE_API, VITE_APP_OFFICE_BASE_API } = env;
  return {
    base: VITE_APP_ENV === "production" ? "./" : "/",
    plugins: [
      /**
       * Vue编译插件
       */
      vue(),

      /**
       * 可以在script声明组件的name
       */
      VueSetupExtend(),

      /**
       * 环境变量注入到html使用
       * <%- officeApi %>
       */
      createHtmlPlugin({
        inject: {
          data: {
            officeApi: VITE_APP_OFFICE_BASE_API,
            officeDocmenutUrlScript: `<script async src="${VITE_APP_OFFICE_BASE_API}/web-apps/apps/api/documents/api.js"></script>`,
          },
        },
      }),

      /**
       * 自定义SVG图标
       */
      Icons({
        compiler: "vue3",
        customCollections: {
          custom: FileSystemIconLoader("src/assets/icon"),
        },
      }),
    ],
    resolve: {
      /**
       * 别名
       */
      alias: {
        "~": path.resolve(__dirname, "./"),
        "@": path.resolve(__dirname, "./src"),
      },

      /**
       * 忽略导入的文件名后缀
       */
      extensions: [
        ".mjs",
        ".js",
        ".ts",
        ".jsx",
        ".tsx",
        ".json",
        ".vue",
        ".css",
        ".scss",
      ],
    },

    /**
     * MOCK环境的反向代理
     */
    server: {
      port: 80,
      host: true,
      open: true,
      proxy: {
        [VITE_APP_BASE_API]: {
          target: "http://localhost",
          changeOrigin: true,
          rewrite: (p) => p.replace(`^\/${VITE_APP_BASE_API}`, ""),
        },
      },
    },
  };
});
