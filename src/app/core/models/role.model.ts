export interface RoleResponse {
  id: number;
  name: string;
  roleKey: string;
  tenantId: number;
}

export interface CreateRoleRequest {
  name: string;
  roleKey: string;
  tenantId?: number;
}

export interface UpdateRoleRequest {
  name: string;
}
