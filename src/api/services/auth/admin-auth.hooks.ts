/**
 * React Query hooks for Admin Authentication
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adminLogin,
  adminRefreshToken,
  adminLogout,
  createAdminUser,
  adminAuthKeys,
} from "./admin-auth.api";
import type { CreateAdminRequest } from "@/api/frontend-types/requests.types";
import type { IBase } from "@/api/entities/solicitud";
import { STORAGE_KEYS } from "@/api/http/types";
import { useAuthStore } from "@/stores/authStore";

/**
 * Hook for admin login
 */
export const useAdminLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      adminLogin(username, password),
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      localStorage.setItem(STORAGE_KEYS.ID_SESSION, data.idSession);

      // Store user info
      if (data.user) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_USER_INFO, JSON.stringify(data.user));
      }

      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: adminAuthKeys.all });

      toast.success("Login exitoso");
    },
    onError: (error: any) => {
      toast.error(error?.info || error?.message || "Error al iniciar sesión");
    },
  });
};

/**
 * Hook for token refresh
 */
export const useAdminRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refreshToken: string) => adminRefreshToken(refreshToken),
    onSuccess: (data) => {
      // Update tokens
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);

      // Update user info if provided
      if (data.user) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_USER_INFO, JSON.stringify(data.user));
      }

      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: adminAuthKeys.tokens() });
    },
    onError: (error: any) => {
      // Clear tokens on refresh failure
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ID_SESSION);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_USER_INFO);

      toast.error(error?.info || error?.message || "Sesión expirada");
    },
  });
};

/**
 * Hook for admin logout
 */
export const useAdminLogout = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.adminAuth.clearAuth);

  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }
      return adminLogout(refreshToken);
    },
    onSuccess: () => {
      // Clear Zustand store (this also clears localStorage and cookies)
      clearAuth();

      // Clear all queries
      queryClient.clear();

      toast.success("Sesión cerrada exitosamente");
    },
    onError: (error: any) => {
      // Clear auth even on error
      clearAuth();

      toast.error(error?.info || error?.message || "Error al cerrar sesión");
    },
  });
};

/**
 * Hook for creating admin user
 */
export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: Omit<CreateAdminRequest, keyof IBase>) =>
      createAdminUser(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminAuthKeys.all });
      toast.success("Usuario administrador creado exitosamente");
    },
    onError: (error: any) => {
      toast.error(
        error?.info || error?.message || "Error al crear usuario administrador"
      );
    },
  });
};
