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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit2, Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { Document } from "./types";

interface DocumentsTableProps {
  documents: Document[];
  isLoading?: boolean;
  onEdit: (document: Document) => void;
  onDelete: (id: number) => Promise<void>;
  onView: (document: Document) => void;
}

export const DocumentsTable: React.FC<DocumentsTableProps> = ({
  documents,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
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

  if (documents.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No hay documentos. Crea uno para empezar.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">{document.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{document.category}</Badge>
              </TableCell>
              <TableCell className="max-w-md truncate text-sm text-muted-foreground">
                {document.description}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(document.createdAt), {
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
                      disabled={isLoading || deletingId === document.id}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(document)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(document)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(document.id)}
                      className="text-destructive"
                      disabled={deletingId === document.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deletingId === document.id ? "Eliminando..." : "Eliminar"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
