// Admin Auth Routes
export const ADMIN_AUTH_LOGIN = "/admin/auth/login";
export const ADMIN_AUTH_REFRESH = "/admin/auth/refresh";
export const ADMIN_AUTH_LOGOUT = "/admin/auth/logout";
export const ADMIN_USERS_CREATE = "/admin/users/create";

// WhatsApp Routes
export const WHATSAPP_CONVERSATION_HISTORY = "/admin/whatsapp/conversation-history";
export const WHATSAPP_QR_CODE = "/admin/whatsapp/qr-code";
export const WHATSAPP_STATUS = "/admin/whatsapp/status";
export const WHATSAPP_UPDATE_STATUS = "/admin/whatsapp/update-status";

// Chunks Routes
export const CHUNKS_BULK_CREATE = "/api/v1/chunks/bulk-create";
export const CHUNKS_CREATE = "/api/v1/chunks/create";
export const CHUNKS_DELETE = "/api/v1/chunks/delete";
export const CHUNKS_GET_BY_DOCUMENT = "/api/v1/chunks/get-by-document";
export const CHUNKS_GET_BY_ID = "/api/v1/chunks/get-by-id";
export const CHUNKS_HYBRID_SEARCH = "/api/v1/chunks/hybrid-search";
export const CHUNKS_SIMILARITY_SEARCH = "/api/v1/chunks/similarity-search";
export const CHUNKS_UPDATE_CONTENT = "/api/v1/chunks/update-content";

// Chunk Statistics Routes
export const CHUNK_STATS_GET_BY_CHUNK = "/api/v1/chunk-statistics/get-by-chunk";
export const CHUNK_STATS_GET_TOP_BY_USAGE = "/api/v1/chunk-statistics/get-top-by-usage";
export const CHUNK_STATS_INCREMENT_USAGE = "/api/v1/chunk-statistics/increment-usage";
export const CHUNK_STATS_UPDATE_QUALITY_METRICS = "/api/v1/chunk-statistics/update-quality-metrics";
export const CHUNK_STATS_UPDATE_STALENESS = "/api/v1/chunk-statistics/update-staleness";

// Documents Routes
export const DOCUMENTS_CREATE = "/api/v1/documents/create";
export const DOCUMENTS_DELETE = "/api/v1/documents/delete";
export const DOCUMENTS_GET_ALL = "/api/v1/documents/get-all";
export const DOCUMENTS_GET_BY_CATEGORY = "/api/v1/documents/get-by-category";
export const DOCUMENTS_GET_BY_ID = "/api/v1/documents/get-by-id";
export const DOCUMENTS_SEARCH_BY_TITLE = "/api/v1/documents/search-by-title";
export const DOCUMENTS_UPDATE = "/api/v1/documents/update";

// Parameters Routes
export const PARAMETERS_ADD = "/api/v1/parameters/add";
export const PARAMETERS_DELETE = "/api/v1/parameters/delete";
export const PARAMETERS_GET_ALL = "/api/v1/parameters/get-all";
export const PARAMETERS_GET_BY_CODE = "/api/v1/parameters/get-by-code";
export const PARAMETERS_RELOAD_CACHE = "/api/v1/parameters/reload-cache";
export const PARAMETERS_UPDATE = "/api/v1/parameters/update";

// Admin Conversations Routes
export const CONVERSATIONS_GET_ALL = "/admin/conversations/get-all";
export const CONVERSATIONS_GET_MESSAGES = "/admin/conversations/get-messages";
export const CONVERSATIONS_SEND = "/admin/conversations/send";
export const CONVERSATIONS_MARK_READ = "/admin/conversations/mark-read";
export const CONVERSATIONS_DELETE = "/admin/conversations/delete";
export const CONVERSATIONS_SET_TEMPORARY = "/admin/conversations/set-temporary";
export const ADMIN_USERS_BLOCK = "/admin/users/block";

// Analytics Routes
export const ANALYTICS_OVERVIEW = "/admin/analytics/overview";
export const ANALYTICS_COSTS = "/admin/analytics/costs";
export const ANALYTICS_TOKENS = "/admin/analytics/tokens";
export const ANALYTICS_USERS = "/admin/analytics/users";
export const ANALYTICS_CONVERSATIONS = "/admin/analytics/conversations";
export const ANALYTICS_MESSAGES = "/admin/analytics/messages";
export const ANALYTICS_TOP_QUERIES = "/admin/analytics/top-queries";
export const ANALYTICS_KNOWLEDGE_BASE = "/admin/analytics/knowledge-base";
export const ANALYTICS_HEALTH = "/admin/analytics/health";

// Reports Routes
export const REPORTS_GENERATE_MONTHLY = "/admin/reports/generate-monthly";
export const REPORTS_LIST = "/admin/reports/list";
export const REPORTS_DOWNLOAD = "/admin/reports/download";
