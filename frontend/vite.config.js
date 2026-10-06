import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'frontend', // Tells Vite to look inside frontend/ for index.html
  plugins: [react()],
  build: {
    outDir: 'dist',  // Builds to frontend/dist
    emptyOutDir: true
  }
});