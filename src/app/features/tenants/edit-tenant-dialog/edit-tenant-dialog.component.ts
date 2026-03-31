import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TenantResponse } from '../../../core/models/tenant.model';

@Component({
  selector: 'app-edit-tenant-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <mat-icon class="dialog-icon">edit</mat-icon>
        <div>
          <h2 mat-dialog-title>Edit Tenant</h2>
          <p>Update workspace details for <strong>{{ data.name }}</strong></p>
        </div>
      </div>
      <mat-dialog-content>
        <form [formGroup]="form" class="dialog-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Workspace Name</mat-label>
            <input matInput formControlName="name">
            <mat-icon matPrefix>domain</mat-icon>
            @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
              <mat-error>Name is required</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="ACTIVE">Active</mat-option>
              <mat-option value="INACTIVE">Inactive</mat-option>
              <mat-option value="SUSPENDED">Suspended</mat-option>
            </mat-select>
          </mat-form-field>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onSave()" [disabled]="form.invalid">Save Changes</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container { padding: 8px; min-width: 320px; }
    .dialog-header { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px;
      .dialog-icon { font-size: 32px; width: 32px; height: 32px; color: #1565c0; margin-top: 4px; }
      h2 { margin: 0 0 4px; font-size: 20px; font-weight: 700; }
      p { margin: 0; font-size: 13px; color: #666; }
    }
    .dialog-form { display: flex; flex-direction: column; gap: 8px; }
    .full-width { width: 100%; }
    mat-dialog-content { padding: 0 !important; margin: 0 !important; }
    mat-dialog-actions { padding: 16px 0 0 !important; }
  `]
})
export class EditTenantDialogComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<EditTenantDialogComponent>);
  data: TenantResponse = inject(MAT_DIALOG_DATA);

  form = this.fb.group({
    name: [this.data.name, Validators.required],
    status: [this.data.status, Validators.required]
  });

  onSave(): void {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }
}
