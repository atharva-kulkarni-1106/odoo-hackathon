import React, { createContext, useState } from 'react';
import API from '../api'; // ✅ use your API instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // ✅ Attach token to every request
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password }); // ✅ fixed

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);

    } catch (err) {
      throw err;
    }
  };

  const signup = async (data) => {
    try {
      const res = await API.post('/auth/signup', data); // ✅ fixed

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);

    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
