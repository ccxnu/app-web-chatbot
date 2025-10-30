import type { IResponse } from "@/api/entities/response";
import { axiosClient } from "@/api/http/client";
import { withBody } from "@/api/http/request";
import { validateApiResponse } from "@/api/http/response";
import {
  DOCUMENTS_CREATE,
  DOCUMENTS_DELETE,
  DOCUMENTS_GET_ALL,
  DOCUMENTS_GET_BY_CATEGORY,
  DOCUMENTS_GET_BY_ID,
  DOCUMENTS_SEARCH_BY_TITLE,
  DOCUMENTS_UPDATE,
  DOCUMENTS_UPLOAD_PDF,
} from "../constant-routes";

/**
 * Query keys for document operations
 */
export const documentsKeys = {
  all: ["documents"] as const,
  byId: (id: number) => ["documents", id] as const,
  byCategory: (category: string) => ["documents", "category", category] as const,
  searchByTitle: (title: string) => ["documents", "search", title] as const,
};

/**
 * Create a new document in the knowledge base
 */
export const createDocument = async (
  data: Record<string, unknown>,
  processName: string = "CREATE_DOCUMENT"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    DOCUMENTS_CREATE,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get a specific document by its ID
 */
export const getDocumentById = async (
  data: Record<string, unknown>,
  processName: string = "GET_DOCUMENT_BY_ID"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    DOCUMENTS_GET_BY_ID,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get all active documents with pagination
 */
export const getAllDocuments = async (
  data: Record<string, unknown>,
  processName: string = "GET_ALL_DOCUMENTS"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    DOCUMENTS_GET_ALL,
    body
  );
  return validateApiResponse(response);
};

/**
 * Get documents filtered by category with pagination
 */
export const getDocumentsByCategory = async (
  data: Record<string, unknown>,
  processName: string = "GET_DOCUMENTS_BY_CATEGORY"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    DOCUMENTS_GET_BY_CATEGORY,
    body
  );
  return validateApiResponse(response);
};

/**
 * Search documents by title pattern (case-insensitive)
 */
export const searchDocumentsByTitle = async (
  data: Record<string, unknown>,
  processName: string = "SEARCH_DOCUMENTS_BY_TITLE"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    DOCUMENTS_SEARCH_BY_TITLE,
    body
  );
  return validateApiResponse(response);
};

/**
 * Update an existing document
 */
export const updateDocument = async (
  data: Record<string, unknown>,
  processName: string = "UPDATE_DOCUMENT"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    DOCUMENTS_UPDATE,
    body
  );
  return validateApiResponse(response);
};

/**
 * Soft delete a document (sets active = false)
 */
export const deleteDocument = async (
  data: Record<string, unknown>,
  processName: string = "DELETE_DOCUMENT"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    DOCUMENTS_DELETE,
    body
  );
  return validateApiResponse(response);
};

/**
 * Upload a PDF file, extract text, and create document with chunks
 */
export const uploadPDFDocument = async (
  data: Record<string, unknown>,
  processName: string = "UPLOAD_PDF_DOCUMENT"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    DOCUMENTS_UPLOAD_PDF,
    body
  );
  return validateApiResponse(response);
};
