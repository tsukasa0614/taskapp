'use client';

import { useState, useEffect } from 'react';
import { Workspace, Team } from '@/types/workspace';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Plus, 
  Settings, 
  User, 
  Users, 
  Home, 
  Building2,
  MessageSquare,
  Bell,
  Calendar,
  FileText,
  TrendingUp,
  Star,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Globe,
  Lock,
  Share,
  Zap
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  teams: Team[];
  onWorkspaceSelect: (workspace: Workspace) => void;
  onCreateWorkspace: () => void;
  onCreateTeam: () => void;
}

export default function AppLayout({
  children,
  currentWorkspace,
  workspaces,
  teams,
  onWorkspaceSelect,
  onCreateWorkspace,
  onCreateTeam
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workspaceExpanded, setWorkspaceExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // モバイル判定
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // モバイルでサイドバーが開いている時は背景をクリックで閉じる
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, sidebarOpen]);

  const personalWorkspaces = workspaces.filter(w => w.type === 'personal');
  const teamWorkspaces = workspaces.filter(w => w.type === 'team');

  const WorkspaceItem = ({ workspace }: { workspace: Workspace }) => {
    const isActive = currentWorkspace?.id === workspace.id;
    
    return (
      <button
        onClick={() => {
          onWorkspaceSelect(workspace);
          if (isMobile) setSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group ${
          isActive 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
        }`}
      >
        <div className={`w-8 h-8 ${workspace.color} rounded-lg flex items-center justify-center shrink-0 ${
          isActive ? 'shadow-lg' : 'group-hover:shadow-md'
        } transition-all duration-200`}>
          {workspace.type === 'personal' ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Users className="h-4 w-4 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-medium truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
            {workspace.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge 
              variant={isActive ? 'secondary' : 'outline'} 
              className={`text-xs ${
                isActive 
                  ? 'bg-white/20 text-white border-white/30' 
                  : 'text-gray-600'
              }`}
            >
              {workspace.type === 'personal' ? '個人' : 'チーム'}
            </Badge>
            {workspace.visibility === 'private' ? (
              <Lock className={`h-3 w-3 ${isActive ? 'text-white/70' : 'text-gray-400'}`} />
            ) : workspace.visibility === 'shared' ? (
              <Share className={`h-3 w-3 ${isActive ? 'text-white/70' : 'text-green-500'}`} />
            ) : (
              <Globe className={`h-3 w-3 ${isActive ? 'text-white/70' : 'text-blue-500'}`} />
            )}
          </div>
        </div>
        {isActive && <Star className="h-4 w-4 text-yellow-300 fill-current shrink-0" />}
      </button>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              NEXUS
            </h1>
            <p className="text-xs text-gray-500">次世代タスク管理</p>
          </div>
        </div>
        
        {/* 検索バー */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="ワークスペースを検索..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* メイン機能 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* クイックアクション */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">
            クイックアクション
          </h3>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <Calendar className="h-4 w-4 mr-3" />
              今日のタスク
              <Badge variant="destructive" className="ml-auto">3</Badge>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-green-50 hover:text-green-600"
            >
              <Star className="h-4 w-4 mr-3" />
              お気に入り
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-purple-50 hover:text-purple-600"
            >
              <TrendingUp className="h-4 w-4 mr-3" />
              アナリティクス
            </Button>
          </div>
        </div>

        {/* ワークスペース */}
        <div className="space-y-3">
          <button
            onClick={() => setWorkspaceExpanded(!workspaceExpanded)}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 hover:text-gray-700"
          >
            ワークスペース
            {workspaceExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {workspaceExpanded && (
            <div className="space-y-4">
              {/* 個人ワークスペース */}
              {personalWorkspaces.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-medium text-gray-600">個人</span>
                    <Button
                      onClick={onCreateWorkspace}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {personalWorkspaces.map((workspace) => (
                      <WorkspaceItem key={workspace.id} workspace={workspace} />
                    ))}
                  </div>
                </div>
              )}

              {/* チームワークスペース */}
              {teamWorkspaces.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-medium text-gray-600">チーム</span>
                    <Button
                      onClick={onCreateTeam}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-green-600"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {teamWorkspaces.map((workspace) => (
                      <WorkspaceItem key={workspace.id} workspace={workspace} />
                    ))}
                  </div>
                </div>
              )}

              {/* ワークスペース作成ボタン */}
              {workspaces.length === 0 && (
                <div className="space-y-2">
                  <Button
                    onClick={onCreateWorkspace}
                    variant="outline"
                    className="w-full justify-start border-dashed border-2 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    個人ワークスペース作成
                  </Button>
                  <Button
                    onClick={onCreateTeam}
                    variant="outline"
                    className="w-full justify-start border-dashed border-2 text-gray-600 hover:border-green-300 hover:text-green-600 hover:bg-green-50"
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    チーム作成
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* その他の機能 */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">
            機能
          </h3>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <MessageSquare className="h-4 w-4 mr-3" />
              チャット
              <Badge variant="destructive" className="ml-auto">2</Badge>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
            >
              <Bell className="h-4 w-4 mr-3" />
              通知
              <Badge variant="secondary" className="ml-auto">5</Badge>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-purple-50 hover:text-purple-600"
            >
              <FileText className="h-4 w-4 mr-3" />
              ファイル
            </Button>
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:bg-gray-100"
        >
          <Settings className="h-4 w-4 mr-3" />
          設定
        </Button>
        
        {/* ユーザープロフィール */}
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">M</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Miyamoto</p>
              <p className="text-xs text-gray-500 truncate">miyamoto@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* デスクトップサイドバー */}
      <div className={`hidden md:flex md:w-80 bg-white shadow-xl border-r border-gray-200 transition-all duration-300`}>
        <SidebarContent />
      </div>

      {/* モバイルサイドバーオーバーレイ */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* モバイルサイドバー */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-white shadow-xl border-r border-gray-200 z-50 transform transition-transform duration-300 md:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">メニュー</h2>
          <Button
            onClick={() => setSidebarOpen(false)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <SidebarContent />
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* モバイルヘッダー */}
        {isMobile && (
          <div className="bg-white shadow-sm border-b border-gray-200 p-4 md:hidden">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setSidebarOpen(true)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-3 w-3 text-white" />
                </div>
                <h1 className="font-bold text-gray-900">NEXUS</h1>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* 現在のワークスペース表示 */}
            {currentWorkspace && (
              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 ${currentWorkspace.color} rounded-md flex items-center justify-center`}>
                    {currentWorkspace.type === 'personal' ? (
                      <User className="h-3 w-3 text-white" />
                    ) : (
                      <Users className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {currentWorkspace.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {currentWorkspace.type === 'personal' ? '個人' : 'チーム'}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        )}

        {/* メインコンテンツエリア */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>

      {/* モバイル下部タブバー（将来的に追加可能） */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 md:hidden">
          <div className="flex items-center justify-around">
            <Button variant="ghost" size="sm" className="flex-col h-auto p-2">
              <Home className="h-4 w-4 mb-1" />
              <span className="text-xs">ホーム</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col h-auto p-2">
              <MessageSquare className="h-4 w-4 mb-1" />
              <span className="text-xs">チャット</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col h-auto p-2">
              <Calendar className="h-4 w-4 mb-1" />
              <span className="text-xs">カレンダー</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col h-auto p-2">
              <Bell className="h-4 w-4 mb-1" />
              <span className="text-xs">通知</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col h-auto p-2">
              <User className="h-4 w-4 mb-1" />
              <span className="text-xs">プロフィール</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
