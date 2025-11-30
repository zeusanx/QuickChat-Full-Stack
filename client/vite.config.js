import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 5173,

    // FULL FIX: Ensure ALL /api requests go to backend
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },

  // FULL FIX: Completely disable Vite's base64 media handling
  build: {
    assetsInlineLimit: 0,
  },

  // Hard disable any Cloudinary inference
  define: {
    "process.env": {},
    __CLOUDINARY_UPLOAD__: false,
  },
})
