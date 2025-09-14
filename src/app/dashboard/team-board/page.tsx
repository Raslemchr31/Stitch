'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MessageCircle,
  Paperclip,
  MoreHorizontal,
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
  Target,
  Flag
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'review' | 'done'
  assignee: {
    id: string
    name: string
    avatar: string
    initials: string
  }
  labels: string[]
  dueDate: string
  comments: number
  attachments: number
  progress?: number
}

interface Column {
  id: string
  title: string
  tasks: Task[]
  color: string
  limit?: number
}

const INITIAL_COLUMNS: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'bg-gray-100 dark:bg-gray-800',
    tasks: [
      {
        id: '1',
        title: 'Design new landing page',
        description: 'Create wireframes and mockups for the new product landing page',
        priority: 'high',
        status: 'todo',
        assignee: {
          id: '1',
          name: 'Sarah Chen',
          avatar: '',
          initials: 'SC'
        },
        labels: ['Design', 'Landing Page'],
        dueDate: '2024-01-25',
        comments: 3,
        attachments: 2
      },
      {
        id: '2',
        title: 'Set up analytics tracking',
        description: 'Implement Google Analytics and Facebook Pixel on all campaign pages',
        priority: 'medium',
        status: 'todo',
        assignee: {
          id: '2',
          name: 'Mike Johnson',
          avatar: '',
          initials: 'MJ'
        },
        labels: ['Analytics', 'Tracking'],
        dueDate: '2024-01-30',
        comments: 1,
        attachments: 0
      }
    ]
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    color: 'bg-blue-50 dark:bg-blue-900/20',
    limit: 3,
    tasks: [
      {
        id: '3',
        title: 'Develop campaign dashboard',
        description: 'Build React components for the campaign management interface',
        priority: 'high',
        status: 'in_progress',
        assignee: {
          id: '3',
          name: 'Alex Thompson',
          avatar: '',
          initials: 'AT'
        },
        labels: ['Frontend', 'Dashboard'],
        dueDate: '2024-01-28',
        comments: 7,
        attachments: 1,
        progress: 65
      },
      {
        id: '4',
        title: 'Content creation workflow',
        description: 'Define process for creating and approving ad creatives',
        priority: 'medium',
        status: 'in_progress',
        assignee: {
          id: '4',
          name: 'Emma Davis',
          avatar: '',
          initials: 'ED'
        },
        labels: ['Content', 'Workflow'],
        dueDate: '2024-02-01',
        comments: 2,
        attachments: 3,
        progress: 30
      }
    ]
  },
  {
    id: 'review',
    title: 'Review',
    color: 'bg-yellow-50 dark:bg-yellow-900/20',
    tasks: [
      {
        id: '5',
        title: 'API documentation update',
        description: 'Update API docs with new Meta Graph API endpoints',
        priority: 'low',
        status: 'review',
        assignee: {
          id: '5',
          name: 'David Wilson',
          avatar: '',
          initials: 'DW'
        },
        labels: ['Documentation', 'API'],
        dueDate: '2024-01-26',
        comments: 4,
        attachments: 1
      }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    color: 'bg-green-50 dark:bg-green-900/20',
    tasks: [
      {
        id: '6',
        title: 'Database schema design',
        description: 'Design and implement database schema for campaign data',
        priority: 'high',
        status: 'done',
        assignee: {
          id: '6',
          name: 'Lisa Wang',
          avatar: '',
          initials: 'LW'
        },
        labels: ['Backend', 'Database'],
        dueDate: '2024-01-20',
        comments: 8,
        attachments: 2
      },
      {
        id: '7',
        title: 'User authentication setup',
        description: 'Implement NextAuth.js with Meta OAuth integration',
        priority: 'urgent',
        status: 'done',
        assignee: {
          id: '7',
          name: 'Ryan Miller',
          avatar: '',
          initials: 'RM'
        },
        labels: ['Auth', 'Security'],
        dueDate: '2024-01-18',
        comments: 5,
        attachments: 0
      }
    ]
  }
]

const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
}

const PRIORITY_ICONS = {
  low: Flag,
  medium: AlertCircle,
  high: Target,
  urgent: AlertCircle
}

