import { API_CONFIG } from '../../shared/config/api.config';
import axios from '../../shared/utils/axios';
import { AuthCredentials, AuthResult, UserRegisterData } from '../types/auth.types';

class AuthService {  async register(userData: UserRegisterData): Promise<AuthResult> {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.REGISTER}`,
        userData
      );

      return {
        _success: true,
        _value: response.data
      };
    } catch (error: any) {
      return {
        _success: false,
        _error: {
          message: error.response?.data?.message || 'Error en el registro',
          code: error.response?.status?.toString() || 'NETWORK_ERROR',
          statusCode: error.response?.status
        }
      };
    }
  }  async login(credentials: AuthCredentials): Promise<AuthResult> {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.LOGIN}`,
        credentials
      );

      const data = response.data;
      
      // Manejar tanto _success como _isSuccess
      const isSuccess = data._success || data._isSuccess;
      
      if (isSuccess) {
        return {
          _success: true,
          _value: data._value || data
        };
      } else {
        return {
          _success: false,
          _error: {
            message: data._error?.message || data.message || 'Error en el login',
            code: data._error?.code || data.code,
            statusCode: data._error?.statusCode || data.statusCode
          }
        };
      }
    } catch (error: any) {
      return {
        _success: false,
        _error: {
          message: error.response?.data?.message || (error instanceof Error ? error.message : 'Error desconocido'),
          code: error.response?.status?.toString() || 'NETWORK_ERROR',
          statusCode: error.response?.status
        }
      };
    }
  }

  async logout(): Promise<void> {
    // Aquí puedes agregar lógica para invalidar token en el servidor
    return Promise.resolve();
  }
  async sendVerificationCode(email: string): Promise<AuthResult> {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.SEND_VERIFICATION_CODE}`,
        { email }
      );

      return {
        _success: true,
        _value: response.data
      };
    } catch (error: any) {
      return {
        _success: false,
        _error: {
          message: error.response?.data?.message || 'Error al reenviar el código',
          code: error.response?.status?.toString() || 'NETWORK_ERROR',
          statusCode: error.response?.status
        }
      };
    }
  }
  async verifyEmailCode(code: string): Promise<AuthResult> {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.VERIFY_EMAIL_CODE}`,
        { code }
      );

      return {
        _success: true,
        _value: response.data
      };
    } catch (error: any) {
      return {
        _success: false,
        _error: {
          message: error.response?.data?.message || 'Código de verificación inválido',
          code: error.response?.status?.toString() || 'NETWORK_ERROR',
          statusCode: error.response?.status
        }
      };
    }
  }
}

export const authService = new AuthService();
