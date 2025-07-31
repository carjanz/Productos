export interface Response {
  succeeded: boolean;
  data: {
    token: string;
    refreshToken: string;
    refreshTokenExpiryTime: string;
  } | null;
  messages: string[];
}
