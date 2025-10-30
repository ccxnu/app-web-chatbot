import type { IResponse } from "@/api/entities/response";
import { axiosClient } from "@/api/http/client";
import { withBody } from "@/api/http/request";
import { validateApiResponse } from "@/api/http/response";
import {
  CONVERSATIONS_GET_ALL,
  CONVERSATIONS_GET_MESSAGES,
  CONVERSATIONS_SEND,
  CONVERSATIONS_MARK_READ,
  CONVERSATIONS_DELETE,
  CONVERSATIONS_SET_TEMPORARY,
  ADMIN_USERS_BLOCK,
} from "../constant-routes";

/**
 * Query keys for conversation operations
 */
export const conversationsKeys = {
  all: ["conversations"] as const,
  list: (filter?: string) => ["conversations", "list", filter] as const,
  messages: (conversationId: number) => ["conversations", "messages", conversationId] as const,
};

/**
 * Get all conversations with optional filtering
 */
export const getAllConversations = async (
  data: Record<string, unknown>,
  processName: string = "GET_ALL_CONVERSATIONS"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CONVERSATIONS_GET_ALL,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get conversation message history
 */
export const getConversationMessages = async (
  data: Record<string, unknown>,
  processName: string = "GET_CONVERSATION_MESSAGES"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CONVERSATIONS_GET_MESSAGES,
    body
  );
  return validateApiResponse(response);
};

/**
 * Send message as admin to user
 */
export const sendAdminMessage = async (
  data: Record<string, unknown>,
  processName: string = "SEND_ADMIN_MESSAGE"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CONVERSATIONS_SEND,
    body
  );
  return validateApiResponse(response);
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (
  data: Record<string, unknown>,
  processName: string = "MARK_MESSAGES_READ"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CONVERSATIONS_MARK_READ,
    body
  );
  return validateApiResponse(response);
};

/**
 * Block or unblock a user
 */
export const blockUser = async (
  data: Record<string, unknown>,
  processName: string = "BLOCK_USER"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    ADMIN_USERS_BLOCK,
    body
  );
  return validateApiResponse(response);
};

/**
 * Soft delete a conversation
 */
export const deleteConversation = async (
  data: Record<string, unknown>,
  processName: string = "DELETE_CONVERSATION"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CONVERSATIONS_DELETE,
    body
  );
  return validateApiResponse(response);
};

/**
 * Set conversation as temporary (auto-expire)
 */
export const setTemporaryConversation = async (
  data: Record<string, unknown>,
  processName: string = "SET_TEMPORARY_CONVERSATION"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CONVERSATIONS_SET_TEMPORARY,
    body
  );
  return validateApiResponse(response);
};
