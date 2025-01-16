import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });

  useEffect(() => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      const user = JSON.parse(localStorage.getItem('user'));
      if (token && user) {
        setAuth({ token, user });
      }
    } catch (error) {
      console.error("Failed to load auth data from localStorage", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
