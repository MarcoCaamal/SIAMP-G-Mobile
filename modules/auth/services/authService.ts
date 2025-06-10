import { API_URLS } from '../../shared/config/api.config';
import { AuthCredentials, AuthResult, UserRegisterData } from '../types/auth.types';

class AuthService {
  async register(userData: UserRegisterData): Promise<AuthResult> {
    try {
      const response = await fetch(API_URLS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          _success: false,
          _error: {
            message: data.message || 'Error en el registro',
            code: response.status.toString()
          }
        };
      }

      return {
        _success: true,
        _value: data
      };
    } catch (error) {
      return {
        _success: false,
        _error: {
          message: error instanceof Error ? error.message : 'Error desconocido',
          code: 'NETWORK_ERROR'
        }
      };
    }
  }    async login(credentials: AuthCredentials): Promise<AuthResult> {
    try {
      const response = await fetch(API_URLS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          _success: false,
          _error: {
            message: data.message || data._error?.message || 'Error en el login',
            code: data.code || data._error?.code || response.status.toString(),
            statusCode: data.statusCode || data._error?.statusCode || response.status
          }
        };
      }

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
    } catch (error) {
      return {
        _success: false,
        _error: {
          message: error instanceof Error ? error.message : 'Error desconocido',
          code: 'NETWORK_ERROR'
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
      const response = await fetch(API_URLS.AUTH.SEND_VERIFICATION_CODE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          _success: false,
          _error: {
            message: data.message || 'Error al reenviar el código',
            code: response.status.toString()
          }
        };
      }

      return {
        _success: true,
        _value: data
      };
    } catch (error) {
      return {
        _success: false,
        _error: {
          message: error instanceof Error ? error.message : 'Error desconocido',
          code: 'NETWORK_ERROR'
        }
      };
    }
  }

  async verifyEmailCode(code: string): Promise<AuthResult> {
    try {
      const response = await fetch(API_URLS.AUTH.VERIFY_EMAIL_CODE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          _success: false,
          _error: {
            message: data.message || 'Código de verificación inválido',
            code: response.status.toString()
          }
        };
      }

      return {
        _success: true,
        _value: data
      };
    } catch (error) {
      return {
        _success: false,
        _error: {
          message: error instanceof Error ? error.message : 'Error desconocido',
          code: 'NETWORK_ERROR'
        }
      };
    }
  }
}

export const authService = new AuthService();
