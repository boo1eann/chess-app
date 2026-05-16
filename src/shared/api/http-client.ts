import { useAuthStore } from "@/features/auth/store/auth.store";
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  type AxiosInstance,
} from "axios";
import { secureStorage } from "../storage/secure-storage";
import { env } from "../config/env";

export const rawClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
});

export const httpClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
});

httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  const refreshToken = await secureStorage.getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  try {
    const { data } = await rawClient.post<{
      accessToken: string;
      refreshToken: string;
    }>("/auth/refresh", { refreshToken });

    await secureStorage.setRefreshToken(data.refreshToken);
    useAuthStore.getState().setAccessToken(data.accessToken);
    return data.accessToken;
  } catch (err) {
    await secureStorage.clearRefreshToken();
    useAuthStore.getState().clearSession();
    throw err;
  }
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retried?: boolean;
    };

    const isAuthEndpoint = original.url?.includes("/auth");
    const is401 = error.response?.status === 401;

    if (!is401 || original._retried || isAuthEndpoint) {
      return Promise.reject(error);
    }

    original._retried = true;

    try {
      if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
          refreshPromise = null;
        });
      }
      const newAccessToken = await refreshPromise;

      if (original.headers) {
        original.headers.Authorization = `Bearer ${newAccessToken}`;
      }
      return httpClient(original);
    } catch (refreshErr) {
      return Promise.reject(refreshErr);
    }
  },
);
