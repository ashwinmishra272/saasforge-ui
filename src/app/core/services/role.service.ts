import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RoleResponse, CreateRoleRequest, UpdateRoleRequest } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/roles`;

  getRoles(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(this.apiUrl);
  }

  getRoleById(id: number): Observable<RoleResponse> {
    return this.http.get<RoleResponse>(`${this.apiUrl}/${id}`);
  }

  createRole(request: CreateRoleRequest): Observable<RoleResponse> {
    return this.http.post<RoleResponse>(this.apiUrl, request);
  }

  updateRole(id: number, request: UpdateRoleRequest): Observable<RoleResponse> {
    return this.http.put<RoleResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
