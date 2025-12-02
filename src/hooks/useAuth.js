import { useState, useEffect } from 'react';
import { fetchUsers } from '../api/api';

const STORAGE_KEY_TOKEN_LOGIN = 'biblioteca_auth_token';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN_LOGIN);
    if (token) {
      try {
        const authData = JSON.parse(token);
        setUser(authData.user);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY_TOKEN_LOGIN);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const users = await fetchUsers();
      
      const foundUser = users.find(
        u => u.email === email && u.password === password
      );

      if (!foundUser) {
        return {
          success: false,
          message: 'Credenciales inválidas',
        };
      }

      const token = btoa(JSON.stringify({
        id: foundUser.id,
        email: foundUser.email,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
      }));

      const authData = {
        token,
        user: {
          id: foundUser.id,
          email: foundUser.email,
          nombre: foundUser.nombre,
        },
      };

      localStorage.setItem(STORAGE_KEY_TOKEN_LOGIN, JSON.stringify(authData));
      setUser(authData.user);
      setIsAuthenticated(true);

      return {
        success: true,
        message: 'Login exitoso',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Error en el servidor',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN_LOGIN);
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };
};
