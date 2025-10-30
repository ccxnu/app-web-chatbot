/**
 * Analytics types
 * Generated from Go backend domain models
 */

/**
 * Analytics overview metrics
 */
export interface AnalyticsOverview {
  costThisMonth: number;
  tokensThisMonth: number;
  activeUsersToday: number;
  conversationsThisMonth: number;
  messagesToday: number;
  avgResponseTimeMs: number;
  adminInterventionRate: number;
  lastUpdated: string; // ISO 8601 timestamp
}

/**
 * Cost analytics data
 */
export interface CostAnalytics {
  periodStart: string; // ISO 8601 timestamp
  periodEnd: string; // ISO 8601 timestamp
  totalCost: number;
  llmCost: number;
  embeddingCost: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  embeddingTokens: number;
  conversationCount: number;
  costPerConversation: number;
  avgTokensPerConversation: number;
}

/**
 * Request parameters for cost analytics
 */
export interface CostAnalyticsParams {
  startDate?: string; // ISO 8601 timestamp
  endDate?: string; // ISO 8601 timestamp
}

/**
 * Token usage data point
 */
export interface TokenUsageData {
  periodLabel: string;
  periodStart: string; // ISO 8601 timestamp
  periodEnd: string; // ISO 8601 timestamp
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  messageCount: number;
  conversationCount: number;
  avgTokensPerMessage: number;
}

/**
 * Request parameters for token usage
 */
export interface TokenUsageParams {
  period?: 'day' | 'week' | 'month' | 'year' | 'all'; // default: "month"
  groupBy?: 'hour' | 'day' | 'week'; // default: "day"
}

/**
 * Active users metrics
 */
export interface ActiveUsersMetrics {
  period: string;
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
  students: number;
  professors: number;
  external: number;
  avgMessagesPerUser: number;
  avgSessionsPerUser: number;
}

/**
 * Request parameters for user analytics
 */
export interface UserAnalyticsParams {
  period?: 'day' | 'week' | 'month' | 'all'; // default: "month"
}

/**
 * Conversation metrics
 */
export interface ConversationMetrics {
  period: string;
  totalConversations: number;
  activeConversations: number;
  newConversations: number;
  avgMessagesPerConversation: number;
  conversationsWithAdminHelp: number;
  adminInterventionRate: number;
  blockedConversations: number;
  temporaryConversations: number;
}

/**
 * Message analytics
 */
export interface MessageAnalytics {
  period: string;
  totalMessages: number;
  userMessages: number;
  botMessages: number;
  adminMessages: number;
  avgMessagesPerDay: number;
  peakHour: number; // 0-23
  peakHourCount: number;
}

/**
 * Top query data
 */
export interface TopQuery {
  queryText: string;
  queryCount: number;
  avgSimilarity: number;
  lastAsked: string; // ISO 8601 timestamp
  hasGoodAnswer: boolean;
}

/**
 * Request parameters for top queries
 */
export interface TopQueriesParams {
  period?: 'day' | 'week' | 'month' | 'all'; // default: "month"
  limit?: number; // 1-100, default: 20
  minSimilarity?: number; // 0-1, default: 0.5
}

/**
 * Knowledge base usage data
 */
export interface KnowledgeBaseUsage {
  chunkId: number;
  documentTitle: string;
  usageCount: number;
  avgSimilarity: number;
  lastUsed: string; // ISO 8601 timestamp
}

/**
 * Request parameters for knowledge base analytics
 */
export interface KnowledgeBaseParams {
  period?: 'day' | 'week' | 'month' | 'all'; // default: "month"
}

/**
 * System health metric
 */
export interface SystemHealthMetric {
  metricName: string;
  metricValue: number;
  metricUnit: string;
}
