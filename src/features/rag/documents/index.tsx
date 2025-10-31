import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  uploadPDFDocument,
  documentsKeys,
} from "@/api/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { DocumentDialog } from "./document-dialog";
import { PDFUploadDialog } from "./pdf-upload-dialog";
import { DocumentsTable } from "./documents-table";
import { ChunksManager } from "./chunks-manager";
import { DocumentViewer } from "./document-viewer";
import type { Document, CreateDocumentRequest, UploadPDFDocumentRequest } from "./types";
import { Header } from "@/components/layout/header";
import { Search } from "@/components/search";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { TopNav } from "@/components/layout/top-nav";
import { ThemeSwitch } from "@/components/theme-switch";

export const DocumentsManager: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pdfUploadOpen, setPdfUploadOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | undefined>();
  const [viewingDocument, setViewingDocument] = useState<Document | undefined>();
  const [chunksDocument, setChunksDocument] = useState<Document | undefined>();
  const [activeTab, setActiveTab] = useState("documents");
  const queryClient = useQueryClient();

  // Obtener todos los documentos
  const { data: documents = [], isLoading } = useQuery({
    queryKey: documentsKeys.all,
    queryFn: () =>
      getAllDocuments({
        offset: 0,
        limit: 100,
      }),
  });

  // Crear documento
  const createMutation = useMutation({
    mutationFn: (data: CreateDocumentRequest) => createDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsKeys.all });
      toast.success("Documento creado exitosamente");
      setDialogOpen(false);
      setSelectedDocument(undefined);
    },
    onError: () => {
      toast.error("Error al crear documento");
    },
  });

  // Actualizar documento
  const updateMutation = useMutation({
    mutationFn: (data: CreateDocumentRequest) =>
      updateDocument({
        docId: selectedDocument!.id,
        ...data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsKeys.all });
      toast.success("Documento actualizado exitosamente");
      setDialogOpen(false);
      setSelectedDocument(undefined);
    },
    onError: () => {
      toast.error("Error al actualizar documento");
    },
  });

  // Eliminar documento
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDocument({ docId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsKeys.all });
      toast.success("Documento eliminado exitosamente");
    },
    onError: () => {
      toast.error("Error al eliminar documento");
    },
  });

  // Subir PDF
  const uploadPDFMutation = useMutation({
    mutationFn: (data: UploadPDFDocumentRequest) => uploadPDFDocument(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: documentsKeys.all });
      toast.success(`PDF procesado: ${result.chunksCreated} fragmentos creados`);
      setPdfUploadOpen(false);
    },
    onError: () => {
      toast.error("Error al procesar el PDF");
    },
  });

  const handleEdit = (document: Document) => {
    setSelectedDocument(document);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedDocument(undefined);
    setDialogOpen(true);
  };

  const handleUploadPDF = () => {
    setPdfUploadOpen(true);
  };

  const handlePDFUploadSubmit = async (data: UploadPDFDocumentRequest) => {
    await uploadPDFMutation.mutateAsync(data);
  };

  const handleSubmit = async (data: CreateDocumentRequest) => {
    if (selectedDocument) {
      await updateMutation.mutateAsync(data);
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDelete = (id: number) => deleteMutation.mutateAsync(id);

  const handleView = (document: Document) => {
    setViewingDocument(document);
  };

  const handleViewChunks = (document: Document) => {
    setChunksDocument(document);
    setActiveTab("chunks");
  };

  return (
  <>
  <Header>
	<TopNav links={[]} />
	<div className='ml-auto flex items-center space-x-4'>
	  <Search />
	  <ThemeSwitch />
	  <ProfileDropdown />
	</div>
  </Header>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Documentos</h1>
          <p className="text-muted-foreground mt-2">
            Crea, edita y organiza los documentos de tu base de conocimientos
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUploadPDF} size="lg" variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Subir PDF
          </Button>
          <Button onClick={handleCreate} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Documento
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="documents">Documentos ({documents.length})</TabsTrigger>
          <TabsTrigger value="chunks" disabled={!chunksDocument}>
            Fragmentos {chunksDocument && `- ${chunksDocument.title}`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todos los Documentos</CardTitle>
              <CardDescription>
                Lista de documentos disponibles en la base de conocimientos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <DocumentsTable
                  documents={documents}
                  isLoading={
                    createMutation.isPending ||
                    updateMutation.isPending ||
                    deleteMutation.isPending
                  }
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                  onViewChunks={handleViewChunks}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chunks" className="space-y-4">
          {chunksDocument ? (
            <div className="space-y-4">
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{chunksDocument.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {chunksDocument.summary}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <ChunksManager documentId={chunksDocument.id} />
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
                Selecciona un documento para ver sus fragmentos
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <DocumentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        document={selectedDocument}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <PDFUploadDialog
        open={pdfUploadOpen}
        onOpenChange={setPdfUploadOpen}
        onSubmit={handlePDFUploadSubmit}
        isLoading={uploadPDFMutation.isPending}
      />

      {viewingDocument && (
        <DocumentViewer
          document={viewingDocument}
          onClose={() => setViewingDocument(undefined)}
        />
      )}
    </div>
	</>
  );
};
