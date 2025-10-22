import { Navigate } from '@tanstack/react-router'
import { useAuth } from '@/context/auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: string[]
}

export function ProtectedRoute({ children, requiredPermissions }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-muted-foreground'>Cargando...</div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to='/iniciar-sesion' />
  }

  // Check permissions if specified
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.every((permission) =>
      user?.permissions.includes(permission)
    )

    if (!hasPermission) {
      return (
        <div className='flex h-screen items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Acceso Denegado</h1>
            <p className='text-muted-foreground'>
              No tienes permisos para acceder a esta página
            </p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}
