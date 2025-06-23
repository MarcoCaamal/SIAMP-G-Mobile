import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/api.config';

// Tipo para las respuestas de error de la API
interface ApiErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

// Clase para manejar la instancia de Axios y sus interceptores
class AxiosService {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;
  private onTokenExpiredCallback?: () => void;
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
    config: AxiosRequestConfig;
  }> = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 30000, // 30 segundos
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // Configurar interceptores para las peticiones y respuestas
  private setupInterceptors(): void {
    // Interceptor de peticiones
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Si la URL es de login, register o refresh, no añadir token
        const isAuthUrl = [
          API_CONFIG.AUTH.LOGIN,
          API_CONFIG.AUTH.REGISTER,
          API_CONFIG.AUTH.REFRESH,
        ].some(endpoint => config.url?.includes(endpoint));

        if (!isAuthUrl) {
          const token = await AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
          if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de respuestas
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiErrorResponse>) => {
        // Obtener la configuración original de la petición para reintentarla después
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        // Si no hay configuración, rechazar el error
        if (!originalRequest) {
          return Promise.reject(error);
        }

        // Verificar si es un error 401 (Unauthorized)
        const isUnauthorized = error.response?.status === 401;
        
        // Verificar si ya se ha reintentado esta petición
        const shouldRetry = !originalRequest._retry;

        // Verificar si la URL no es la de refresh token
        const isNotRefreshEndpoint = !originalRequest.url?.includes(API_CONFIG.AUTH.REFRESH);

        // Si es un error 401, no se ha reintentado y no es un endpoint de refresh
        if (isUnauthorized && shouldRetry && isNotRefreshEndpoint) {
          originalRequest._retry = true;

          // Si ya se está refrescando, encolar la petición actual
          if (this.isRefreshing) {
            return this.enqueueFailedRequest(originalRequest);
          }

          this.isRefreshing = true;
          this.refreshPromise = this.refreshAccessToken();
          
          try {
            // Esperar a que se actualice el token
            const newToken = await this.refreshPromise;
            if (newToken) {
              // Procesar la cola de peticiones fallidas
              this.processQueue(null, newToken);
              
              // Reintentar la petición original con el nuevo token
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            } else {
              // Si no se pudo obtener un nuevo token, rechazar todas las peticiones en cola
              this.processQueue(new Error('Failed to refresh token'), null);
              return Promise.reject(error);
            }
          } catch (refreshError) {
            // Rechazar todas las peticiones en cola
            this.processQueue(refreshError as Error, null);
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
            this.refreshPromise = null;
          }
        }

        // Para otros errores, simplemente rechazarlos
        return Promise.reject(error);
      }
    );
  }

  // Encolar una petición fallida para reintentarla después
  private enqueueFailedRequest(config: AxiosRequestConfig): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.failedQueue.push({
        resolve,
        reject,
        config,
      });
    });
  }

  // Procesar la cola de peticiones fallidas
  private processQueue(error: Error | null, token: string | null): void {
    this.failedQueue.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.config.headers = promise.config.headers || {};
        promise.config.headers['Authorization'] = `Bearer ${token}`;
        promise.resolve(this.axiosInstance(promise.config));
      }
    });
    
    // Limpiar la cola después de procesarla
    this.failedQueue = [];
  }
  // Intentar refrescar el token de acceso
  private async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = await AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
      
      if (!refreshToken) {
        this.handleTokenExpired();
        return null;
      }
      
      // Realizar petición para refrescar el token
      const response = await axios.post<{ 
        _success: boolean; 
        _value?: { accessToken: string; refreshToken: string; }
      }>(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.REFRESH}`, { refreshToken });
      
      const result = response.data;
      
      console.log('Resultado del refresh token:', result);
      
      if (result._success && result._value?.accessToken) {
        // Guardar nuevo access token
        await AsyncStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, result._value.accessToken);
        
        // Opcional: guardar nuevo refresh token si se devuelve
        if (result._value.refreshToken) {
          await AsyncStorage.setItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, result._value.refreshToken);
        }
        
        return result._value.accessToken;
      } else {
        this.handleTokenExpired();
        return null;
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      this.handleTokenExpired();
      return null;
    }
  }
  
  // Manejar cuando el token ha expirado y no se puede refrescar
  private handleTokenExpired(): void {
    // Limpiar tokens
    AsyncStorage.multiRemove([
      API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
      API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
      API_CONFIG.STORAGE_KEYS.USER
    ]);
    
    // Ejecutar callback si existe
    if (this.onTokenExpiredCallback) {
      this.onTokenExpiredCallback();
    }
  }
  
  // Método para establecer el callback cuando los tokens expiren
  public setOnTokenExpiredCallback(callback: () => void): void {
    this.onTokenExpiredCallback = callback;
  }
  
  // Métodos para exponer la instancia de axios a través de métodos proxy
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }
  
  // Obtener la instancia de axios directamente
  public getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Exportar una única instancia
export const axiosService = new AxiosService();

// Para uso directo en los servicios
export default axiosService.getInstance();
