export interface ApiResponse<T> {
  succeeded: boolean;
  data: T;
  messages: string[];
}
