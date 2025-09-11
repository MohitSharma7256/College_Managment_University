import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    include: "**/*.{jsx,js}" // Allow JSX in .js files
  })],
  build: {
    outDir: 'dist',
    assetsDir: 'static'
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: []
  }
})
