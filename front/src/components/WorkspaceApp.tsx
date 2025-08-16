'use client';

import { useState, useEffect } from 'react';
import { Workspace, WorkspaceCreate, Team, TeamCreate } from '@/types/workspace';
import { Board, BoardCreate, BoardColumn } from '@/types/board';
import { Task, TaskCreate } from '@/types/task';
import AppLayout from './AppLayout';
import WorkspaceSelector from './WorkspaceSelector';
import BoardManager from './BoardManager';
import KanbanBoard from './KanbanBoard';

type ViewMode = 'workspaces' | 'boards' | 'kanban';

export default function WorkspaceApp() {
  const [currentView, setCurrentView] = useState<ViewMode>('boards');
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [showWorkspaceSelector, setShowWorkspaceSelector] = useState(false);
  const [showCreateWorkspaceForm, setShowCreateWorkspaceForm] = useState(false);
  const [showCreateTeamForm, setShowCreateTeamForm] = useState(false);

  // データ管理
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // デモデータの初期化
  useEffect(() => {
    initializeDemoData();
  }, []);

  const initializeDemoData = () => {
    // デモワークスペース
    const demoWorkspaces: Workspace[] = [
      {
        id: 'ws-1',
        name: 'マイプロジェクト',
        description: '個人的なタスクと目標を管理',
        type: 'personal',
        visibility: 'private',
        owner_id: 'user-1',
        color: 'bg-blue-500',
        icon: 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'ws-2',
        name: '開発チーム',
        description: 'ウェブアプリケーション開発プロジェクト',
        type: 'team',
        visibility: 'shared',
        owner_id: 'user-1',
        team_id: 'team-1',
        color: 'bg-green-500',
        icon: 'Users',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // デモチーム
    const demoTeams: Team[] = [
      {
        id: 'team-1',
        name: '開発チーム',
        description: 'NEXUSアプリケーション開発チーム',
        members: [
          {
            user_id: 'user-1',
            user_name: 'Miyamoto',
            user_email: 'miyamoto@example.com',
            role: 'owner',
            joined_at: new Date().toISOString(),
          },
          {
            user_id: 'user-2',
            user_name: 'Tanaka',
            user_email: 'tanaka@example.com',
            role: 'member',
            joined_at: new Date().toISOString(),
          },
        ],
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // デモボード
    const demoBoards: Board[] = [
      {
        id: 'board-1',
        name: 'ウェブサイト制作',
        description: 'コーポレートサイトのリニューアルプロジェクト',
        workspace_id: 'ws-1',
        color: 'bg-purple-500',
        icon: 'Target',
        position: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'board-2',
        name: 'NEXUS開発',
        description: 'タスク管理アプリケーションの開発',
        workspace_id: 'ws-2',
        color: 'bg-blue-600',
        icon: 'Zap',
        position: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // デモカラム
    const demoColumns: BoardColumn[] = [
      {
        id: 'col-1',
        board_id: 'board-1',
        name: 'To Do',
        position: 0,
        color: 'bg-gray-500',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'col-2',
        board_id: 'board-1',
        name: 'In Progress',
        position: 1,
        color: 'bg-blue-500',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'col-3',
        board_id: 'board-1',
        name: 'Done',
        position: 2,
        color: 'bg-green-500',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // デモタスク
    const demoTasks: Task[] = [
      {
        id: 'task-1',
        title: 'デザインシステムの構築',
        description: 'ブランドカラーとコンポーネントライブラリを作成',
        status: 'todo',
        board_id: 'board-1',
        column_id: 'col-1',
        position: 0,
        priority: 'high',
        tags: ['デザイン', '優先度高'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'task-2',
        title: 'レスポンシブ対応',
        description: 'モバイルとタブレット表示の最適化',
        status: 'in_progress',
        board_id: 'board-1',
        column_id: 'col-2',
        position: 0,
        priority: 'medium',
        tags: ['フロントエンド'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    setWorkspaces(demoWorkspaces);
    setTeams(demoTeams);
    setBoards(demoBoards);
    setColumns(demoColumns);
    setTasks(demoTasks);
    
    // 最初のワークスペースを自動選択
    if (demoWorkspaces.length > 0) {
      setCurrentWorkspace(demoWorkspaces[0]);
    }
  };

  // ワークスペース操作
  const handleCreateWorkspace = (workspaceData: WorkspaceCreate) => {
    const newWorkspace: Workspace = {
      id: `ws-${Date.now()}`,
      ...workspaceData,
      owner_id: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setWorkspaces(prev => [...prev, newWorkspace]);
  };

  const handleCreateTeam = (teamData: TeamCreate) => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      ...teamData,
      members: [
        {
          user_id: 'user-1',
          user_name: 'Miyamoto',
          user_email: 'miyamoto@example.com',
          role: 'owner',
          joined_at: new Date().toISOString(),
        },
        ...(teamData.members || [])
      ],
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTeams(prev => [...prev, newTeam]);
  };

  const handleWorkspaceSelect = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    setCurrentView('boards');
    setCurrentBoard(null); // ボードをリセット
  };

  // ボード操作
  const handleCreateBoard = (boardData: BoardCreate) => {
    const newBoard: Board = {
      id: `board-${Date.now()}`,
      ...boardData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setBoards(prev => [...prev, newBoard]);

    // デフォルトカラムを作成
    const defaultColumns = [
      { name: 'To Do', color: 'bg-gray-500' },
      { name: 'In Progress', color: 'bg-blue-500' },
      { name: 'Done', color: 'bg-green-500' },
    ];

    const newColumns = defaultColumns.map((col, index) => ({
      id: `col-${Date.now()}-${index}`,
      board_id: newBoard.id,
      name: col.name,
      position: index,
      color: col.color,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    setColumns(prev => [...prev, ...newColumns]);
  };

  const handleUpdateBoard = (id: string, updates: Partial<Board>) => {
    setBoards(prev => prev.map(board => 
      board.id === id ? { ...board, ...updates, updated_at: new Date().toISOString() } : board
    ));
  };

  const handleDeleteBoard = (id: string) => {
    setBoards(prev => prev.filter(board => board.id !== id));
    setColumns(prev => prev.filter(column => column.board_id !== id));
    setTasks(prev => prev.filter(task => task.board_id !== id));
  };

  const handleOpenBoard = (board: Board) => {
    setCurrentBoard(board);
    setCurrentView('kanban');
  };

  // タスク操作
  const handleCreateTask = (taskData: TaskCreate) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...taskData,
      status: 'todo',
      position: 0,
      tags: taskData.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates, updated_at: new Date().toISOString() } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // カラム操作
  const handleCreateColumn = (columnData: { board_id: string; name: string; color: string }) => {
    const newColumn: BoardColumn = {
      id: `col-${Date.now()}`,
      ...columnData,
      position: columns.filter(col => col.board_id === columnData.board_id).length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setColumns(prev => [...prev, newColumn]);
  };

  // ナビゲーション
  const handleBackToWorkspaces = () => {
    setCurrentView('workspaces');
    setCurrentWorkspace(null);
  };

  const handleBackToBoards = () => {
    setCurrentView('boards');
    setCurrentBoard(null);
  };

  // サイドバー用ハンドラー
  const handleCreateWorkspaceFromSidebar = () => {
    setShowCreateWorkspaceForm(true);
  };

  const handleCreateTeamFromSidebar = () => {
    setShowCreateTeamForm(true);
  };

  // フィルタリング
  const currentWorkspaceBoards = currentWorkspace 
    ? boards.filter(board => board.workspace_id === currentWorkspace.id)
    : [];

  const currentBoardColumns = currentBoard
    ? columns.filter(column => column.board_id === currentBoard.id)
    : [];

  const currentBoardTasks = currentBoard
    ? tasks.filter(task => task.board_id === currentBoard.id)
    : [];

  // メインコンテンツのレンダリング
  const renderMainContent = () => {
    if (currentView === 'workspaces' || !currentWorkspace) {
      return (
        <WorkspaceSelector
          workspaces={workspaces}
          teams={teams}
          currentWorkspace={currentWorkspace}
          onWorkspaceSelect={handleWorkspaceSelect}
          onCreateWorkspace={handleCreateWorkspace}
          onCreateTeam={handleCreateTeam}
        />
      );
    }

    if (currentView === 'boards' && currentWorkspace) {
      return (
        <BoardManager
          workspace={currentWorkspace}
          boards={currentWorkspaceBoards}
          onCreateBoard={handleCreateBoard}
          onUpdateBoard={handleUpdateBoard}
          onDeleteBoard={handleDeleteBoard}
          onOpenBoard={handleOpenBoard}
          onBackToWorkspaces={handleBackToWorkspaces}
        />
      );
    }

    if (currentView === 'kanban' && currentWorkspace && currentBoard) {
      return (
        <KanbanBoard
          workspace={currentWorkspace}
          board={currentBoard}
          columns={currentBoardColumns}
          tasks={currentBoardTasks}
          onCreateTask={handleCreateTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onCreateColumn={handleCreateColumn}
          onBackToBoards={handleBackToBoards}
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">ワークスペースを選択してください</h2>
          <p className="text-gray-600">左のサイドバーからワークスペースを選択するか、新しく作成してください。</p>
        </div>
      </div>
    );
  };

  return (
    <AppLayout
      currentWorkspace={currentWorkspace}
      workspaces={workspaces}
      teams={teams}
      onWorkspaceSelect={handleWorkspaceSelect}
      onCreateWorkspace={handleCreateWorkspaceFromSidebar}
      onCreateTeam={handleCreateTeamFromSidebar}
    >
      {renderMainContent()}

      {/* ワークスペース作成フォーム モーダル */}
      {showCreateWorkspaceForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <WorkspaceSelector
              workspaces={[]}
              teams={[]}
              currentWorkspace={null}
              onWorkspaceSelect={() => {}}
              onCreateWorkspace={(data) => {
                handleCreateWorkspace(data);
                setShowCreateWorkspaceForm(false);
              }}
              onCreateTeam={() => {}}
            />
          </div>
        </div>
      )}

      {/* チーム作成フォーム モーダル */}
      {showCreateTeamForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <WorkspaceSelector
              workspaces={[]}
              teams={[]}
              currentWorkspace={null}
              onWorkspaceSelect={() => {}}
              onCreateWorkspace={() => {}}
              onCreateTeam={(data) => {
                handleCreateTeam(data);
                setShowCreateTeamForm(false);
              }}
            />
          </div>
        </div>
      )}
    </AppLayout>
  );
}
