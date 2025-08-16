// ボードの型定義
export interface Board {
  id: string;
  name: string;
  description?: string;
  workspace_id: string;
  color: string;
  icon: string;
  position: number; // ワークスペース内での順序
  created_at: string;
  updated_at: string;
}

export interface BoardCreate {
  name: string;
  description?: string;
  workspace_id: string;
  color: string;
  icon: string;
  position?: number;
}

// カラムの型定義（ボード内のTo Do, In Progress, Done等）
export interface BoardColumn {
  id: string;
  board_id: string;
  name: string;
  position: number;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface BoardColumnCreate {
  board_id: string;
  name: string;
  position?: number;
  color: string;
}
