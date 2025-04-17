import { Message, FileAttachment } from '../chat';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  preferences: Record<string, any>;
}

export interface FileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  metadata: Record<string, any>;
}

export interface DLPNotification {
  id: string;
  type: 'warning' | 'block' | 'log';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  metadata: Record<string, any>;
}

export interface TenantSecuritySettings {
  encryption: boolean;
  twoFactorAuth: boolean;
  passwordPolicy: {
    minLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
  };
  sessionTimeout: number;
  ipWhitelist: string[];
}

export interface TenantComplianceSettings {
  gdpr: boolean;
  hipaa: boolean;
  pci: boolean;
  dataRetention: {
    enabled: boolean;
    period: number;
    unit: 'days' | 'months' | 'years';
  };
  auditLogging: boolean;
}

export interface LayoutCustomization {
  theme: 'light' | 'dark' | 'custom';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  layout: 'default' | 'compact' | 'spacious';
  sidebarPosition: 'left' | 'right';
}

export interface ComponentCustomization {
  header: {
    showLogo: boolean;
    showTitle: boolean;
    showActions: boolean;
  };
  chat: {
    showAvatars: boolean;
    showTimestamps: boolean;
    showStatus: boolean;
  };
  input: {
    showAttachments: boolean;
    showEmoji: boolean;
    showFormatting: boolean;
  };
}

export interface WorkflowCustomization {
  autoResponse: boolean;
  routing: {
    type: 'round-robin' | 'skills-based' | 'load-balanced';
    rules: Record<string, any>;
  };
  escalation: {
    enabled: boolean;
    rules: Record<string, any>;
  };
}

export interface IntegrationCustomization {
  webhooks: {
    enabled: boolean;
    endpoints: string[];
  };
  api: {
    enabled: boolean;
    rateLimit: number;
  };
  sso: {
    enabled: boolean;
    providers: string[];
  };
}

export interface DashboardConfig {
  id: string;
  name: string;
  layout: {
    type: 'grid' | 'flex';
    columns: number;
  };
  widgets: {
    id: string;
    type: string;
    config: Record<string, any>;
  }[];
  refreshInterval: number;
}

export interface FilterCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between';
  value: any;
  logic: 'and' | 'or';
} 