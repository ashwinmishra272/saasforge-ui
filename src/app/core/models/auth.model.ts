export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  tenantName: string;
  adminName: string;
  adminEmail: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface JwtPayload {
  userId: number;
  tenantId: number;
  role: string;
  sub: string;
  iat: number;
  exp: number;
}
