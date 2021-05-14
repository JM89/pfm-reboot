import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import BankAccountList from 'src/pages/BankAccountList';
import SavingsList from 'src/pages/SavingsList';
import Dashboard from 'src/pages/Dashboard';
// import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'bankaccounts', element: <BankAccountList /> },
      { path: 'savings', element: <SavingsList /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: '*', element: <NotFound /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // { path: 'login', element: <Login /> },
      // { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/bankaccounts" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
