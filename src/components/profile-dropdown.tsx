import { Link, useNavigate } from '@tanstack/react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/context/auth-context'
import { useAdminLogout } from '@/api/services'
import { BadgeCheck, LogOut, Settings } from 'lucide-react'

export function ProfileDropdown() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const logoutMutation = useAdminLogout()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      navigate({ to: '/iniciar-sesion' })
    } catch (error) {
      // Error already handled by mutation
      navigate({ to: '/iniciar-sesion' })
    }
  }

  if (!user) return null

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
			<AvatarFallback className='rounded-lg'>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
			<span className='truncate font-semibold'>{user.name}</span>
			<span className='truncate text-xs'>{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
			{/*        <DropdownMenuItem asChild> */}
			{/* <Link to='/configuration'> */}
			{/*   <Settings /> */}
			{/*   Configuración */}
			{/* </Link> */}
			{/*  </DropdownMenuItem> */}
		  <DropdownMenuItem asChild>
			<Link to='/configuration'>
			  <BadgeCheck />
			  Mi Perfil
			</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
		<DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
		  <LogOut />
		  {logoutMutation.isPending ? 'Cerrando sesión...' : 'Cerrar Sesión'}
		</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
