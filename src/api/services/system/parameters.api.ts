import type { IResponse } from "@/api/entities/response";
import { axiosClient } from "@/api/http/client";
import { withBody } from "@/api/http/request";
import { validateApiResponse } from "@/api/http/response";
import {
  PARAMETERS_ADD,
  PARAMETERS_DELETE,
  PARAMETERS_GET_ALL,
  PARAMETERS_GET_BY_CODE,
  PARAMETERS_RELOAD_CACHE,
  PARAMETERS_UPDATE,
} from "../constant-routes";

/**
 * Query keys for parameter operations
 */
export const parametersKeys = {
  all: ["parameters"] as const,
  byCode: (code: string) => ["parameters", "code", code] as const,
  cache: () => ["parameters", "cache"] as const,
};

/**
 * Add a new system parameter with validation
 */
export const addParameter = async (
  data: Record<string, unknown>,
  processName: string = "ADD_PARAMETER"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    PARAMETERS_ADD,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get a specific parameter by its unique code
 */
export const getParameterByCode = async (
  data: Record<string, unknown>,
  processName: string = "GET_PARAMETER_BY_CODE"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    PARAMETERS_GET_BY_CODE,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get all active system parameters from cache or database
 */
export const getAllParameters = async (
  data: Record<string, unknown>,
  processName: string = "GET_ALL_PARAMETERS"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    PARAMETERS_GET_ALL,
    body
  );
  return validateApiResponse(response);
};

/**
 * Update an existing parameter
 */
export const updateParameter = async (
  data: Record<string, unknown>,
  processName: string = "UPDATE_PARAMETER"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    PARAMETERS_UPDATE,
    body
  );
  return validateApiResponse(response);
};

/**
 * Soft delete a parameter (sets active = false)
 */
export const deleteParameter = async (
  data: Record<string, unknown>,
  processName: string = "DELETE_PARAMETER"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    PARAMETERS_DELETE,
    body
  );
  return validateApiResponse(response);
};

/**
 * Reload parameter cache from database
 */
export const reloadParameterCache = async (
  data: Record<string, unknown>,
  processName: string = "RELOAD_PARAMETER_CACHE"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    PARAMETERS_RELOAD_CACHE,
    body
  );
  return validateApiResponse(response);
};
