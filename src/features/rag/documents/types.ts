/**
 * Types para documentos y chunks
 */

export interface Document {
  id: number;
  title: string;
  category: string;
  summary: string;
  source?: string;
  publishedAt?: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface Chunk {
  id: number;
  documentId: number;
  content: string;
  embedding?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentRequest {
  title: string;
  category: string;
  summary: string;
  source?: string;
  content?: string;
}

export interface UpdateDocumentRequest extends CreateDocumentRequest {
  id: number;
}

export interface CreateChunkRequest {
  documentId: number;
  content: string;
}

export interface UpdateChunkRequest {
  chunkId: number;
  content: string;
}

export interface DeleteChunkRequest {
  chunkId: number;
}

export interface GetChunksByDocumentRequest {
  docId: number;
}

export interface DocumentsTableState {
  selectedId: number | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
}

export interface ChunksTableState {
  selectedId: number | null;
  isLoading: boolean;
  error: string | null;
  documentId: number | null;
  page: number;
  pageSize: number;
}
