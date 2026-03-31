import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'accept-invitation',
    loadComponent: () => import('./features/auth/accept-invitation/accept-invitation.component').then(m => m.AcceptInvitationComponent)
  },
  {
    path: '',
    loadComponent: () => import('./shared/layout/app-shell/app-shell.component').then(m => m.AppShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/roles/roles.component').then(m => m.RolesComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'invite',
        loadComponent: () => import('./features/invite/invite.component').then(m => m.InviteComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'tenants',
        loadComponent: () => import('./features/tenants/tenants.component').then(m => m.TenantsComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
