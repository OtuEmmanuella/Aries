// import { useState, useEffect } from 'react';
// import { openDB } from 'idb';

// const DB_NAME = 'aries-store';
// const DB_VERSION = 1;
// const PRODUCTS_STORE = 'products';
// const PRODUCT_DETAILS_STORE = 'product-details';

// const initDB = async () => {
//   return openDB(DB_NAME, DB_VERSION, {
//     upgrade(db) {
//       if (!db.objectStoreNames.contains(PRODUCTS_STORE)) {
//         db.createObjectStore(PRODUCTS_STORE);
//       }
//       if (!db.objectStoreNames.contains(PRODUCT_DETAILS_STORE)) {
//         db.createObjectStore(PRODUCT_DETAILS_STORE);
//       }
//     },
//   });
// };

// export const useOfflineData = () => {
//   const [db, setDb] = useState(null);

//   useEffect(() => {
//     const setup = async () => {
//       const database = await initDB();
//       setDb(database);
//     };
//     setup();
//   }, []);

//   const saveProducts = async (products) => {
//     if (!db) return;
//     const tx = db.transaction(PRODUCTS_STORE, 'readwrite');
//     const store = tx.objectStore(PRODUCTS_STORE);
//     await store.put(products, 'all-products');
//     await tx.done;
//   };

//   const getProducts = async () => {
//     if (!db) return null;
//     const tx = db.transaction(PRODUCTS_STORE, 'readonly');
//     const store = tx.objectStore(PRODUCTS_STORE);
//     return store.get('all-products');
//   };

//   const saveProductDetail = async (slug, product) => {
//     if (!db) return;
//     const tx = db.transaction(PRODUCT_DETAILS_STORE, 'readwrite');
//     const store = tx.objectStore(PRODUCT_DETAILS_STORE);
//     await store.put(product, slug);
//     await tx.done;
//   };

//   const getProductDetail = async (slug) => {
//     if (!db) return null;
//     const tx = db.transaction(PRODUCT_DETAILS_STORE, 'readonly');
//     const store = tx.objectStore(PRODUCT_DETAILS_STORE);
//     return store.get(slug);
//   };

//   return {
//     saveProducts,
//     getProducts,
//     saveProductDetail,
//     getProductDetail,
//   };
// };