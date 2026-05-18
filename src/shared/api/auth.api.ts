import { User } from "@/features/auth/store/auth.store";
import { rawClient } from "./http-client";

interface LoginPayload {
  login: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await rawClient.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await rawClient.post<AuthResponse>(
      "/auth/register",
      payload,
    );
    return data;
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const { data } = await rawClient.post<RefreshResponse>("/auth/refresh", {
      refreshToken,
    });
    return data;
  },

  async logout(refreshToken: string): Promise<void> {
    await rawClient.post("/auth/logout", { refreshToken });
  },
};
