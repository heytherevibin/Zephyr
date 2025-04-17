import { apiService } from './api';
import { Message, MessageThread, FileAttachment } from '../types';

export interface SendMessageData {
  text: string;
  threadId?: string;
  attachments?: File[];
}

export interface CreateThreadData {
  title: string;
  participants: string[];
}

export class ChatService {
  private static instance: ChatService;
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];
  private typingHandlers: ((userId: string, isTyping: boolean) => void)[] = [];

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  public async sendMessage(data: SendMessageData): Promise<Message> {
    const formData = new FormData();
    formData.append('text', data.text);
    
    if (data.threadId) {
      formData.append('threadId', data.threadId);
    }
    
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await apiService.post<Message>('/chat/messages', formData);
    return response.data;
  }

  public async getThreads(): Promise<MessageThread[]> {
    const response = await apiService.get<MessageThread[]>('/chat/threads');
    return response.data;
  }

  public async getThread(threadId: string): Promise<MessageThread> {
    const response = await apiService.get<MessageThread>(`/chat/threads/${threadId}`);
    return response.data;
  }

  public async createThread(data: CreateThreadData): Promise<MessageThread> {
    const response = await apiService.post<MessageThread>('/chat/threads', data);
    return response.data;
  }

  public async uploadAttachment(file: File): Promise<FileAttachment> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiService.post<FileAttachment>('/chat/attachments', formData);
    return response.data;
  }

  public connect(): void {
    if (this.ws) {
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.example.com/ws';
    this.ws = new WebSocket(wsUrl);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'message') {
        this.messageHandlers.forEach((handler) => handler(data.message));
      } else if (data.type === 'typing') {
        this.typingHandlers.forEach((handler) => handler(data.userId, data.isTyping));
      }
    };

    this.ws.onclose = () => {
      this.ws = null;
      // Attempt to reconnect after a delay
      setTimeout(() => this.connect(), 5000);
    };
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public onMessage(handler: (message: Message) => void): void {
    this.messageHandlers.push(handler);
  }

  public onTyping(handler: (userId: string, isTyping: boolean) => void): void {
    this.typingHandlers.push(handler);
  }

  public sendTypingStatus(threadId: string, isTyping: boolean): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'typing',
          threadId,
          isTyping,
        })
      );
    }
  }
}

export const chatService = ChatService.getInstance(); 