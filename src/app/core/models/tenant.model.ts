export interface TenantResponse {
  id: number;
  name: string;
  tenantKey: string;
  status: string;
  createdAt: string;
}

export interface UpdateTenantRequest {
  name: string;
  status: string;
}
