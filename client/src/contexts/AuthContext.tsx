import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const apiUrl = import.meta.env.backendurl || 'http://localhost:3015';

interface User {
  id: number;
  username: string;
  adm_bool: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 Ao iniciar, verifica se já existe token no cookie
  useEffect(() => {
    const savedToken = Cookies.get('yamaphone_token');

    if (savedToken) {
      setToken(savedToken);

      // opcional: validar token na API e buscar usuário
      fetch(`${apiUrl}/api/me`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setUser(data.user);
        })
        .catch(() => {
          Cookies.remove('yamaphone_token');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Falha ao fazer login');
      }

      const data = await response.json();

      setToken(data.token);
      setUser(data.user);

      // 🔥 salva no cookie (1 dia)
      Cookies.set('yamaphone_token', data.token, {
        expires: 1,
        secure: true,
        sameSite: 'Strict',
      });

    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Falha ao registrar');
      }

      const data = await response.json();

      setToken(data.token);
      setUser(data.user);

      Cookies.set('yamaphone_token', data.token, {
        expires: 1,
        secure: true,
        sameSite: 'Strict',
      });

    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('yamaphone_token');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    register,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.adm_bool ?? false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
