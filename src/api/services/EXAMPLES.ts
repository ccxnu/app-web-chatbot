/**
 * EXAMPLE: API Services Usage
 * Ejemplos de cómo usar los servicios API disponibles
 */

// ============================================================================
// ADMIN - WhatsApp Services
// ============================================================================

import {
  getConversationHistory,
  getWhatsAppQRCode,
  getWhatsAppStatus,
  updateWhatsAppStatus,
  // RAG Services
  createDocument,
  getAllDocuments,
  getDocumentsByCategory,
  searchDocumentsByTitle,
  createChunk,
  hybridSearchChunks,
  similaritySearchChunks,
  getChunkStatistics,
  incrementChunkUsage,
  updateChunkQualityMetrics,
  getTopChunksByUsage,
  // System Services
  getAllParameters,
  getParameterByCode,
  addParameter,
} from "@/api/services";

/**
 * Ejemplo 1: Obtener estado de WhatsApp
 */
export const exampleGetWhatsAppStatus = async () => {
  try {
    const status = await getWhatsAppStatus({});
    console.log("WhatsApp Status:", status);
    return status;
  } catch (error) {
    console.error("Error getting WhatsApp status:", error);
  }
};

/**
 * Ejemplo 2: Obtener código QR de WhatsApp
 */
export const exampleGetWhatsAppQRCode = async () => {
  try {
    const qrData = await getWhatsAppQRCode({});
    console.log("QR Code:", qrData);
    return qrData;
  } catch (error) {
    console.error("Error getting WhatsApp QR code:", error);
  }
};

/**
 * Ejemplo 3: Obtener historial de conversación
 */
export const exampleGetConversationHistory = async (conversationId: string) => {
  try {
    const history = await getConversationHistory({
      conversationId,
    });
    console.log("Conversation History:", history);
    return history;
  } catch (error) {
    console.error("Error getting conversation history:", error);
  }
};

// ============================================================================
// RAG - Documents
// ============================================================================

/**
 * Ejemplo 4: Crear un nuevo documento
 */
export const exampleCreateDocument = async () => {
  try {
    const result = await createDocument({
      title: "Política de Privacidad",
      category: "legal",
      description: "Documento con las políticas de privacidad de la empresa",
      content: "Lorem ipsum dolor sit amet...",
    });
    console.log("Document created:", result);
    return result;
  } catch (error) {
    console.error("Error creating document:", error);
  }
};

/**
 * Ejemplo 5: Obtener todos los documentos con paginación
 */
