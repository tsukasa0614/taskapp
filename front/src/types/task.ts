export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  board_id: string;
  column_id: string;
  position: number; // カラム内での順序
  assignee_id?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  board_id: string;
  column_id: string;
  assignee_id?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}
