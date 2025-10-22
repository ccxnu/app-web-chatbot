import { createFileRoute } from '@tanstack/react-router'
import ForgotPassword from '@/features/auth/forgot-password'

export const Route = createFileRoute('/(auth)/olvide-mi-contrasena')({
  component: ForgotPassword,
})
