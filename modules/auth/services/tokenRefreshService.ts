import { axiosService } from '../../shared/utils/axios';

class TokenRefreshService {
  setOnTokenExpiredCallback(callback: () => void) {
    axiosService.setOnTokenExpiredCallback(callback);
  }
}

export const tokenRefreshService = new TokenRefreshService();
