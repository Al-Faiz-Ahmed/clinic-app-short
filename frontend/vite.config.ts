import { defineConfig } from 'vite'
import path from "path"
import tsconfigPaths from 'vite-tsconfig-paths';

import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// const aliases = {
//   '/@/': path.resolve(__dirname, 'src') // Replace 'src' with your actual source directory
// };
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),tsconfigPaths()],
  resolve: {
    // alias : aliases
  //   alias: [{ find: '@', replacement: '/src' }],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
