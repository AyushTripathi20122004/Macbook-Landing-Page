import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  base: '/Macbook-Landing-Page/',
  plugins: [
    tailwindcss(),
  ],
  assetsInclude: ['**/*.glb']
  
})