import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/sistema/usuarios')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/sistema/usuarios"!</div>
}
