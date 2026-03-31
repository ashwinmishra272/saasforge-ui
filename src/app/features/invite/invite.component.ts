import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { InvitationService } from '../../core/services/invitation.service';
import { RoleService } from '../../core/services/role.service';
import { RoleResponse } from '../../core/models/role.model';

@Component({
  selector: 'app-invite',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule, MatDividerModule
  ],
  templateUrl: './invite.component.html',
  styleUrl: './invite.component.scss'
})
export class InviteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private invitationService = inject(InvitationService);
  private roleService = inject(RoleService);
  private snackBar = inject(MatSnackBar);

  roles = signal<RoleResponse[]>([]);
  loading = signal(false);
  rolesLoading = signal(true);
  inviteToken = signal<string | null>(null);
  inviteEmail = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    roleId: [null as number | null, Validators.required]
  });

  ngOnInit(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => { this.roles.set(roles); this.rolesLoading.set(false); },
      error: () => { this.rolesLoading.set(false); this.snackBar.open('Failed to load roles', 'Close', { duration: 3000 }); }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.inviteToken.set(null);
    const { email, roleId } = this.form.value;
    this.invitationService.invite({ email: email!, roleId: roleId! }).subscribe({
      next: (token: string) => {
        this.inviteToken.set(token);
        this.inviteEmail.set(email!);
        this.loading.set(false);
        this.form.reset();
        this.snackBar.open('Invitation created successfully!', 'Close', { duration: 3000 });
      },
      error: (err: any) => {
        this.loading.set(false);
        const msg = err?.error?.error || 'Failed to send invitation';
        this.snackBar.open(msg, 'Close', { duration: 4000, panelClass: ['error-snack'] });
      }
    });
  }

  copyToken(): void {
    const token = this.inviteToken();
    if (token) {
      navigator.clipboard.writeText(token).then(() => {
        this.snackBar.open('Token copied to clipboard!', 'Close', { duration: 2000 });
      });
    }
  }

  copyAcceptUrl(): void {
    const token = this.inviteToken();
    if (token) {
      const url = `${window.location.origin}/accept-invitation?token=${token}`;
      navigator.clipboard.writeText(url).then(() => {
        this.snackBar.open('Accept URL copied!', 'Close', { duration: 2000 });
      });
    }
  }

  sendAnother(): void {
    this.inviteToken.set(null);
  }
}
