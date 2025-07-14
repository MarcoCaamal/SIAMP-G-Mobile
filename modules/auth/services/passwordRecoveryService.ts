import { environment } from '../../shared/constants/environment';

interface ResetPasswordRequest {
  email: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface VerifyCodeRequest {
  email: string;
  code: string;
}

interface VerifyCodeResponse {
  success: boolean;
  message: string;
  token?: string;
}

interface UpdatePasswordRequest {
  token: string;
  newPassword: string;
}

interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}

class PasswordRecoveryService {
  private baseUrl = 'https://siamp-api.balam-code.com/api';

  // Solicitar código de recuperación por email
  async requestPasswordReset(email: string): Promise<ResetPasswordResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el correo');
      }

      return {
        success: true,
        message: data.message || 'Código enviado correctamente',
        data: data.data,
      };
    } catch (error) {
      console.error('Error en requestPasswordReset:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error de conexión',
      };
    }
  }

  // Verificar código de recuperación
  async verifyResetCode(email: string, code: string): Promise<VerifyCodeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/verify-reset-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Código inválido');
      }

      return {
        success: true,
        message: data.message || 'Código verificado correctamente',
        token: data.token || data.resetToken,
      };
    } catch (error) {
      console.error('Error en verifyResetCode:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error de verificación',
      };
    }
  }

  // Actualizar contraseña
  async updatePassword(token: string, newPassword: string): Promise<UpdatePasswordResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          resetToken: token,
          newPassword: newPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar contraseña');
      }

      return {
        success: true,
        message: data.message || 'Contraseña actualizada correctamente',
      };
    } catch (error) {
      console.error('Error en updatePassword:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error al actualizar contraseña',
      };
    }
  }
}

export const passwordRecoveryService = new PasswordRecoveryService();
export type {
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
};
