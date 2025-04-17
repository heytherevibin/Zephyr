import { Message } from '../chat';
import { DLPNotification } from './common';

export interface EncryptedMessage extends Message {
  encryptionKey: string;
  encryptionVersion: string;
  signature: string;
  encryptedContent: string;
  metadata: {
    encryptionTimestamp: Date;
    encryptedBy: string;
    algorithm: string;
  };
}

export interface AuditLog {
  id: string;
  eventType: AuditEventType;
  userId: string;
  timestamp: Date;
  metadata: Record<string, any>;
  ipAddress: string;
  deviceInfo: DeviceInfo;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failure' | 'warning';
}

export type AuditEventType = 
  | 'message_sent'
  | 'message_read'
  | 'file_upload'
  | 'file_download'
  | 'export'
  | 'delete'
  | 'login'
  | 'logout'
  | 'settings_change'
  | 'permission_change';

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  browser: string;
  version: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface RetentionPolicy {
  messageRetentionDays: number;
  fileRetentionDays: number;
  archiveEnabled: boolean;
  archiveLocation?: string;
  autoDelete: boolean;
}

export interface ComplianceConfig {
  gdpr: boolean;
  hipaa: boolean;
  pci: boolean;
  soc2: boolean;
  customPolicies: {
    name: string;
    description: string;
    enabled: boolean;
  }[];
}

export interface DLPRule {
  id: string;
  name: string;
  pattern: RegExp | string;
  action: 'block' | 'warn' | 'log' | 'mask';
  severity: 'low' | 'medium' | 'high';
  enabled: boolean;
  notifications: DLPNotification[];
}

export interface DataClassification {
  public: string[];
  internal: string[];
  confidential: string[];
  restricted: string[];
}

export interface PIIHandlingConfig {
  maskingEnabled: boolean;
  encryptionRequired: boolean;
  allowedDataTypes: string[];
  restrictedDataTypes: string[];
  maskingPatterns: Record<string, RegExp>;
}

export interface EncryptionConfig {
  enabled: boolean;
  algorithm: string;
  keyRotationDays: number;
  atRestEncryption: boolean;
  transitEncryption: boolean;
}

export interface SecurityConfig {
  encryption: EncryptionConfig;
  compliance: ComplianceConfig;
  retention: RetentionPolicy;
  audit: {
    enabled: boolean;
    detailedLogs: boolean;
    retentionDays: number;
  };
} 