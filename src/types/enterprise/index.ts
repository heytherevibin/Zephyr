import { PerformanceMetrics } from './performance';
import { ComplianceConfig, RetentionPolicy } from './security';
import { CacheConfig, PaginationConfig, MessageQueue } from './performance';
import { RBACConfig, AnalyticsConfig, TenantConfig } from './features';
import { WebhookConfig, SSOConfig, CRMIntegration } from './integrations';
import { HealthCheck, ErrorHandling, LoggingConfig, SystemStatus } from './monitoring';
import { AuditLog } from './security';

// Export all types except those with naming conflicts
export * from './security';
export type { CacheConfig, PaginationConfig, MessageQueue } from './performance';
export * from './features';
export * from './integrations';
export * from './monitoring';
export * from './common';

export interface EnterpriseConfig {
  security: {
    encryption: boolean;
    audit: boolean;
    compliance: ComplianceConfig;
    retention: RetentionPolicy;
  };
  performance: {
    caching: CacheConfig;
    pagination: PaginationConfig;
    queueing: MessageQueue;
  };
  features: {
    rbac: RBACConfig;
    analytics: AnalyticsConfig;
    tenant: TenantConfig;
  };
  integrations: {
    webhooks: WebhookConfig;
    sso: SSOConfig;
    crm: CRMIntegration;
  };
  monitoring: {
    health: HealthCheck;
    errorHandling: ErrorHandling;
    logging: LoggingConfig;
  };
}

// Enhanced ChatWidget with enterprise features
export interface EnterpriseWidgetProps {
  config: EnterpriseConfig;
  onError?: (error: Error) => void;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  onAuditEvent?: (event: AuditLog) => void;
  onHealthUpdate?: (status: SystemStatus) => void;
} 