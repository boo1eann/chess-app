import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  username: string;
}

export type AuthStatus = "bootstraping" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  user: User | null;
  accessToken: string | null;

  setSession: (params: { user: User; accessToken: string }) => void;
  setAccessToken: (token: string) => void;
  clearSession: () => void;
  setStatus: (status: AuthStatus) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "bootstraping",
  user: null,
  accessToken: null,

  setSession: ({ user, accessToken }) =>
    set({ status: "authenticated", user, accessToken }),

  setAccessToken: (token) => set({ accessToken: token }),

  clearSession: () =>
    set({ status: "unauthenticated", user: null, accessToken: null }),
  setStatus: (status) => set({ status }),
}));
