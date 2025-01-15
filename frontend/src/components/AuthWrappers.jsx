import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Renders children only if the user is authenticated
export function Authenticated({ children }) {
  const { isAuthorized } = useContext(AuthContext);
  return isAuthorized ? <>{children}</> : null;
}

// Renders children only if the user is not authenticated
export function NotAuthenticated({ children }) {
  const { isAuthorized } = useContext(AuthContext);
  return !isAuthorized ? <>{children}</> : null;
}
