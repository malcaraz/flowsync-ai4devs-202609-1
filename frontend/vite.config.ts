import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Redirige las llamadas a la API al backend de AdonisJS en desarrollo
    proxy: {
      "/api": "http://localhost:3333",
    },
  },
});
