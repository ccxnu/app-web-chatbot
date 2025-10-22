import type { IResponse } from "@/api/entities/response";
import { axiosClient } from "@/api/http/client";
import { withBody } from "@/api/http/request";
import { validateApiResponse } from "@/api/http/response";
import {
  CHUNK_STATS_GET_BY_CHUNK,
  CHUNK_STATS_GET_TOP_BY_USAGE,
  CHUNK_STATS_INCREMENT_USAGE,
  CHUNK_STATS_UPDATE_QUALITY_METRICS,
  CHUNK_STATS_UPDATE_STALENESS,
} from "../constant-routes";

/**
 * Query keys for chunk statistics operations
 */
export const chunkStatsKeys = {
  all: ["chunk-statistics"] as const,
  byChunk: (chunkId: number) => ["chunk-statistics", "chunk", chunkId] as const,
  topByUsage: () => ["chunk-statistics", "top-by-usage"] as const,
  usage: (chunkId: number) => ["chunk-statistics", "usage", chunkId] as const,
};

/**
 * Get all statistics and quality metrics for a specific chunk
 */
export const getChunkStatistics = async (
  data: Record<string, unknown>,
  processName: string = "GET_CHUNK_STATISTICS"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CHUNK_STATS_GET_BY_CHUNK,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get the most frequently used chunks for analytics
 */
export const getTopChunksByUsage = async (
  data: Record<string, unknown>,
  processName: string = "GET_TOP_CHUNKS_BY_USAGE"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CHUNK_STATS_GET_TOP_BY_USAGE,
    body
  );
  return validateApiResponse(response);
};

/**
 * Increment the usage count for a chunk
 */
export const incrementChunkUsage = async (
  data: Record<string, unknown>,
  processName: string = "INCREMENT_CHUNK_USAGE"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CHUNK_STATS_INCREMENT_USAGE,
    body
  );
  return validateApiResponse(response);
};

/**
 * Update quality and relevance metrics for a chunk
 * Metrics include: Precision@K, Recall@K, F1, MRR, MAP, NDCG
 */
export const updateChunkQualityMetrics = async (
  data: Record<string, unknown>,
  processName: string = "UPDATE_CHUNK_QUALITY_METRICS"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CHUNK_STATS_UPDATE_QUALITY_METRICS,
    body
  );
  return validateApiResponse(response);
};

/**
 * Update the staleness metric for a chunk to track content freshness
 */
export const updateChunkStaleness = async (
  data: Record<string, unknown>,
  processName: string = "UPDATE_CHUNK_STALENESS"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    CHUNK_STATS_UPDATE_STALENESS,
    body
  );
  return validateApiResponse(response);
};
