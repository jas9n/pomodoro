import React, { createContext, useState, useEffect } from 'react';
import api from '../api';
import { jwtDecode } from 'jwt-decode';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // In AuthContext.jsx
const refreshToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  if (!refreshToken) {
    logout();
    setLoading(false);
    return false; // Add return value
  }

  try {
    const res = await api.post('/api/token/refresh/', { refresh: refreshToken });
    if (res.status === 200) {
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      setIsAuthorized(true);
      return true; // Add return value
    } 
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
  
  logout();
  return false; // Add return value
};

const checkAuth = async () => {
  setLoading(true); // Ensure loading is true while checking
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) {
    logout();
    setLoading(false);
    return;
  }

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        setLoading(false);
        return;
      }
    } else {
      setIsAuthorized(true);
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    logout();
  }
  setLoading(false);
};

  const login = (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
    setIsAuthorized(true);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setIsAuthorized(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthorized, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
