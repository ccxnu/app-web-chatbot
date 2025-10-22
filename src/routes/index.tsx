import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'

function LandingPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted'>
      <div className='container mx-auto px-4 text-center'>
        <div className='mx-auto max-w-3xl'>
          <h1 className='mb-6 text-5xl font-bold tracking-tight sm:text-6xl'>
            Chatbot Institucional
          </h1>
          <p className='text-muted-foreground mb-8 text-lg sm:text-xl'>
            Sistema de gestión de chatbot con inteligencia artificial para tu institución
          </p>

          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            {isAuthenticated ? (
              <Button asChild size='lg'>
                <Link to='/panel-de-control'>
                  Ir al Panel de Control
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size='lg'>
                  <Link to='/iniciar-sesion'>
                    Iniciar Sesión
                  </Link>
                </Button>
                <Button asChild variant='outline' size='lg'>
                  <Link to='/iniciar-sesion'>
                    Más Información
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: LandingPage,
})
