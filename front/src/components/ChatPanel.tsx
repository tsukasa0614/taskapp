'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatMessage, ChatMessageCreate } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquare, Users, Smile } from 'lucide-react';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName] = useState('Miyamoto'); // 本来はユーザー認証から取得
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // デモデータ
  useEffect(() => {
    const demoMessages: ChatMessage[] = [
      {
        id: '1',
        message: 'おはようございます！今日のタスクについて相談したいことがあります 👋',
        user_name: 'Tanaka',
        user_avatar: '🧑‍💼',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '2',
        message: 'おはようございます！何でしょうか？',
        user_name: 'Miyamoto',
        user_avatar: '👨‍💻',
        created_at: new Date(Date.now() - 3000000).toISOString(),
      },
      {
        id: '3',
        message: '新機能の実装スケジュールを調整したいと思います。来週の金曜日まででも大丈夫でしょうか？',
        user_name: 'Tanaka',
        user_avatar: '🧑‍💼',
        created_at: new Date(Date.now() - 1800000).toISOString(),
      },
    ];
    setMessages(demoMessages);
  }, []);

  // メッセージリストの末尾にスクロール
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // メッセージ送信
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      message: newMessage.trim(),
      user_name: userName,
      user_avatar: '👨‍💻',
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col bg-white shadow-2xl">
        <CardHeader className="pb-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">チームチャット</CardTitle>
                <p className="text-white/80 text-sm">リアルタイムコミュニケーション</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                <Users className="h-4 w-4" />
                <span className="text-sm">3</span>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* メッセージエリア */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.user_name === userName ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                    {message.user_avatar || message.user_name[0]}
                  </div>
                  <div
                    className={`max-w-[70%] ${
                      message.user_name === userName ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-600">
                        {message.user_name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(message.created_at).toLocaleTimeString('ja-JP', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-2xl ${
                        message.user_name === userName
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* 入力エリア */}
          <div className="border-t bg-gray-50 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="メッセージを入力..."
                  className="pr-12 bg-white border-gray-300 focus:border-blue-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
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
