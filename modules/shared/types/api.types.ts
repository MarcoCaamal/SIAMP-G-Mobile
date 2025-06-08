export interface ErrorResult {
  code: string | number;
  message: string;
  statusCode: number;
}

export interface Result<T> {
  _success: boolean;
  _value?: T;
  _error?: ErrorResult;
}

export interface ApiResponse<T = any> extends Result<T> {}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
