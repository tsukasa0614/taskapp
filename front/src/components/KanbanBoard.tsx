'use client';

import { useState } from 'react';
import { Board, BoardColumn } from '@/types/board';
import { Task, TaskCreate } from '@/types/task';
import { Workspace } from '@/types/workspace';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  ArrowLeft, 
  MoreVertical, 
  Edit, 
  Trash2, 
  User, 
  Calendar, 
  Clock,
  Flag,
  Tag,
  MessageSquare,
  Paperclip,
  CheckSquare,
  Circle,
  AlertCircle,
  Target,
  Users
} from 'lucide-react';

interface KanbanBoardProps {
  workspace: Workspace;
  board: Board;
  columns: BoardColumn[];
  tasks: Task[];
  onCreateTask: (task: TaskCreate) => void;
  onUpdateTask: (id: string, task: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onCreateColumn: (column: { board_id: string; name: string; color: string }) => void;
  onBackToBoards: () => void;
}

const defaultColumns = [
  { name: 'To Do', color: 'bg-gray-500' },
  { name: 'In Progress', color: 'bg-blue-500' },
  { name: 'Review', color: 'bg-yellow-500' },
  { name: 'Done', color: 'bg-green-500' },
];

const priorityConfig = {
  low: { icon: Circle, color: 'text-gray-400', bg: 'bg-gray-100', label: '低' },
  medium: { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-100', label: '中' },
  high: { icon: Flag, color: 'text-red-500', bg: 'bg-red-100', label: '高' },
};

export default function KanbanBoard({
  workspace,
  board,
  columns,
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onCreateColumn,
  onBackToBoards
}: KanbanBoardProps) {
  const [showTaskForm, setShowTaskForm] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // デモ用にカラムがない場合はデフォルトカラムを表示
  const displayColumns = columns.length > 0 ? columns : defaultColumns.map((col, index) => ({
    id: `demo-${index}`,
    board_id: board.id,
    name: col.name,
    position: index,
    color: col.color,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  const handleCreateTask = (e: React.FormEvent, columnId: string) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const taskData: TaskCreate = {
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || undefined,
      board_id: board.id,
      column_id: columnId,
      priority: newTaskPriority,
      tags: [],
    };

    onCreateTask(taskData);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskPriority('medium');
    setShowTaskForm(null);
  };

  const getTasksByColumn = (columnId: string) => {
    return tasks.filter(task => task.column_id === columnId);
  };

  const handleTaskStatusChange = (task: Task, newStatus: 'todo' | 'in_progress' | 'done') => {
    onUpdateTask(task.id, { status: newStatus });
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const priority = priorityConfig[task.priority];
    const PriorityIcon = priority.icon;

    return (
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 bg-white border border-gray-200 hover:border-blue-300">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors duration-200">
              {task.title}
            </h4>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-100 hover:text-red-600"
              onClick={() => onDeleteTask(task.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          {task.description && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 mb-3">
            <Badge className={`${priority.bg} ${priority.color} text-xs px-2 py-0.5`}>
              <PriorityIcon className="h-3 w-3 mr-1" />
              {priority.label}
            </Badge>
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              {task.assignee_id && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>担当者</span>
                </div>
              )}
              {task.due_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(task.due_date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>0</span>
            </div>
          </div>

          {/* ステータス変更ボタン */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex gap-1">
              {task.status !== 'todo' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleTaskStatusChange(task, 'todo')}
                  className="flex-1 h-6 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                >
                  ← To Do
                </Button>
              )}
              {task.status !== 'in_progress' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleTaskStatusChange(task, 'in_progress')}
                  className="flex-1 h-6 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  進行中
                </Button>
              )}
              {task.status !== 'done' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleTaskStatusChange(task, 'done')}
                  className="flex-1 h-6 text-xs text-green-600 hover:text-green-800 hover:bg-green-50"
                >
                  完了 →
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b p-6 shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBackToBoards}
              variant="ghost"
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              ボード一覧に戻る
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${board.color} rounded-lg flex items-center justify-center shadow-md`}>
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{board.name}</h1>
                <p className="text-sm text-gray-600">{workspace.name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-gray-600">
              {tasks.length} タスク
            </Badge>
            <Badge variant="outline" className="text-gray-600">
              {displayColumns.length} カラム
            </Badge>
            {workspace.type === 'team' && (
              <Button size="sm" variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                <Users className="h-4 w-4 mr-2" />
                チームを管理
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Kanbanボード */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 h-full min-w-max max-w-7xl mx-auto">
          {displayColumns.map((column) => {
            const columnTasks = getTasksByColumn(column.id);
            return (
              <div
                key={column.id}
                className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full"
              >
                {/* カラムヘッダー */}
                <div className="p-4 border-b border-gray-200 shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${column.color} rounded-full`}></div>
                      <h3 className="font-semibold text-gray-900">{column.name}</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {columnTasks.length}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => setShowTaskForm(column.id)}
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-gray-800 hover:bg-gray-50 h-8 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    タスクを追加
                  </Button>
                </div>

                {/* タスク一覧 */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}

                  {/* タスク作成フォーム */}
                  {showTaskForm === column.id && (
                    <Card className="border-2 border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <form onSubmit={(e) => handleCreateTask(e, column.id)} className="space-y-3">
                          <Input
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="タスクのタイトル..."
                            className="bg-white"
                            autoFocus
                          />
                          <Input
                            value={newTaskDesc}
                            onChange={(e) => setNewTaskDesc(e.target.value)}
                            placeholder="説明（任意）..."
                            className="bg-white"
                          />
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-medium text-gray-700">優先度:</label>
                            <select
                              value={newTaskPriority}
                              onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                            >
                              <option value="low">低</option>
                              <option value="medium">中</option>
                              <option value="high">高</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit" size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                              追加
                            </Button>
                            <Button 
                              type="button" 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => setShowTaskForm(null)}
                            >
                              キャンセル
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            );
          })}

          {/* 新しいカラム追加 */}
          <div className="w-80 shrink-0">
            <Card className="h-fit border-2 border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors duration-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-700 mb-2">新しいカラム</h4>
                <p className="text-sm text-gray-500 mb-4">
                  ワークフローに合わせてカラムを追加
                </p>
                <Button
                  onClick={() => onCreateColumn({
                    board_id: board.id,
                    name: `カラム ${displayColumns.length + 1}`,
                    color: 'bg-gray-500'
                  })}
                  variant="outline"
                  className="w-full"
                >
                  カラムを追加
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
