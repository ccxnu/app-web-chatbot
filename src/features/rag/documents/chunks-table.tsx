import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit2, Trash2, Copy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import type { Chunk } from "./types";

interface ChunksTableProps {
  chunks: Chunk[];
  isLoading?: boolean;
  onEdit: (chunk: Chunk) => void;
  onDelete: (id: number) => Promise<void>;
}

export const ChunksTable: React.FC<ChunksTableProps> = ({
  chunks,
  isLoading = false,
  onEdit,
  onDelete,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Contenido copiado al portapapeles");
    } catch {
      toast.error("Error al copiar contenido");
    }
  };

  if (!chunks || chunks.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No hay fragmentos para este documento.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">ID</TableHead>
            <TableHead>Contenido</TableHead>
            <TableHead className="w-24">Palabras</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead className="text-right w-20">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chunks.map((chunk) => {
            const wordCount = chunk.content.split(/\s+/).length;
            return (
              <TableRow key={chunk.id}>
                <TableCell className="font-mono text-sm">#{chunk.id}</TableCell>
                <TableCell>
                  <div className="max-w-2xl text-sm line-clamp-3">
                    {chunk.content}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {wordCount}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(chunk.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isLoading || deletingId === chunk.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleCopyContent(chunk.content)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(chunk)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(chunk.id)}
                        className="text-destructive"
                        disabled={deletingId === chunk.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingId === chunk.id ? "Eliminando..." : "Eliminar"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
