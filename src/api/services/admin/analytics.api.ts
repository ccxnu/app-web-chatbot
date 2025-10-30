import type { IResponse } from "@/api/entities/response";
import { axiosClient } from "@/api/http/client";
import { withBody } from "@/api/http/request";
import { validateApiResponse } from "@/api/http/response";
import {
  ANALYTICS_OVERVIEW,
  ANALYTICS_COSTS,
  ANALYTICS_TOKENS,
  ANALYTICS_USERS,
  ANALYTICS_CONVERSATIONS,
  ANALYTICS_MESSAGES,
  ANALYTICS_TOP_QUERIES,
  ANALYTICS_KNOWLEDGE_BASE,
  ANALYTICS_HEALTH,
} from "../constant-routes";

/**
 * Query keys for analytics operations
 */
export const analyticsKeys = {
  all: ["analytics"] as const,
  overview: () => ["analytics", "overview"] as const,
  costs: (params?: Record<string, unknown>) => ["analytics", "costs", params] as const,
  tokens: (params?: Record<string, unknown>) => ["analytics", "tokens", params] as const,
  users: (params?: Record<string, unknown>) => ["analytics", "users", params] as const,
  conversations: () => ["analytics", "conversations"] as const,
  messages: () => ["analytics", "messages"] as const,
  topQueries: (params?: Record<string, unknown>) => ["analytics", "top-queries", params] as const,
  knowledgeBase: (params?: Record<string, unknown>) => ["analytics", "knowledge-base", params] as const,
  health: () => ["analytics", "health"] as const,
};

/**
 * Get analytics overview dashboard metrics
 */
export const getAnalyticsOverview = async (
  data: Record<string, unknown> = {},
  processName: string = "GET_ANALYTICS_OVERVIEW"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    ANALYTICS_OVERVIEW,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get detailed cost breakdown
 */
export const getAnalyticsCosts = async (
  data: Record<string, unknown>,
  processName: string = "GET_ANALYTICS_COSTS"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    ANALYTICS_COSTS,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get token usage trends
 */
export const getAnalyticsTokens = async (
  data: Record<string, unknown>,
  processName: string = "GET_ANALYTICS_TOKENS"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    ANALYTICS_TOKENS,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get active user statistics
 */
export const getAnalyticsUsers = async (
  data: Record<string, unknown>,
  processName: string = "GET_ANALYTICS_USERS"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    ANALYTICS_USERS,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get conversation metrics
 */
export const getAnalyticsConversations = async (
  data: Record<string, unknown> = {},
  processName: string = "GET_ANALYTICS_CONVERSATIONS"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    ANALYTICS_CONVERSATIONS,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get message analytics
 */
export const getAnalyticsMessages = async (
  data: Record<string, unknown> = {},
  processName: string = "GET_ANALYTICS_MESSAGES"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    ANALYTICS_MESSAGES,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get top queries analysis
 */
export const getAnalyticsTopQueries = async (
  data: Record<string, unknown>,
  processName: string = "GET_ANALYTICS_TOP_QUERIES"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    ANALYTICS_TOP_QUERIES,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get knowledge base usage statistics
 */
export const getAnalyticsKnowledgeBase = async (
  data: Record<string, unknown>,
  processName: string = "GET_ANALYTICS_KNOWLEDGE_BASE"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    ANALYTICS_KNOWLEDGE_BASE,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get system health metrics
 */
export const getAnalyticsHealth = async (
  data: Record<string, unknown> = {},
  processName: string = "GET_ANALYTICS_HEALTH"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    ANALYTICS_HEALTH,
    body
  );
  return validateApiResponse(response);
};
