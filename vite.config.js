import { defineConfig } from 'vite'
// import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'cut-tree',
      formats: ['es'],
    },
  },

})
