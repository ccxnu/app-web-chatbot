/**
 * Admin Authentication API Service
 * Following existing API patterns with Axios, withBody, and validateApiResponse
 */

import { axiosClient } from "@/api/http/client";
import { withBody } from "@/api/http/request";
import { validateApiResponse } from "@/api/http/response";
import type { IResponse } from "@/api/entities/response";
import type {
  TokenPairResponse,
  AdminUser,
} from "@/api/frontend-types/admin.types";
import type {
  LoginRequest,
  RefreshTokenRequest,
  LogoutRequest,
  CreateAdminRequest,
} from "@/api/frontend-types/requests.types";
import {
  ADMIN_AUTH_LOGIN,
  ADMIN_AUTH_REFRESH,
  ADMIN_AUTH_LOGOUT,
  ADMIN_USERS_CREATE,
} from "../constant-routes";

/**
 * Query keys for React Query
 */
export const adminAuthKeys = {
  all: ["admin-auth"] as const,
  currentUser: () => ["admin-auth", "current-user"] as const,
  tokens: () => ["admin-auth", "tokens"] as const,
};

/**
 * Login admin user
 */
export const adminLogin = async (
  username: string,
  password: string,
  processName: string = "ADMIN_LOGIN"
): Promise<TokenPairResponse> => {
  const requestData: Omit<LoginRequest, keyof import("@/api/entities/solicitud").IBase> = {
    username,
    password,
  };

  const body = withBody(requestData, processName);
  const { data: response } = await axiosClient.post<IResponse<TokenPairResponse>>(
    ADMIN_AUTH_LOGIN,
    body
  );
  return validateApiResponse(response);
};

/**
 * Refresh access token using refresh token
 */
export const adminRefreshToken = async (
  refreshToken: string,
  processName: string = "ADMIN_REFRESH_TOKEN"
): Promise<TokenPairResponse> => {
  const requestData: Omit<RefreshTokenRequest, keyof import("@/api/entities/solicitud").IBase> = {
    refreshToken,
  };

  const body = withBody(requestData, processName);
  const { data: response } = await axiosClient.post<IResponse<TokenPairResponse>>(
    ADMIN_AUTH_REFRESH,
    body
  );
  return validateApiResponse(response);
};

/**
 * Logout admin user and revoke refresh token
 */
export const adminLogout = async (
  refreshToken: string,
  processName: string = "ADMIN_LOGOUT"
): Promise<void> => {
  const requestData: Omit<LogoutRequest, keyof import("@/api/entities/solicitud").IBase> = {
    refreshToken,
  };

  const body = withBody(requestData, processName);
  const { data: response } = await axiosClient.post<IResponse<void>>(
    ADMIN_AUTH_LOGOUT,
    body
  );
  return validateApiResponse(response);
};

/**
 * Create new admin user (requires authentication)
 */
export const createAdminUser = async (
  params: Omit<CreateAdminRequest, keyof import("@/api/entities/solicitud").IBase>,
  processName: string = "CREATE_ADMIN_USER"
): Promise<AdminUser> => {
  const body = withBody(params, processName);
  const { data: response } = await axiosClient.post<IResponse<AdminUser>>(
    ADMIN_USERS_CREATE,
    body
  );
  return validateApiResponse(response);
};
