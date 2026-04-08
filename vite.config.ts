import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  
  // Vercel automatically sets VERCEL = "1"
  // GitHub Pages needs '/data-alchemy/', Vercel needs '/'
  const isVercel = process.env.VERCEL || env.VERCEL || process.env.VERCEL_ENV || env.VERCEL_ENV;
  const basePath = isVercel ? '/' : '/data-alchemy/';

  return {
    plugins: [react(), tailwindcss()],
    base: basePath,
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
