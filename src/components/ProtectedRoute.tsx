import React from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = observer(({ children }) => {
  const { authStore } = useStores();

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
});

export default ProtectedRoute;
