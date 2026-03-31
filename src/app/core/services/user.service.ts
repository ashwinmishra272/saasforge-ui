import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponse, UpdateUserRequest } from '../models/user.model';
import { PageResponse } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/users`;

  getUsers(page = 0, size = 10, sortBy = 'id', search = ''): Observable<PageResponse<UserResponse>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);
    if (search.trim()) params = params.set('search', search.trim());
    return this.http.get<PageResponse<UserResponse>>(this.apiUrl, { params });
  }

  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, request: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
