export type ApiErrorResponse = {
  success: false;
  error: ApiErrorPayload;
};

export type ApiErrorPayload = {
  code: string;
  message: string;
  severity: "info" | "warning" | "error" | "critical";
  statusCode: number;
  timestamp: string;
  userAction?: string;
  retryable: boolean;
  retryAfterMs?: number;
  requestId: string;
  errors?: ValidationFieldError[];
};

export interface ValidationFieldError {
  field: string;
  message: string;
  code?: string;
  received?: unknown;
}

export function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    (data as { success: unknown }).success === false
  );
}
