import { createBrowserRouter } from 'react-router-dom';
import RequireAuth from '../auth/requireauth';
import Home from '../pages/home';
import User from '../pages/user';
import Login from '../pages/login';
import DashBoard from '../pages/dashboard';
import ServiceManagement from '../pages/service';
import CategoryRoom from '../pages/categoryroom';
import Product from '../pages/product';
import CategoryProduct from '../pages/categoryproduct';
import Room from '../pages/room';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <Home />
      </RequireAuth>
    ),
    children: [
      { path: '/', element: <DashBoard /> },
      { path: 'user', element: <User /> },
      { path: 'category-room', element: <CategoryRoom /> },
      { path: 'service', element: <ServiceManagement /> },
      { path: 'category-product', element: <CategoryProduct /> },
      { path: 'product', element: <Product /> },
      { path: 'room', element: <Room /> },


    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

export default router;
