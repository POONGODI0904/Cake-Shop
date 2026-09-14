import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('sweetcrumb_token'));
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('sweetcrumb_token');
      if (storedToken) {
        try {
          const res = await authAPI.getProfile();
          setUser(res.data.user);
        } catch (err) {
          console.error('Session expired or invalid token', err);
          localStorage.removeItem('sweetcrumb_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { token: newToken, user: loggedUser } = res.data;
      localStorage.setItem('sweetcrumb_token', newToken);
      setToken(newToken);
      setUser(loggedUser);
      showToast(`Welcome back, ${loggedUser.name}!`, 'success');
      return { success: true, user: loggedUser };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('sweetcrumb_token', newToken);
      setToken(newToken);
      setUser(newUser);
      showToast(`Account created! Welcome to SweetCrumb, ${newUser.name}.`, 'success');
      return { success: true, user: newUser };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('sweetcrumb_token');
    setToken(null);
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

  const refreshProfile = async () => {
    try {
      const res = await authAPI.getProfile();
      setUser(res.data.user);
    } catch (e) {
      console.error(e);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        setUser,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
