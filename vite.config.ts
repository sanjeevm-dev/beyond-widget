import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: "./src/widget-entry.tsx", // ✅ auto-mount entry
      name: "ChatBotWidget",
      fileName: "assistant",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        globals: {},
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": "{}",
  },
});
