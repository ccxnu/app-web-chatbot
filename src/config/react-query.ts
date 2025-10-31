import { QueryClient, QueryCache } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { router } from '@/config/router'
import { AxiosError } from 'axios'

export const queryClient = new QueryClient({
    defaultOptions:
    {
        queries:
        {
            retry: (failureCount, error: any) =>
            {

                if (import.meta.env.DEV) console.log({ failureCount, error })
                if (failureCount >= 0 && import.meta.env.DEV) return false
                if (failureCount > 3 && import.meta.env.PROD) return false

                // Para errores 401 y 403, NO reintenta
                if (
                    error instanceof AxiosError &&
                    [401, 403].includes(error.response?.status ?? 0)
                ) return false;

                if (error?.code && String(error.code).startsWith("ERR_")) return false;
                return true;
            },
            refetchOnWindowFocus: import.meta.env.PROD,
            staleTime: 10 * 1000,
        },
        mutations:
        {
            onError: (error: any) =>
            {
                if (error?.info)
                {
                  toast.error(error.info);
                }
                else if (error instanceof AxiosError && error.response?.status === 304)
                {
                  toast.error('Contenido no modificado');
                }
                else
                {
                  toast.error(error?.message || "Ocurrió un error.");
                }
            },
        },
    },
    queryCache: new QueryCache({
        onError: (error: any) =>
        {
            if (error?.info)
            {
                toast.error(error.info);
            }
            else if (error instanceof AxiosError)
            {
                if (error.response?.status === 401)
                {
                  toast.error('Session expired!')
                  useAuthStore.getState().auth.reset()
                  const redirect = `${router.history.location.href}`
                  router.navigate({ to: '/iniciar-sesion', search: { redirect } })
                }

                if (error.response?.status === 500)
                {
                  toast.error('Error del servidor')
                  router.navigate({ to: '/500' })
                }

                if (error.response?.status === 403)
                {
                    router.navigate({ to: '/', replace: true });
                }
           }
           else
           {
               toast.error(error?.message || "Ocurrió un error.");
           }
        },
    }),
})
