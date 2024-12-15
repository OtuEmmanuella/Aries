import { createBrowserRouter } from 'react-router-dom';
import Home from '../Pages/Home/Home';
import App from '../App';
import Login from '../Components/Auth/Login';
import Signup from '../Components/Auth/Signup';
import ForgotPassword from '../Components/Auth/ForgotPassword';
import AdminDashboard from '../Components/Admin/AdminDashboard';
import UserProfile from '../Components/Auth/UserProfile';
import ProductListing from '../Components/Product/ProductListing';
import ProductPage from '../Pages/Product/ProductPage';

// Import components for admin dashboard sections
import ProductsSection from '../Components/Admin/ProductsSection';
import OrdersSection from '../Components/Admin/OrdersSection';
import UsersSection from '../Components/Admin/UsersSection';
import SalesReportSection from '../Components/Admin/SalesReportSection';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/signup",
        element: <Signup />
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
        children: [
          {
            path: "products",
            element: <ProductsSection />
          },
          {
            path: "orders",
            element: <OrdersSection />
          },
          {
            path: "users",
            element: <UsersSection />
          },
          {
            path: "sales",
            element: <SalesReportSection />
          }
        ]
      },
      {
        path: "/profile",
        element: <UserProfile />
      },
      {
        path: "/products",
        element: <ProductListing />
      },
      {
        path: "/product/:slug",
        element: <ProductPage />
      }
    ]
  }
]);

export default router;