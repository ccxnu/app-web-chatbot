import React, { useMemo, useState } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { ChunkDialog } from "./chunk-dialog";
import { ChunksTable } from "./chunks-table";
import type { Chunk, CreateChunkRequest } from "./types";

interface ChunksManagerProps {
  documentId: number;
}

type FilterType = "all" | "short" | "medium" | "long";

export const ChunksManager: React.FC<ChunksManagerProps> = ({ documentId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedChunk, setSelectedChunk] = useState<Chunk | undefined>();
  const [filter, setFilter] = useState<FilterType>("all");
  const queryClient = useQueryClient();

  // Obtener chunks del documento
  const { data: chunks = [], isLoading } = useQuery({
    queryKey: chunksKeys.byDocument(documentId),
    queryFn: () =>
      getChunksByDocument({
        docId: documentId,
      }),
  });

  // Crear chunk
  const createMutation = useMutation({
    mutationFn: (data: CreateChunkRequest) => createChunk(data as Record<string, unknown>),
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
        chunkId: selectedChunk!.id,
        content: data.content,
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
    mutationFn: (id: number) => deleteChunk({ chunkId: id }),
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

  // Filtrar chunks según el filtro seleccionado
  const filteredChunks = useMemo(() => {
    if (filter === "all") return chunks;

    return chunks.filter((chunk: Chunk) => {
      const wordCount = chunk.content.split(/\s+/).length;

      switch (filter) {
        case "short":
          return wordCount < 100;
        case "medium":
          return wordCount >= 100 && wordCount <= 300;
        case "long":
          return wordCount > 300;
        default:
          return true;
      }
    });
  }, [chunks, filter]);

  // Contar chunks por categoría
  const chunkCounts = useMemo(() => {
    return {
      all: chunks.length,
      short: chunks.filter((c: Chunk) => c.content.split(/\s+/).length < 100).length,
      medium: chunks.filter((c: Chunk) => {
        const wc = c.content.split(/\s+/).length;
        return wc >= 100 && wc <= 300;
      }).length,
      long: chunks.filter((c: Chunk) => c.content.split(/\s+/).length > 300).length,
    };
  }, [chunks]);

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
        <CardContent className="space-y-4">
          {/* Filtros con Tabs */}
          <div className="w-full overflow-x-auto overflow-y-hidden pb-2">
            <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
              <TabsList className="inline-flex w-auto min-w-min">
                <TabsTrigger value="all">
                  Todos ({chunkCounts.all})
                </TabsTrigger>
                <TabsTrigger value="short">
                  Cortos ({chunkCounts.short})
                </TabsTrigger>
                <TabsTrigger value="medium">
                  Medianos ({chunkCounts.medium})
                </TabsTrigger>
                <TabsTrigger value="long">
                  Largos ({chunkCounts.long})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tabla de chunks */}
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ChunksTable
              chunks={filteredChunks}
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
