import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tpy_token');
    const userSession = localStorage.getItem('tpy_user_session');
    
    if (token && userSession) {
      try {
        const parsedUser = JSON.parse(userSession);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('tpy_token');
        localStorage.removeItem('tpy_user_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Primero, verificamos si el usuario existe y la contraseña coincide
      // En un entorno real, esto debería ser un endpoint de login dedicado
      // Por ahora, usaremos un flujo simple: buscar usuario por email y verificar
      const response = await api.get(`/usuarios/email/${email}`);
      
      // Para fines de demostración, aceptamos cualquier contraseña
      // En un entorno real, deberías verificar la contraseña en el backend
      const userData = response.data;
      
      // Simulamos un token JWT
      const fakeToken = btoa(`${email}:${Date.now()}`);
      
      localStorage.setItem('tpy_token', fakeToken);
      localStorage.setItem('tpy_user_session', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.error || 'Credenciales inválidas' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('tpy_token');
    localStorage.removeItem('tpy_user_session');
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
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
