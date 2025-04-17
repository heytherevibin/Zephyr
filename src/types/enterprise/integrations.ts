export interface WebhookConfig {
  endpoints: WebhookEndpoint[];
  events: WebhookEvent[];
  retryPolicy: RetryPolicy;
  authentication: WebhookAuth;
  rateLimit: RateLimit;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  timeout: number;
  enabled: boolean;
  description?: string;
}

export interface WebhookEvent {
  type: string;
  version: string;
  payload: any;
  timestamp: Date;
  signature: string;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffStrategy: 'linear' | 'exponential';
  initialDelay: number;
  maxDelay: number;
  timeoutMs: number;
}

export interface WebhookAuth {
  type: 'basic' | 'bearer' | 'oauth2' | 'apiKey';
  credentials: AuthCredentials;
  oauth2Config?: OAuth2Config;
}

export interface AuthCredentials {
  username?: string;
  password?: string;
  token?: string;
  apiKey?: string;
}

export interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  scope: string[];
  grantType: 'client_credentials' | 'authorization_code';
}

export interface RateLimit {
  requestsPerMinute: number;
  burstSize: number;
  enabled: boolean;
}

export interface SSOConfig {
  providers: {
    okta?: OktaConfig;
    azure?: AzureADConfig;
    google?: GoogleWorkspaceConfig;
  };
  jwtConfig: JWTConfig;
  sessionConfig: SessionConfig;
}

export interface OktaConfig {
  orgUrl: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
  redirectUri: string;
  userMapping: UserMapping;
}

export interface AzureADConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
  redirectUri: string;
  userMapping: UserMapping;
}

export interface GoogleWorkspaceConfig {
  clientId: string;
  clientSecret: string;
  scopes: string[];
  redirectUri: string;
  userMapping: UserMapping;
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
  algorithm: string;
  issuer: string;
  audience: string[];
}

export interface SessionConfig {
  duration: number;
  renewalThreshold: number;
  maxConcurrentSessions: number;
  enforceDeviceLimit: boolean;
}

export interface UserMapping {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  customAttributes: Record<string, string>;
}

export interface CRMIntegration {
  provider: 'salesforce' | 'dynamics' | 'zendesk';
  syncConfig: SyncConfig;
  mappings: FieldMapping[];
  webhooks: WebhookConfig[];
  authentication: CRMAuth;
}

export interface SyncConfig {
  direction: 'one-way' | 'two-way';
  frequency: 'realtime' | 'scheduled';
  schedule?: CronExpression;
  filters: SyncFilter[];
  conflictResolution: ConflictResolution;
}

export interface FieldMapping {
  source: string;
  target: string;
  transformation?: TransformationRule;
  required: boolean;
  validation?: ValidationRule[];
}

export interface SyncFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
  value: any;
}

export interface ConflictResolution {
  strategy: 'source' | 'target' | 'newest' | 'manual';
  notification: boolean;
  logging: boolean;
}

export interface CRMAuth {
  type: 'oauth2' | 'apiKey' | 'jwt';
  credentials: AuthCredentials;
  oauth2Config?: OAuth2Config;
}

export type CronExpression = string;

export interface TransformationRule {
  type: 'map' | 'combine' | 'split' | 'format' | 'custom';
  config: Record<string, any>;
}

export interface ValidationRule {
  type: 'required' | 'format' | 'range' | 'custom';
  config: Record<string, any>;
  errorMessage: string;
} 