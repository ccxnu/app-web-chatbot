/**
 * Adaptadores para transformar datos de la API al formato del componente
 */

import type { Conversation, ConversationMessage } from "@/api/frontend-types/conversation.types";

// Tipo esperado por el componente actual
export interface ChatUser {
  id: string;
  profile: string;
  username: string;
  fullName: string;
  title: string;
  messages: Convo[];
}

export interface Convo {
  sender: string;
  message: string;
  timestamp: string;
}

/**
 * Convierte una conversación de la API al formato ChatUser
 */
export function conversationToChatUser(conversation: Conversation): ChatUser {
  const displayName = conversation.isGroup
    ? conversation.groupName || `Grupo ${conversation.phoneNumber}`
    : conversation.contactName || conversation.phoneNumber;

  const username = conversation.isGroup
    ? conversation.groupName?.substring(0, 3).toUpperCase() || "GRP"
    : conversation.contactName?.substring(0, 3).toUpperCase() || "USR";

  // Información adicional del usuario
  const title = conversation.userName
    ? `${conversation.userName} - ${conversation.userRole || 'Usuario'}`
    : conversation.phoneNumber;

  return {
    id: conversation.id.toString(),
    profile: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
    username,
    fullName: displayName,
    title,
    messages: conversation.lastMessagePreview
      ? [
          {
            sender: conversation.lastMessageFromMe ? "You" : displayName,
            message: conversation.lastMessagePreview,
            timestamp: conversation.lastMessageAt || new Date().toISOString(),
          },
        ]
      : [],
  };
}

/**
 * Convierte un mensaje de la API al formato Convo
 */
export function apiMessageToConvo(
  message: ConversationMessage,
  currentUserName: string = "You"
): Convo {
  // Determinar quién es el remitente
  let sender: string;
  if (message.fromMe) {
    sender = "You";
  } else if (message.senderType === "admin" && message.adminName) {
    sender = message.adminName;
  } else {
    sender = message.senderName;
  }

  return {
    sender,
    message: message.body || "(Mensaje sin contenido)",
    timestamp: new Date(message.timestamp).toISOString(),
  };
}

/**
 * Convierte un array de mensajes de la API a formato Convo[]
 */
export function apiMessagesToConvos(
  messages: ConversationMessage[],
  currentUserName: string = "You"
): Convo[] {
  return messages
    .map(msg => apiMessageToConvo(msg, currentUserName))
    .reverse(); // Invertir para mostrar más recientes primero
}
