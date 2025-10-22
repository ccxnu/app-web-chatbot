import type { IBase } from "@/api/entities/solicitud";
import { STORAGE_KEYS } from "./types";

export function withBody<T extends object>(
    data: T,
    process: string
): T & IBase {
    return {
        ...data,
        ...buildSolicitud(process),
    };
}

function buildSolicitud(process: string): IBase {
    return {
        idSession: localStorage.getItem(STORAGE_KEYS.ID_SESSION) || "pruebaSession",
        idRequest: crypto.randomUUID?.(),
        dateProcess: new Date().toISOString(), // RFC 3339 completo con timezone
        process,
        idDevice: localStorage.getItem(STORAGE_KEYS.ID_DEVICE) || "unknown",
        deviceAddress: localStorage.getItem(STORAGE_KEYS.DEVICE_ADDRESS) || "0.0.0.0",
    };
}