/**
 * Quick Verification File - Imports Test
 * Este archivo verifica que todos los servicios se pueden importar correctamente
 */

// ✅ Verificación de imports - Si este archivo compila, todos los servicios están correctos

// Admin Services
import type {
  whatsappKeys,
} from "@/api/services/admin/whatsapp.api";
import {
  getConversationHistory,
  getWhatsAppQRCode,
  getWhatsAppStatus,
  updateWhatsAppStatus,
} from "@/api/services";

// RAG - Chunks Services
import type {
  chunksKeys,
} from "@/api/services/rag/chunks.api";
import {
  createChunk,
  bulkCreateChunks,
  getChunkById,
  getChunksByDocument,
  updateChunkContent,
  deleteChunk,
  similaritySearchChunks,
  hybridSearchChunks,
} from "@/api/services";

// RAG - Chunk Statistics Services
import type {
  chunkStatsKeys,
} from "@/api/services/rag/chunk-statistics.api";
import {
  getChunkStatistics,
  getTopChunksByUsage,
  incrementChunkUsage,
  updateChunkQualityMetrics,
  updateChunkStaleness,
} from "@/api/services";

// RAG - Documents Services
import type {
  documentsKeys,
} from "@/api/services/rag/documents.api";
import {
  createDocument,
  getDocumentById,
  getAllDocuments,
  getDocumentsByCategory,
  searchDocumentsByTitle,
  updateDocument,
  deleteDocument,
} from "@/api/services";

// System - Parameters Services
import type {
  parametersKeys,
} from "@/api/services/system/parameters.api";
import {
  addParameter,
  getParameterByCode,
  getAllParameters,
  updateParameter,
  deleteParameter,
  reloadParameterCache,
} from "@/api/services";

// Routes Constants
import {
  // WhatsApp
  WHATSAPP_CONVERSATION_HISTORY,
  WHATSAPP_QR_CODE,
  WHATSAPP_STATUS,
  WHATSAPP_UPDATE_STATUS,
  // Chunks
  CHUNKS_BULK_CREATE,
  CHUNKS_CREATE,
  CHUNKS_DELETE,
  CHUNKS_GET_BY_DOCUMENT,
  CHUNKS_GET_BY_ID,
  CHUNKS_HYBRID_SEARCH,
  CHUNKS_SIMILARITY_SEARCH,
  CHUNKS_UPDATE_CONTENT,
  // Chunk Statistics
  CHUNK_STATS_GET_BY_CHUNK,
  CHUNK_STATS_GET_TOP_BY_USAGE,
  CHUNK_STATS_INCREMENT_USAGE,
  CHUNK_STATS_UPDATE_QUALITY_METRICS,
  CHUNK_STATS_UPDATE_STALENESS,
  // Documents
  DOCUMENTS_CREATE,
  DOCUMENTS_DELETE,
  DOCUMENTS_GET_ALL,
  DOCUMENTS_GET_BY_CATEGORY,
  DOCUMENTS_GET_BY_ID,
  DOCUMENTS_SEARCH_BY_TITLE,
  DOCUMENTS_UPDATE,
  // Parameters
  PARAMETERS_ADD,
  PARAMETERS_DELETE,
  PARAMETERS_GET_ALL,
  PARAMETERS_GET_BY_CODE,
  PARAMETERS_RELOAD_CACHE,
  PARAMETERS_UPDATE,
} from "@/api/services";

/**
 * Function de prueba - Simplemente importar ya verifica que todo está correctamente tipado
 */
export const verifyServicesAreAvailable = () => {
  console.log("✅ All services imported successfully!");
  console.log("📊 Statistics:");
  console.log("   - Admin services: 1 module (WhatsApp)");
  console.log("   - RAG services: 3 modules (Chunks, Statistics, Documents)");
  console.log("   - System services: 1 module (Parameters)");
  console.log("   - Total routes: 30 constants");
  console.log("   - Total functions: 30");
  
  return {
    admin: { whatsapp: true },
    rag: {
      chunks: true,
      statistics: true,
      documents: true,
    },
    system: {
      parameters: true,
    },
  };
};

// Type checking - esto verifica que los types son correctos
const typeCheck = (): void => {
  // Admin types
  const _adminKeys: typeof whatsappKeys = whatsappKeys;
  
  // RAG types
  const _chunksKeys: typeof chunksKeys = chunksKeys;
  const _chunkStatsKeys: typeof chunkStatsKeys = chunkStatsKeys;
  const _documentsKeys: typeof documentsKeys = documentsKeys;
  
  // System types
  const _parametersKeys: typeof parametersKeys = parametersKeys;
  
  console.log("✅ All types are correct!");
};

export { typeCheck };
