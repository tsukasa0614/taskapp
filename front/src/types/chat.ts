export interface ChatMessage {
  id: string;
  message: string;
  user_name: string;
  user_avatar?: string;
  created_at: string;
}

export interface ChatMessageCreate {
  message: string;
  user_name: string;
  user_avatar?: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  comment: string;
  user_name: string;
  created_at: string;
}

export interface TaskCommentCreate {
  task_id: string;
  comment: string;
  user_name: string;
}
