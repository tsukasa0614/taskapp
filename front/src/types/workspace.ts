// ワークスペースの型定義
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  type: 'personal' | 'team';
  visibility: 'private' | 'shared'; // 個人ワークスペース用
  owner_id: string;
  shared_with?: string[]; // 共有先ユーザーID配列
  team_id?: string; // チームワークスペース用
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceCreate {
  name: string;
  description?: string;
  type: 'personal' | 'team';
  visibility?: 'private' | 'shared';
  shared_with?: string[];
  team_id?: string;
  color: string;
  icon: string;
}

// チームの型定義
export interface Team {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  user_id: string;
  user_name: string;
  user_email: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

export interface TeamCreate {
  name: string;
  description?: string;
  members?: Omit<TeamMember, 'joined_at'>[];
}
