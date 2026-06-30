import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { DashboardLayout } from './components/DashboardLayout';
import { AnvaiaExecutive } from './pages/AnvaiaExecutive';
import { Hyperpersonalized } from './pages/Hyperpersonalized';
import { AutoReminder } from './pages/AutoReminder';
import { Upselling } from './pages/Upselling';
import { CrossSelling } from './pages/CrossSelling';
import { AutoDebit } from './pages/AutoDebit';
import { GeoMerchant } from './pages/GeoMerchant';
import { Login } from './pages/Login';

// Simple auth guard
function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, Component: AnvaiaExecutive },
      { path: 'hyperpersonalized', Component: Hyperpersonalized },
      { path: 'auto-reminder', Component: AutoReminder },
      { path: 'upselling', Component: Upselling },
      { path: 'cross-selling', Component: CrossSelling },
      { path: 'auto-debit', Component: AutoDebit },
      { path: 'geo-merchant', Component: GeoMerchant },
      // Catch-all: redirect unknown routes (termasuk /index) ke home
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}