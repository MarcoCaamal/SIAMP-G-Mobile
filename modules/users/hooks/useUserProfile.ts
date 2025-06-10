import { useState } from 'react';
import { useAuthContext } from '../../auth/context/AuthContext';
import { ChangePasswordData, UpdateNotificationPreferences, UpdateProfileData, UserProfile, userService } from '../services/userService';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuthContext();
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.getUserProfile();
      if (result.isSuccess && result.value) {
        setProfile(result.value);
      } else {
        if (result.error?.message?.includes('UNAUTHORIZED') || result.error === 'No valid access token') {
          // Token inválido, hacer logout
          await logout();
        } else {
          setError(result.error?.message || 'Error al cargar el perfil');
        }
      }
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED' || err.message === 'No valid access token') {
        await logout();
      } else {
        setError('Error de conexión');
      }
    } finally {
      setLoading(false);
    }
  };
  const updateProfile = async (data: UpdateProfileData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.updateUserProfile(data);
      if (result.isSuccess && result.value) {
        setProfile(result.value);
        return { success: true, message: result.message || 'Perfil actualizado exitosamente' };
      } else {
        if (result.error?.message?.includes('UNAUTHORIZED') || result.error === 'No valid access token') {
          await logout();
        }
        const errorMessage = result.error?.message || 'Error al actualizar el perfil';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED' || err.message === 'No valid access token') {
        await logout();
      }
      const errorMessage = 'Error de conexión';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  const updateNotifications = async (preferences: UpdateNotificationPreferences) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.updateNotificationPreferences(preferences);
      if (result.isSuccess) {
        // Actualizar el perfil local con las nuevas preferencias
        if (profile && result.value) {
          setProfile({
            ...profile,
            notificationPreferences: result.value,
          });
        }
        return { success: true, message: result.message || 'Preferencias actualizadas exitosamente' };
      } else {
        if (result.error?.message?.includes('UNAUTHORIZED') || result.error === 'No valid access token') {
          await logout();
        }
        const errorMessage = result.error?.message || 'Error al actualizar las preferencias';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED' || err.message === 'No valid access token') {
        await logout();
      }
      const errorMessage = 'Error de conexión';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  const changePassword = async (passwordData: ChangePasswordData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.changePassword(passwordData);
      if (result.isSuccess && result.value) {
        return { success: true, message: result.value.message };
      } else {
        if (result.error?.message?.includes('UNAUTHORIZED') || result.error === 'No valid access token') {
          await logout();
        }
        const errorMessage = result.error?.message || 'Error al cambiar la contraseña';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED' || err.message === 'No valid access token') {
        await logout();
      }
      const errorMessage = 'Error de conexión';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateNotifications,
    changePassword,
  };
};
