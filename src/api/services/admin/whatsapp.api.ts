import type { IResponse } from "@/api/entities/response";
import { axiosClient } from "@/api/http/client";
import { withBody } from "@/api/http/request";
import { validateApiResponse } from "@/api/http/response";
import {
  WHATSAPP_CONVERSATION_HISTORY,
  WHATSAPP_QR_CODE,
  WHATSAPP_STATUS,
  WHATSAPP_UPDATE_STATUS,
} from "../constant-routes";

/**
 * Query keys for WhatsApp operations
 */
export const whatsappKeys = {
  all: ["whatsapp"] as const,
  status: () => ["whatsapp", "status"] as const,
  qrCode: () => ["whatsapp", "qr-code"] as const,
  conversationHistory: (conversationId: string) =>
    ["whatsapp", "conversation-history", conversationId] as const,
};

/**
 * Get conversation message history for a specific WhatsApp conversation
 */
export const getConversationHistory = async (
  data: Record<string, unknown>,
  processName: string = "GET_CONVERSATION_HISTORY"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    WHATSAPP_CONVERSATION_HISTORY,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get WhatsApp QR code for authentication
 */
export const getWhatsAppQRCode = async (
  data: Record<string, unknown>,
  processName: string = "GET_WHATSAPP_QR_CODE"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    WHATSAPP_QR_CODE,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get current WhatsApp session status
 */
export const getWhatsAppStatus = async (
  data: Record<string, unknown>,
  processName: string = "GET_WHATSAPP_STATUS"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    WHATSAPP_STATUS,
    body
  );
  return validateApiResponse(response);
};

/**
 * Update WhatsApp session connection status
 */
export const updateWhatsAppStatus = async ( data: Record<string, unknown>, processName: string = "UPDATE_WHATSAPP_STATUS") => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    WHATSAPP_UPDATE_STATUS,
    body
  );
  return validateApiResponse(response);
};
