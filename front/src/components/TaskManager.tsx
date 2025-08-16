'use client';

import { useState, useEffect } from 'react';
import { Task, TaskCreate } from '@/types/task';
import { Project } from '@/types/project';
import { Category } from '@/types/category';
import { tasksApi, projectsApi, categoriesApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Calendar, Clock, Menu, X, BarChart3, Settings, User, Users, FolderPlus, Briefcase, Home, TrendingUp, Bell, Search, ChevronDown, Star, Zap, Target, Award, Globe, PersonStanding, Building2, Coffee, Car, Heart, Gamepad2, ShoppingCart, GraduationCap, MessageSquare, MessageCircle } from 'lucide-react';
import ChatPanel from './ChatPanel';
import TaskComments from './TaskComments';

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // ワークスペース関連のstate
  const [currentWorkspace, setCurrentWorkspace] = useState<'personal' | 'team'>('personal');
  
  // プロジェクト関連のstate
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectType, setNewProjectType] = useState<'personal' | 'team'>('personal');
  
  // カテゴリ関連のstate
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  
  // チャット・コメント関連のstate
  const [showChat, setShowChat] = useState(false);
  const [showTaskComments, setShowTaskComments] = useState(false);
  const [selectedTaskForComments, setSelectedTaskForComments] = useState<string | null>(null);

  // タスク一覧取得
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await tasksApi.getAllTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      setError('タスクの取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 新規タスク作成
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const taskData: TaskCreate = {
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
        project_id: currentWorkspace === 'team' ? selectedProject?.id : undefined,
        category_id: currentWorkspace === 'personal' ? selectedCategory?.id : undefined,
      };

      const newTask = await tasksApi.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setError(null);
    } catch (err) {
      setError('タスクの作成に失敗しました');
      console.error(err);
    }
  };

  // タスク完了状態切り替え
  const handleToggleTask = async (taskId: string) => {
    try {
      const updatedTask = await tasksApi.toggleTask(taskId);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      setError(null);
    } catch (err) {
      setError('タスクの更新に失敗しました');
      console.error(err);
    }
  };

  // タスク削除
  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksApi.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError('タスクの削除に失敗しました');
      console.error(err);
    }
  };

  // データ初期化
  const initializeData = async () => {
    try {
      setLoading(true);
      
      // APIからデータを取得
      const [tasksData, projectsData, categoriesData] = await Promise.all([
        tasksApi.getAllTasks(),
        projectsApi.getAllProjects(),
        categoriesApi.getAllCategories()
      ]);
      
      setTasks(tasksData);
      setProjects(projectsData);
      setCategories(categoriesData);
      
      // デフォルト選択
      const personalCategories = categoriesData.filter(c => c.workspace_type === 'personal');
      if (personalCategories.length > 0) {
        setSelectedCategory(personalCategories[0]);
      }
      
      setError(null);
    } catch (err) {
      setError('データの取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 初期化
  useEffect(() => {
    initializeData();
  }, []);

  // プロジェクト作成
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newProjectData = {
        name: newProjectName.trim(),
        description: newProjectDescription.trim() || undefined,
        type: newProjectType,
        color: randomColor,
        icon: newProjectType === 'team' ? 'Users' : 'User',
      };

      const newProject = await projectsApi.createProject(newProjectData);
      setProjects(prev => [...prev, newProject]);
      setNewProjectName('');
      setNewProjectDescription('');
      setShowProjectForm(false);
      setError(null);
    } catch (err) {
      setError('プロジェクトの作成に失敗しました');
      console.error(err);
    }
  };

  // カテゴリ作成
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-orange-500'];
      const icons = ['Building2', 'Heart', 'Star', 'Coffee', 'Car', 'Gamepad2', 'ShoppingCart', 'GraduationCap'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];

      const newCategoryData = {
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
        color: randomColor,
        icon: randomIcon,
        workspace_type: 'personal' as const,
      };

      const newCategory = await categoriesApi.createCategory(newCategoryData);
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      setNewCategoryDescription('');
      setShowCategoryForm(false);
      setError(null);
    } catch (err) {
      setError('カテゴリの作成に失敗しました');
      console.error(err);
    }
  };

  // ワークスペース切り替え
  const handleWorkspaceChange = (workspace: 'personal' | 'team') => {
    setCurrentWorkspace(workspace);
    if (workspace === 'team') {
      setSelectedProject(projects.find(p => p.type === 'team') || null);
      setSelectedCategory(null);
    } else {
      setSelectedProject(null);
      setSelectedCategory(categories.find(c => c.workspace_type === 'personal') || null);
    }
  };

  // ワークスペースとカテゴリ/プロジェクトに基づいてタスクをフィルタリング
  const filteredTasks = tasks.filter(task => {
    if (currentWorkspace === 'team') {
      return selectedProject ? task.project_id === selectedProject.id : false;
    } else {
      return selectedCategory ? task.category_id === selectedCategory.id : false;
    }
  });
  
  // タスクを状態別に分離
  const todoTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  // タスクカードコンポーネント
  const TaskCard = ({ task }: { task: Task }) => (
    <div className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative p-5">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-gray-800 leading-snug text-base group-hover:text-gray-900 transition-colors">
              {task.title}
            </h3>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTask(task.id);
              }}
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0 shrink-0 rounded-xl"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
          
          <div className="pt-3 border-t border-gray-200/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-3 w-3" />
                </div>
                <span className="font-medium">{new Date(task.created_at).toLocaleDateString('ja-JP')}</span>
              </div>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleTask(task.id);
                }}
                size="sm"
                className={`h-8 text-xs px-4 rounded-xl font-medium transition-all duration-200 ${
                  task.completed 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:scale-105'
                }`}
              >
                {task.completed ? '⏪ 戻す' : '✓ 完了'}
              </Button>
            </div>
            
            {/* アクションボタン */}
            <div className="flex items-center gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTaskForComments(task.id);
                  setShowTaskComments(true);
                }}
                variant="ghost"
                size="sm"
                className="flex-1 h-8 text-xs text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                コメント
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex">
      {/* サイドバー */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 backdrop-blur-xl bg-white/80 border-r border-white/20 shadow-2xl transform transition-all duration-500 ease-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* 背景装飾 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/20 to-orange-500/20 rounded-full blur-2xl translate-y-12 -translate-x-12" />
          {/* サイドバーヘッダー */}
          <div className="relative p-6 border-b border-gray-200/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white/80"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">NEXUS</h1>
                  <p className="text-sm text-gray-500 font-medium">次世代タスク管理プラットフォーム</p>
                </div>
              </div>
              <Button
                onClick={() => setSidebarOpen(false)}
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* ユーザープロフィール */}
            <div className="relative p-4 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Miyamoto</p>
                  <p className="text-xs text-gray-500">プロジェクトマネージャー</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* ワークスペース切り替え */}
          <div className="relative p-5 border-b border-gray-200/20">
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center">
                <Globe className="h-3 w-3 text-white" />
              </div>
              ワークスペース
            </h3>
            <div className="space-y-3">
              <Button 
                onClick={() => handleWorkspaceChange('personal')}
                variant="ghost" 
                className={`group w-full justify-start text-left p-4 h-auto rounded-xl transition-all duration-300 ${
                  currentWorkspace === 'personal' 
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border border-blue-200/50 shadow-lg transform scale-[1.02]' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/60 hover:shadow-md hover:scale-[1.01]'
                } backdrop-blur-sm`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    currentWorkspace === 'personal' 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <PersonStanding className={`h-5 w-5 ${currentWorkspace === 'personal' ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">個人</p>
                    <p className="text-xs opacity-70">プライベートタスク</p>
                  </div>
                  {currentWorkspace === 'personal' && (
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  )}
                </div>
              </Button>
              <Button 
                onClick={() => handleWorkspaceChange('team')}
                variant="ghost" 
                className={`group w-full justify-start text-left p-4 h-auto rounded-xl transition-all duration-300 ${
                  currentWorkspace === 'team' 
                    ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 border border-green-200/50 shadow-lg transform scale-[1.02]' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/60 hover:shadow-md hover:scale-[1.01]'
                } backdrop-blur-sm`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    currentWorkspace === 'team' 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <Users className={`h-5 w-5 ${currentWorkspace === 'team' ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">チーム</p>
                    <p className="text-xs opacity-70">共同プロジェクト</p>
                  </div>
                  {currentWorkspace === 'team' && (
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  )}
                </div>
              </Button>
            </div>
          </div>

          {/* ナビゲーション */}
          <div className="relative p-5 border-b border-gray-200/20">
            <nav className="space-y-2">
              <Button variant="ghost" className="group w-full justify-start text-left text-gray-600 hover:text-gray-800 hover:bg-white/60 hover:shadow-md rounded-xl p-3 transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mr-3 group-hover:shadow-lg transition-all duration-200">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">アナリティクス</span>
              </Button>
              <Button 
                onClick={() => setShowChat(true)}
                variant="ghost" 
                className="group w-full justify-start text-left text-gray-600 hover:text-gray-800 hover:bg-white/60 hover:shadow-md rounded-xl p-3 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-3 group-hover:shadow-lg transition-all duration-200">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">チャット</span>
                <div className="ml-auto w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
              </Button>
              <Button variant="ghost" className="group w-full justify-start text-left text-gray-600 hover:text-gray-800 hover:bg-white/60 hover:shadow-md rounded-xl p-3 transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center mr-3 group-hover:shadow-lg transition-all duration-200">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">通知</span>
                <div className="ml-auto w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </Button>
              <Button variant="ghost" className="group w-full justify-start text-left text-gray-600 hover:text-gray-800 hover:bg-white/60 hover:shadow-md rounded-xl p-3 transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center mr-3 group-hover:shadow-lg transition-all duration-200">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">設定</span>
              </Button>
            </nav>
          </div>

          {/* プロジェクト/カテゴリ一覧 */}
          <div className="relative p-5 border-b border-gray-200/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                {currentWorkspace === 'team' ? (
                  <>
                    <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md flex items-center justify-center">
                      <Briefcase className="h-3 w-3 text-white" />
                    </div>
                    プロジェクト
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
                      <FolderPlus className="h-3 w-3 text-white" />
                    </div>
                    カテゴリ
                  </>
                )}
              </h3>
              <Button
                onClick={() => currentWorkspace === 'team' ? setShowProjectForm(!showProjectForm) : setShowCategoryForm(!showCategoryForm)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-white/60 rounded-xl hover:shadow-md transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {showProjectForm && (
              <div className="mb-3 p-3 bg-slate-800 rounded-lg border border-slate-600">
                <form onSubmit={handleCreateProject} className="space-y-3">
                  <Input
                    placeholder="プロジェクト名"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    required
                    className="text-sm h-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  />
                  <Input
                    placeholder="説明（オプション）"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    className="text-sm h-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => setNewProjectType('personal')}
                      variant={newProjectType === 'personal' ? 'default' : 'outline'}
                      size="sm"
                      className={`flex-1 h-8 text-xs ${
                        newProjectType === 'personal' 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <User className="h-3 w-3 mr-1" />
                      個人
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setNewProjectType('team')}
                      variant={newProjectType === 'team' ? 'default' : 'outline'}
                      size="sm"
                      className={`flex-1 h-8 text-xs ${
                        newProjectType === 'team' 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <Users className="h-3 w-3 mr-1" />
                      チーム
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700">
                      <Plus className="h-3 w-3 mr-1" />
                      作成
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setShowProjectForm(false)}
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-8 text-xs border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      キャンセル
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {showCategoryForm && currentWorkspace === 'personal' && (
              <div className="mb-3 p-3 bg-slate-800 rounded-lg border border-slate-600">
                <form onSubmit={handleCreateCategory} className="space-y-3">
                  <Input
                    placeholder="カテゴリ名"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                    className="text-sm h-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  />
                  <Input
                    placeholder="説明（オプション）"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    className="text-sm h-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700">
                      <Plus className="h-3 w-3 mr-1" />
                      作成
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setShowCategoryForm(false)}
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-8 text-xs border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      キャンセル
                    </Button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-1">
              {currentWorkspace === 'team' ? (
                projects.filter(p => p.type === 'team').map((project) => (
                  <Button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    variant="ghost"
                    className={`w-full justify-start text-left h-auto p-3 rounded-lg group ${
                      selectedProject?.id === project.id 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-3 h-3 rounded-sm ${project.color} shadow-sm`} />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Users className="h-4 w-4 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{project.name}</p>
                          {project.description && (
                            <p className="text-xs text-slate-400 truncate">{project.description}</p>
                          )}
                        </div>
                      </div>
                      {selectedProject?.id === project.id && (
                        <Star className="h-3 w-3 text-green-400" />
                      )}
                    </div>
                  </Button>
                ))
              ) : (
                categories.filter(c => c.workspace_type === 'personal').map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    variant="ghost"
                    className={`w-full justify-start text-left h-auto p-3 rounded-lg group ${
                      selectedCategory?.id === category.id 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-3 h-3 rounded-sm ${category.color} shadow-sm`} />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {category.icon === 'Building2' && <Building2 className="h-4 w-4 shrink-0" />}
                        {category.icon === 'Heart' && <Heart className="h-4 w-4 shrink-0" />}
                        {category.icon === 'Star' && <Star className="h-4 w-4 shrink-0" />}
                        {category.icon === 'Coffee' && <Coffee className="h-4 w-4 shrink-0" />}
                        {category.icon === 'Car' && <Car className="h-4 w-4 shrink-0" />}
                        {category.icon === 'Gamepad2' && <Gamepad2 className="h-4 w-4 shrink-0" />}
                        {category.icon === 'ShoppingCart' && <ShoppingCart className="h-4 w-4 shrink-0" />}
                        {category.icon === 'GraduationCap' && <GraduationCap className="h-4 w-4 shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{category.name}</p>
                          {category.description && (
                            <p className="text-xs text-slate-400 truncate">{category.description}</p>
                          )}
                        </div>
                      </div>
                      {selectedCategory?.id === category.id && (
                        <Star className="h-3 w-3 text-blue-400" />
                      )}
                    </div>
                  </Button>
                ))
              )}
            </div>
          </div>

          {/* クイック統計 */}
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="h-4 w-4" />
              プロジェクト統計
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <span className="text-sm text-slate-300">未完了</span>
                </div>
                <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  {todoTasks.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-slate-300">完了</span>
                </div>
                <Badge className="bg-green-500/20 text-green-300 border border-green-500/30">
                  {completedTasks.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-300">合計</span>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {filteredTasks.length}
                </Badge>
              </div>
              
              {/* 進捗バー */}
              {filteredTasks.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">完了率</span>
                    <span className="text-xs text-slate-300 font-medium">
                      {Math.round((completedTasks.length / filteredTasks.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedTasks.length / filteredTasks.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 新規タスク作成 */}
          <div className="flex-1 p-4">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Plus className="h-4 w-4 text-green-400" />
                新しいタスク
              </h3>
              {(currentWorkspace === 'team' && selectedProject) || (currentWorkspace === 'personal' && selectedCategory) ? (
                <form onSubmit={handleCreateTask} className="space-y-3">
                  <div className="flex items-center gap-2 p-2 bg-slate-700 rounded-md">
                    {currentWorkspace === 'team' && selectedProject ? (
                      <>
                        <div className={`w-3 h-3 rounded-sm ${selectedProject.color}`} />
                        <span className="text-xs text-slate-300">{selectedProject.name}</span>
                      </>
                    ) : selectedCategory ? (
                      <>
                        <div className={`w-3 h-3 rounded-sm ${selectedCategory.color}`} />
                        <span className="text-xs text-slate-300">{selectedCategory.name}</span>
                      </>
                    ) : null}
                  </div>
                  <Input
                    placeholder="タスクのタイトル..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                    className="text-sm bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  />
                  <Input
                    placeholder="詳細説明（オプション）..."
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="text-sm bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    タスクを追加
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <FolderPlus className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">プロジェクトを選択して</p>
                  <p className="text-sm text-slate-400">タスクを作成しましょう</p>
                </div>
              )}
            </div>
          </div>

          {/* フッター */}
          <div className="p-4 border-t border-slate-700">
            <Button 
              onClick={fetchTasks} 
              variant="outline" 
              disabled={loading}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              size="sm"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin" />
                  更新中...
                </div>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  最新データを取得
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* サイドバーオーバーレイ (モバイル) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* メインコンテンツ */}
      <div className="flex-1 lg:ml-0">
        {/* トップバー */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setSidebarOpen(true)}
                variant="ghost"
                size="sm"
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentWorkspace === 'team' 
                      ? (selectedProject ? selectedProject.name : 'チームワークスペース')
                      : (selectedCategory ? selectedCategory.name : '個人ワークスペース')
                    }
                  </h2>
                  {((currentWorkspace === 'team' && selectedProject) || (currentWorkspace === 'personal' && selectedCategory)) && (
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-sm ${
                        currentWorkspace === 'team' ? selectedProject?.color : selectedCategory?.color
                      }`} />
                      {currentWorkspace === 'team' ? (
                        <Users className="h-4 w-4 text-gray-500" />
                      ) : (
                        <PersonStanding className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {currentWorkspace === 'team' 
                    ? (selectedProject?.description || 'チームプロジェクトの進捗を管理しましょう')
                    : (selectedCategory?.description || '個人タスクを効率的に管理しましょう')
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mx-4 lg:mx-6 mt-4">
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* カンバンボード */}
        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* 未完了カラム */}
            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="relative p-6 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-10 translate-x-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full blur-lg translate-y-8 -translate-x-8"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">To Do</h3>
                      <p className="text-white/80 text-sm">進行中のタスク</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                    <span className="text-white font-bold text-lg">{todoTasks.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-3 min-h-[500px] bg-gray-50">
                {loading && tasks.length === 0 ? (
                  <div className="text-center py-16">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">読み込み中...</p>
                  </div>
                ) : todoTasks.length === 0 ? (
                  <div className="text-center py-16">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">未完了のタスクはありません</p>
                    <p className="text-gray-400 text-sm mt-1">サイドバーから新しいタスクを作成してみましょう</p>
                  </div>
                ) : (
                  todoTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </div>
            </div>

            {/* 完了カラム */}
            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="relative p-6 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-10 translate-x-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full blur-lg translate-y-8 -translate-x-8"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Done</h3>
                      <p className="text-white/80 text-sm">完了したタスク</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                    <span className="text-white font-bold text-lg">{completedTasks.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-3 min-h-[500px] bg-gray-50">
                {completedTasks.length === 0 ? (
                  <div className="text-center py-16">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">完了したタスクはありません</p>
                    <p className="text-gray-400 text-sm mt-1">タスクを完了してみましょう</p>
                  </div>
                ) : (
                  completedTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* チャットパネル */}
      <ChatPanel isOpen={showChat} onClose={() => setShowChat(false)} />
      
      {/* タスクコメント */}
      <TaskComments 
        taskId={selectedTaskForComments || ''} 
        isOpen={showTaskComments} 
        onClose={() => {
          setShowTaskComments(false);
          setSelectedTaskForComments(null);
        }} 
      />
    </div>
  );
}
