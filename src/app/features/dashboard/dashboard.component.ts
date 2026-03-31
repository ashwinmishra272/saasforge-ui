import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin, catchError, of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { RoleService } from '../../core/services/role.service';
import { TenantService } from '../../core/services/tenant.service';

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  bg: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private tenantService = inject(TenantService);

  loading = signal(true);
  userName = signal('User');
  tenantName = signal('');
  tenantStatus = signal('');

  stats = signal<StatCard[]>([
    { label: 'Total Users', value: '–', icon: 'people', color: '#5c6bc0', bg: '#ede7f6' },
    { label: 'Total Roles', value: '–', icon: 'admin_panel_settings', color: '#00897b', bg: '#e0f2f1' },
    { label: 'Your Role', value: '–', icon: 'verified_user', color: '#f57c00', bg: '#fff3e0' },
    { label: 'Tenant Status', value: '–', icon: 'domain', color: '#1565c0', bg: '#e3f2fd' }
  ]);

  ngOnInit(): void {
    const userId = this.authService.userId();
    const tenantId = this.authService.tenantId();
    const isAdmin = this.authService.isAdmin();

    const requests: any = {};

    if (isAdmin) {
      requests.users = this.userService.getUsers(0, 1).pipe(catchError(() => of(null)));
      requests.roles = this.roleService.getRoles().pipe(catchError(() => of(null)));
    }

    if (tenantId) {
      requests.tenant = this.tenantService.getTenantById(tenantId).pipe(catchError(() => of(null)));
    }

    if (userId) {
      requests.user = this.userService.getUserById(userId).pipe(catchError(() => of(null)));
    }

    forkJoin(Object.keys(requests).length ? requests : { noop: of(null) }).subscribe((results: any) => {
      const updatedStats: StatCard[] = [
        {
          label: isAdmin ? 'Total Users' : 'Workspace',
          value: isAdmin
            ? (results.users?.totalElements ?? '–')
            : (results.tenant?.name ?? '–'),
          icon: 'people',
          color: '#5c6bc0',
          bg: '#ede7f6'
        },
        {
          label: isAdmin ? 'Total Roles' : 'Your Role',
          value: isAdmin
            ? (results.roles?.length ?? '–')
            : (this.authService.userRole() ?? '–'),
          icon: 'admin_panel_settings',
          color: '#00897b',
          bg: '#e0f2f1'
        },
        {
          label: 'Your Role',
          value: this.authService.userRole() ?? '–',
          icon: 'verified_user',
          color: '#f57c00',
          bg: '#fff3e0'
        },
        {
          label: 'Tenant Status',
          value: results.tenant?.status ?? '–',
          icon: 'domain',
          color: '#1565c0',
          bg: '#e3f2fd'
        }
      ];

      // Remove duplicate "Your Role" card for non-admins
      this.stats.set(isAdmin ? updatedStats : updatedStats.filter((_, i) => i !== 1));

      if (results.user) this.userName.set(results.user.name);
      if (results.tenant) {
        this.tenantName.set(results.tenant.name);
        this.tenantStatus.set(results.tenant.status);
      }

      this.loading.set(false);
    });
  }
}
