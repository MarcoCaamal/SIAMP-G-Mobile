export interface AuthCredentials {
  email: string;
  password: string;
}

export interface UserRegisterData {
  name: string;
  email: string;
  password: string;
  timezone: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  status: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthResult {
  _success: boolean;
  _value?: AuthResponse;
  _error?: {
    message: string;
    code?: string;
    statusCode?: number;
  };
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