export default function TeamBoardPage() {
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const newColumns = [...columns]
    const sourceColumn = newColumns.find(col => col.id === source.droppableId)!
    const destColumn = newColumns.find(col => col.id === destination.droppableId)!

    const [movedTask] = sourceColumn.tasks.splice(source.index, 1)
    movedTask.status = destination.droppableId as Task['status']
    destColumn.tasks.splice(destination.index, 0, movedTask)

    setColumns(newColumns)
  }

  const getPriorityIcon = (priority: Task['priority']) => {
    const Icon = PRIORITY_ICONS[priority]
    return <Icon className="h-3 w-3" />
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays > 1) return `In ${diffDays} days`
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Team Collaboration Board</h1>
            <p className="text-muted-foreground">
              Manage your team's tasks and track campaign progress
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new task to your team board
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input placeholder="Enter task title" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input placeholder="Enter task description" className="mt-1" />
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Priority</label>
                      <select className="w-full mt-1 px-3 py-2 border rounded-md">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">Due Date</label>
                      <Input type="date" className="mt-1" />
                    </div>
                  </div>
                  <Button className="w-full">Create Task</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Team:</span>
            <div className="flex items-center -space-x-2">
              {INITIAL_COLUMNS.flatMap(col => col.tasks)
                .map(task => task.assignee)
                .filter((assignee, index, self) =>
                  self.findIndex(a => a.id === assignee.id) === index
                )
                .slice(0, 5)
                .map(assignee => (
                  <Avatar key={assignee.id} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={assignee.avatar} />
                    <AvatarFallback className="text-xs">
                      {assignee.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
              <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <Plus className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-6 min-w-max">
            {columns.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-80">
                <div className={`rounded-lg p-4 ${column.color}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{column.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {column.tasks.length}
                      </Badge>
                      {column.limit && column.tasks.length >= column.limit && (
                        <Badge variant="destructive" className="text-xs">
                          Limit reached
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[200px] transition-colors ${
                          snapshot.isDraggingOver ? 'bg-primary/5 rounded-md' : ''
                        }`}
                      >
                        {column.tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`cursor-pointer hover:shadow-md transition-all ${
                                  snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                                }`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium text-sm leading-tight">
                                      {task.title}
                                    </h4>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${PRIORITY_COLORS[task.priority]}`}
                                    >
                                      {getPriorityIcon(task.priority)}
                                      <span className="ml-1 capitalize">{task.priority}</span>
                                    </Badge>
                                  </div>

                                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                    {task.description}
                                  </p>

                                  {task.progress !== undefined && (
                                    <div className="mb-3">
                                      <div className="flex justify-between text-xs mb-1">
                                        <span>Progress</span>
                                        <span>{task.progress}%</span>
                                      </div>
                                      <div className="w-full bg-muted rounded-full h-1">
                                        <div
                                          className="bg-primary h-1 rounded-full transition-all"
                                          style={{ width: `${task.progress}%` }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {task.labels.map(label => (
                                      <Badge key={label} variant="secondary" className="text-xs">
                                        {label}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={task.assignee.avatar} />
                                        <AvatarFallback className="text-xs">
                                          {task.assignee.initials}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-xs text-muted-foreground">
                                        {task.assignee.name}
                                      </span>
                                    </div>

                                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                      {task.comments > 0 && (
                                        <div className="flex items-center space-x-1">
                                          <MessageCircle className="h-3 w-3" />
                                          <span>{task.comments}</span>
                                        </div>
                                      )}
                                      {task.attachments > 0 && (
                                        <div className="flex items-center space-x-1">
                                          <Paperclip className="h-3 w-3" />
                                          <span>{task.attachments}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between mt-2 pt-2 border-t">
                                    <div className={`flex items-center space-x-1 text-xs ${
                                      isOverdue(task.dueDate) ? 'text-red-500' : 'text-muted-foreground'
                                    }`}>
                                      <Clock className="h-3 w-3" />
                                      <span>{formatDueDate(task.dueDate)}</span>
                                    </div>

                                    {task.status === 'done' && (
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {/* Add Task Button */}
                        <Button
                          variant="ghost"
                          className="w-full border-2 border-dashed border-muted-foreground/25 h-12 text-muted-foreground hover:border-primary hover:text-primary"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}

            {/* Add Column */}
            <div className="flex-shrink-0 w-80">
              <Button
                variant="ghost"
                className="w-full h-32 border-2 border-dashed border-muted-foreground/25 text-muted-foreground hover:border-primary hover:text-primary"
              >
                <Plus className="h-6 w-6 mr-2" />
                Add Column
              </Button>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}