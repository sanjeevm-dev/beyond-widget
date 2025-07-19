import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: './src/widget-entry.tsx',
      name: 'ChatBotWidget',
      fileName: 'chat-bot-widget',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        globals: {},
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}',
  },
})
