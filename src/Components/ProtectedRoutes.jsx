import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

function ProtectedRoute({ children }) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || user.email !== 'admin@yourdomain.com') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;