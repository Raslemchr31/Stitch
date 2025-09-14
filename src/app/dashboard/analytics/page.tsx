'use client'

import { useState, useCallback } from 'react'
import { useMetricsUpdates } from '@/hooks/use-websocket'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Eye,
  MousePointer,
  ShoppingCart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

// Sample data for charts
const performanceData = [
  { date: '2024-01-01', impressions: 12500, clicks: 450, conversions: 23, spend: 285 },
  { date: '2024-01-02', impressions: 13200, clicks: 520, conversions: 31, spend: 312 },
  { date: '2024-01-03', impressions: 11800, clicks: 380, conversions: 19, spend: 268 },
  { date: '2024-01-04', impressions: 14100, clicks: 580, conversions: 35, spend: 345 },
  { date: '2024-01-05', impressions: 15300, clicks: 650, conversions: 42, spend: 389 },
  { date: '2024-01-06', impressions: 13900, clicks: 490, conversions: 28, spend: 298 },
  { date: '2024-01-07', impressions: 16200, clicks: 720, conversions: 48, spend: 425 },
]

const audienceData = [
  { name: '18-24', value: 25, color: '#8013ec' },
  { name: '25-34', value: 35, color: '#a855f7' },
  { name: '35-44', value: 22, color: '#c084fc' },
  { name: '45-54', value: 12, color: '#ddd6fe' },
  { name: '55+', value: 6, color: '#f3f4f6' }
]

const campaignData = [
  { campaign: 'Summer Sale 2024', impressions: 45200, clicks: 1823, conversions: 127, spend: 1250, roas: 4.2 },
  { campaign: 'Brand Awareness Q1', impressions: 67800, clicks: 1245, conversions: 89, spend: 980, roas: 3.1 },
  { campaign: 'Product Launch', impressions: 23400, clicks: 891, conversions: 156, spend: 2100, roas: 5.8 },
  { campaign: 'Retargeting Campaign', impressions: 15600, clicks: 567, conversions: 78, spend: 450, roas: 6.2 },
  { campaign: 'Holiday Special', impressions: 89300, clicks: 2134, conversions: 289, spend: 1890, roas: 3.9 }
]

const cohortData = [
  { period: 'Week 1', newUsers: 1245, returning: 0, revenue: 2456, retention: 100 },
  { period: 'Week 2', newUsers: 1320, returning: 456, revenue: 3234, retention: 36.7 },
  { period: 'Week 3', newUsers: 1156, returning: 289, revenue: 2890, retention: 23.2 },
  { period: 'Week 4', newUsers: 1398, returning: 234, revenue: 3456, retention: 16.8 },
  { period: 'Week 5', newUsers: 1289, returning: 198, revenue: 2987, retention: 15.4 },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7days')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [liveMetrics, setLiveMetrics] = useState({
    impressions: 123456,
    impressionsChange: '+15%',
    clicks: 1234,
    clicksChange: '+10%',
    conversions: 123,
    conversionsChange: '-6%',
    reach: 87654,
    spend: 1250,
    roas: 4.2
  })

  // Real-time metrics updates
  const handleMetricsUpdate = useCallback((data: any) => {
    setLiveMetrics(prev => ({
      ...prev,
      impressions: data.impressions,
      clicks: data.clicks,
      conversions: data.conversions,
      reach: data.reach,
      spend: data.spend,
      roas: data.roas
    }))
  }, [])

  useMetricsUpdates(handleMetricsUpdate)

  const kpis = [
    {
      title: 'Impressions',
      value: '12,345,678',
      change: '+15%',
      trend: 'up',
      icon: Eye,
      description: 'vs last period'
    },
    {
      title: 'Reach',
      value: '8,765,432',
      change: '+12%',
      trend: 'up',
      icon: Users,
      description: 'vs last period'
    },
    {
      title: 'Clicks',
      value: '543,210',
      change: '+10%',
      trend: 'up',
      icon: MousePointer,
      description: 'vs last period'
    },
    {
      title: 'Conversions',
      value: '12,345',
      change: '+6%',
      trend: 'up',
      icon: Target,
      description: 'vs last period'
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Live Metrics Ticker */}
      <div className="w-full bg-black/90 text-white text-sm font-mono p-2 flex items-center justify-center gap-8 overflow-x-auto whitespace-nowrap">
        <p className="text-gray-400">Live Campaign Metrics:</p>
        <span className="flex items-center gap-2">
          <span className="text-green-400">Impressions:</span>
          {liveMetrics.impressions.toLocaleString()}
          <span className="text-green-500 text-xs">▲</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-blue-400">Reach:</span>
          {liveMetrics.reach.toLocaleString()}
          <span className="text-green-500 text-xs">▲</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-yellow-400">Clicks:</span>
          {liveMetrics.clicks.toLocaleString()}
          <span className="text-green-500 text-xs">▲</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-purple-400">Conversions:</span>
          {liveMetrics.conversions.toLocaleString()}
          <span className="text-red-500 text-xs">▼</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-orange-400">Spend:</span>
          ${liveMetrics.spend.toLocaleString()}
          <span className="text-green-500 text-xs">▲</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-cyan-400">ROAS:</span>
          {liveMetrics.roas.toFixed(1)}x
          <span className="text-green-500 text-xs">▲</span>
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Analyze your campaign performance with detailed metrics and visualizations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm">
            <Input
              type="date"
              defaultValue="2024-01-01"
              className="w-36"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="date"
              defaultValue="2024-01-28"
              className="w-36"
            />
            <Button variant="outline" size="sm" className="ml-2">
              Compare
            </Button>
          </div>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <Badge
                    variant={kpi.trend === 'up' ? 'default' : 'secondary'}
                    className={`text-xs ${
                      kpi.trend === 'up'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}
                  >
                    {kpi.trend === 'up' ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {kpi.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.title}</p>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Performance Trend
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="impressions">Impressions</SelectItem>
                  <SelectItem value="clicks">Clicks</SelectItem>
                  <SelectItem value="conversions">Conversions</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8013ec" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8013ec" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number, name: string) => [
                      selectedMetric === 'spend' ? `$${value}` : value.toLocaleString(),
                      name
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric === 'revenue' ? 'spend' : selectedMetric}
                    stroke="#8013ec"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Audience Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Audience Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={audienceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {audienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Campaign Performance
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search campaigns..."
                className="w-64"
              />
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Conversions</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="text-right">ROAS</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaignData.map((campaign, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{campaign.campaign}</TableCell>
                    <TableCell className="text-right">
                      {campaign.impressions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.clicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.conversions}
                    </TableCell>
                    <TableCell className="text-right">
                      ${campaign.spend.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={campaign.roas >= 4 ? 'default' : 'secondary'}
                        className={campaign.roas >= 4 ? 'bg-green-100 text-green-700' : ''}
                      >
                        {campaign.roas}x
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Cohort Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Cohort Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">
            User retention and revenue patterns over time
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">New Users</TableHead>
                  <TableHead className="text-right">Returning Users</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Retention Rate</TableHead>
                  <TableHead className="text-right">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cohortData.map((cohort, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{cohort.period}</TableCell>
                    <TableCell className="text-right">
                      {cohort.newUsers.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {cohort.returning.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ${cohort.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${cohort.retention}%` }}
                          />
                        </div>
                        <span className="text-sm">{cohort.retention}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-8 w-16">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[
                            { value: Math.random() * 100 },
                            { value: Math.random() * 100 },
                            { value: Math.random() * 100 },
                            { value: Math.random() * 100 },
                          ]}>
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#8013ec"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}