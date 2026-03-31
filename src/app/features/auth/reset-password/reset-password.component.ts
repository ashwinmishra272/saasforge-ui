import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

function passwordMatchValidator(control: AbstractControl) {
  const parent = control.parent;
  if (!parent) return null;
  const password = parent.get('newPassword')?.value;
  return control.value === password ? null : { mismatch: true };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);
  hideNew = signal(true);
  hideConfirm = signal(true);

  form = this.fb.group({
    token: [this.route.snapshot.queryParamMap.get('token') ?? '', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, passwordMatchValidator]]
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);

    this.authService.resetPassword({
      token: this.form.value.token!,
      newPassword: this.form.value.newPassword!
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login'], {
          queryParams: { message: 'Password reset successfully! Please sign in.' }
        });
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message || 'Reset failed. Token may be expired.';
        this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snack'] });
      }
    });
  }
}
