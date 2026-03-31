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
import { InvitationService } from '../../../core/services/invitation.service';

function passwordMatchValidator(control: AbstractControl) {
  const parent = control.parent;
  if (!parent) return null;
  const password = parent.get('password')?.value;
  return control.value === password ? null : { mismatch: true };
}

@Component({
  selector: 'app-accept-invitation',
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
  templateUrl: './accept-invitation.component.html',
  styleUrl: './accept-invitation.component.scss'
})
export class AcceptInvitationComponent {
  private fb = inject(FormBuilder);
  private invitationService = inject(InvitationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);
  hidePassword = signal(true);
  hideConfirm = signal(true);
  token = this.route.snapshot.queryParamMap.get('token') ?? '';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, passwordMatchValidator]]
  });

  onSubmit(): void {
    if (this.form.invalid || !this.token) return;
    this.loading.set(true);

    this.invitationService.acceptInvitation({
      token: this.token,
      name: this.form.value.name!,
      password: this.form.value.password!
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login'], {
          queryParams: { message: 'Invitation accepted! You can now sign in.' }
        });
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message || 'Failed to accept invitation. Token may be expired or invalid.';
        this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snack'] });
      }
    });
  }
}
