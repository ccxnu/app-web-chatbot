/**
 * Exports para el módulo de Gestión de Documentos y Chunks
 */

// Componentes
export { DocumentsManager } from "./index";
export { DocumentDialog } from "./document-dialog";
export { ChunkDialog } from "./chunk-dialog";
export { DocumentsTable } from "./documents-table";
export { ChunksTable } from "./chunks-table";
export { ChunksManager } from "./chunks-manager";
export { DocumentViewer } from "./document-viewer";

// Types
export type {
  Document,
  Chunk,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  CreateChunkRequest,
  UpdateChunkRequest,
  DocumentsTableState,
  ChunksTableState,
} from "./types";

// Utilities
export {
  truncateText,
  formatWordCount,
  validateDocumentContent,
  suggestCategories,
  calculateChunkStatistics,
  cn,
} from "./utils";
export type { ChunkStatistics } from "./utils";

// Context
export { DocumentsProvider, useDocumentsContext } from "./context";
