// Configuración de la API
export const API_CONFIG = {
  // URL del servidor - Configurar según el entorno de desarrollo:
  // 
  // 🔧 Para desarrollo local:
  // - Simulador iOS: 'http://localhost:3000/api'
  // - Emulador Android: 'http://10.0.2.2:3000/api' 
  // - Dispositivo físico: 'http://TU_IP_LOCAL:3000/api' (ej: 'http://192.168.1.100:3000/api')
  //
  // 🚀 Para producción:
  // - 'https://tu-servidor.com/api'
  //
  // 💡 Para encontrar tu IP local:
  // Windows: ipconfig | Mac/Linux: ifconfig
  BASE_URL: __DEV__ ? 'http://10.49.179.148:3000/api' : 'https://siamp-g.canadacentral.cloudapp.azure.com/api',
    // URLs específicas
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    SEND_VERIFICATION_CODE: '/auth/send-verification-code',
    VERIFY_EMAIL_CODE: '/auth/verify-email-code',
    SEND_RESET_PASSWORD_EMAIL: '/auth/request-password-reset-code',
  },
  
  USERS: {
    PROFILE: '/users/profile',
    NOTIFICATIONS: '/users/notifications',
    CHANGE_PASSWORD: '/users/change-password',
    PROFILE_PICTURE: '/users/profile/picture',
  },
  
  LIGHTING_MODES: {
    BASE: '/lighting-modes',
    SHARE: (id: string) => `/lighting-modes/${id}/share`,
    IMPORT: '/lighting-modes/import',
  },
  
  // Configuración de tokens
  TOKEN: {
    REFRESH_INTERVAL: 14 * 60 * 1000, // 14 minutos en milisegundos
  },
  
  // Claves de almacenamiento
  STORAGE_KEYS: {
    ACCESS_TOKEN: '@siamp_access_token',
    REFRESH_TOKEN: '@siamp_refresh_token',
    USER: '@siamp_user',
  },
};

// URLs completas para facilitar el uso
export const API_URLS = {
  AUTH: {
    LOGIN: `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.LOGIN}`,
    REGISTER: `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.REGISTER}`,
    REFRESH: `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.REFRESH}`,
    SEND_VERIFICATION_CODE: `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.SEND_VERIFICATION_CODE}`,
    VERIFY_EMAIL_CODE: `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.VERIFY_EMAIL_CODE}`,
  },
  
  USERS: {
    PROFILE: `${API_CONFIG.BASE_URL}${API_CONFIG.USERS.PROFILE}`,
    NOTIFICATIONS: `${API_CONFIG.BASE_URL}${API_CONFIG.USERS.NOTIFICATIONS}`,
    CHANGE_PASSWORD: `${API_CONFIG.BASE_URL}${API_CONFIG.USERS.CHANGE_PASSWORD}`,
    PROFILE_PICTURE: `${API_CONFIG.BASE_URL}${API_CONFIG.USERS.PROFILE_PICTURE}`,
  },
  
  LIGHTING_MODES: {
    BASE: `${API_CONFIG.BASE_URL}${API_CONFIG.LIGHTING_MODES.BASE}`,
    SHARE: (id: string) => `${API_CONFIG.BASE_URL}${API_CONFIG.LIGHTING_MODES.SHARE(id)}`,
    IMPORT: `${API_CONFIG.BASE_URL}${API_CONFIG.LIGHTING_MODES.IMPORT}`,
  },
};
