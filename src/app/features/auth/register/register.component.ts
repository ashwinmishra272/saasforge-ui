import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);
  hidePassword = signal(true);
  successMessage = signal('');

  form = this.fb.group({
    tenantName: ['', [Validators.required, Validators.minLength(2)]],
    adminName: ['', [Validators.required, Validators.minLength(2)]],
    adminEmail: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  getPasswordStrength(): { level: number; label: string; color: string } {
    const pw = this.form.get('password')?.value || '';
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { level: 25, label: 'Weak', color: '#f44336' };
    if (score === 2) return { level: 50, label: 'Fair', color: '#ff9800' };
    if (score === 3) return { level: 75, label: 'Good', color: '#2196f3' };
    return { level: 100, label: 'Strong', color: '#4caf50' };
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);

    const { tenantName, adminName, adminEmail, password } = this.form.value;
    this.authService.register({
      tenantName: tenantName!,
      adminName: adminName!,
      adminEmail: adminEmail!,
      password: password!
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Workspace created! You can now sign in with your credentials.');
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message || err?.error || 'Registration failed. Please try again.';
        this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snack'] });
      }
    });
  }
}
