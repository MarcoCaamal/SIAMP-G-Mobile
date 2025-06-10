import { httpInterceptor } from '../../shared/services/httpInterceptor';

class TokenRefreshService {
  setOnTokenExpiredCallback(callback: () => void) {
    httpInterceptor.setOnTokenExpiredCallback(callback);
  }
}

export const tokenRefreshService = new TokenRefreshService();
