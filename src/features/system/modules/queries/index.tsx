import { addModule, deleteModule, getModules, moduleKeys, updateModule } from "@/api/services/system/module.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useModules = () => {
    return useQuery({
        queryKey: moduleKeys.all,
        queryFn: () => getModules(),
    });
};

export function useDeleteModule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteModule,
        onSuccess: () => {
            toast.success("Módulo eliminado correctamente");
            // Invalida la cache para refrescar la lista
            queryClient.invalidateQueries({ queryKey: moduleKeys.all });
        },
        onError: (err: any) => {
            toast.error(err?.info || "Error eliminando el módulo");
        },
    });
}

export function useAddModule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addModule,
        onSuccess: () => {
            toast.success("Módulo agregado correctamente");
            queryClient.invalidateQueries({ queryKey: moduleKeys.all });
        },
        onError: (err: any) => {
            toast.error(err?.info || "Error agregando el módulo");
        },
    });
}

export function useUpdateModule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateModule,
        onSuccess: () => {
            toast.success("Módulo actualizado correctamente");
            queryClient.invalidateQueries({ queryKey: moduleKeys.all });
        },
        onError: (err: any) => {
            toast.error(err?.info || "Error actualizando el módulo");
        },
    });
}
