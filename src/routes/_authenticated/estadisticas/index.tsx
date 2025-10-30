import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  getAnalyticsOverview,
  getAnalyticsCosts,
  getAnalyticsUsers,
  getAnalyticsConversations,
  getAnalyticsMessages,
  analyticsKeys
} from '@/api/services/admin/analytics.api'
import type {
  AnalyticsOverview,
  CostAnalytics,
  ActiveUsersMetrics,
  ConversationMetrics,
  MessageAnalytics
} from '@/api/frontend-types/analytics.types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart3Icon,
  DollarSignIcon,
  UsersIcon,
  MessageSquareIcon,
  ActivityIcon,
  TrendingUpIcon,
  ClockIcon
} from 'lucide-react'

export const Route = createFileRoute('/_authenticated/estadisticas/')({
  component: RouteComponent,
})

function RouteComponent() {
  // Fetch overview data
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: analyticsKeys.overview(),
    queryFn: async () => {
      const response = await getAnalyticsOverview()
      return response.data as AnalyticsOverview
    },
  })

  // Fetch cost data
  const { data: costs, isLoading: costsLoading } = useQuery({
    queryKey: analyticsKeys.costs(),
    queryFn: async () => {
      const response = await getAnalyticsCosts({})
      return response.data as CostAnalytics
    },
  })

  // Fetch user metrics
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: analyticsKeys.users(),
    queryFn: async () => {
      const response = await getAnalyticsUsers({})
      return response.data as ActiveUsersMetrics
    },
  })

  // Fetch conversation metrics
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: analyticsKeys.conversations(),
    queryFn: async () => {
      const response = await getAnalyticsConversations()
      return response.data as ConversationMetrics
    },
  })

  // Fetch message analytics
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: analyticsKeys.messages(),
    queryFn: async () => {
      const response = await getAnalyticsMessages()
      return response.data as MessageAnalytics
    },
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-ES').format(value)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor system performance, costs, and user activity
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cost This Month
                </CardTitle>
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {overviewLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {formatCurrency(overview?.costThisMonth || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      LLM + Embedding costs
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tokens This Month
                </CardTitle>
                <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {overviewLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {formatNumber(overview?.tokensThisMonth || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total tokens processed
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users Today
                </CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {overviewLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {formatNumber(overview?.activeUsersToday || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Daily active users
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Messages Today
                </CardTitle>
                <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {overviewLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {formatNumber(overview?.messagesToday || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total messages sent
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Response Time
                </CardTitle>
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {overviewLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {overview?.avgResponseTimeMs || 0}ms
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Average bot response time
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Admin Intervention
                </CardTitle>
                <ActivityIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {overviewLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {formatPercentage(overview?.adminInterventionRate || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Conversations needing help
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversations
                </CardTitle>
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {overviewLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {formatNumber(overview?.conversationsThisMonth || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total this month
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Cost</CardTitle>
                <CardDescription>Current billing period</CardDescription>
              </CardHeader>
              <CardContent>
                {costsLoading ? (
                  <Skeleton className="h-10 w-32" />
                ) : (
                  <div className="text-3xl font-bold">
                    {formatCurrency(costs?.totalCost || 0)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>LLM Cost</CardTitle>
                <CardDescription>Language model usage</CardDescription>
              </CardHeader>
              <CardContent>
                {costsLoading ? (
                  <Skeleton className="h-10 w-32" />
                ) : (
                  <div className="text-3xl font-bold">
                    {formatCurrency(costs?.llmCost || 0)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Embedding Cost</CardTitle>
                <CardDescription>Vector embedding generation</CardDescription>
              </CardHeader>
              <CardContent>
                {costsLoading ? (
                  <Skeleton className="h-10 w-32" />
                ) : (
                  <div className="text-3xl font-bold">
                    {formatCurrency(costs?.embeddingCost || 0)}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Token Usage Breakdown</CardTitle>
              <CardDescription>Detailed token consumption metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {costsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Prompt Tokens</span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(costs?.promptTokens || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completion Tokens</span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(costs?.completionTokens || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Tokens</span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(costs?.totalTokens || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Embedding Tokens</span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(costs?.embeddingTokens || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm font-medium">Cost per Conversation</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(costs?.costPerConversation || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Tokens per Conversation</span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(costs?.avgTokensPerConversation || 0)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="text-3xl font-bold">
                    {formatNumber(users?.totalUsers || 0)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="text-3xl font-bold">
                    {formatNumber(users?.activeUsers || 0)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Users</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="text-3xl font-bold">
                    {formatNumber(users?.newUsers || 0)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Returning Users</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="text-3xl font-bold">
                    {formatNumber(users?.returningUsers || 0)}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>By role type</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Students</span>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(users?.students || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Professors</span>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(users?.professors || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">External</span>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(users?.external || 0)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Average user activity</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Avg Messages per User</span>
                      <span className="text-sm text-muted-foreground">
                        {users?.avgMessagesPerUser?.toFixed(1) || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Avg Sessions per User</span>
                      <span className="text-sm text-muted-foreground">
                        {users?.avgSessionsPerUser?.toFixed(1) || 0}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total</CardTitle>
              </CardHeader>
              <CardContent>
                {conversationsLoading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="text-3xl font-bold">
                    {formatNumber(conversations?.totalConversations || 0)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active</CardTitle>
              </CardHeader>
              <CardContent>
                {conversationsLoading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="text-3xl font-bold">
                    {formatNumber(conversations?.activeConversations || 0)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New</CardTitle>
              </CardHeader>
              <CardContent>
                {conversationsLoading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="text-3xl font-bold">
                    {formatNumber(conversations?.newConversations || 0)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avg Messages</CardTitle>
              </CardHeader>
              <CardContent>
                {conversationsLoading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="text-3xl font-bold">
                    {conversations?.avgMessagesPerConversation?.toFixed(1) || 0}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Conversation Quality Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              {conversationsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">With Admin Help</span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(conversations?.conversationsWithAdminHelp || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Intervention Rate</span>
                    <span className="text-sm text-muted-foreground">
                      {formatPercentage(conversations?.adminInterventionRate || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Blocked</span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(conversations?.blockedConversations || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Temporary</span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(conversations?.temporaryConversations || 0)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
