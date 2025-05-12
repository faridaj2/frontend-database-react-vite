import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://backend.dev/",
        changeOrigin: true,
        rewrite: (path) => path,
      },
      "/storage": {
        target: "http://backend.dev/",
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});
