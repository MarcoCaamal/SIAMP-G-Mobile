import { useState } from 'react';
import { authService } from '../services/authService';
import { AuthCredentials, UserRegisterData } from '../types/auth.types';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (userData: UserRegisterData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error en el registro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
  };
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: AuthCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error en el login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
};

export const useSendVerificationCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendVerificationCode = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.sendVerificationCode(email);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al reenviar el código');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendVerificationCode,
    loading,
    error,
  };
};

export const useVerifyEmailCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyEmailCode = async (code: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.verifyEmailCode(code);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al verificar el código');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyEmailCode,
    loading,
    error,
  };
};
