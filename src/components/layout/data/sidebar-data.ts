import {
  IconBrandWhatsapp,
  IconBrowserCheck,
  IconChartBar,
  IconFileText,
  IconLayoutDashboard,
  IconMessages,
  IconPalette,
  IconSettings,
  IconTool,
  IconUsers,
} from '@tabler/icons-react'
import { type SidebarData } from '../types'
import { GraduationCap } from 'lucide-react'

export const sidebarData: SidebarData = {
  user: {
    name: '',
    email: '',
    avatar: '',
  },
  teams: [
	{
	  name: 'Chatbot Institucional',
	  logo: GraduationCap,
	  plan: 'ISTS',
	}
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Panel de Control',
          url: '/panel-de-control',
          icon: IconLayoutDashboard,
        },
        {
          title: 'WhatsApp',
          url: '/whatsapp',
          icon: IconBrandWhatsapp,
        },
        {
          title: 'Chats',
          url: '/chats',
          icon: IconMessages,
        },
        {
          title: 'Usuarios',
          url: '/usuarios',
          icon: IconUsers,
        },
        {
          title: 'Estadísticas',
          url: '/estadisticas',
          icon: IconChartBar,
        },
      ],
    },
    {
      title: 'RAG',
      items: [
        {
          title: 'Documentos',
          url: '/rag',
          icon: IconFileText,
        },
      ],
    },
    {
      title: 'Configuración',
      items: [
        {
          title: 'Configuración',
          url: '/configuration',
          icon: IconSettings,
        },
      ],
    },
    {
      title: 'Sistema',
      items: [
        {
          title: 'Permisos',
          url: '/sistema/permisos',
          icon: IconTool,
        },
        {
          title: 'Funcionalidades',
          url: '/sistema/funcionalidades',
          icon: IconPalette,
        },
        {
          title: 'Parametros',
          url: '/sistema/parametros',
          icon: IconBrowserCheck,
        },
      ],
    },
  ],
}
