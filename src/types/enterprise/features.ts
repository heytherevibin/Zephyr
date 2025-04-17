import {
  TenantSecuritySettings,
  TenantComplianceSettings,
  LayoutCustomization,
  ComponentCustomization,
  WorkflowCustomization,
  IntegrationCustomization,
  DashboardConfig,
  FilterCondition
} from './common';

export interface RBACConfig {
  roles: {
    admin: Permission[];
    moderator: Permission[];
    agent: Permission[];
    user: Permission[];
  };
  customRoles: Map<string, Permission[]>;
  roleHierarchy: RoleHierarchy;
  permissions: PermissionConfig;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  scope: PermissionScope[];
  constraints?: PermissionConstraint[];
}

export type PermissionScope = 
  | 'read'
  | 'write'
  | 'delete'
  | 'manage'
  | 'admin'
  | 'export'
  | 'share';

export interface PermissionConstraint {
  type: 'time' | 'location' | 'device' | 'ip';
  value: any;
  condition: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex';
}

export interface RoleHierarchy {
  parent?: string;
  children: string[];
  inheritedPermissions: string[];
  level: number;
}

export interface PermissionConfig {
  enforceStrictMode: boolean;
  allowPermissionDelegation: boolean;
  auditPermissionChanges: boolean;
  permissionInheritance: boolean;
}

export interface TenantConfig {
  tenantId: string;
  settings: TenantSettings;
  branding: BrandingConfig;
  customizations: CustomizationConfig;
  features: FeatureFlags;
  limits: TenantLimits;
}

export interface TenantSettings {
  name: string;
  domain: string[];
  timezone: string;
  locale: string[];
  security: TenantSecuritySettings;
  compliance: TenantComplianceSettings;
}

export interface BrandingConfig {
  logo: {
    light: string;
    dark: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  customCSS?: string;
}

export interface CustomizationConfig {
  layout: LayoutCustomization;
  components: ComponentCustomization;
  workflows: WorkflowCustomization;
  integrations: IntegrationCustomization;
}

export interface FeatureFlags {
  aiAssistant: boolean;
  multiLanguage: boolean;
  fileSharing: boolean;
  videoChat: boolean;
  customEmoji: boolean;
  threadedReplies: boolean;
}

export interface TenantLimits {
  maxUsers: number;
  maxStorage: number;
  maxBandwidth: number;
  maxIntegrations: number;
  maxCustomizations: number;
}

export interface AnalyticsConfig {
  metrics: {
    responseTime: number;
    resolutionRate: number;
    satisfactionScore: number;
    agentPerformance: AgentMetrics;
  };
  reports: ReportConfig[];
  dashboards: DashboardConfig[];
  exportFormats: ExportFormat[];
}

export interface AgentMetrics {
  averageResponseTime: number;
  resolutionRate: number;
  customerSatisfaction: number;
  activeChats: number;
  totalResolved: number;
}

export interface ReportConfig {
  id: string;
  name: string;
  type: ReportType;
  schedule: ReportSchedule;
  recipients: string[];
  format: ExportFormat;
  filters: ReportFilters;
}

export type ReportType = 
  | 'performance'
  | 'usage'
  | 'satisfaction'
  | 'compliance'
  | 'custom';

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  time: string;
  timezone: string;
  enabled: boolean;
}

export type ExportFormat = 
  | 'pdf'
  | 'csv'
  | 'excel'
  | 'json'
  | 'html';

export interface ReportFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  metrics: string[];
  dimensions: string[];
  conditions: FilterCondition[];
} 