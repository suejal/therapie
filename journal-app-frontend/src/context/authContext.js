import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        api.defaults.headers.common['Authorization'] = token;
        try {
          const userData = JSON.parse(localStorage.getItem('user'));
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };
    loadUser();
  }, []);
  
  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    
    api.defaults.headers.common['Authorization'] = res.data.token;
    
    setUser(res.data.user);
    setIsAuthenticated(true);
    
    return res.data;
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    
    setUser(null);
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};