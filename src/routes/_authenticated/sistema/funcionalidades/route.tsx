import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/sistema/funcionalidades')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/_authenticated/sistema/funcionalidades"!</div>
}
