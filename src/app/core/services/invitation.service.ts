import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InviteRequest, AcceptInvitationRequest } from '../models/invitation.model';

@Injectable({ providedIn: 'root' })
export class InvitationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/invitations`;

  invite(request: InviteRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/invite`, request, { responseType: 'text' });
  }

  acceptInvitation(request: AcceptInvitationRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/accept`, request, { responseType: 'text' });
  }
}
