import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://backend.dev",
        changeOrigin: true,
        rewrite: (path) => path,
      },
      "/storage": {
        target: "https://backend.dev",
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});
