import type { IResponse } from "@/api/entities/response";

// Lanzar error si el código es distinto de COD_OK
export function validateApiResponse<T>(data: IResponse<T>): T
{
  if (!data.success)
  {
    const error: any = new Error(data.info || "Error desconocido");
    error.code = data.code;
    error.info = data.info;
    throw error;
  }

  return data.data;
}

