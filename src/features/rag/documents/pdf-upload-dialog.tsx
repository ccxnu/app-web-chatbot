import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, FileText, X } from "lucide-react";
import { getDocumentCategories, categoriesKeys } from "@/api/services";
import type { UploadPDFDocumentRequest } from "./types";
import { Progress } from "@/components/ui/progress";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const pdfUploadSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  category: z.string().min(1, "La categoría es requerida"),
  source: z.string().optional(),
  chunkSize: z.number().min(100).max(5000).optional(),
  chunkOverlap: z.number().min(0).max(500).optional(),
});

type PDFUploadFormData = z.infer<typeof pdfUploadSchema>;

interface PDFUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UploadPDFDocumentRequest) => Promise<void>;
  isLoading?: boolean;
}

export const PDFUploadDialog: React.FC<PDFUploadDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: categoriesKeys.all,
    queryFn: getDocumentCategories,
  });

  const form = useForm<PDFUploadFormData>({
    resolver: zodResolver(pdfUploadSchema),
    defaultValues: {
      title: "",
      category: "",
      source: "",
      chunkSize: 1000,
      chunkOverlap: 200,
    },
  });

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      form.reset();
      setSelectedFile(null);
      setFileBase64("");
      setUploadProgress(0);
    }
  }, [open, form]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data:application/pdf;base64, prefix
        const base64 = reader.result?.toString().split(",")[1] || "";
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };
    });
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      form.setError("title", {
        message: "Solo se aceptan archivos PDF",
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      form.setError("title", {
        message: "El archivo no debe superar los 10MB",
      });
      return;
    }

    setSelectedFile(file);

    // Auto-fill title from filename if empty
    if (!form.getValues("title")) {
      const fileName = file.name.replace(".pdf", "").replace(/_/g, " ");
      form.setValue("title", fileName);
    }

    try {
      setUploadProgress(0);
      const base64 = await convertFileToBase64(file);
      setFileBase64(base64);
    } catch (error) {
      console.error("Error converting file to base64:", error);
      form.setError("title", {
        message: "Error al procesar el archivo PDF",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = async (data: PDFUploadFormData) => {
    if (!fileBase64) {
      form.setError("title", {
        message: "Debes seleccionar un archivo PDF",
      });
      return;
    }

    try {
      await onSubmit({
        ...data,
        fileBase64,
      });
      onOpenChange(false);
      form.reset();
      setSelectedFile(null);
      setFileBase64("");
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subir Documento PDF</DialogTitle>
          <DialogDescription>
            Sube un archivo PDF para extraer el texto y crear fragmentos automáticamente
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {selectedFile ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedFile(null);
                        setFileBase64("");
                        setUploadProgress(0);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <Progress value={uploadProgress} className="h-2" />
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">Arrastra tu archivo PDF aquí</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      o haz clic para seleccionar (máx. 10MB)
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del Documento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Introducción a Machine Learning" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={categoriesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesLoading ? (
                        <SelectItem value="" disabled>
                          Cargando categorías...
                        </SelectItem>
                      ) : categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem key={category.code} value={category.code}>
                            {category.description}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          No hay categorías disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Source Field */}
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuente (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="URL o referencia del documento" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL o referencia donde se obtuvo el documento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Advanced Settings */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="chunkSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamaño de Fragmento</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={100}
                        max={5000}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Caracteres por fragmento (100-5000)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chunkOverlap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Superposición</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={500}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Caracteres de superposición (0-500)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || !fileBase64}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Subir y Procesar
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
