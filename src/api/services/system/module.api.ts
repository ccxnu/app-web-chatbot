import type { IModule } from "@/api/entities/module";
import type { IResponse } from "@/api/entities/response";
import { axiosClient } from "@/api/http/client";
import { withBody } from "@/api/http/request";
import { validateApiResponse } from "@/api/http/response";

/**
 * Provides consistent query keys across the application
 */
export const moduleKeys = {
    all: ["modules"] as const,
    byId: (id: string) => ["modules", id] as const,
};

export const getModules = async (): Promise<IModule[]> => {
    const body = withBody({}, "GET_MODULES");
    const { data } = await axiosClient.post<IResponse<IModule[]>>("/module/get_modules", body);
    return validateApiResponse<IModule[]>(data);
};

export const addModule = async (mod: Omit<IModule, "id">) => {
    const body = withBody(mod, "ADD_MODULE");
    const { data } = await axiosClient.post<IResponse>("/module/add_module", body);
    return validateApiResponse(data);
}

export const updateModule = async (mod: IModule): Promise<IResponse> => {
    const body = withBody(mod, "UPD_MODULES");
    const { data } = await axiosClient.post<IResponse>(`/module/upd_module`, body);
    return validateApiResponse(data);
};

export const deleteModule = async (mod: Pick<IModule, "id">): Promise<IResponse> => {
    const body = withBody({ idModule: mod.id }, "DEL_MODULE");
    const { data } = await axiosClient.post<IResponse>(`/module/del_module`, body);
    return validateApiResponse(data);
};
