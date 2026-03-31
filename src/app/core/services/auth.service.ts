import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  JwtPayload
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/api/auth`;

  private _accessToken = signal<string | null>(localStorage.getItem('accessToken'));
  private _refreshToken = signal<string | null>(localStorage.getItem('refreshToken'));

  readonly isLoggedIn = computed(() => !!this._accessToken());
  readonly currentUser = computed(() => {
    const token = this._accessToken();
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  });
  readonly userRole = computed(() => this.currentUser()?.role ?? null);
  readonly isAdmin = computed(() => this.userRole() === 'ADMIN');
  readonly userId = computed(() => this.currentUser()?.userId ?? null);
  readonly tenantId = computed(() => this.currentUser()?.tenantId ?? null);

  getAccessToken(): string | null {
    return this._accessToken();
  }

  getRefreshToken(): string | null {
    return this._refreshToken();
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(res => this.storeTokens(res))
    );
  }

  register(request: RegisterRequest): Observable<string> {
    return this.http.post(`${environment.apiUrl}/api/tenants/register`, request, { responseType: 'text' });
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/forgot-password`, request, { responseType: 'text' });
  }

  resetPassword(request: ResetPasswordRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/reset-password`, request, { responseType: 'text' });
  }

  changePassword(request: ChangePasswordRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/change-password`, request, { responseType: 'text' });
  }

  refreshAccessToken(): Observable<AuthResponse> {
    const refreshToken = this._refreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(res => this.storeTokens(res)),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this._accessToken.set(null);
    this._refreshToken.set(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  private storeTokens(res: AuthResponse): void {
    this._accessToken.set(res.accessToken);
    this._refreshToken.set(res.refreshToken);
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
  }
}
