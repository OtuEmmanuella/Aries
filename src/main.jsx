import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/router.jsx'
import { AuthContextProvider } from './Context/AuthContext.jsx'
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
// ... log other environment variables


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <AuthContextProvider>
         <RouterProvider router={router} />
      </AuthContextProvider>
  </React.StrictMode>,
)
