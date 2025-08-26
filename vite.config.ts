import path from 'path';
import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // add more if you like:
      // '@components': path.resolve(__dirname, './src/components'),
      // '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
});
