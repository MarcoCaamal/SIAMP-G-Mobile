import { API_CONFIG } from '../../shared/config/api.config';
import axios from '../../shared/utils/axios';

export interface DevicePairDto {
  deviceId: string;
  name: string;
  type: string;
  model: string;
  firmwareVersion: string;
  habitatType: string;
  ssid: string;
  ipAddress: string;
}

export interface DeviceConfigResponse {
  success: boolean;
  message: string;
}

export interface DeviceInfoResponse {
  device: string;
  firmware_version: string;
  device_id: string;
  state: string;
  mode: string;
  message: string;
  ap_ssid: string;
  ap_ip: string;
  configured: boolean;
  endpoints: string[];
}

// Interfaces para la respuesta de dispositivos
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface DeviceStatus {
  isConnected: boolean;
  lastConnectedAt: Date;
  currentState: 'on' | 'off';
  brightness: number;
  color: {
    mode: 'rgb' | 'temperature';
    rgb: RGBColor;
    temperature: number;
  };
}

export interface Device {
  id: string;
  deviceId: string;
  name: string;
  type: string;
  model: string;
  firmwareVersion: string;
  habitatType: string;
  status: DeviceStatus;
  networkConfig: {
    ssid?: string;
    ipAddress?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DevicesResponse {
  _isSuccess: boolean;
  _value?: {
    devices: Device[];
    total: number;
    connectedCount: number;
    disconnectedCount: number;
  };
  _error?: any;
}

export interface DeviceControlRequest {
  on?: boolean;
  brightness?: number;
  color?: {
    mode: 'rgb' | 'temperature';
    rgb?: {
      r: number;
      g: number;
      b: number;
    };
    temperature?: number;
  };
}

export interface DeviceControlResponse {
  _isSuccess: boolean;
  _value?: {
    success: boolean;
    message: string;
    deviceStatus?: {
      isConnected: boolean;
      currentState: 'on' | 'off';
      brightness: number;
      color: {
        mode: 'rgb' | 'temperature';
        rgb: {
          r: number;
          g: number;
          b: number;
        };
        temperature: number;
      };
    };
  };
  _error?: any;
}

class DeviceService {
  // Obtiene todos los dispositivos del usuario
  async getDevices(): Promise<DevicesResponse> {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/devices`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener dispositivos:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?._error || 'Error al obtener dispositivos'
      };
    }
  }

  // Envía la configuración WiFi al dispositivo
  async configureDeviceWifi(deviceIp: string, config: {
    ssid: string; 
    password: string; 
    server_url: string;
  }): Promise<DeviceConfigResponse> {
    try {
      // Usamos axios normal aquí porque estamos enviando a una IP local, no a nuestro backend
      const response = await axios.post(
        `http://${deviceIp}/config`,
        config,
        { timeout: 10000 } // Timeout de 10 segundos
      );

      return {
        success: true,
        message: response.data.message || 'Configuración enviada con éxito'
      };
    } catch (error: any) {
      console.error('Error al configurar dispositivo:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al enviar configuración'
      };
    }
  }

  // Obtiene información del dispositivo
  async getDeviceInfo(deviceIp: string): Promise<DeviceInfoResponse | null> {
    try {
      const response = await axios.get(`http://${deviceIp}/`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener información del dispositivo:', error);
      return null;
    }
  }

  // Vincula un dispositivo con el usuario en el servidor
  async pairDevice(deviceData: DevicePairDto): Promise<{
    _isSuccess: boolean;
    _value?: any;
    _error?: any
  }> {
    try {
      console.log('Enviando datos para vincular dispositivo:', deviceData);
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/devices/pair`, 
        deviceData
      );
      console.log('Respuesta del servidor al vincular dispositivo:', response.data);

      return response.data;
    } catch (error: any) {
      console.error('Error al vincular dispositivo:', error.response.data);
      return {
        _isSuccess: false,
        _error: error.response.data._error || 'Error al vincular dispositivo'
      };
    }
  }

  // Controlar un dispositivo (encender/apagar, brillo, color)
  async controlDevice(deviceId: string, controlData: DeviceControlRequest): Promise<DeviceControlResponse> {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/devices/${deviceId}/control`,
        controlData
      );
      return response.data;
    } catch (error: any) {
      console.error('Error al controlar dispositivo:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?._error || 'Error al controlar el dispositivo'
      };
    }
  }

  // Obtiene información detallada de un dispositivo
  async getDevice(deviceId: string): Promise<{
    _isSuccess: boolean;
    _value?: Device;
    _error?: any;
  }> {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/devices/${deviceId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener información del dispositivo:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?._error || 'Error al obtener información del dispositivo'
      };
    }
  }

  // Actualiza la información de un dispositivo (nombre y tipo de hábitat)
  async updateDevice(deviceId: string, updateData: {
    name?: string;
    habitatType?: string;
  }): Promise<{
    _isSuccess: boolean;
    _value?: Device;
    _error?: any;
  }> {
    try {
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}/devices/${deviceId}`,
        updateData
      );
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar el dispositivo:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?._error || 'Error al actualizar la información del dispositivo'
      };
    }
  }
  
  // Elimina un dispositivo
  async deleteDevice(deviceId: string): Promise<{
    _isSuccess: boolean;
    _value?: { success: boolean; message: string };
    _error?: any;
  }> {
    try {
      // Primero intentamos desemparejar el dispositivo
      await this.unpairDevice(deviceId);
      
      // Luego, eliminamos el dispositivo del backend
      const response = await axios.delete(`${API_CONFIG.BASE_URL}/devices/${deviceId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al eliminar el dispositivo:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?._error || 'Error al eliminar el dispositivo'
      };
    }
  }
  
  // Desempareja un dispositivo (envía comando al dispositivo para desvincularse)
  async unpairDevice(deviceId: string): Promise<{
    _isSuccess: boolean;
    _value?: { success: boolean; message: string };
    _error?: any;
  }> {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/devices/${deviceId}/unpair`,
        {}
      );
      return response.data;
    } catch (error: any) {
      console.error('Error al desemparejar el dispositivo:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?._error || 'Error al desemparejar el dispositivo'
      };
    }
  }
}

export const deviceService = new DeviceService();
