import type { ISolicitud } from "@/api/entities/solicitud";

export function withBody<T extends object>(
  data: T,
  process: string
): T & ISolicitud {
  return {
    ...data,
    ...buildSolicitud(process),
  };
}

function buildSolicitud(process: string): ISolicitud
{
  return {
    idSession: localStorage.getItem("idSession") || "pruebaSession",
    idRequest: crypto.randomUUID?.(),
    process,
    dateProcess: new Date().toISOString().slice(0, 19),
    ipDevice: navigator.userAgent || "unknown",
    ipPublic: "10.10.01.00",
    sender: "WEB",
    idLogin: localStorage.getItem("idLogin") || "1",
  };
}
