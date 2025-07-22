import { API_CONFIG } from '../../shared/config/api.config';
import axios from '../../shared/utils/axios';

// Interfaces para modos de iluminación
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ColorState {
  mode: 'rgb' | 'temperature';
  rgb: RGBColor;
  temperature: number;
}

export interface DeviceState {
  power: 'on' | 'off';
  brightness: number;
  color: ColorState;
}

export interface Transition {
  type: 'fade' | 'instant';
  duration: number;
}

export interface SequenceStep {
  duration: number;
  state: DeviceState;
  transition: Transition;
}

export interface ScheduleTime {
  hour: number;
  minute: number;
}

export interface TimeRange {
  start: ScheduleTime;
  end: ScheduleTime;
}

export interface LightMode {
  id: string;
  name: string;
  description?: string;
  habitatType: 'terrarium' | 'aquarium' | 'garden' | 'greenhouse';
  sequence: SequenceStep[];
  schedule?: {
    isEnabled: boolean;
    timeRanges: TimeRange[];
  };
  isSystemMode: boolean;
  isShared: boolean;
  shareCode?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLightModeDto {
  name: string;
  description?: string;
  habitatType: 'terrarium' | 'aquarium' | 'garden' | 'greenhouse';
  sequence: SequenceStep[];
  schedule?: {
    isEnabled: boolean;
    timeRanges: TimeRange[];
  };
}

export interface UpdateLightModeDto {
  name?: string;
  description?: string;
  habitatType?: 'terrarium' | 'aquarium' | 'garden' | 'greenhouse';
  sequence?: SequenceStep[];
  schedule?: {
    isEnabled: boolean;
    timeRanges: TimeRange[];
  };
}

export interface ImportSharedModeDto {
  shareCode: string;
}

export interface LightModeListResponse {
  lightModes: LightMode[];
  total: number;
}

export interface ShareModeResponse {
  shareCode: string;
  expiresAt: string;
}

// Respuesta estándar de la API
export interface ApiResponse<T> {
  _isSuccess: boolean;
  _value?: T;
  _error?: string;
}

class LightModeService {
  private readonly baseUrl = `${API_CONFIG.BASE_URL}/lighting-modes`;

  // Obtener todos los modos de iluminación del usuario
  async getLightModes(habitatType?: string): Promise<ApiResponse<LightModeListResponse>> {
    try {
      const params = habitatType ? { habitatType } : {};
      const response = await axios.get(this.baseUrl, { params });
      
      if (response.data.success && response.data.data) {
        return {
          _isSuccess: true,
          _value: {
            lightModes: response.data.data.modes || [],
            total: response.data.data.total || 0
          }
        };
      } else {
        return {
          _isSuccess: false,
          _error: response.data.message || 'Error al obtener los modos de iluminación'
        };
      }
    } catch (error: any) {
      console.error('Error al obtener modos de iluminación:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?.message || 'Error de conexión'
      };
    }
  }

  // Obtener un modo de iluminación por ID
  async getLightModeById(id: string): Promise<ApiResponse<LightMode>> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      
      if (response.data.success) {
        return {
          _isSuccess: true,
          _value: response.data.data
        };
      } else {
        return {
          _isSuccess: false,
          _error: response.data.message || 'Error al obtener el modo de iluminación'
        };
      }
    } catch (error: any) {
      console.error('Error al obtener modo de iluminación:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?.message || 'Error de conexión'
      };
    }
  }

  // Crear un nuevo modo de iluminación
  async createLightMode(data: CreateLightModeDto): Promise<ApiResponse<LightMode>> {
    try {
      console.log('Enviando datos para crear modo de iluminación:', JSON.stringify(data, null, 2));
      const response = await axios.post(this.baseUrl, data);
      console.log('Respuesta del servidor:', response.data);
      
      if (response.data.success) {
        return {
          _isSuccess: true,
          _value: response.data.data
        };
      } else {
        return {
          _isSuccess: false,
          _error: response.data.message || 'Error al crear el modo de iluminación'
        };
      }
    } catch (error: any) {
      console.error('Error al crear modo de iluminación:', error);
      console.error('Respuesta de error:', error.response?.data);
      return {
        _isSuccess: false,
        _error: error.response?.data?.message || 'Error de conexión'
      };
    }
  }

  // Actualizar un modo de iluminación
  async updateLightMode(id: string, data: UpdateLightModeDto): Promise<ApiResponse<LightMode>> {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, data);
      
      if (response.data.success) {
        return {
          _isSuccess: true,
          _value: response.data.data
        };
      } else {
        return {
          _isSuccess: false,
          _error: response.data.message || 'Error al actualizar el modo de iluminación'
        };
      }
    } catch (error: any) {
      console.error('Error al actualizar modo de iluminación:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?.message || 'Error de conexión'
      };
    }
  }

  // Eliminar un modo de iluminación
  async deleteLightMode(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await axios.delete(`${this.baseUrl}/${id}`);
      
      if (response.data.success) {
        return {
          _isSuccess: true
        };
      } else {
        return {
          _isSuccess: false,
          _error: response.data.message || 'Error al eliminar el modo de iluminación'
        };
      }
    } catch (error: any) {
      console.error('Error al eliminar modo de iluminación:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?.message || 'Error de conexión'
      };
    }
  }

  // Compartir un modo de iluminación
  async shareLightMode(id: string): Promise<ApiResponse<ShareModeResponse>> {
    try {
      const response = await axios.post(`${this.baseUrl}/${id}/share`);
      
      if (response.data.success) {
        return {
          _isSuccess: true,
          _value: response.data.data
        };
      } else {
        return {
          _isSuccess: false,
          _error: response.data.message || 'Error al compartir el modo de iluminación'
        };
      }
    } catch (error: any) {
      console.error('Error al compartir modo de iluminación:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?.message || 'Error de conexión'
      };
    }
  }

  // Importar un modo de iluminación compartido
  async importSharedLightMode(shareCode: string): Promise<ApiResponse<LightMode>> {
    try {
      const response = await axios.post(`${this.baseUrl}/import`, { shareCode });
      
      if (response.data.success) {
        return {
          _isSuccess: true,
          _value: response.data.data
        };
      } else {
        return {
          _isSuccess: false,
          _error: response.data.message || 'Error al importar el modo de iluminación'
        };
      }
    } catch (error: any) {
      console.error('Error al importar modo de iluminación:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?.message || 'Error de conexión'
      };
    }
  }
}

export const lightModeService = new LightModeService();
