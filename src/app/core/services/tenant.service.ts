import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TenantResponse, UpdateTenantRequest } from '../models/tenant.model';
import { PageResponse } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/tenants`;

  getTenants(page = 0, size = 10, search = '', sortBy = 'id'): Observable<PageResponse<TenantResponse>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);
    if (search.trim()) params = params.set('search', search.trim());
    return this.http.get<PageResponse<TenantResponse>>(this.apiUrl, { params });
  }

  getTenantById(id: number): Observable<TenantResponse> {
    return this.http.get<TenantResponse>(`${this.apiUrl}/${id}`);
  }

  getCurrentTenantEmail(): Observable<string> {
    return this.http.get(`${this.apiUrl}/me`, { responseType: 'text' });
  }

  updateTenant(id: number, request: UpdateTenantRequest): Observable<TenantResponse> {
    return this.http.put<TenantResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteTenant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
