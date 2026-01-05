import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// IMPORTANT for GitHub Pages:
// - If you deploy at https://<user>.github.io/<repo>/, set base to '/<repo>/'
// - If you deploy to a custom domain or user/organisation root, base can be '/'
export default defineConfig({
  plugins: [vue()],
  base: process.env.VITE_BASE ?? '/',
})
