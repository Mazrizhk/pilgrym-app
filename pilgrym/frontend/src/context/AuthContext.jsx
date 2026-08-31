import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginRequest, registerRequest, getMeRequest } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('pilgrym_token');
    if (!token) {
      setLoading(false);
      return;
    }
    getMeRequest()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('pilgrym_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await loginRequest({ email, password });
    localStorage.setItem('pilgrym_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await registerRequest(payload);
    localStorage.setItem('pilgrym_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('pilgrym_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
