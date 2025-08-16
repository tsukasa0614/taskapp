'use client';

import { useState } from 'react';
import { Board, BoardCreate, BoardColumn } from '@/types/board';
import { Workspace } from '@/types/workspace';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Users,
  User,
  ArrowLeft,
  Grid3X3,
  Kanban,
  Settings,
  Star,
  Clock,
  Target,
  Zap,
  Briefcase,
  Home,
  Folder,
  Layers
} from 'lucide-react';

interface BoardManagerProps {
  workspace: Workspace;
  boards: Board[];
  onCreateBoard: (board: BoardCreate) => void;
  onUpdateBoard: (id: string, board: Partial<Board>) => void;
  onDeleteBoard: (id: string) => void;
  onOpenBoard: (board: Board) => void;
  onBackToWorkspaces: () => void;
}

const boardIcons = [
  { name: 'Kanban', icon: Kanban, color: 'bg-blue-500' },
  { name: 'Target', icon: Target, color: 'bg-green-500' },
  { name: 'Zap', icon: Zap, color: 'bg-yellow-500' },
  { name: 'Briefcase', icon: Briefcase, color: 'bg-purple-500' },
  { name: 'Home', icon: Home, color: 'bg-pink-500' },
  { name: 'Folder', icon: Folder, color: 'bg-indigo-500' },
  { name: 'Layers', icon: Layers, color: 'bg-teal-500' },
  { name: 'Grid3X3', icon: Grid3X3, color: 'bg-orange-500' },
];

export default function BoardManager({
  workspace,
  boards,
  onCreateBoard,
  onUpdateBoard,
  onDeleteBoard,
  onOpenBoard,
  onBackToWorkspaces
}: BoardManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(boardIcons[0]);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    const boardData: BoardCreate = {
      name: newBoardName.trim(),
      description: newBoardDesc.trim() || undefined,
      workspace_id: workspace.id,
      color: selectedIcon.color,
      icon: selectedIcon.name,
      position: boards.length,
    };

    onCreateBoard(boardData);
    setNewBoardName('');
    setNewBoardDesc('');
    setSelectedIcon(boardIcons[0]);
    setShowCreateForm(false);
  };

  const handleUpdateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBoard || !newBoardName.trim()) return;

    onUpdateBoard(editingBoard.id, {
      name: newBoardName.trim(),
      description: newBoardDesc.trim() || undefined,
      color: selectedIcon.color,
      icon: selectedIcon.name,
    });

    setEditingBoard(null);
    setNewBoardName('');
    setNewBoardDesc('');
    setSelectedIcon(boardIcons[0]);
  };

  const startEdit = (board: Board) => {
    setEditingBoard(board);
    setNewBoardName(board.name);
    setNewBoardDesc(board.description || '');
    const icon = boardIcons.find(i => i.name === board.icon) || boardIcons[0];
    setSelectedIcon(icon);
  };

  const cancelEdit = () => {
    setEditingBoard(null);
    setNewBoardName('');
    setNewBoardDesc('');
    setSelectedIcon(boardIcons[0]);
  };

  const IconComponent = ({ iconName, className }: { iconName: string; className?: string }) => {
    const iconData = boardIcons.find(i => i.name === iconName);
    if (!iconData) return <Kanban className={className} />;
    const Icon = iconData.icon;
    return <Icon className={className} />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={onBackToWorkspaces}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            ワークスペース一覧に戻る
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${workspace.color} rounded-xl flex items-center justify-center shadow-lg`}>
              {workspace.type === 'personal' ? (
                <User className="h-6 w-6 text-white" />
              ) : (
                <Users className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{workspace.name}</h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                {workspace.description || 'ボードを作成してプロジェクトを整理しましょう'}
                <Badge variant={workspace.type === 'personal' ? 'secondary' : 'default'}>
                  {workspace.type === 'personal' ? '個人' : 'チーム'}
                </Badge>
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            新しいボード
          </Button>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Kanban className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">総ボード数</p>
                <p className="text-2xl font-bold text-blue-900">{boards.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">アクティブ</p>
                <p className="text-2xl font-bold text-green-900">{boards.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">共同作業者</p>
                <p className="text-2xl font-bold text-purple-900">
                  {workspace.type === 'team' ? '3+' : '1'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-600 font-medium">最近の更新</p>
                <p className="text-2xl font-bold text-orange-900">今日</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ボード作成フォーム */}
      {(showCreateForm || editingBoard) && (
        <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {editingBoard ? 'ボードを編集' : '新しいボードを作成'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingBoard ? handleUpdateBoard : handleCreateBoard} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ボード名</label>
                  <Input
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="プロジェクト名を入力..."
                    required
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">説明（任意）</label>
                  <Input
                    value={newBoardDesc}
                    onChange={(e) => setNewBoardDesc(e.target.value)}
                    placeholder="プロジェクトの説明..."
                    className="bg-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">アイコンとカラー</label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {boardIcons.map((iconData) => {
                    const Icon = iconData.icon;
                    return (
                      <button
                        key={iconData.name}
                        type="button"
                        onClick={() => setSelectedIcon(iconData)}
                        className={`w-12 h-12 ${iconData.color} rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                          selectedIcon.name === iconData.name
                            ? 'ring-4 ring-blue-300 scale-110'
                            : 'hover:shadow-lg'
                        }`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  {editingBoard ? '更新' : '作成'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    if (editingBoard) {
                      cancelEdit();
                    } else {
                      setShowCreateForm(false);
                    }
                  }}
                  className="px-8"
                >
                  キャンセル
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ボード一覧 */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">ボード一覧</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-gray-600">
              {boards.length} 個のボード
            </Badge>
          </div>
        </div>

        {boards.length === 0 ? (
          <Card className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent>
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Kanban className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">まだボードがありません</h3>
              <p className="text-gray-500 mb-6">最初のボードを作成してプロジェクトを始めましょう</p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                最初のボードを作成
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <Card
                key={board.id}
                className="group cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 border-2 hover:border-blue-300 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${board.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200`}>
                      <IconComponent iconName={board.icon} className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(board);
                        }}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBoard(board.id);
                        }}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {board.name}
                    </h3>
                    {board.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {board.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(board.created_at).toLocaleDateString('ja-JP')}</span>
                    </div>
                    <Button
                      onClick={() => onOpenBoard(board)}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      開く
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
