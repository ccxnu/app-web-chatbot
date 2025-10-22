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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Chunk, CreateChunkRequest } from "./types";

const chunkSchema = z.object({
  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
});

type ChunkFormData = z.infer<typeof chunkSchema>;

interface ChunkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chunk?: Chunk;
  onSubmit: (data: CreateChunkRequest) => Promise<void>;
  isLoading?: boolean;
}

export const ChunkDialog: React.FC<ChunkDialogProps> = ({
  open,
  onOpenChange,
  chunk,
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<ChunkFormData>({
    resolver: zodResolver(chunkSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    if (chunk) {
      form.reset({
        content: chunk.content,
      });
    } else {
      form.reset({
        content: "",
      });
    }
  }, [chunk, open, form]);

  const handleSubmit = async (data: ChunkFormData) => {
    try {
      await onSubmit({
        ...data,
        documentId: chunk?.documentId || 0,
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting chunk:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {chunk ? "Editar Fragmento" : "Crear Nuevo Fragmento"}
          </DialogTitle>
          <DialogDescription>
            {chunk
              ? "Actualiza el contenido del fragmento"
              : "Crea un nuevo fragmento (chunk) que será indexado automáticamente"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenido del Fragmento</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingresa el contenido que será indexado para búsqueda semántica"
                      {...field}
                      disabled={isLoading}
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    El contenido será automáticamente convertido a embeddings para búsqueda semántica.
                    Recomendación: 100-500 palabras por fragmento.
                  </FormDescription>
                  <div className="text-xs text-muted-foreground mt-2">
                    Palabras: {field.value?.split(/\s+/).length || 0}
                  </div>
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
                {chunk ? "Actualizar" : "Crear"} Fragmento
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
