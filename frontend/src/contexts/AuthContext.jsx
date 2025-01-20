import React, { createContext, useState, useEffect } from 'react';
import api from '../api';
import { jwtDecode } from 'jwt-decode';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      logout();
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/api/token/refresh/', { refresh: refreshToken });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
    setLoading(false);
  };

  const checkAuth = async () => {
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
        await refreshToken();
      } else {
        setIsAuthorized(true);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error decoding token or invalid token:', error);
      logout();
      setLoading(false);
    }
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
