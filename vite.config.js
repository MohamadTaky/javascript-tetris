/** @type {import('vite').UserConfig} */
import { resolve } from "path";
export default {
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
};
