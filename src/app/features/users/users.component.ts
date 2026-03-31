import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { UserResponse } from '../../core/models/user.model';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['name', 'email', 'role', 'status', 'actions'];
  users = signal<UserResponse[]>([]);
  loading = signal(true);
  totalElements = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);
  searchQuery = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  onSearch(): void {
    this.pageIndex.set(0);
    this.loadUsers();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.pageIndex.set(0);
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.userService.getUsers(this.pageIndex(), this.pageSize(), 'id', this.searchQuery).subscribe({
      next: (res) => {
        this.users.set(res.content);
        this.totalElements.set(res.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000, panelClass: ['error-snack'] });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadUsers();
  }

  openEditDialog(user: UserResponse): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '480px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(user.id, result).subscribe({
          next: (updated) => {
            const users = this.users();
            const idx = users.findIndex(u => u.id === user.id);
            if (idx !== -1) {
              const updatedList = [...users];
              updatedList[idx] = updated;
              this.users.set(updatedList);
            }
            this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to update user', 'Close', { duration: 3000, panelClass: ['error-snack'] });
          }
        });
      }
    });
  }

  openDeleteDialog(user: UserResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete <strong>${user.name}</strong>? This action cannot be undone.`,
        confirmLabel: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.users.set(this.users().filter(u => u.id !== user.id));
            this.totalElements.set(this.totalElements() - 1);
            this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to delete user', 'Close', { duration: 3000, panelClass: ['error-snack'] });
          }
        });
      }
    });
  }
}
