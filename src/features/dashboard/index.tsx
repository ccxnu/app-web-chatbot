import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  getAnalyticsOverview,
  getAnalyticsCosts,
  getAnalyticsUsers,
  getAnalyticsConversations,
  analyticsKeys
} from '@/api/services/admin/analytics.api'
import { generateMonthlyReport } from '@/api/services/admin/reports.api'
import type {
  AnalyticsOverview,
  CostAnalytics,
  ActiveUsersMetrics,
  ConversationMetrics,
} from '@/api/frontend-types/analytics.types'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart3Icon,
  DollarSignIcon,
  UsersIcon,
  MessageSquareIcon,
  ActivityIcon,
  TrendingUpIcon,
  ClockIcon,
  FileTextIcon,
  DownloadIcon
} from 'lucide-react'
import { toast } from 'sonner'

export default function Dashboard() {
  // Fetch analytics data
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: analyticsKeys.overview(),
    queryFn: async () => {
      const response = await getAnalyticsOverview()
      return response as AnalyticsOverview
    },
  })

  const { data: costs, isLoading: costsLoading } = useQuery({
    queryKey: analyticsKeys.costs({}),
    queryFn: async () => {
      const response = await getAnalyticsCosts({})
      return response as CostAnalytics
    },
  })

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: analyticsKeys.users({ period: 'month' }),
    queryFn: async () => {
      const response = await getAnalyticsUsers({ period: 'month' })
      return response as ActiveUsersMetrics
    },
  })

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: analyticsKeys.conversations(),
    queryFn: async () => {
      const response = await getAnalyticsConversations({ period: 'month' })
      return response as ConversationMetrics
    },
  })

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: async () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1 // JavaScript months are 0-indexed
      return generateMonthlyReport({ year, month })
    },
    onSuccess: (data) => {
      toast.success('Reporte generado exitosamente', {
        description: `El archivo ${data.filename} se ha descargado.`
      })
    },
    onError: (error: any) => {
      toast.error('Error al generar reporte', {
        description: error?.message || 'Ocurrió un error al generar el reporte PDF.'
      })
    }
  })

  const handleGenerateReport = () => {
    generateReportMutation.mutate()
  }

  // Formatting helpers
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '$0.00'
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '0'
    return new Intl.NumberFormat('es-ES').format(value)
  }

  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '0.0%'
    return `${(value * 100).toFixed(1)}%`
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
      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Panel de Control</h1>
          <Button
            onClick={handleGenerateReport}
            disabled={generateReportMutation.isPending}
            className='gap-2'
          >
            {generateReportMutation.isPending ? (
              <>
                <FileTextIcon className='h-4 w-4 animate-pulse' />
                Generando...
              </>
            ) : (
              <>
                <DownloadIcon className='h-4 w-4' />
                Descargar Reporte Mensual
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue='resumen' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='resumen'>Resumen</TabsTrigger>
            <TabsTrigger value='costos'>Costos</TabsTrigger>
            <TabsTrigger value='usuarios'>Usuarios</TabsTrigger>
            <TabsTrigger value='conversaciones'>Conversaciones</TabsTrigger>
          </TabsList>

          <TabsContent value='resumen' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Costo Este Mes
                  </CardTitle>
                  <DollarSignIcon className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {overviewLoading ? (
                    <Skeleton className='h-8 w-24' />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>
                        {formatCurrency(overview?.costThisMonth || 0)}
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>
                        Costos de LLM + Embeddings
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Tokens Este Mes
                  </CardTitle>
                  <BarChart3Icon className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {overviewLoading ? (
                    <Skeleton className='h-8 w-24' />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>
                        {formatNumber(overview?.tokensThisMonth || 0)}
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>
                        Total tokens procesados
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Usuarios Activos Hoy
                  </CardTitle>
                  <UsersIcon className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {overviewLoading ? (
                    <Skeleton className='h-8 w-24' />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>
                        {formatNumber(overview?.activeUsersToday || 0)}
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>
                        Usuarios activos diarios
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Mensajes Hoy
                  </CardTitle>
                  <MessageSquareIcon className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {overviewLoading ? (
                    <Skeleton className='h-8 w-24' />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>
                        {formatNumber(overview?.messagesToday || 0)}
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>
                        Total de mensajes enviados
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Tiempo de Respuesta Promedio
                  </CardTitle>
                  <ClockIcon className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {overviewLoading ? (
                    <Skeleton className='h-8 w-24' />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>
                        {overview?.avgResponseTimeMs || 0}ms
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>
                        Tiempo de respuesta del bot
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Intervención del Administrador
                  </CardTitle>
                  <ActivityIcon className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {overviewLoading ? (
                    <Skeleton className='h-8 w-24' />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>
                        {formatPercentage(overview?.adminInterventionRate || 0)}
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>
                        Conversaciones que necesitan ayuda
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Conversaciones
                  </CardTitle>
                  <TrendingUpIcon className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {overviewLoading ? (
                    <Skeleton className='h-8 w-24' />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>
                        {formatNumber(overview?.conversationsThisMonth || 0)}
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>
                        Total este mes
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='costos' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <Card>
                <CardHeader>
                  <CardTitle>Costo Total</CardTitle>
                  <CardDescription>Período de facturación actual</CardDescription>
                </CardHeader>
                <CardContent>
                  {costsLoading ? (
                    <Skeleton className='h-10 w-32' />
                  ) : (
                    <div className='text-3xl font-bold'>
                      {formatCurrency(costs?.totalCost || 0)}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Costo de LLM</CardTitle>
                  <CardDescription>Uso del modelo de lenguaje</CardDescription>
                </CardHeader>
                <CardContent>
                  {costsLoading ? (
                    <Skeleton className='h-10 w-32' />
                  ) : (
                    <div className='text-3xl font-bold'>
                      {formatCurrency(costs?.llmCost || 0)}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Costo de Embeddings</CardTitle>
                  <CardDescription>Generación de embeddings vectoriales</CardDescription>
                </CardHeader>
                <CardContent>
                  {costsLoading ? (
                    <Skeleton className='h-10 w-32' />
                  ) : (
                    <div className='text-3xl font-bold'>
                      {formatCurrency(costs?.embeddingCost || 0)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Desglose de Uso de Tokens</CardTitle>
                <CardDescription>Métricas detalladas de consumo de tokens</CardDescription>
              </CardHeader>
              <CardContent>
                {costsLoading ? (
                  <div className='space-y-2'>
                    <Skeleton className='h-6 w-full' />
                    <Skeleton className='h-6 w-full' />
                    <Skeleton className='h-6 w-full' />
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Tokens de Prompt</span>
                      <span className='text-sm text-muted-foreground'>
                        {formatNumber(costs?.promptTokens || 0)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Tokens de Respuesta</span>
                      <span className='text-sm text-muted-foreground'>
                        {formatNumber(costs?.completionTokens || 0)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Total de Tokens</span>
                      <span className='text-sm text-muted-foreground'>
                        {formatNumber(costs?.totalTokens || 0)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Tokens de Embeddings</span>
                      <span className='text-sm text-muted-foreground'>
                        {formatNumber(costs?.embeddingTokens || 0)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between pt-4 border-t'>
                      <span className='text-sm font-medium'>Costo por Conversación</span>
                      <span className='text-sm text-muted-foreground'>
                        {formatCurrency(costs?.costPerConversation || 0)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Promedio de Tokens por Conversación</span>
                      <span className='text-sm text-muted-foreground'>
                        {formatNumber(costs?.avgTokensPerConversation || 0)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='usuarios' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Usuarios Totales</CardTitle>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <Skeleton className='h-10 w-24' />
                  ) : (
                    <div className='text-3xl font-bold'>
                      {formatNumber(users?.totalUsers || 0)}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usuarios Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <Skeleton className='h-10 w-24' />
                  ) : (
                    <div className='text-3xl font-bold'>
                      {formatNumber(users?.activeUsers || 0)}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usuarios Nuevos</CardTitle>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <Skeleton className='h-10 w-24' />
                  ) : (
                    <div className='text-3xl font-bold'>
                      {formatNumber(users?.newUsers || 0)}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usuarios Recurrentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <Skeleton className='h-10 w-24' />
                  ) : (
                    <div className='text-3xl font-bold'>
                      {formatNumber(users?.returningUsers || 0)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Usuarios</CardTitle>
                  <CardDescription>Por tipo de rol</CardDescription>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className='space-y-2'>
                      <Skeleton className='h-6 w-full' />
                      <Skeleton className='h-6 w-full' />
                      <Skeleton className='h-6 w-full' />
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>Estudiantes</span>
                        <span className='text-sm text-muted-foreground'>
                          {formatNumber(users?.students || 0)}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>Profesores</span>
                        <span className='text-sm text-muted-foreground'>
                          {formatNumber(users?.professors || 0)}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>Externos</span>
                        <span className='text-sm text-muted-foreground'>
                          {formatNumber(users?.external || 0)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Participación</CardTitle>
                  <CardDescription>Actividad promedio de usuarios</CardDescription>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className='space-y-2'>
                      <Skeleton className='h-6 w-full' />
                      <Skeleton className='h-6 w-full' />
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>Promedio de Mensajes por Usuario</span>
                        <span className='text-sm text-muted-foreground'>
                          {users?.avgMessagesPerUser?.toFixed(1) || 0}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>Promedio de Sesiones por Usuario</span>
                        <span className='text-sm text-muted-foreground'>
                          {users?.avgSessionsPerUser?.toFixed(1) || 0}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='conversaciones' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Total</CardTitle>
                </CardHeader>
                <CardContent>
                  {conversationsLoading ? (
                    <Skeleton className='h-10 w-24' />
                  ) : (
                    <div className='text-3xl font-bold'>
                      {formatNumber(conversations?.totalConversations || 0)}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activas</CardTitle>
                </CardHeader>
                <CardContent>
                  {conversationsLoading ? (
                    <Skeleton className='h-10 w-24' />
                  ) : (
                    <div className='text-3xl font-bold'>
                      {formatNumber(conversations?.activeConversations || 0)}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nuevas</CardTitle>
                </CardHeader>
                <CardContent>
                  {conversationsLoading ? (
                    <Skeleton className='h-10 w-24' />
                  ) : (
                    <div className='text-3xl font-bold'>
                      {formatNumber(conversations?.newConversations || 0)}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Promedio de Mensajes</CardTitle>
                </CardHeader>
                <CardContent>
                  {conversationsLoading ? (
                    <Skeleton className='h-10 w-24' />
                  ) : (
                    <div className='text-3xl font-bold'>
                      {conversations?.avgMessagesPerConversation?.toFixed(1) || 0}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Calidad de Conversación</CardTitle>
              </CardHeader>
              <CardContent>
                {conversationsLoading ? (
                  <div className='space-y-2'>
                    <Skeleton className='h-6 w-full' />
                    <Skeleton className='h-6 w-full' />
                    <Skeleton className='h-6 w-full' />
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Con Ayuda del Administrador</span>
                      <span className='text-sm text-muted-foreground'>
                        {formatNumber(conversations?.conversationsWithAdminHelp || 0)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Tasa de Intervención</span>
                      <span className='text-sm text-muted-foreground'>
                        {formatPercentage(conversations?.adminInterventionRate || 0)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Bloqueadas</span>
                      <span className='text-sm text-muted-foreground'>
                        {formatNumber(conversations?.blockedConversations || 0)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Temporales</span>
                      <span className='text-sm text-muted-foreground'>
                        {formatNumber(conversations?.temporaryConversations || 0)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav: any[] = [
  // {
  //   title: 'Overview',
  //   href: 'dashboard/overview',
  //   isActive: true,
  //   disabled: false,
  // },
  // {
  //   title: 'Customers',
  //   href: 'dashboard/customers',
  //   isActive: false,
  //   disabled: true,
  // },
  // {
  //   title: 'Products',
  //   href: 'dashboard/products',
  //   isActive: false,
  //   disabled: true,
  // },
  // {
  //   title: 'Settings',
  //   href: 'dashboard/settings',
  //   isActive: false,
  //   disabled: true,
  // },
]
