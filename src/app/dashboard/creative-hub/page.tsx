'use client'

import { useState } from 'react'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus,
  Search,
  Filter,
  Upload,
  Download,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Star,
  MoreHorizontal,
  Image,
  Video,
  FileText,
  Zap,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  Heart,
  MessageCircle,
  Share,
  BarChart3
} from 'lucide-react'

interface Creative {
  id: string
  title: string
  type: 'image' | 'video' | 'carousel' | 'text'
  format: string
  dimensions: string
  fileSize: string
  status: 'active' | 'paused' | 'draft' | 'archived'
  performance: {
    score: number
    impressions: number
    clicks: number
    ctr: number
    cpc: number
    conversions: number
    roas: number
  }
  thumbnail: string
  createdAt: string
  updatedAt: string
  tags: string[]
  campaign?: string
  aiGenerated: boolean
}

const SAMPLE_CREATIVES: Creative[] = [
  {
    id: '1',
    title: 'Summer Sale Hero Banner',
    type: 'image',
    format: 'JPG',
    dimensions: '1200x628',
    fileSize: '245 KB',
    status: 'active',
    performance: {
      score: 92,
      impressions: 45200,
      clicks: 1823,
      ctr: 4.03,
      cpc: 0.68,
      conversions: 127,
      roas: 4.2
    },
    thumbnail: '',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    tags: ['summer', 'sale', 'banner', 'hero'],
    campaign: 'Summer Sale 2024',
    aiGenerated: false
  },
  {
    id: '2',
    title: 'Product Demo Video',
    type: 'video',
    format: 'MP4',
    dimensions: '1920x1080',
    fileSize: '12.3 MB',
    status: 'active',
    performance: {
      score: 88,
      impressions: 23400,
      clicks: 891,
      ctr: 3.81,
      cpc: 0.72,
      conversions: 156,
      roas: 5.8
    },
    thumbnail: '',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-22',
    tags: ['product', 'demo', 'video', 'tutorial'],
    campaign: 'Product Launch',
    aiGenerated: true
  },
  {
    id: '3',
    title: 'Holiday Collection Carousel',
    type: 'carousel',
    format: 'Multiple',
    dimensions: '1080x1080',
    fileSize: '1.8 MB',
    status: 'paused',
    performance: {
      score: 76,
      impressions: 89300,
      clicks: 2134,
      ctr: 2.39,
      cpc: 0.89,
      conversions: 289,
      roas: 3.9
    },
    thumbnail: '',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-25',
    tags: ['holiday', 'collection', 'carousel', 'products'],
    campaign: 'Holiday Special',
    aiGenerated: false
  },
  {
    id: '4',
    title: 'Brand Story Text Ad',
    type: 'text',
    format: 'Text',
    dimensions: 'N/A',
    fileSize: '2 KB',
    status: 'draft',
    performance: {
      score: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpc: 0,
      conversions: 0,
      roas: 0
    },
    thumbnail: '',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25',
    tags: ['brand', 'story', 'text', 'awareness'],
    aiGenerated: true
  }
]

const PERFORMANCE_COLORS = {
  excellent: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  good: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  average: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  poor: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
}

const getPerformanceLevel = (score: number): keyof typeof PERFORMANCE_COLORS => {
  if (score >= 90) return 'excellent'
  if (score >= 75) return 'good'
  if (score >= 60) return 'average'
  return 'poor'
}

const getTypeIcon = (type: Creative['type']) => {
  switch (type) {
    case 'image': return Image
    case 'video': return Video
    case 'carousel': return BarChart3
    case 'text': return FileText
    default: return FileText
  }
}

