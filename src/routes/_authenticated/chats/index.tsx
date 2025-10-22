import Chats from '@/features/chats'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/chats/')({
  component: Chats,
})
