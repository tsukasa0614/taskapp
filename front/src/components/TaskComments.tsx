'use client';

import { useState, useEffect } from 'react';
import { TaskComment, TaskCommentCreate } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, User } from 'lucide-react';

interface TaskCommentsProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskComments({ taskId, isOpen, onClose }: TaskCommentsProps) {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userName] = useState('Miyamoto'); // 本来はユーザー認証から取得

  // デモコメントデータ
  useEffect(() => {
    if (taskId) {
      const demoComments: TaskComment[] = [
        {
          id: '1',
          task_id: taskId,
          comment: 'このタスクの進捗はいかがですか？何かサポートが必要でしたらお知らせください。',
          user_name: 'Tanaka',
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: '2',
          task_id: taskId,
          comment: 'ありがとうございます！順調に進んでいます。明日までには完了予定です 👍',
          user_name: 'Miyamoto',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      setComments(demoComments);
    }
  }, [taskId]);

  // コメント送信
  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: TaskComment = {
      id: `comment-${Date.now()}`,
      task_id: taskId,
      comment: newComment.trim(),
      user_name: userName,
      created_at: new Date().toISOString(),
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg h-[500px] flex flex-col bg-white shadow-2xl">
        <div className="p-4 border-b bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold">タスクコメント</h3>
                <p className="text-white/80 text-sm">{comments.length}件のコメント</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              ✕
            </Button>
          </div>
        </div>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* コメントリスト */}
          <ScrollArea className="flex-1 p-4">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">まだコメントがありません</p>
                <p className="text-gray-400 text-sm">最初のコメントを追加してみましょう</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                      {comment.user_name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {comment.user_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleString('ja-JP', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border">
                        <p className="text-sm text-gray-800 leading-relaxed">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* コメント入力 */}
          <div className="border-t bg-gray-50 p-4">
            <form onSubmit={handleSendComment} className="flex gap-3">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="コメントを入力..."
                className="flex-1 bg-white border-gray-300 focus:border-emerald-500"
              />
              <Button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
