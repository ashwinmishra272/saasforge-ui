import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  confirmColor?: 'primary' | 'warn' | 'accent';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="dialog-icon-wrap">
        <mat-icon class="warn-icon">warning</mat-icon>
      </div>
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>
        <p [innerHTML]="data.message"></p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button [color]="data.confirmColor || 'warn'" (click)="onConfirm()">
          {{ data.confirmLabel || 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      padding: 8px;
      text-align: center;
    }
    .dialog-icon-wrap {
      margin-bottom: 8px;
      .warn-icon {
        font-size: 48px; width: 48px; height: 48px; color: #f44336;
      }
    }
    h2 { font-size: 20px; font-weight: 700; margin: 0 0 4px; }
    p { color: #555; font-size: 14px; line-height: 1.5; }
    mat-dialog-content { padding: 0 !important; }
    mat-dialog-actions { padding: 16px 0 0 !important; justify-content: center !important; gap: 12px; }
  `]
})
export class ConfirmDialogComponent {
  dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  data: ConfirmDialogData = inject(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
