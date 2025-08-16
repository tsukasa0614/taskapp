import { createClient } from '@supabase/supabase-js'

// Supabase設定
// 本来は環境変数で管理しますが、デモ用として直接記述
const supabaseUrl = 'YOUR_SUPABASE_URL' // 実際のSupabaseプロジェクトURLに置き換え
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY' // 実際のAnonキーに置き換え

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// データベーステーブル名
export const TABLES = {
  TASKS: 'tasks',
  PROJECTS: 'projects', 
  CATEGORIES: 'categories',
  CHAT_MESSAGES: 'chat_messages',
  TASK_COMMENTS: 'task_comments',
} as const

// Supabase型定義
export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          completed: boolean
          project_id: string | null
          category_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          completed?: boolean
          project_id?: string | null
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          completed?: boolean
          project_id?: string | null
          category_id?: string | null
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          type: string
          color: string
          icon: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: string
          color: string
          icon: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string
          color?: string
          icon?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          icon: string
          workspace_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color: string
          icon: string
          workspace_type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          icon?: string
          workspace_type?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          message: string
          user_name: string
          user_avatar: string | null
          created_at: string
        }
        Insert: {
          id?: string
          message: string
          user_name: string
          user_avatar?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          message?: string
          user_name?: string
          user_avatar?: string | null
        }
      }
      task_comments: {
        Row: {
          id: string
          task_id: string
          comment: string
          user_name: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          comment: string
          user_name: string
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          comment?: string
          user_name?: string
        }
      }
    }
  }
}
