import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { TenantService } from '../../core/services/tenant.service';
import { UserResponse } from '../../core/models/user.model';
import { TenantResponse } from '../../core/models/tenant.model';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPass = control.get('newPassword')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return newPass && confirm && newPass !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatDividerModule, MatChipsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private tenantService = inject(TenantService);
  private snackBar = inject(MatSnackBar);

  currentUser = signal<UserResponse | null>(null);
  tenant = signal<TenantResponse | null>(null);
  loadingProfile = signal(true);
  changingPassword = signal(false);
  savingProfile = signal(false);
  editingProfile = signal(false);
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]]
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator });

  ngOnInit(): void {
    const userId = this.authService.userId();
    const tenantId = this.authService.tenantId();

    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.currentUser.set(user);
          this.profileForm.patchValue({ name: user.name });
          this.loadingProfile.set(false);
        },
        error: () => { this.loadingProfile.set(false); }
      });
    }

    if (tenantId) {
      this.tenantService.getTenantById(tenantId).subscribe({
        next: (tenant) => this.tenant.set(tenant)
      });
    }
  }

  getUserInitials(): string {
    const name = this.currentUser()?.name ?? '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  }

  startEditProfile(): void {
    this.profileForm.patchValue({ name: this.currentUser()?.name ?? '' });
    this.editingProfile.set(true);
  }

  cancelEditProfile(): void {
    this.editingProfile.set(false);
    this.profileForm.patchValue({ name: this.currentUser()?.name ?? '' });
  }

  onSaveProfile(): void {
    if (this.profileForm.invalid) return;
    const userId = this.authService.userId();
    if (!userId) return;
    this.savingProfile.set(true);
    this.userService.updateUser(userId, {
      name: this.profileForm.value.name!,
      status: this.currentUser()?.status ?? 'ACTIVE'
    }).subscribe({
      next: (updated) => {
        this.currentUser.set(updated);
        this.savingProfile.set(false);
        this.editingProfile.set(false);
        this.snackBar.open('Profile updated!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.savingProfile.set(false);
        const msg = err?.error?.message || 'Failed to update profile';
        this.snackBar.open(msg, 'Close', { duration: 4000, panelClass: ['error-snack'] });
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) return;
    this.changingPassword.set(true);
    const { currentPassword, newPassword } = this.passwordForm.value;
    this.authService.changePassword({ currentPassword: currentPassword!, newPassword: newPassword! }).subscribe({
      next: () => {
        this.changingPassword.set(false);
        this.passwordForm.reset();
        this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.changingPassword.set(false);
        const msg = err?.error?.error || 'Failed to change password';
        this.snackBar.open(msg, 'Close', { duration: 4000, panelClass: ['error-snack'] });
      }
    });
  }
}
