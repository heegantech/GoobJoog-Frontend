import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()], // Fixed: Removed extra comma
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/auth/": {
        target: "https://api.barrowpay.com/",
        changeOrigin: true,
        secure: false, // Optional: Use if the target uses a self-signed certificate
      },
      "/api/": {
        target: "https://api.barrowpay.com/",
        changeOrigin: true,
        secure: false, // Optional: Use if the target uses a self-signed certificate
      },
    },
    // Uncomment the following if you want to use a custom host and port
    // host: "192.168.100.19",
    // port: 3000,
  },
});
