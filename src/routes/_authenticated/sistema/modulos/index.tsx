import Modules from '@/features/system/modules'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/sistema/modulos/')({
  component: Modules,
})
