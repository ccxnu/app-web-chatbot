import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/usuarios/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/usuarios/"!</div>
}
