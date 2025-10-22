import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { ProtectedRoute } from '@/components/protected-route'

function AuthenticatedRouteComponent() {
  return (
    <ProtectedRoute>
      <AuthenticatedLayout />
    </ProtectedRoute>
  )
}

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedRouteComponent,
})
