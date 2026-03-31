import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  authService = inject(AuthService);
  @Input() collapsed = false;
  @Output() closeSidebar = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Users', icon: 'people', route: '/users' },
    { label: 'Roles', icon: 'admin_panel_settings', route: '/roles', adminOnly: true },
    { label: 'Invite Users', icon: 'person_add', route: '/invite', adminOnly: true },
    { label: 'Tenants', icon: 'domain', route: '/tenants', adminOnly: true }
  ];

  bottomItems: NavItem[] = [
    { label: 'Profile', icon: 'account_circle', route: '/profile' }
  ];

  get visibleNavItems(): NavItem[] {
    return this.navItems.filter(item => !item.adminOnly || this.authService.isAdmin());
  }

  onLogout(): void {
    this.authService.logout();
  }

  onItemClick(): void {
    this.closeSidebar.emit();
  }
}
