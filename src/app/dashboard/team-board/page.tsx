'use client'

import { useState, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useTaskUpdates, useWebSocket } from '@/hooks/use-websocket'
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
        title: 'Design new ad creatives',
        description: 'Create new visual assets for summer sale campaign',
        priority: 'high',
        status: 'todo',
        assignee: {
          id: '1',
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b89c8bce?w=150&h=150&fit=crop&crop=face',
          initials: 'SC'
        },
        labels: ['Design'],
        dueDate: '2024-01-25',
        comments: 0,
        attachments: 0
      },
      {
        id: '2',
        title: 'Write copy for social media posts',
        description: 'Create engaging copy for all social media platforms',
        priority: 'medium',
        status: 'todo',
        assignee: {
          id: '2',
          name: 'Mike Johnson',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          initials: 'MJ'
        },
        labels: ['Copywriting'],
        dueDate: '2024-01-30',
        comments: 0,
        attachments: 0
      },
      {
        id: '3',
        title: 'Setup new A/B test',
        description: 'Configure A/B testing for campaign variants',
        priority: 'medium',
        status: 'todo',
        assignee: {
          id: '3',
          name: 'Alex Thompson',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          initials: 'AT'
        },
        labels: ['Marketing'],
        dueDate: '2024-02-01',
        comments: 0,
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
        id: '4',
        title: 'Develop landing page',
        description: 'Build responsive landing page for summer sale',
        priority: 'high',
        status: 'in_progress',
        assignee: {
          id: '4',
          name: 'Emma Davis',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          initials: 'ED'
        },
        labels: ['Development'],
        dueDate: '2024-01-28',
        comments: 0,
        attachments: 0
      },
      {
        id: '5',
        title: 'Review campaign budget',
        description: 'Analyze and optimize campaign spending allocation',
        priority: 'medium',
        status: 'in_progress',
        assignee: {
          id: '5',
          name: 'David Wilson',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          initials: 'DW'
        },
        labels: ['Marketing'],
        dueDate: '2024-02-02',
        comments: 0,
        attachments: 0
      }
    ]
  },
  {
    id: 'review',
    title: 'In Review',
    color: 'bg-yellow-50 dark:bg-yellow-900/20',
    tasks: [
      {
        id: '6',
        title: 'Finalize ad targeting',
        description: 'Review and approve final audience targeting parameters',
        priority: 'high',
        status: 'review',
        assignee: {
          id: '6',
          name: 'Lisa Wang',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          initials: 'LW'
        },
        labels: ['Pending Approval'],
        dueDate: '2024-01-26',
        comments: 0,
        attachments: 0
      }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    color: 'bg-green-50 dark:bg-green-900/20',
    tasks: [
      {
        id: '7',
        title: 'Launch social media campaign',
        description: 'Successfully launched social media promotion campaign',
        priority: 'high',
        status: 'done',
        assignee: {
          id: '7',
          name: 'Ryan Miller',
          avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
          initials: 'RM'
        },
        labels: ['Completed'],
        dueDate: '2024-01-20',
        comments: 0,
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
  const { emit } = useWebSocket()

  // Real-time task updates
  const handleTaskUpdate = useCallback((data: any) => {
    setColumns(prev => prev.map(column => ({
      ...column,
      tasks: column.tasks.map(task =>
        task.id === data.id
          ? { ...task, status: data.status, ...data }
          : task
      )
    })))
  }, [])

  useTaskUpdates(handleTaskUpdate)

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

    // Emit real-time update
    emit('task-drag', {
      taskId: movedTask.id,
      columnId: destination.droppableId
    })
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
            <h1 className="text-3xl font-bold">Summer Sale Campaign</h1>
            <p className="text-muted-foreground">
              Manage your campaign progress and collaborate with your team
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Call
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

        {/* Tab Navigation */}
        <div className="border-b border-border mb-6">
          <nav className="-mb-px flex space-x-8">
            <button className="border-primary text-primary whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              Board
            </button>
            <button className="border-transparent text-muted-foreground hover:text-foreground hover:border-border whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors">
              List
            </button>
            <button className="border-transparent text-muted-foreground hover:text-foreground hover:border-border whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors">
              Calendar
            </button>
          </nav>
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