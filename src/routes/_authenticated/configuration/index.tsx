import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/configuration/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/configuration/"!</div>
}
