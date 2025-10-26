import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'coffee-house',
  base: './',
  resolve: {
    alias: {
      '/src': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'coffee-house/index.html'),
        menu: resolve(__dirname, 'coffee-house/menu.html'),
        signin: resolve(__dirname, 'coffee-house/signin.html'),
        registration: resolve(__dirname, 'coffee-house/registration.html'),
        cart: resolve(__dirname, 'coffee-house/cart.html')
      }
    },
    watch: {
      buildDelay: 0
    }
  },
  server: {
    open: '/index.html'
  }
});

