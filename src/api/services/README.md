# API Services 🚀

Módulo centralizado de servicios API para la aplicación web del chatbot ISTS.

## 📋 Contenido

- **admin/** - Servicios administrativos (WhatsApp)
- **rag/** - Servicios de RAG (Chunks, Estadísticas, Documentos)
- **system/** - Servicios del sistema (Parámetros, Módulos)
- **constant-routes.ts** - Definición de rutas (endpoints)
- **index.ts** - Índice central de exportación
- **EXAMPLES.ts** - Ejemplos de uso
- **VERIFICATION.ts** - Verificación de tipos

## 🎯 Inicio Rápido

### Instalación
Ya está instalado. Solo importa lo que necesites:

```typescript
import { createDocument, hybridSearchChunks } from "@/api/services";
```

### Uso Básico

```typescript
// Crear documento
const result = await createDocument({
  title: "Mi Documento",
  category: "general",
  content: "Contenido..."
});

// Búsqueda híbrida
const results = await hybridSearchChunks({
  query: "¿Cómo usar el sistema?",
  topK: 5
});
```

## 📚 Documentación

Para documentación completa, ver:
- `../API_SERVICES.md` - Documentación detallada
- `../SERVICES_SUMMARY.md` - Resumen y estadísticas
- `EXAMPLES.ts` - Ejemplos prácticos con React Query

## 🏗️ Arquitectura

Cada servicio sigue el patrón:

```typescript
// 1. Query Keys (para React Query)
export const myKeys = {
  all: ["namespace"],
  byId: (id) => ["namespace", id],
  // ...
};

// 2. API Functions
export const myFunction = async (data: Record<string, unknown>) => {
  const body = withBody(data, "OPERATION_NAME");
  const { data: response } = await axiosClient.post<IResponse>(
    MY_ENDPOINT,
    body
  );
  return validateApiResponse(response);
};
```

## 🔑 Query Keys

Usa los query keys para React Query:

```typescript
import { 
  documentsKeys,
  chunksKeys,
  parametersKeys
} from "@/api/services";

// En un hook
useQuery({
  queryKey: documentsKeys.all,
  queryFn: () => getAllDocuments(...)
});
```

## 🌐 Rutas Disponibles

### Admin
- `/admin/whatsapp/conversation-history`
- `/admin/whatsapp/qr-code`
- `/admin/whatsapp/status`
- `/admin/whatsapp/update-status`

### RAG - Chunks
- `/api/v1/chunks/bulk-create`
- `/api/v1/chunks/create`
- `/api/v1/chunks/delete`
- `/api/v1/chunks/get-by-document`
- `/api/v1/chunks/get-by-id`
- `/api/v1/chunks/hybrid-search`
- `/api/v1/chunks/similarity-search`
- `/api/v1/chunks/update-content`

### RAG - Chunk Statistics
- `/api/v1/chunk-statistics/get-by-chunk`
- `/api/v1/chunk-statistics/get-top-by-usage`
- `/api/v1/chunk-statistics/increment-usage`
- `/api/v1/chunk-statistics/update-quality-metrics`
- `/api/v1/chunk-statistics/update-staleness`

### RAG - Documents
- `/api/v1/documents/create`
- `/api/v1/documents/delete`
- `/api/v1/documents/get-all`
- `/api/v1/documents/get-by-category`
- `/api/v1/documents/get-by-id`
- `/api/v1/documents/search-by-title`
- `/api/v1/documents/update`

### System - Parameters
- `/api/v1/parameters/add`
- `/api/v1/parameters/delete`
- `/api/v1/parameters/get-all`
- `/api/v1/parameters/get-by-code`
- `/api/v1/parameters/reload-cache`
- `/api/v1/parameters/update`

## 💡 Tips

1. **Validación automática** - `validateApiResponse()` maneja errores
2. **Request body automático** - `withBody()` añade metadata automáticamente
3. **Tipos tipados** - Todo tiene tipos TypeScript
4. **Query Keys tipadas** - Usa los keys predefinidos
5. **Logging disponible** - Todos los ejemplos tienen console.log

## 🚀 Próximos Pasos

1. Ver `EXAMPLES.ts` para más ejemplos
2. Usar en componentes React
3. Integrar con React Query
4. Configurar invalidación de caché

## 📞 Troubleshooting

### Error: "No module found"
Verifica que los servicios están correctamente importados:
```bash
# Esto debe compilar sin errores
npx tsc src/api/services/VERIFICATION.ts --noEmit
```

### Error: "Unknown endpoint"
Verifica que usas la ruta correcta de `constant-routes.ts`

### Error: "Response validation failed"
Verifica el formato de la respuesta del servidor

---

**Ultima actualización**: 2024-10-22  
**React Compiler**: ✅ Enabled  
**TypeScript**: ✅ Strict mode
