import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RoleService } from '../../core/services/role.service';
import { AuthService } from '../../core/services/auth.service';
import { RoleResponse } from '../../core/models/role.model';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';
import { ConfirmDialogComponent } from '../users/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {
  private roleService = inject(RoleService);
  authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['name', 'roleKey', 'actions'];
  roles = signal<RoleResponse[]>([]);
  loading = signal(true);
  searchQuery = '';

  get filteredRoles(): RoleResponse[] {
    const q = this.searchQuery.toLowerCase().trim();
    return q
      ? this.roles().filter(r =>
          r.name.toLowerCase().includes(q) ||
          r.roleKey.toLowerCase().includes(q))
      : this.roles();
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading.set(true);
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Failed to load roles', 'Close', { duration: 3000, panelClass: ['error-snack'] });
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '480px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleService.createRole(result).subscribe({
          next: (role) => {
            this.roles.set([...this.roles(), role]);
            this.snackBar.open('Role created successfully', 'Close', { duration: 3000 });
          },
          error: (err) => {
            const msg = err?.error?.message || 'Failed to create role';
            this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['error-snack'] });
          }
        });
      }
    });
  }

  openEditDialog(role: RoleResponse): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '480px',
      data: { role, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleService.updateRole(role.id, { name: result.name }).subscribe({
          next: (updated) => {
            const roles = this.roles();
            const idx = roles.findIndex(r => r.id === role.id);
            if (idx !== -1) {
              const updatedList = [...roles];
              updatedList[idx] = updated;
              this.roles.set(updatedList);
            }
            this.snackBar.open('Role updated successfully', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to update role', 'Close', { duration: 3000, panelClass: ['error-snack'] });
          }
        });
      }
    });
  }

  openDeleteDialog(role: RoleResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Role',
        message: `Are you sure you want to delete role <strong>${role.name}</strong>? This cannot be undone.`,
        confirmLabel: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.roleService.deleteRole(role.id).subscribe({
          next: () => {
            this.roles.set(this.roles().filter(r => r.id !== role.id));
            this.snackBar.open('Role deleted successfully', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to delete role', 'Close', { duration: 3000, panelClass: ['error-snack'] });
          }
        });
      }
    });
  }
}
