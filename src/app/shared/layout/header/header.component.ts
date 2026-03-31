import { Component, inject, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { TenantService } from '../../../core/services/tenant.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  private userService = inject(UserService);
  private tenantService = inject(TenantService);

  @Input() isMobile = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  userName = signal('User');
  tenantName = signal('');
  userInitials = signal('U');

  ngOnInit(): void {
    const userId = this.authService.userId();
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.userName.set(user.name);
          this.userInitials.set(user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2));
        }
      });
    }

    const tenantId = this.authService.tenantId();
    if (tenantId) {
      this.tenantService.getTenantById(tenantId).subscribe({
        next: (tenant) => {
          this.tenantName.set(tenant.name);
        }
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
}