export const exampleGetAllDocuments = async () => {
  try {
    const documents = await getAllDocuments({
      page: 1,
      pageSize: 10,
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
    console.log("Documents:", documents);
    return documents;
  } catch (error) {
    console.error("Error getting documents:", error);
  }
};

/**
 * Ejemplo 6: Obtener documentos por categoría
 */
export const exampleGetDocumentsByCategory = async () => {
  try {
    const documents = await getDocumentsByCategory({
      category: "legal",
      page: 1,
      pageSize: 10,
    });
    console.log("Documents by category:", documents);
    return documents;
  } catch (error) {
    console.error("Error getting documents by category:", error);
  }
};

/**
 * Ejemplo 7: Buscar documentos por título
 */
export const exampleSearchDocumentsByTitle = async () => {
  try {
    const documents = await searchDocumentsByTitle({
      title: "Política",
      page: 1,
      pageSize: 10,
    });
    console.log("Search results:", documents);
    return documents;
  } catch (error) {
    console.error("Error searching documents:", error);
  }
};

// ============================================================================
// RAG - Chunks (Fragmentos)
// ============================================================================

/**
 * Ejemplo 8: Crear un chunk (fragmento de documento)
 */
export const exampleCreateChunk = async () => {
  try {
    const result = await createChunk({
      documentId: 1,
      content: "Este es un fragmento importante del documento principal.",
    });
    console.log("Chunk created:", result);
    return result;
  } catch (error) {
    console.error("Error creating chunk:", error);
  }
};

/**
 * Ejemplo 9: Búsqueda semántica (Vector Search)
 */
export const exampleSimilaritySearch = async () => {
  try {
    const results = await similaritySearchChunks({
      query: "¿Cómo puedo cambiar mi contraseña?",
      topK: 5,
      minSimilarity: 0.5,
    });
    console.log("Similarity search results:", results);
    return results;
  } catch (error) {
    console.error("Error in similarity search:", error);
  }
};

/**
 * Ejemplo 10: Búsqueda híbrida (Vector + Full-text)
 */
export const exampleHybridSearch = async () => {
  try {
    const results = await hybridSearchChunks({
      query: "autenticación de dos factores",
      topK: 5,
      keywordWeight: 0.3,    // Peso para búsqueda de palabras clave
      semanticWeight: 0.7,   // Peso para búsqueda semántica
      minScore: 0.4,
    });
    console.log("Hybrid search results:", results);
    return results;
  } catch (error) {
    console.error("Error in hybrid search:", error);
  }
};

/**
 * Ejemplo 11: Incrementar contador de uso de chunk
 */
export const exampleIncrementChunkUsage = async (chunkId: number) => {
  try {
    const result = await incrementChunkUsage({
      chunkId,
    });
    console.log("Usage incremented:", result);
    return result;
  } catch (error) {
    console.error("Error incrementing chunk usage:", error);
  }
};

/**
 * Ejemplo 12: Obtener estadísticas de un chunk
 */
export const exampleGetChunkStatistics = async (chunkId: number) => {
  try {
    const stats = await getChunkStatistics({
      chunkId,
    });
    console.log("Chunk statistics:", stats);
    // stats contiene: usageCount, lastUsedAt, precisionAtK, recallAtK, f1, etc.
    return stats;
  } catch (error) {
    console.error("Error getting chunk statistics:", error);
  }
};

/**
 * Ejemplo 13: Obtener chunks más usados
 */
export const exampleGetTopChunksByUsage = async () => {
  try {
    const topChunks = await getTopChunksByUsage({
      limit: 10,
      timeWindowDays: 30, // Últimos 30 días
    });
    console.log("Top chunks by usage:", topChunks);
    return topChunks;
  } catch (error) {
    console.error("Error getting top chunks:", error);
  }
};

/**
 * Ejemplo 14: Actualizar métricas de calidad de RAG
 */
export const exampleUpdateQualityMetrics = async (chunkId: number) => {
  try {
    const result = await updateChunkQualityMetrics({
      chunkId,
      precisionAtK: 0.92,      // Precision@K
      recallAtK: 0.88,         // Recall@K
      f1: 0.90,                // F1 Score
      mrr: 0.95,               // Mean Reciprocal Rank
      map: 0.85,               // Mean Average Precision
      ndcg: 0.89,              // Normalized Discounted Cumulative Gain
    });
    console.log("Quality metrics updated:", result);
    return result;
  } catch (error) {
    console.error("Error updating quality metrics:", error);
  }
};

// ============================================================================
// SYSTEM - Parameters
// ============================================================================

/**
 * Ejemplo 15: Obtener todos los parámetros del sistema
 */
export const exampleGetAllParameters = async () => {
  try {
    const parameters = await getAllParameters({});
    console.log("All parameters:", parameters);
    return parameters;
  } catch (error) {
    console.error("Error getting parameters:", error);
  }
};

/**
 * Ejemplo 16: Obtener un parámetro específico por código
 */
export const exampleGetParameterByCode = async () => {
  try {
    const parameter = await getParameterByCode({
      code: "MAX_CHAT_HISTORY_DAYS",
    });
    console.log("Parameter value:", parameter?.data?.value); // Ej: 30
    return parameter;
  } catch (error) {
    console.error("Error getting parameter:", error);
  }
};

/**
 * Ejemplo 17: Añadir un nuevo parámetro del sistema
 */
export const exampleAddParameter = async () => {
  try {
    const result = await addParameter({
      name: "Max History Days",
      code: "MAX_CHAT_HISTORY_DAYS",
      data: { value: 30 },
      description: "Número máximo de días de historial a mantener",
    });
    console.log("Parameter added:", result);
    return result;
  } catch (error) {
    console.error("Error adding parameter:", error);
  }
};

// ============================================================================
// REACT QUERY INTEGRATION
// ============================================================================

/**
 * Ejemplo 18: Usar servicios con React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  documentsKeys,
  chunksKeys,
  chunkStatsKeys,
  parametersKeys,
} from "@/api/services";

// Consulta para obtener todos los documentos
export const useDocumentsQuery = () => {
  return useQuery({
    queryKey: documentsKeys.all,
    queryFn: () => getAllDocuments({ page: 1, pageSize: 10 }),
  });
};

// Consulta para búsqueda híbrida
export const useHybridSearchQuery = (query: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: chunksKeys.hybridSearch(),
    queryFn: () =>
      hybridSearchChunks({
        query,
        topK: 5,
        keywordWeight: 0.3,
        semanticWeight: 0.7,
      }),
    enabled,
  });
};

// Mutación para crear documento
export const useCreateDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsKeys.all });
    },
  });
};

// Mutación para incrementar uso de chunk
export const useIncrementChunkUsageMutation = (chunkId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => incrementChunkUsage({ chunkId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chunkStatsKeys.byChunk(chunkId),
      });
    },
  });
};

/**
 * Ejemplo 19: Hook personalizado para búsqueda
 */
export const useSearchQuery = (query: string, searchType: "similarity" | "hybrid" = "hybrid") => {
  return useQuery({
    queryKey: [chunksKeys.search(), query, searchType],
    queryFn: () =>
      searchType === "hybrid"
        ? hybridSearchChunks({ query, topK: 5 })
        : similaritySearchChunks({ query, topK: 5 }),
    enabled: query.length > 2,
  });
};
