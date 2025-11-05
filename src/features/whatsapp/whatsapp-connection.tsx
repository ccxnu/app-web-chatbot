import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QRCodeSVG } from 'qrcode.react'
import {
  getWhatsAppQRCode,
  getWhatsAppStatus,
  logoutWhatsApp,
  reconnectWhatsApp,
  whatsappKeys,
} from '@/api/services/admin/whatsapp.api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IconQrcode, IconRefresh, IconPlugConnected, IconPlugConnectedX, IconEdit, IconLogout } from '@tabler/icons-react'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { TopNav } from '@/components/layout/top-nav'
import { Search } from '@/components/search'

interface WhatsAppStatusResponse {
  connected: boolean
  session?: string
  phone?: string
}

interface QRCodeResponse {
  qrCode: string
  expiresIn?: number
}

export default function WhatsAppConnection() {
  const queryClient = useQueryClient()
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)
  const [sessionName, setSessionName] = useState(() => {
    return localStorage.getItem('whatsapp-session-name') || 'whatsapp-bot-session'
  })
  const [isEditingSession, setIsEditingSession] = useState(false)
  const [tempSessionName, setTempSessionName] = useState(sessionName)
  const [sessionNotFound, setSessionNotFound] = useState(false)

  // Query para obtener el estado de la conexión
  const {
    data: status,
    isLoading: isLoadingStatus,
    refetch: refetchStatus,
    error: statusError,
  } = useQuery<WhatsAppStatusResponse>({
    queryKey: whatsappKeys.status(),
    queryFn: async () => {
      try {
        const result = await getWhatsAppStatus({ sessionName })
        setSessionNotFound(false)
        return result
      } catch (error: any) {
        if (error?.code === 'ERR_WHATSAPP_SESSION_NOT_FOUND') {
          setSessionNotFound(true)
          throw error
        }
        throw error
      }
    },
    refetchInterval: sessionNotFound ? false : 5000, // Stop polling if session not found
    retry: (failureCount, error: any) => {
      // Don't retry if session not found
      if (error?.code === 'ERR_WHATSAPP_SESSION_NOT_FOUND') {
        return false
      }
      return failureCount < 3
    },
  })

  // Mutation para logout (disconnect + clear QR + logout)
  const logoutMutation = useMutation({
    mutationFn: () => logoutWhatsApp({ sessionName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: whatsappKeys.status() })
      setQrCodeImage(null)
      toast.success('Sesión cerrada. Usa Reconectar para generar un nuevo QR.')
    },
    onError: (error: any) => {
      toast.error(error?.info || error?.message || 'Error al cerrar sesión')
    },
  })

  // Mutation para reconnect (clears QR, disconnects, and reconnects)
  const reconnectMutation = useMutation({
    mutationFn: () => reconnectWhatsApp({ sessionName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: whatsappKeys.status() })
      setQrCodeImage(null)
      toast.success('Reconectando... El nuevo QR se generará automáticamente.')
      // Auto-generate QR after reconnect with longer wait for backend to reconnect
      setTimeout(() => generateQRCode(), 3000)
    },
    onError: (error: any) => {
      toast.error(error?.info || error?.message || 'Error al reconectar')
    },
  })

  // Función para generar QR code
  const generateQRCode = async () => {
    setIsGeneratingQR(true)
    try {
      const response = await getWhatsAppQRCode({
        sessionName,
      })

      console.log('QR Code Response:', response)

      const qrData = response as unknown as QRCodeResponse

      if (qrData.qrCode) {
        // The backend returns plain text QR code data, not an image
        // We'll render it using QRCodeSVG component
        console.log('QR Code text received, length:', qrData.qrCode.length)
        setQrCodeImage(qrData.qrCode)
        toast.success('Código QR generado')
      } else {
        console.error('No QR code in response:', qrData)
        toast.error('No se recibió el código QR del servidor')
      }
    } catch (error: any) {
      console.error('QR Code Error:', error)
      toast.error(error?.info || error?.message || 'Error al generar código QR')
    } finally {
      setIsGeneratingQR(false)
    }
  }

  // Auto-generar QR si no está conectado
  useEffect(() => {
    if (status && !status.connected && !qrCodeImage) {
      generateQRCode()
    }
  }, [status])

  // Auto-refresh QR code every 5 seconds when not connected
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (status && !status.connected && qrCodeImage) {
      console.log('Starting QR auto-refresh interval')
      intervalId = setInterval(() => {
        console.log('Auto-refreshing QR code')
        generateQRCode()
      }, 5000) // Refresh every 5 seconds
    }

    return () => {
      if (intervalId) {
        console.log('Clearing QR auto-refresh interval')
        clearInterval(intervalId)
      }
    }
  }, [status?.connected, qrCodeImage])

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const handleReconnect = () => {
    reconnectMutation.mutate()
  }

  const handleSaveSessionName = () => {
    if (!tempSessionName.trim()) {
      toast.error('El nombre de sesión no puede estar vacío')
      return
    }
    setSessionName(tempSessionName.trim())
    localStorage.setItem('whatsapp-session-name', tempSessionName.trim())
    setIsEditingSession(false)
    setQrCodeImage(null) // Clear QR code to generate a new one with new session
    setSessionNotFound(false) // Reset session not found flag
    toast.success('Nombre de sesión actualizado')
    // Refetch status with new session name
    refetchStatus()
  }

  const handleCancelEdit = () => {
    setTempSessionName(sessionName)
    setIsEditingSession(false)
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={[]} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

    <div className='container mx-auto max-w-4xl py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Conexión WhatsApp</h1>
        <p className='text-muted-foreground mt-2'>
          Gestiona la conexión del bot con WhatsApp
        </p>
      </div>

      {/* Configuración de Sesión */}
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Configuración de Sesión</CardTitle>
          <CardDescription>
            Nombre de la sesión de WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {isEditingSession ? (
              <div className='space-y-3'>
                <div className='space-y-2'>
                  <Label htmlFor='session-name'>Nombre de Sesión</Label>
                  <Input
                    id='session-name'
                    value={tempSessionName}
                    onChange={(e) => setTempSessionName(e.target.value)}
                    placeholder='whatsapp-bot-session'
                    className='font-mono text-sm'
                  />
                </div>
                <div className='flex gap-2'>
                  <Button
                    onClick={handleSaveSessionName}
                    size='sm'
                    className='flex-1'
                  >
                    Guardar
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant='outline'
                    size='sm'
                    className='flex-1'
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium'>Sesión Actual</p>
                  <p className='text-muted-foreground font-mono text-xs'>
                    {sessionName}
                  </p>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsEditingSession(true)}
                >
                  <IconEdit className='h-4 w-4' />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Estado de Conexión */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              {status?.connected ? (
                <IconPlugConnected className='h-5 w-5 text-green-500' />
              ) : (
                <IconPlugConnectedX className='h-5 w-5 text-yellow-500' />
              )}
              Estado de Conexión
            </CardTitle>
            <CardDescription>
              Estado actual de la sesión de WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {isLoadingStatus ? (
              <div className='flex items-center justify-center py-8'>
                <div className='text-muted-foreground'>Cargando...</div>
              </div>
            ) : (
              <>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Estado:</span>
                  <Badge variant={status?.connected ? 'default' : 'secondary'}>
                    {status?.connected ? 'Conectado' : 'Desconectado'}
                  </Badge>
                </div>

                {status?.phone && (
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>Teléfono:</span>
                    <span className='text-sm'>{status.phone}</span>
                  </div>
                )}

                {status?.session && (
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>Sesión:</span>
                    <span className='text-muted-foreground text-xs font-mono'>
                      {status.session.slice(0, 8)}...
                    </span>
                  </div>
                )}

                <div className='space-y-2 pt-4'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => refetchStatus()}
                    className='w-full'
                  >
                    <IconRefresh className='mr-2 h-4 w-4' />
                    Actualizar Estado
                  </Button>

                  {status?.connected && (
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className='w-full'
                    >
                      <IconLogout className='mr-2 h-4 w-4' />
                      {logoutMutation.isPending ? 'Cerrando...' : 'Cerrar Sesión'}
                    </Button>
                  )}

                  {!status?.connected && (
                    <Button
                      variant='default'
                      size='sm'
                      onClick={handleReconnect}
                      disabled={reconnectMutation.isPending}
                      className='w-full'
                    >
                      <IconRefresh className='mr-2 h-4 w-4' />
                      {reconnectMutation.isPending ? 'Reconectando...' : 'Reconectar'}
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconQrcode className='h-5 w-5' />
              Código QR
            </CardTitle>
            <CardDescription>
              Escanea este código con WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status?.connected ? (
              <div className='flex flex-col items-center justify-center py-8'>
                <IconPlugConnected className='mb-4 h-16 w-16 text-green-500' />
                <p className='text-center text-sm text-green-600'>
                  WhatsApp conectado exitosamente
                </p>
              </div>
            ) : qrCodeImage ? (
              <div className='space-y-4'>
                <div className='flex items-center justify-center rounded-lg border bg-white p-8'>
                  <QRCodeSVG
                    value={qrCodeImage}
                    size={256}
                    level="M"
                    includeMargin={true}
                  />
                </div>
                <div className='text-center'>
                  <p className='text-muted-foreground text-xs'>
                    1. Abre WhatsApp en tu teléfono
                    <br />
                    2. Ve a Configuración {'>'} Dispositivos vinculados
                    <br />
                    3. Toca "Vincular un dispositivo"
                    <br />
                    4. Escanea este código
                  </p>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={generateQRCode}
                  disabled={isGeneratingQR}
                  className='w-full'
                >
                  <IconRefresh className='mr-2 h-4 w-4' />
                  Generar Nuevo Código
                </Button>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-8'>
                <Button
                  onClick={generateQRCode}
                  disabled={isGeneratingQR}
                  size='lg'
                >
                  <IconQrcode className='mr-2 h-5 w-5' />
                  {isGeneratingQR ? 'Generando...' : 'Generar Código QR'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent className='text-muted-foreground space-y-2 text-sm'>
          <p>
            • La conexión se actualiza automáticamente cada 5 segundos
          </p>
          <p>
            • El código QR expira después de cierto tiempo, genera uno nuevo si es necesario
          </p>
          <p>
            • Una vez conectado, el bot podrá enviar y recibir mensajes de WhatsApp
          </p>
          <p>
            • No cierres la sesión de WhatsApp en tu teléfono mientras el bot esté activo
          </p>
        </CardContent>
      </Card>
    </div>
	</>
  )
}
