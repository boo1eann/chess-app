import { secureStorage } from "@/shared/storage/secure-storage";
import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";
import { authApi } from "@/shared/api/auth.api";
import { jwtDecode } from "jwt-decode";

interface AccessPayload {
  sub: string;
  username: string;
  type: "access";
}

export function useBootstrapAuth(): void {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const refreshToken = await secureStorage.getRefreshToken();
        if (!refreshToken) {
          if (!cancelled) useAuthStore.getState().clearSession();
          return;
        }

        const { data } = await authApi.refresh(refreshToken);
        await secureStorage.setRefreshToken(data.refreshToken);

        const payload = jwtDecode<AccessPayload>(data.accessToken);

        if (cancelled) return;

        useAuthStore.getState().setSession({
          user: {
            id: payload.sub,
            username: payload.username,
            email: "",
          },
          accessToken: data.accessToken,
        });
      } catch (err) {
        if (cancelled) return;
        await secureStorage.clearRefreshToken();
        useAuthStore.getState().clearSession();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);
}
