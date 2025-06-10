import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, API_URLS } from '../../shared/config/api.config';

class HttpInterceptor {
  private onTokenExpiredCallback: (() => void) | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  setOnTokenExpiredCallback(callback: () => void) {
    this.onTokenExpiredCallback = callback;
  }

  private async refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
      console.log('Refreshing access token...');
      
      const response = await fetch(API_URLS.AUTH.REFRESH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data._isSuccess && data._value?.accessToken) {
        // Guardar el nuevo access token
        await AsyncStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, data._value.accessToken);
        console.log('Token refreshed successfully');
        return data._value.accessToken;
      } else {
        // Refresh token inválido o expirado
        console.log('Refresh token expired or invalid');
        await this.clearTokens();
        if (this.onTokenExpiredCallback) {
          this.onTokenExpiredCallback();
        }
        return null;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      await this.clearTokens();
      if (this.onTokenExpiredCallback) {
        this.onTokenExpiredCallback();
      }
      return null;
    }
  }

  private async clearTokens() {
    await AsyncStorage.multiRemove([
      API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, 
      API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, 
      API_CONFIG.STORAGE_KEYS.USER
    ]);
  }
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    // Obtener el token de acceso
    let accessToken = await AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!accessToken) {
      throw new Error('No access token available');
    }

    // Realizar la petición inicial
    const response = await this.makeRequest(url, options, accessToken);

    // Si no es 401, devolver la respuesta directamente
    if (response.status !== 401) {
      return response;
    }

    // Si es 401, verificar el formato del error
    try {
      const errorData = await response.clone().json();
      
      // Verificar si es el formato de error esperado
      const isTokenError = (
        errorData.statusCode === 401 && 
        errorData.error === "Unauthorized" && 
        errorData.message && 
        (errorData.message.includes("expired") || errorData.message.includes("Invalid"))
      );

      if (!isTokenError) {
        // Si no es un error de token, devolver la respuesta original
        return response;
      }
    } catch (error) {
      // Si no se puede parsear el JSON, asumir que es un error de token
      console.log('Could not parse error response, assuming token error');
    }

    // Si es 401 por token expirado, intentar refrescar el token
    console.log('Token expired, attempting refresh...');

    // Si ya se está refrescando, esperar a que termine
    if (this.isRefreshing && this.refreshPromise) {
      const newToken = await this.refreshPromise;
      if (newToken) {
        return this.makeRequest(url, options, newToken);
      } else {
        throw new Error('UNAUTHORIZED');
      }
    }

    // Iniciar el proceso de refresh
    this.isRefreshing = true;
    const refreshToken = await AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    
    if (!refreshToken) {
      this.isRefreshing = false;
      throw new Error('No refresh token available');
    }

    // Crear la promesa de refresh
    this.refreshPromise = this.refreshAccessToken(refreshToken);
    
    try {
      const newAccessToken = await this.refreshPromise;
      
      if (newAccessToken) {
        // Reintentar la petición original con el nuevo token
        return this.makeRequest(url, options, newAccessToken);
      } else {
        throw new Error('UNAUTHORIZED');
      }
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async makeRequest(url: string, options: RequestInit, accessToken: string): Promise<Response> {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }
}

export const httpInterceptor = new HttpInterceptor();
