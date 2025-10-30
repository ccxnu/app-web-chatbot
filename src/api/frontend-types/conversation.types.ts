/**
 * Conversation types
 * Generated from Go backend domain models
 */

/**
 * User role types
 */
export type UserRole = 'ROLE_STUDENT' | 'ROLE_PROFESSOR' | 'EXTERNAL';

/**
 * Message sender type
 */
export type SenderType = 'user' | 'admin' | 'bot';

/**
 * Message type
 */
export type MessageType = 'text' | 'image' | 'document' | 'audio' | 'video';

/**
 * Conversation filter types
 */
export type ConversationFilter = 'all' | 'unread' | 'blocked' | 'active';

/**
 * Conversation data
 */
export interface Conversation {
  id: number;
  chatId: string;
  phoneNumber: string;
  contactName: string | null;
  isGroup: boolean;
  groupName: string | null;
  lastMessageAt: string; // ISO 8601 timestamp
  messageCount: number;
  unreadCount: number;
  blocked: boolean;
  adminIntervened: boolean;
  temporary: boolean;
  expiresAt: string | null; // ISO 8601 timestamp
  // User data
  userId: number;
  userName: string;
  userIdentityNumber: string;
  userRole: UserRole;
  userBlocked: boolean;
  // Last message preview
  lastMessagePreview: string;
  lastMessageFromMe: boolean;
}

/**
 * Request parameters for getting all conversations
 */
export interface GetConversationsParams {
  filter?: ConversationFilter; // default: "all"
  limit?: number; // default: 50
  offset?: number; // default: 0
}

/**
 * Conversation message
 */
export interface ConversationMessage {
  id: number;
  messageId: string;
  fromMe: boolean;
  senderName: string;
  senderType: SenderType;
  messageType: MessageType;
  body: string | null;
  mediaUrl: string | null;
  quotedMessage: string | null;
  timestamp: number;
  isForwarded: boolean;
  read: boolean;
  createdAt: string; // ISO 8601 timestamp
  adminName: string | null; // if senderType === "admin"
}

/**
 * Request parameters for getting conversation messages
 */
export interface GetMessagesParams {
  conversationId: number;
  limit?: number; // default: 100
}

/**
 * Request parameters for sending a message
 */
export interface SendMessageParams {
  conversationId: number;
  message: string; // 1-4096 characters
}

/**
 * Response for sending a message
 */
export interface SendMessageResponse {
  messageId: number;
  conversationId: number;
  sent: boolean;
}

/**
 * Request parameters for marking messages as read
 */
export interface MarkReadParams {
  conversationId: number;
}

/**
 * Request parameters for blocking a user
 */
export interface BlockUserParams {
  userId: number;
  blocked: boolean;
  reason?: string; // max 500 characters
}

/**
 * Request parameters for deleting a conversation
 */
export interface DeleteConversationParams {
  conversationId: number;
}

/**
 * Request parameters for setting temporary conversation
 */
export interface SetTemporaryParams {
  conversationId: number;
  temporary: boolean;
  hoursUntilExpiry?: number; // 1-720 (default: 24)
}

/**
 * Response for setting temporary conversation
 */
export interface SetTemporaryResponse {
  conversationId: number;
  temporary: boolean;
  expiresAt: string; // ISO 8601 timestamp
}
