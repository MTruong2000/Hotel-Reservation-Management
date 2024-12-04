import { createBrowserRouter } from 'react-router-dom';
import RequireAuth from '../auth/requireauth';
import Home from '../pages/home';
import User from '../pages/user';
import Login from '../pages/login';
import DashBoard from '../pages/dashboard';
import ServiceManagement from '../pages/service';

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
      { path: 'service', element: <ServiceManagement /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

export default router;
