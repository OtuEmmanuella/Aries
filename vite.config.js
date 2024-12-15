// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';

// export default defineConfig({
//   plugins: [
//     react(),
//     VitePWA({
//       registerType: 'autoUpdate',
//       includeAssets: ['Aries (2).png', 'icons/*'],
//       manifest: {
//         name: 'Aries Fashion Store',
//         short_name: 'Aries',
//         description: 'Premium fashion and sportswear store',
//         theme_color: '#000000',
//         icons: [
//           {
//             src: '/icons/icon-192x192.png',
//             sizes: '192x192',
//             type: 'image/png'
//           },
//           {
//             src: '/icons/icon-512x512.png',
//             sizes: '512x512',
//             type: 'image/png'
//           },
//           {
//             src: '/icons/icon-512x512.png',
//             sizes: '512x512',
//             type: 'image/png',
//             purpose: 'any maskable'
//           }
//         ]
//       },
//       workbox: {
//         globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,gif}'],
//         runtimeCaching: [
//           {
//             urlPattern: ({ url }) => url.hostname === '26wq1wsf.api.sanity.io',
//             handler: 'NetworkFirst',
//             options: {
//               cacheName: 'sanity-api-cache',
//               expiration: {
//                 maxEntries: 100,
//                 maxAgeSeconds: 72 * 60 * 60 // 72 hours
//               },
//               networkTimeoutSeconds: 10
//             }
//           },
//           {
//             urlPattern: ({ url }) => url.hostname === 'cdn.sanity.io',
//             handler: 'CacheFirst',
//             options: {
//               cacheName: 'sanity-image-cache',
//               expiration: {
//                 maxEntries: 200,
//                 maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
//               }
//             }
//           }
//         ]
//       }
//     })
//   ],
//   server: {
//     host: '0.0.0.0',
//     port: 3000,
//   },
//   define: {
//     'process.env': {}
//   }
// });

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      host: 'localhost',
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})