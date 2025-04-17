export interface HealthCheck {
  services: ServiceHealth[];
  metrics: PerformanceMetrics;
  alerts: AlertConfig[];
  logs: LoggingConfig;
  status: SystemStatus;
}

export interface ServiceHealth {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: Date;
  uptime: number;
  responseTime: number;
  dependencies: string[];
}

export interface PerformanceMetrics {
  cpu: {
    usage: number;
    temperature: number;
    processes: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    cached: number;
  };
  network: {
    bandwidth: number;
    latency: number;
    packetLoss: number;
  };
  storage: {
    total: number;
    used: number;
    free: number;
    iops: number;
  };
}

export interface AlertConfig {
  id: string;
  name: string;
  condition: AlertCondition;
  threshold: number;
  severity: 'info' | 'warning' | 'error' | 'critical';
  notification: NotificationConfig;
  enabled: boolean;
}

export interface AlertCondition {
  metric: string;
  operator: '>' | '<' | '==' | '>=' | '<=';
  value: number;
  duration: number;
  frequency: number;
}

export interface NotificationConfig {
  channels: NotificationChannel[];
  template: string;
  throttling: {
    enabled: boolean;
    maxNotifications: number;
    timeWindow: number;
  };
}

export interface NotificationChannel {
  type: 'email' | 'slack' | 'webhook' | 'sms';
  config: Record<string, any>;
  enabled: boolean;
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  retention: number;
  format: LogFormat;
  destinations: LogDestination[];
}

export interface LogFormat {
  timestamp: boolean;
  level: boolean;
  service: boolean;
  correlation: boolean;
  custom: Record<string, boolean>;
}

export interface LogDestination {
  type: 'file' | 'elasticsearch' | 'cloudwatch' | 'stackdriver';
  config: Record<string, any>;
  enabled: boolean;
}

export interface SystemStatus {
  overall: 'operational' | 'degraded' | 'down';
  components: Record<string, ComponentStatus>;
  lastUpdated: Date;
  incidents: Incident[];
}

export interface ComponentStatus {
  status: 'operational' | 'degraded' | 'down';
  lastIncident?: Date;
  metrics: Record<string, number>;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  startTime: Date;
  endTime?: Date;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  timestamp: Date;
  status: string;
  message: string;
  author: string;
}

export interface ErrorHandling {
  fallbackStrategies: FallbackStrategy[];
  errorBoundaries: ErrorBoundaryConfig[];
  recoveryProcedures: RecoveryProcedure[];
  errorReporting: ErrorReportingConfig;
}

export interface FallbackStrategy {
  id: string;
  condition: string;
  action: 'retry' | 'circuit-break' | 'fallback' | 'ignore';
  config: Record<string, any>;
}

export interface ErrorBoundaryConfig {
  name: string;
  scope: string;
  fallback: React.ComponentType<any>;
  onError: (error: Error, info: React.ErrorInfo) => void;
}

export interface RecoveryProcedure {
  id: string;
  trigger: 'manual' | 'automatic';
  steps: RecoveryStep[];
  rollback: RollbackStep[];
}

export interface RecoveryStep {
  id: string;
  action: string;
  timeout: number;
  retries: number;
  validation: () => boolean;
}

export interface RollbackStep {
  id: string;
  action: string;
  condition: string;
}

export interface ErrorReportingConfig {
  service: 'sentry' | 'rollbar' | 'bugsnag' | 'custom';
  config: Record<string, any>;
  filters: ErrorFilter[];
  grouping: ErrorGrouping;
}

export interface ErrorFilter {
  type: string;
  pattern: string | RegExp;
  action: 'ignore' | 'transform' | 'escalate';
}

export interface ErrorGrouping {
  rules: GroupingRule[];
  fingerprinting: boolean;
  similarity: number;
}

export interface GroupingRule {
  name: string;
  condition: string;
  stackTraceConfig: StackTraceConfig;
}

export interface StackTraceConfig {
  includeModules: string[];
  excludeModules: string[];
  maxFrames: number;
} 