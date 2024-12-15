// const CACHE_NAME = 'aries-store-v1';
// const STATIC_ASSETS = [
//   '/',
//   '/index.html',
//   '/manifest.json',
//   '/src/index.css',
//   '/src/App.css',
//   '/src/Components/Header/Header.css',
//   '/src/Components/Footer/Footer.css',
//   '/src/Pages/Home/Home.css',
//   '/src/Components/Product/ProductListing.jsx'
// ];

// const IMAGE_CACHE = 'aries-images-v1';
// const API_CACHE = 'aries-api-v1';

// // Install Service Worker
// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(STATIC_ASSETS);
//     })
//   );
// });

// // Activate and Clean up old caches
// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames
//           .filter((name) => name.startsWith('aries-'))
//           .filter((name) => name !== CACHE_NAME && name !== IMAGE_CACHE && name !== API_CACHE)
//           .map((name) => caches.delete(name))
//       );
//     })
//   );
// });

// // Fetch Handler with Network-first strategy for API calls and Cache-first for assets
// self.addEventListener('fetch', (event) => {
//   const url = new URL(event.request.url);

//   // Handle Sanity API Calls (Network First with Cache Fallback)
//   if (url.hostname === '26wq1wsf.api.sanity.io') {
//     event.respondWith(
//       fetch(event.request)
//         .then((response) => {
//           if (!response || response.status !== 200) {
//             throw new Error('Network response was not ok');
//           }
//           const clonedResponse = response.clone();
//           caches.open(API_CACHE).then((cache) => {
//             cache.put(event.request, clonedResponse);
//           });
//           return response;
//         })
//         .catch(() => {
//           // If network fails, serve the cached API data
//           return caches.match(event.request).then((cachedResponse) => {
//             if (cachedResponse) {
//               return cachedResponse; // Serve cached data
//             } else {
//               // Return a fallback response if no cached data is available
//               return new Response(
//                 '<h1>No Internet Connection</h1><p>Please check your network settings.</p>',
//                 {
//                   headers: { 'Content-Type': 'text/html' },
//                 }
//               );
//             }
//           });
//         })
//     );
//     return;
//   }

//   // Handle Sanity Images (Cache First)
//   if (url.hostname === 'cdn.sanity.io') {
//     event.respondWith(
//       caches.match(event.request).then((response) => {
//         if (response) return response; // Return cached response if found

//         return fetch(event.request).then((response) => {
//           const clonedResponse = response.clone();
//           caches.open(IMAGE_CACHE).then((cache) => {
//             cache.put(event.request, clonedResponse);
//           });
//           return response;
//         });
//       })
//     );
//     return;
//   }

//   // Handle other requests (Static Assets - Cache First)
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       if (response) return response; // Return cached response if found

//       return fetch(event.request).then((response) => {
//         if (!response || response.status !== 200 || response.type !== 'basic') {
//           return response; // Don't cache responses that are not valid
//         }

//         const clonedResponse = response.clone();
//         caches.open(CACHE_NAME).then((cache) => {
//           cache.put(event.request, clonedResponse);
//         });
//         return response;
//       });
//     })
//   );
// });

// // Handle Background Sync for offline cart operations
// self.addEventListener('sync', (event) => {
//   if (event.tag === 'sync-cart') {
//     event.waitUntil(syncCart());
//   }
// });

// async function syncCart() {
//   try {
//     const cartData = await getCartDataFromIndexedDB();
//     await fetch('/api/sync-cart', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(cartData)
//     });
//   } catch (error) {
//     console.error('Cart sync failed:', error);
//   }
// }
