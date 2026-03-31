export interface UserResponse {
  id: number;
  name: string;
  email: string;
  status: string;
  tenantId: number;
  roleName: string;
}

export interface UpdateUserRequest {
  name: string;
  status: string;
}
