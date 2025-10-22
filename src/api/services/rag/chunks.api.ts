import type { IResponse } from "@/api/entities/response";
import { axiosClient } from "@/api/http/client";
import { withBody } from "@/api/http/request";
import { validateApiResponse } from "@/api/http/response";
import {
  CHUNKS_BULK_CREATE,
  CHUNKS_CREATE,
  CHUNKS_DELETE,
  CHUNKS_GET_BY_DOCUMENT,
  CHUNKS_GET_BY_ID,
  CHUNKS_HYBRID_SEARCH,
  CHUNKS_SIMILARITY_SEARCH,
  CHUNKS_UPDATE_CONTENT,
} from "../constant-routes";

/**
 * Query keys for chunk operations
 */
export const chunksKeys = {
  all: ["chunks"] as const,
  byId: (id: number) => ["chunks", id] as const,
  byDocument: (documentId: number) => ["chunks", "document", documentId] as const,
  search: () => ["chunks", "search"] as const,
  hybridSearch: () => ["chunks", "hybrid-search"] as const,
};

/**
 * Create a new chunk from text content
 */
export const createChunk = async (
  data: Record<string, unknown>,
  processName: string = "CREATE_CHUNK"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CHUNKS_CREATE,
    body
  );
  return validateApiResponse(response);
};

/**
 * Create multiple chunks from text contents (bulk operation)
 */
export const bulkCreateChunks = async (
  data: Record<string, unknown>,
  processName: string = "BULK_CREATE_CHUNKS"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CHUNKS_BULK_CREATE,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get a specific chunk by its ID
 */
export const getChunkById = async (
  data: Record<string, unknown>,
  processName: string = "GET_CHUNK_BY_ID"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CHUNKS_GET_BY_ID,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get all chunks for a specific document
 */
export const getChunksByDocument = async (
  data: Record<string, unknown>,
  processName: string = "GET_CHUNKS_BY_DOCUMENT"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CHUNKS_GET_BY_DOCUMENT,
    body
  );
  return validateApiResponse(response);
};

/**
 * Update chunk content and regenerate embedding
 */
export const updateChunkContent = async (
  data: Record<string, unknown>,
  processName: string = "UPDATE_CHUNK_CONTENT"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CHUNKS_UPDATE_CONTENT,
    body
  );
  return validateApiResponse(response);
};

/**
 * Delete a chunk (hard delete)
 */
export const deleteChunk = async (
  data: Record<string, unknown>,
  processName: string = "DELETE_CHUNK"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CHUNKS_DELETE,
    body
  );
  return validateApiResponse(response);
};

/**
 * Perform semantic search using text query
 */
export const similaritySearchChunks = async (
  data: Record<string, unknown>,
  processName: string = "SIMILARITY_SEARCH_CHUNKS"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CHUNKS_SIMILARITY_SEARCH,
    body
  );
  return validateApiResponse(response);
};

/**
 * Perform hybrid search combining semantic similarity and keyword matching
 */
export const hybridSearchChunks = async (
  data: Record<string, unknown>,
  processName: string = "HYBRID_SEARCH_CHUNKS"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CHUNKS_HYBRID_SEARCH,
    body
  );
  return validateApiResponse(response);
};
