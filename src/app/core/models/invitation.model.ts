export interface InviteRequest {
  email: string;
  roleId: number;
}

export interface AcceptInvitationRequest {
  token: string;
  name: string;
  password: string;
}
