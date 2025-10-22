import { createFileRoute } from '@tanstack/react-router'
import WhatsAppConnection from '@/features/whatsapp/whatsapp-connection'

export const Route = createFileRoute('/_authenticated/whatsapp/')({
  component: WhatsAppConnection,
})
