import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Document, CreateDocumentRequest } from "./types";

const documentSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  category: z.string().min(1, "La categoría es requerida"),
  summary: z.string().min(10, "El resumen debe tener al menos 10 caracteres"),
  source: z.string().optional(),
  content: z.string().optional(),
});

type DocumentFormData = z.infer<typeof documentSchema>;

interface DocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document?: Document;
  onSubmit: (data: CreateDocumentRequest) => Promise<void>;
  isLoading?: boolean;
}

export const DocumentDialog: React.FC<DocumentDialogProps> = ({
  open,
  onOpenChange,
  document,
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: "",
      category: "",
      summary: "",
      source: "",
      content: "",
    },
  });

  useEffect(() => {
    if (document) {
      form.reset({
        title: document.title,
        category: document.category,
        summary: document.summary,
        source: document.source || "",
        content: document.content || "",
      });
    } else {
      form.reset({
        title: "",
        category: "",
        summary: "",
        source: "",
        content: "",
      });
    }
  }, [document, open, form]);

  const handleSubmit = async (data: DocumentFormData) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting document:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {document ? "Editar Documento" : "Crear Nuevo Documento"}
          </DialogTitle>
          <DialogDescription>
            {document
              ? "Actualiza los detalles del documento"
              : "Crea un nuevo documento en la base de conocimientos"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa el título del documento"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: legal, técnico, faq"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    La categoría ayuda a organizar y filtrar documentos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Resumen breve del documento"
                      {...field}
                      disabled={isLoading}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuente (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="URL o referencia de la fuente"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenido (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Contenido del documento"
                      {...field}
                      disabled={isLoading}
                      rows={6}
                    />
                  </FormControl>
                  <FormDescription>
                    El contenido puede ser añadido más adelante en fragmentos (chunks)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {document ? "Actualizar" : "Crear"} Documento
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
