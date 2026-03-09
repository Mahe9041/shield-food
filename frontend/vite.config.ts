import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Any request starting with /api gets forwarded to NestJS
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
