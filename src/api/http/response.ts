import type { IResponse } from "@/api/entities/response";

// Lanzar error si el código es distinto de COD_OK
export function validateApiResponse<T>(data: IResponse<T>): T
{
  if (data.code !== "COD_OK")
  {
    const error: any = new Error(data.info || "Error desconocido");
    error.code = data.code;
    error.info = data.info;
    error.idTransaction = data.idTransaction;
    throw error;
  }

  return data.result;
}

