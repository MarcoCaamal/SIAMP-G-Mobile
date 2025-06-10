import { API_URLS } from '../../shared/config/api.config';
import { httpInterceptor } from '../../shared/services/httpInterceptor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  timezone: string;
  profilePicture: string;
  status: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    silentHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    eventTypes: {
      deviceConnection: boolean;
      deviceDisconnection: boolean;
      scheduledEvent: boolean;
      systemAlerts: boolean;
    };
  };
  accountType: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateProfileData {
  name?: string;
  timezone?: string;
  profilePicture?: string;
}

export interface UpdateNotificationPreferences {
  email?: boolean;
  push?: boolean;
  silentHours?: {
    enabled?: boolean;
    start?: string;
    end?: string;
  };
  eventTypes?: {
    deviceConnection?: boolean;
    deviceDisconnection?: boolean;
    scheduledEvent?: boolean;
    systemAlerts?: boolean;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class UserService {
  async getUserProfile(): Promise<{ isSuccess: boolean; value?: UserProfile; error?: any }> {
    try {
      const response = await httpInterceptor.authenticatedFetch(API_URLS.USERS.PROFILE);
      const data = await response.json();
      
      if (data._isSuccess) {
        return { isSuccess: true, value: data._value };
      } else {
        return { isSuccess: false, error: data._error };
      }
    } catch (error: any) {
      console.error('Error getting user profile:', error);
      if (error.message === 'UNAUTHORIZED') {
        return { isSuccess: false, error: { message: 'UNAUTHORIZED' } };
      }
      return { isSuccess: false, error: 'Error al obtener el perfil' };
    }
  }

  async updateUserProfile(profileData: UpdateProfileData): Promise<{ isSuccess: boolean; value?: UserProfile; error?: any; message?: string }> {
    try {
      const response = await httpInterceptor.authenticatedFetch(API_URLS.USERS.PROFILE, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      
      if (data._isSuccess) {
        return { 
          isSuccess: true, 
          value: data._value, 
          message: data._value?.message || 'Perfil actualizado exitosamente' 
        };
      } else {
        return { isSuccess: false, error: data._error };
      }
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      if (error.message === 'UNAUTHORIZED') {
        return { isSuccess: false, error: { message: 'UNAUTHORIZED' } };
      }
      return { isSuccess: false, error: 'Error al actualizar el perfil' };
    }
  }

  async updateNotificationPreferences(preferences: UpdateNotificationPreferences): Promise<{ isSuccess: boolean; value?: any; error?: any; message?: string }> {
    try {
      const response = await httpInterceptor.authenticatedFetch(API_URLS.USERS.NOTIFICATIONS, {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
      const data = await response.json();
      
      if (data._isSuccess) {
        return { 
          isSuccess: true, 
          value: data._value, 
          message: data._value?.message || 'Preferencias actualizadas exitosamente' 
        };
      } else {
        return { isSuccess: false, error: data._error };
      }
    } catch (error: any) {
      console.error('Error updating notification preferences:', error);
      if (error.message === 'UNAUTHORIZED') {
        return { isSuccess: false, error: { message: 'UNAUTHORIZED' } };
      }
      return { isSuccess: false, error: 'Error al actualizar las preferencias' };
    }
  }

  async changePassword(passwordData: ChangePasswordData): Promise<{ isSuccess: boolean; value?: { message: string }; error?: any }> {
    try {
      const response = await httpInterceptor.authenticatedFetch(API_URLS.USERS.CHANGE_PASSWORD, {
        method: 'POST',
        body: JSON.stringify(passwordData),
      });
      const data = await response.json();
      
      if (data._isSuccess) {
        return { 
          isSuccess: true, 
          value: { message: data._value?.message || 'Contraseña cambiada exitosamente' }
        };
      } else {
        return { isSuccess: false, error: data._error };
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      if (error.message === 'UNAUTHORIZED') {
        return { isSuccess: false, error: { message: 'UNAUTHORIZED' } };
      }
      return { isSuccess: false, error: 'Error al cambiar la contraseña' };
    }
  }
}

export const userService = new UserService();