export default function CreativeHubPage() {
  const [creatives, setCreatives] = useState<Creative[]>(SAMPLE_CREATIVES)
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredCreatives = creatives.filter(creative => {
    const matchesSearch = creative.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creative.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = filterType === 'all' || creative.type === filterType
    const matchesStatus = filterStatus === 'all' || creative.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const stats = {
    total: creatives.length,
    active: creatives.filter(c => c.status === 'active').length,
    performance: creatives.reduce((acc, c) => acc + c.performance.score, 0) / creatives.length,
    totalImpressions: creatives.reduce((acc, c) => acc + c.performance.impressions, 0)
  }

  return (
    <div className="h-full flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Creative Management Hub</h1>
              <p className="text-muted-foreground">
                Manage, analyze, and optimize your ad creatives
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    AI Generate
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Generate AI Creative</DialogTitle>
                    <DialogDescription>
                      Describe what you want to create and let AI generate it for you
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Creative Type</Label>
                      <Select defaultValue="image">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="text">Text Ad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe your creative idea..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Style</Label>
                      <Select defaultValue="modern">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                          <SelectItem value="elegant">Elegant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Creative
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Creatives</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <Play className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Performance</p>
                    <p className="text-2xl font-bold">{Math.round(stats.performance)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Impressions</p>
                    <p className="text-2xl font-bold">{(stats.totalImpressions / 1000).toFixed(1)}K</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search creatives..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Creative Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCreatives.map((creative) => {
                const TypeIcon = getTypeIcon(creative.type)
                const performanceLevel = getPerformanceLevel(creative.performance.score)

                return (
                  <Card
                    key={creative.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 group"
                    onClick={() => setSelectedCreative(creative)}
                  >
                    <CardContent className="p-0">
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <TypeIcon className="h-12 w-12 text-muted-foreground" />
                        </div>

                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <Button variant="secondary" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge
                            variant={creative.status === 'active' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {creative.status}
                          </Badge>
                        </div>

                        {/* AI Badge */}
                        {creative.aiGenerated && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              <Zap className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                            {creative.title}
                          </h3>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            {creative.format} • {creative.dimensions}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {creative.fileSize}
                          </span>
                        </div>

                        {/* Performance Score */}
                        {creative.performance.score > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">Performance</span>
                              <span className="text-xs font-medium">{creative.performance.score}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1">
                              <div
                                className={`h-1 rounded-full transition-all ${
                                  creative.performance.score >= 90 ? 'bg-green-500' :
                                  creative.performance.score >= 75 ? 'bg-blue-500' :
                                  creative.performance.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${creative.performance.score}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {creative.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {creative.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{creative.tags.length - 2}
                            </Badge>
                          )}
                        </div>

                        {/* Performance Metrics */}
                        {creative.performance.impressions > 0 && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Impressions</span>
                              <p className="font-medium">{(creative.performance.impressions / 1000).toFixed(1)}K</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">CTR</span>
                              <p className="font-medium">{creative.performance.ctr.toFixed(2)}%</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            // List View
            <div className="space-y-2">
              {filteredCreatives.map((creative) => {
                const TypeIcon = getTypeIcon(creative.type)
                const performanceLevel = getPerformanceLevel(creative.performance.score)

                return (
                  <Card
                    key={creative.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={() => setSelectedCreative(creative)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        {/* Thumbnail */}
                        <div className="w-16 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          <TypeIcon className="h-6 w-6 text-muted-foreground" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-sm mb-1">{creative.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                {creative.type} • {creative.format} • {creative.dimensions} • {creative.fileSize}
                              </p>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={creative.status === 'active' ? 'default' : 'secondary'}
                                className="capitalize text-xs"
                              >
                                {creative.status}
                              </Badge>
                              {creative.aiGenerated && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                                  <Zap className="h-3 w-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Performance */}
                        {creative.performance.impressions > 0 && (
                          <div className="flex items-center space-x-4 text-xs">
                            <div className="text-center">
                              <p className="text-muted-foreground">Score</p>
                              <p className="font-medium">{creative.performance.score}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground">Impressions</p>
                              <p className="font-medium">{(creative.performance.impressions / 1000).toFixed(1)}K</p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground">CTR</p>
                              <p className="font-medium">{creative.performance.ctr.toFixed(2)}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground">ROAS</p>
                              <p className="font-medium">{creative.performance.roas.toFixed(1)}x</p>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Details */}
      {selectedCreative && (
        <div className="w-80 border-l bg-card flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Creative Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedCreative(null)}
              >
                ×
              </Button>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {selectedCreative.title}
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Preview */}
            <div>
              <h3 className="font-medium mb-3">Preview</h3>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                {(() => {
                  const Icon = getTypeIcon(selectedCreative.type)
                  return <Icon className="h-12 w-12 text-muted-foreground" />
                })()}
              </div>
            </div>

            {/* Basic Info */}
            <div>
              <h3 className="font-medium mb-3">Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="capitalize">{selectedCreative.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span>{selectedCreative.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dimensions:</span>
                  <span>{selectedCreative.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File Size:</span>
                  <span>{selectedCreative.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary" className="capitalize">
                    {selectedCreative.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Performance */}
            {selectedCreative.performance.impressions > 0 && (
              <div>
                <h3 className="font-medium mb-3">Performance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overall Score</span>
                    <Badge
                      className={PERFORMANCE_COLORS[getPerformanceLevel(selectedCreative.performance.score)]}
                    >
                      {selectedCreative.performance.score}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Impressions</p>
                      <p className="font-medium">{selectedCreative.performance.impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Clicks</p>
                      <p className="font-medium">{selectedCreative.performance.clicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">CTR</p>
                      <p className="font-medium">{selectedCreative.performance.ctr.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">CPC</p>
                      <p className="font-medium">${selectedCreative.performance.cpc.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Conversions</p>
                      <p className="font-medium">{selectedCreative.performance.conversions}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ROAS</p>
                      <p className="font-medium">{selectedCreative.performance.roas.toFixed(1)}x</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <h3 className="font-medium mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {selectedCreative.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Campaign */}
            {selectedCreative.campaign && (
              <div>
                <h3 className="font-medium mb-3">Campaign</h3>
                <Badge variant="secondary">{selectedCreative.campaign}</Badge>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 border-t">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}