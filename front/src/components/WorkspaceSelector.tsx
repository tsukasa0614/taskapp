'use client';

import { useState } from 'react';
import { Workspace, WorkspaceCreate, Team, TeamCreate } from '@/types/workspace';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Users, 
  User, 
  Building2, 
  Home, 
  Globe, 
  Lock, 
  Share,
  Settings,
  ChevronRight,
  Star
} from 'lucide-react';

interface WorkspaceSelectorProps {
  workspaces: Workspace[];
  teams: Team[];
  currentWorkspace: Workspace | null;
  onWorkspaceSelect: (workspace: Workspace) => void;
  onCreateWorkspace: (workspace: WorkspaceCreate) => void;
  onCreateTeam: (team: TeamCreate) => void;
}

export default function WorkspaceSelector({
  workspaces,
  teams,
  currentWorkspace,
  onWorkspaceSelect,
  onCreateWorkspace,
  onCreateTeam
}: WorkspaceSelectorProps) {
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [workspaceType, setWorkspaceType] = useState<'personal' | 'team'>('personal');
  const [workspaceVisibility, setWorkspaceVisibility] = useState<'private' | 'shared'>('private');
  
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');

  const personalWorkspaces = workspaces.filter(w => w.type === 'personal');
  const teamWorkspaces = workspaces.filter(w => w.type === 'team');

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    const workspaceData: WorkspaceCreate = {
      name: newWorkspaceName.trim(),
      description: newWorkspaceDesc.trim() || undefined,
      type: workspaceType,
      visibility: workspaceType === 'personal' ? workspaceVisibility : 'shared',
      color: 'bg-blue-500',
      icon: workspaceType === 'personal' ? 'User' : 'Users',
    };

    onCreateWorkspace(workspaceData);
    setNewWorkspaceName('');
    setNewWorkspaceDesc('');
    setShowCreateWorkspace(false);
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const teamData: TeamCreate = {
      name: newTeamName.trim(),
      description: newTeamDesc.trim() || undefined,
    };

    onCreateTeam(teamData);
    setNewTeamName('');
    setNewTeamDesc('');
    setShowCreateTeam(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          ワークスペースを選択
        </h1>
        <p className="text-gray-600">
          プロジェクトを整理するワークスペースを選択するか、新しく作成してください
        </p>
      </div>

      {/* 個人ワークスペース */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">個人ワークスペース</h2>
          </div>
          <Button
            onClick={() => {
              setWorkspaceType('personal');
              setShowCreateWorkspace(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            新規作成
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personalWorkspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                currentWorkspace?.id === workspace.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => onWorkspaceSelect(workspace)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${workspace.color} rounded-lg flex items-center justify-center`}>
                    {workspace.icon === 'User' && <User className="h-5 w-5 text-white" />}
                    {workspace.icon === 'Home' && <Home className="h-5 w-5 text-white" />}
                    {workspace.icon === 'Building2' && <Building2 className="h-5 w-5 text-white" />}
                  </div>
                  <div className="flex items-center gap-1">
                    {workspace.visibility === 'private' ? (
                      <Lock className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Share className="h-4 w-4 text-green-500" />
                    )}
                    {currentWorkspace?.id === workspace.id && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{workspace.name}</h3>
                {workspace.description && (
                  <p className="text-sm text-gray-600 mb-3">{workspace.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <Badge variant={workspace.visibility === 'private' ? 'secondary' : 'default'}>
                    {workspace.visibility === 'private' ? 'プライベート' : '共有'}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* チームワークスペース */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">チームワークスペース</h2>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateTeam(true)}
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              チーム作成
            </Button>
            <Button
              onClick={() => {
                setWorkspaceType('team');
                setShowCreateWorkspace(true);
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              ワークスペース作成
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamWorkspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                currentWorkspace?.id === workspace.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => onWorkspaceSelect(workspace)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${workspace.color} rounded-lg flex items-center justify-center`}>
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-green-500" />
                    {currentWorkspace?.id === workspace.id && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{workspace.name}</h3>
                {workspace.description && (
                  <p className="text-sm text-gray-600 mb-3">{workspace.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-700">チーム</Badge>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ワークスペース作成フォーム */}
      {showCreateWorkspace && (
        <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {workspaceType === 'personal' ? <User className="h-5 w-5" /> : <Users className="h-5 w-5" />}
              {workspaceType === 'personal' ? '個人ワークスペース' : 'チームワークスペース'}を作成
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
                <Input
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="ワークスペース名を入力..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">説明（任意）</label>
                <Input
                  value={newWorkspaceDesc}
                  onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                  placeholder="説明を入力..."
                />
              </div>
              {workspaceType === 'personal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">公開設定</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="private"
                        checked={workspaceVisibility === 'private'}
                        onChange={(e) => setWorkspaceVisibility(e.target.value as 'private' | 'shared')}
                      />
                      <Lock className="h-4 w-4" />
                      プライベート
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="shared"
                        checked={workspaceVisibility === 'shared'}
                        onChange={(e) => setWorkspaceVisibility(e.target.value as 'private' | 'shared')}
                      />
                      <Share className="h-4 w-4" />
                      共有
                    </label>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  作成
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateWorkspace(false)}
                >
                  キャンセル
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* チーム作成フォーム */}
      {showCreateTeam && (
        <Card className="mb-6 border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              新しいチームを作成
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">チーム名</label>
                <Input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="チーム名を入力..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">説明（任意）</label>
                <Input
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  placeholder="説明を入力..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  チーム作成
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateTeam(false)}
                >
                  キャンセル
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
