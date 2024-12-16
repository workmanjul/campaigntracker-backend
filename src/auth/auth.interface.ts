interface AuthLoginResponse {
  id: number;
  token: string;

  name: string;

  expires_in: number;
  email: string;
}
