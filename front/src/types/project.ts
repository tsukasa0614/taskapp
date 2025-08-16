export interface Project {
  id: string;
  name: string;
  description?: string;
  type: 'personal' | 'team';
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  type: 'personal' | 'team';
  color: string;
  icon: string;
}
