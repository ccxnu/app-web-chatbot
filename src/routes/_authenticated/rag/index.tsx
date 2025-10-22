import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/rag/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/rag/"!</div>
}
