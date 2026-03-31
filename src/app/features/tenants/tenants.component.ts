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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TenantService } from '../../core/services/tenant.service';
import { TenantResponse } from '../../core/models/tenant.model';
import { ConfirmDialogComponent } from '../users/confirm-dialog/confirm-dialog.component';
import { EditTenantDialogComponent } from './edit-tenant-dialog/edit-tenant-dialog.component';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatTableModule, MatPaginatorModule,
    MatButtonModule, MatIconModule, MatCardModule, MatChipsModule, MatDialogModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule
  ],
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss'
})
export class TenantsComponent implements OnInit {
  private tenantService = inject(TenantService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['name', 'tenantKey', 'status', 'createdAt', 'actions'];
  tenants = signal<TenantResponse[]>([]);
  loading = signal(true);
  totalElements = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);
  searchQuery = '';

  ngOnInit(): void { this.loadTenants(); }

  onSearch(): void {
    this.pageIndex.set(0);
    this.loadTenants();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.pageIndex.set(0);
    this.loadTenants();
  }

  loadTenants(): void {
    this.loading.set(true);
    this.tenantService.getTenants(this.pageIndex(), this.pageSize(), this.searchQuery).subscribe({
      next: (res) => { this.tenants.set(res.content); this.totalElements.set(res.totalElements); this.loading.set(false); },
      error: () => { this.loading.set(false); this.snackBar.open('Failed to load tenants', 'Close', { duration: 3000, panelClass: ['error-snack'] }); }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadTenants();
  }

  openEditDialog(tenant: TenantResponse): void {
    const dialogRef = this.dialog.open(EditTenantDialogComponent, { width: '480px', data: tenant });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tenantService.updateTenant(tenant.id, result).subscribe({
          next: (updated) => {
            const list = this.tenants();
            const idx = list.findIndex(t => t.id === tenant.id);
            if (idx !== -1) { const u = [...list]; u[idx] = updated; this.tenants.set(u); }
            this.snackBar.open('Tenant updated successfully', 'Close', { duration: 3000 });
          },
          error: () => this.snackBar.open('Failed to update tenant', 'Close', { duration: 3000, panelClass: ['error-snack'] })
        });
      }
    });
  }

  openDeleteDialog(tenant: TenantResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Tenant', message: `Delete <strong>${tenant.name}</strong>? All data will be permanently removed.`, confirmLabel: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.tenantService.deleteTenant(tenant.id).subscribe({
          next: () => { this.tenants.set(this.tenants().filter(t => t.id !== tenant.id)); this.totalElements.set(this.totalElements() - 1); this.snackBar.open('Tenant deleted', 'Close', { duration: 3000 }); },
          error: () => this.snackBar.open('Failed to delete tenant', 'Close', { duration: 3000, panelClass: ['error-snack'] })
        });
      }
    });
  }
}
