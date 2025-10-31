import ViteLogo from '@/assets/react.svg'
import { UserAuthForm } from './components/user-auth-form'
import { useAuth } from '@/context/auth-context'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { GraduationCap } from 'lucide-react'

export default function SignIn() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/panel-de-control' })
    }
  }, [isAuthenticated, navigate]) // Dependencias: solo se ejecuta si isAuthenticated o navigate cambian

  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-zinc-300' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
		<GraduationCap className='w-6 h-6 text-secondary' />
          Chatbot Institutional
        </div>

		<h1 className='mb-6 text-6xl relative m-auto font-extrabold tracking-tight sm:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600'>
		  Automatiza tu Atención Estudiantil
		</h1>
	</div>

      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-left'>
            <h1 className='text-2xl font-semibold tracking-tight'>Iniciar Sesión</h1>
            <p className='text-muted-foreground text-sm'>
              Ingresa tus credenciales para acceder al panel de control
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  )
}
