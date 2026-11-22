import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (userId, password) => {
    const response = await axiosClient.post('/auth/login', { userId, password });
    const data = response.data;
    localStorage.setItem('token', data.token);
    const userData = {
      userId: data.userId,
      fullName: data.fullName,
      role: data.role,
      mustChangePassword: data.mustChangePassword,
      entityId: data.entityId
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const changePassword = async (oldPassword, newPassword) => {
    await axiosClient.post('/auth/change-password', { oldPassword, newPassword });
    if (user && user.mustChangePassword) {
      const updated = { ...user, mustChangePassword: false };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    changePassword,
    isAuthenticated: !!user,
    role: user ? user.role : null,
    mustChangePassword: user ? user.mustChangePassword : false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
