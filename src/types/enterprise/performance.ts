import { Message } from '../chat';
import { UserProfile, FileMetadata } from './common';

export interface MessageQueue {
  priority: 'high' | 'normal' | 'low';
  retryAttempts: number;
  maxRetries: number;
  deliveryStatus: QueueDeliveryStatus;
  offlineQueue: Message[];
  queueConfig: {
    maxSize: number;
    timeoutMs: number;
    batchSize: number;
    processingStrategy: 'fifo' | 'lifo' | 'priority';
  };
  metrics: QueueMetrics;
  maxSize: number;
  processingInterval: number;
  retryDelay: number;
}

export type QueueDeliveryStatus = 
  | 'pending'
  | 'processing'
  | 'sent'
  | 'failed'
  | 'retrying'
  | 'throttled';

export interface QueueMetrics {
  totalMessages: number;
  processedMessages: number;
  failedMessages: number;
  averageProcessingTime: number;
  queueLength: number;
  throughput: number;
}

export interface PaginationConfig {
  defaultPageSize: number;
  maxPageSize: number;
  enableCursor: boolean;
}

export interface FilterCriteria {
  dateRange?: {
    start: Date;
    end: Date;
  };
  messageTypes?: string[];
  senders?: string[];
  keywords?: string[];
  status?: string[];
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  strategy: 'lru' | 'fifo' | 'lfu';
}

export interface CachedMessage extends Message {
  cachedAt: Date;
  expiresAt: Date;
  hitCount: number;
  size: number;
}

export interface CachedUser {
  id: string;
  profile: UserProfile;
  cachedAt: Date;
  expiresAt: Date;
  hitCount: number;
}

export interface CachedFile {
  id: string;
  metadata: FileMetadata;
  cachedAt: Date;
  expiresAt: Date;
  hitCount: number;
  size: number;
}

export interface CacheStrategy {
  type: 'memory' | 'localStorage' | 'indexedDB';
  compression: boolean;
  encryption: boolean;
  maxAge: number;
  maxEntries: number;
}

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  concurrentUsers: number;
  messageLatency: number;
  resourceUtilization: {
    cpu: number;
    memory: number;
    storage: number;
  };
}

export interface LoadBalancingConfig {
  enabled: boolean;
  algorithm: 'round-robin' | 'least-connections' | 'ip-hash';
  maxConnections: number;
  healthCheck: {
    interval: number;
    timeout: number;
    unhealthyThreshold: number;
  };
}

export interface PerformanceConfig {
  cache: CacheConfig;
  pagination: PaginationConfig;
  queue: MessageQueue;
  metrics: PerformanceMetrics;
  loadBalancing: LoadBalancingConfig;
  optimizations: {
    compression: boolean;
    minification: boolean;
    lazyLoading: boolean;
  };
} 