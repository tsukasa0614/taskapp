export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  workspace_type: 'personal' | 'team';
  created_at: string;
  updated_at: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
  color: string;
  icon: string;
  workspace_type: 'personal' | 'team';
}
