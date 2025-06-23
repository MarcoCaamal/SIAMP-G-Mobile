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

class DeviceService {
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
}

export const deviceService = new DeviceService();
