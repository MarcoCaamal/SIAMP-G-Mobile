import { environment } from '../../shared/constants/environment';
import { AuthCredentials, AuthResult, UserRegisterData } from '../types/auth.types';

class AuthService {
  private baseUrl = environment.API_BASE_URL;
  async register(userData: UserRegisterData): Promise<AuthResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/register`, {
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
  }
  async login(credentials: AuthCredentials): Promise<AuthResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
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
            message: data.message || 'Error en el login',
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

  async logout(): Promise<void> {
    // Aquí puedes agregar lógica para invalidar token en el servidor
    return Promise.resolve();
  }
}

export const authService = new AuthService();
