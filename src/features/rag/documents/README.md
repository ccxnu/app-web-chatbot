# RAG - Gestión de Documentos y Chunks

Sistema completo para gestionar documentos y fragmentos (chunks) en la base de conocimientos.

## 📁 Estructura

```
src/features/rag/documents/
├── types.ts              # Tipos TypeScript
├── utils.ts              # Funciones utilidades
├── index.tsx             # Componente principal (DocumentsManager)
├── document-dialog.tsx   # Diálogo crear/editar documento
├── document-viewer.tsx   # Vista de detalles documento
├── documents-table.tsx   # Tabla de documentos
├── chunk-dialog.tsx      # Diálogo crear/editar chunks
├── chunks-table.tsx      # Tabla de chunks
├── chunks-manager.tsx    # Gestor de chunks
└── README.md             # Este archivo
```

## 🎯 Componentes

### DocumentsManager
Componente principal que integra toda la funcionalidad de gestión.

```typescript
import { DocumentsManager } from "@/features/rag/documents";

export default function Page() {
  return <DocumentsManager />;
}
```

**Características:**
- Crear documentos
- Editar documentos existentes
- Eliminar documentos
- Ver detalles de documentos
- Gestionar chunks de cada documento

### DocumentDialog
Diálogo modal para crear/editar documentos.

**Props:**
- `open: boolean` - Control de apertura
- `onOpenChange: (open: boolean) => void` - Callback de estado
- `document?: Document` - Documento a editar (undefined = crear)
- `onSubmit: (data: CreateDocumentRequest) => Promise<void>` - Handler de submit
- `isLoading?: boolean` - Estado de carga

### ChunksManager
Gestor de fragmentos para un documento específico.

```typescript
<ChunksManager documentId={1} />
```

**Características:**
- Crear fragmentos
- Editar fragmentos
- Eliminar fragmentos
- Visualizar estadísticas

### DocumentsTable
Tabla con lista de documentos con acciones.

### ChunksTable
Tabla con lista de fragmentos con acciones.

## 🔄 Operaciones Principales

### Crear Documento

```typescript
import { createDocument } from "@/api/services";

const result = await createDocument({
  title: "Mi Documento",
  category: "general",
  description: "Descripción del documento",
  content: "Contenido opcional"
});
```

### Actualizar Documento

```typescript
import { updateDocument } from "@/api/services";

await updateDocument({
  id: 1,
  title: "Título actualizado",
  category: "legal",
  description: "Nueva descripción"
});
```

### Eliminar Documento

```typescript
import { deleteDocument } from "@/api/services";

await deleteDocument({ id: 1 });
```

### Crear Chunk

```typescript
import { createChunk } from "@/api/services";

await createChunk({
  documentId: 1,
  content: "Contenido del fragmento..."
});
```

### Obtener Chunks de Documento

```typescript
import { getChunksByDocument } from "@/api/services";

const chunks = await getChunksByDocument({
  documentId: 1
});
```

## 📊 Tipos

### Document
```typescript
interface Document {
  id: number;
  title: string;
  category: string;
  description: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}
```

### Chunk
```typescript
interface Chunk {
  id: number;
  documentId: number;
  content: string;
  embedding?: number[];
  createdAt: string;
  updatedAt: string;
}
```

## 🎨 Características UI

- **Validación de formularios** con Zod
- **React Query** para gestión de estado
- **Toasts** para notificaciones
- **Componentes Shadcn/ui**
- **Iconos Lucide**
- **Formateo de fechas** con date-fns

## 🛠️ Utilidades

### formatWordCount
Formatea el conteo de palabras

```typescript
formatWordCount("Hola mundo") // "2 palabras"
```

### truncateText
Trunca texto a longitud específica

```typescript
truncateText("Texto largo...", 20) // "Texto largo....."
```

### suggestCategories
Sugiere categorías basadas en el título

```typescript
suggestCategories("Política de privacidad") // ["legal"]
```

### calculateChunkStatistics
Calcula estadísticas de chunks

```typescript
const stats = calculateChunkStatistics([
  "Chunk 1 content",
  "Chunk 2 content"
]);
// { totalChunks: 2, totalWords: 4, ... }
```

## 📱 Flujo de Uso

1. **Ver Documentos**
   - Tab "Documentos" muestra lista de todos los documentos
   - Acciones: Ver, Editar, Eliminar

2. **Crear Documento**
   - Botón "Nuevo Documento"
   - Llena formulario con validación
   - Se crea y se invalida caché

3. **Ver Chunks**
   - Selecciona un documento
   - Tab "Fragmentos" muestra chunks del documento
   - Acciones: Copiar, Editar, Eliminar

4. **Crear Chunk**
   - Botón "Nuevo Fragmento"
   - Ingresa contenido (mínimo 10 caracteres)
   - Se indexa automáticamente

## 🔐 Validaciones

### Documento
- Título: 3+ caracteres
- Categoría: requerida
- Descripción: 10+ caracteres
- Contenido: opcional

### Chunk
- Contenido: 10+ caracteres
- Recomendación: 100-500 palabras

## 📡 Integración con API

Usa servicios del módulo RAG:

```typescript
import {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  getChunksByDocument,
  createChunk,
  updateChunkContent,
  deleteChunk,
  documentsKeys,
  chunksKeys
} from "@/api/services";
```

## 🚀 Próximas Mejoras

- [ ] Búsqueda de documentos
- [ ] Filtrado por categoría
- [ ] Paginación
- [ ] Importar documentos desde archivo
- [ ] Exportar documentos
- [ ] Estadísticas de chunks
- [ ] Vista de similitud de chunks

---

**Última actualización:** 2024-10-22
