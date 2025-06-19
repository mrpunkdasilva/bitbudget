import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types/User';
import { authAPI, userAPI } from '../services/api';
import { useNotification } from '../components/NotificationManager';

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { error, success } = useNotification();

  useEffect(() => {
    // Check if user is logged in
    const storedToken = localStorage.getItem('@BitBudget:token');
    const storedUser = localStorage.getItem('@BitBudget:user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await authAPI.login(email, password);

      // Save to state
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setToken(data.token);

      // Save to localStorage
      localStorage.setItem('@BitBudget:token', data.token);
      localStorage.setItem(
        '@BitBudget:user',
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      );

      success('Login realizado com sucesso!');
    } catch (err) {
      error('Falha no login. Verifique suas credenciais.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      await authAPI.register(name, email, password);
      success('Registro realizado com sucesso! Verifique seu email para ativar sua conta.');
    } catch (err) {
      error('Falha no registro. Tente novamente.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);

    // Clear localStorage
    localStorage.removeItem('@BitBudget:token');
    localStorage.removeItem('@BitBudget:user');

    success('Logout realizado com sucesso!');
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!token) throw new Error('User not authenticated');

      setIsLoading(true);
      const updatedUser = await userAPI.updateProfile(token, userData);

      // Update state
      setUser(prevUser => {
        if (!prevUser) return updatedUser;
        return { ...prevUser, ...updatedUser };
      });

      // Update localStorage
      localStorage.setItem(
        '@BitBudget:user',
        JSON.stringify({
          ...user,
          ...updatedUser,
        })
      );

      success('Perfil atualizado com sucesso!');
    } catch (err) {
      error('Falha ao atualizar perfil. Tente novamente.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
