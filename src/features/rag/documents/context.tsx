import React, { createContext, useContext, useState, useCallback } from "react";
import type { Document, Chunk } from "./types";

interface DocumentsContextType {
  selectedDocument: Document | null;
  setSelectedDocument: (document: Document | null) => void;
  selectedChunk: Chunk | null;
  setSelectedChunk: (chunk: Chunk | null) => void;
  viewingDocument: Document | null;
  setViewingDocument: (document: Document | null) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  dialogMode: "create" | "edit";
  setDialogMode: (mode: "create" | "edit") => void;
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(
  undefined
);

export const DocumentsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [selectedChunk, setSelectedChunk] = useState<Chunk | null>(null);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  const value: DocumentsContextType = {
    selectedDocument,
    setSelectedDocument,
    selectedChunk,
    setSelectedChunk,
    viewingDocument,
    setViewingDocument,
    isDialogOpen,
    setIsDialogOpen,
    dialogMode,
    setDialogMode,
  };

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
};

export const useDocumentsContext = () => {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error(
      "useDocumentsContext debe usarse dentro de DocumentsProvider"
    );
  }
  return context;
};
