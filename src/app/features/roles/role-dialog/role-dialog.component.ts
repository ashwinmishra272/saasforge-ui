import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RoleResponse } from '../../../core/models/role.model';

export interface RoleDialogData {
  role?: RoleResponse;
  isEdit: boolean;
}

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <mat-icon class="dialog-icon">{{ data.isEdit ? 'edit' : 'add_circle' }}</mat-icon>
        <div>
          <h2 mat-dialog-title>{{ data.isEdit ? 'Edit Role' : 'Create Role' }}</h2>
          <p>{{ data.isEdit ? 'Update role details' : 'Add a new role to your workspace' }}</p>
        </div>
      </div>

      <mat-dialog-content>
        <form [formGroup]="form" class="dialog-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Role Name</mat-label>
            <input matInput formControlName="name" placeholder="e.g. Manager">
            <mat-icon matPrefix>admin_panel_settings</mat-icon>
            @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
              <mat-error>Role name is required</mat-error>
            }
          </mat-form-field>

          @if (!data.isEdit) {
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Role Key</mat-label>
              <input matInput formControlName="roleKey" placeholder="e.g. MANAGER">
              <mat-icon matPrefix>key</mat-icon>
              <mat-hint>Unique identifier (uppercase, no spaces)</mat-hint>
              @if (form.get('roleKey')?.hasError('required') && form.get('roleKey')?.touched) {
                <mat-error>Role key is required</mat-error>
              }
              @if (form.get('roleKey')?.hasError('pattern') && form.get('roleKey')?.touched) {
                <mat-error>Use uppercase letters and underscores only</mat-error>
              }
            </mat-form-field>
          }
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onSave()" [disabled]="form.invalid">
          {{ data.isEdit ? 'Save Changes' : 'Create Role' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container { padding: 8px; min-width: 320px; }
    .dialog-header {
      display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px;
      .dialog-icon { font-size: 32px; width: 32px; height: 32px; color: #00897b; margin-top: 4px; }
      h2 { margin: 0 0 4px; font-size: 20px; font-weight: 700; }
      p { margin: 0; font-size: 13px; color: #666; }
    }
    .dialog-form { display: flex; flex-direction: column; gap: 8px; }
    .full-width { width: 100%; }
    mat-dialog-content { padding: 0 !important; margin: 0 !important; overflow: visible !important; }
    mat-dialog-actions { padding: 16px 0 0 !important; }
  `]
})
export class RoleDialogComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<RoleDialogComponent>);
  data: RoleDialogData = inject(MAT_DIALOG_DATA);

  form = this.fb.group({
    name: [this.data.role?.name ?? '', Validators.required],
    roleKey: [
      { value: this.data.role?.roleKey ?? '', disabled: this.data.isEdit },
      [Validators.required, Validators.pattern(/^[A-Z_]+$/)]
    ]
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        name: this.form.value.name,
        roleKey: this.form.getRawValue().roleKey
      });
    }
  }
}
