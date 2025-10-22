import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/config/router'
import { queryClient } from '@/config/react-query'
import { ThemeProvider } from '@/context/theme-context'
import UID from '@/utils/uid'
import { STORAGE_KEYS } from '@/api/http/types'
import './index.css'

async function initializeApp() {
  try {
    const uid = new UID()
    const completeID = await uid.completeID()
    localStorage.setItem(STORAGE_KEYS.ID_DEVICE, completeID)
  } catch (error) {
    console.warn('Error inicializando ID del dispositivo:', error)
    localStorage.setItem(STORAGE_KEYS.ID_DEVICE, navigator.userAgent || 'unknown')
  }
}

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML)
{
  initializeApp().then(() => {
    const root = ReactDOM.createRoot(rootElement)

    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
              <RouterProvider router={router} />
          </ThemeProvider>
        </QueryClientProvider>
      </StrictMode>
    )
  })
}
