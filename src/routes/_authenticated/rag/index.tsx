import { createFileRoute } from '@tanstack/react-router'
import { DocumentsManager } from '@/features/rag/documents'

export const Route = createFileRoute('/_authenticated/rag/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto py-6 px-4">
      <DocumentsManager />
    </div>
  )
}
