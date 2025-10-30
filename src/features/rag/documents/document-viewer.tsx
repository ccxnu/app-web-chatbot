import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Document } from "./types";

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onClose,
}) => {
  return (
    <Dialog open={!!document} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-8xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{document.title}</DialogTitle>
          <DialogDescription>
            Detalles completos del documento
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <div className="space-y-6">
            {/* Categoría */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                Categoría
              </h4>
              <Badge variant="outline">{document.category}</Badge>
            </div>

            <Separator />

            {/* Resumen */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                Resumen
              </h4>
              <p className="text-sm leading-relaxed">{document.summary}</p>
            </div>

            <Separator />

            {/* Fuente */}
            {document.source && (
              <>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    Fuente
                  </h4>
                  <a
                    href={document.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {document.source}
                  </a>
                </div>
                <Separator />
              </>
            )}

            {/* Contenido */}
            {document.content && (
              <>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    Contenido
                  </h4>
                  <div className="bg-muted p-3 rounded-md text-sm leading-relaxed whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
                    {document.content}
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-1">
                  Creado
                </h4>
                <p className="text-sm">
                  {format(new Date(document.createdAt), "PPP p", {
                    locale: es,
                  })}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-1">
                  Actualizado
                </h4>
                <p className="text-sm">
                  {format(new Date(document.updatedAt), "PPP p", {
                    locale: es,
                  })}
                </p>
              </div>
            </div>

            <Separator />

            {/* Estado */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                Estado
              </h4>
              <Badge variant={document.active ? "default" : "secondary"}>
                {document.active ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
