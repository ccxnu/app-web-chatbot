import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getChunksByDocument,
  createChunk,
  updateChunkContent,
  deleteChunk,
  chunksKeys,
} from "@/api/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { ChunkDialog } from "./chunk-dialog";
import { ChunksTable } from "./chunks-table";
import type { Chunk, CreateChunkRequest } from "./types";

interface ChunksManagerProps {
  documentId: number;
}

export const ChunksManager: React.FC<ChunksManagerProps> = ({ documentId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedChunk, setSelectedChunk] = useState<Chunk | undefined>();
  const queryClient = useQueryClient();

  // Obtener chunks del documento
  const { data: chunks = [], isLoading } = useQuery({
    queryKey: chunksKeys.byDocument(documentId),
    queryFn: () =>
      getChunksByDocument({
        documentId,
      }),
  });

  // Crear chunk
  const createMutation = useMutation({
    mutationFn: (data: CreateChunkRequest) => createChunk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chunksKeys.byDocument(documentId),
      });
      toast.success("Fragmento creado exitosamente");
      setDialogOpen(false);
      setSelectedChunk(undefined);
    },
    onError: () => {
      toast.error("Error al crear fragmento");
    },
  });

  // Actualizar chunk
  const updateMutation = useMutation({
    mutationFn: (data: CreateChunkRequest) =>
      updateChunkContent({
        id: selectedChunk!.id,
        ...data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chunksKeys.byDocument(documentId),
      });
      toast.success("Fragmento actualizado exitosamente");
      setDialogOpen(false);
      setSelectedChunk(undefined);
    },
    onError: () => {
      toast.error("Error al actualizar fragmento");
    },
  });

  // Eliminar chunk
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteChunk({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chunksKeys.byDocument(documentId),
      });
      toast.success("Fragmento eliminado exitosamente");
    },
    onError: () => {
      toast.error("Error al eliminar fragmento");
    },
  });

  const handleEdit = (chunk: Chunk) => {
    setSelectedChunk(chunk);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedChunk(undefined);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: CreateChunkRequest) => {
    const payload = {
      ...data,
      documentId,
    };

    if (selectedChunk) {
      await updateMutation.mutateAsync(payload);
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const handleDelete = (id: number) => deleteMutation.mutateAsync(id);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Fragmentos (Chunks)</CardTitle>
            <CardDescription>
              Gestiona los fragmentos de contenido de este documento
            </CardDescription>
          </div>
          <Button onClick={handleCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Fragmento
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ChunksTable
              chunks={chunks}
              isLoading={
                createMutation.isPending ||
                updateMutation.isPending ||
                deleteMutation.isPending
              }
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <ChunkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        chunk={selectedChunk}
        onSubmit={handleSubmit}
        isLoading={
          createMutation.isPending ||
          updateMutation.isPending
        }
      />
    </>
  );
};
