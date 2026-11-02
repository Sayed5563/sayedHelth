import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// base './' lets the built app run from any folder or sub-path (GitHub Pages, Netlify, a phone's local server).
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['icon.svg', 'apple-touch-icon.png', 'plate.jpg'],
      manifest: {
        name: 'sayedHelth',
        short_name: 'sayedHelth',
        description: 'مخطط وجبات يومي تفاعلي — خطة ١٦٠٠ سعرة',
        lang: 'ar',
        dir: 'rtl',
        id: './',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FAF6EE',
        theme_color: '#1F3D2F',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache everything the app needs, including only the Arabic + Latin font subsets.
        globPatterns: ['**/*.{js,css,html,png,svg,jpg,jpeg,webp}', '**/*-{arabic,latin}-*.woff2'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
