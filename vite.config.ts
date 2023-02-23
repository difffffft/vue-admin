import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig(({ command, mode, ssrBuild }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_APP_ENV, VITE_APP_BASE_API } = env;
  return {
    plugins: [vue()],
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
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    },

    /**
     * 开发环境的跨域代理
     */
    server: {
      port: 80,
      host: true,
      open: true,
      proxy: {
        [VITE_APP_BASE_API]: {
          target: "http://localhost:8080",
          changeOrigin: true,
          rewrite: (p) => p.replace(`^\/${VITE_APP_BASE_API}`, ""),
        },
      },
    },
  };
});
