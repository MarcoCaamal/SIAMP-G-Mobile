import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User } from '../types/auth.types';

interface AuthContextType {
  authState: AuthState;
  login: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCESS_TOKEN: '@siamp_access_token',
  REFRESH_TOKEN: '@siamp_refresh_token',
  USER: '@siamp_user',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del almacenamiento al iniciar la app
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      setIsLoading(true);
      
      const [accessToken, refreshToken, userString] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
      ]);

      if (accessToken && refreshToken && userString) {
        const user = JSON.parse(userString);
        
        setAuthState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      // Si hay error, limpiar el almacenamiento
      await clearStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (accessToken: string, refreshToken: string, user: User) => {
    try {
      // Guardar en AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
      ]);

      // Actualizar estado
      setAuthState({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Limpiar AsyncStorage
      await clearStorage();
      
      // Limpiar estado
      setAuthState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const clearStorage = async () => {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER),
    ]);
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
