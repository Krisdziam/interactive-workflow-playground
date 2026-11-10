export const locales = ["en", "uk"] as const;
export type Locale = (typeof locales)[number];

export const topics = [
  "ai_automation",
  "api_integrations",
  "workflow_optimization",
] as const;
export type Topic = (typeof topics)[number];

export type Attempt = 1 | 2 | 3 | 4;
export type OverallStatus = "success" | "partial_success" | "failed";
export type AttemptStatus = "available" | "unavailable";

export const workflowStages = [
  "webhook",
  "session_lookup",
  "ai",
  "telegram",
  "sheets",
  "workflow",
] as const;
export type WorkflowStage = (typeof workflowStages)[number];

export type StageStatus =
  "waiting" | "processing" | "success" | "fallback" | "error" | "skipped";

export type AiStatus = "success" | "fallback" | "error";
export type TelegramStatus = "success" | "error" | "skipped";
export type SheetsStatus = "success" | "error";

export interface ExecuteWorkflowRequest {
  name: string;
  company: string;
  topic: Topic;
  locale: Locale;
  session_id: string;
  run_id: string;
}

export interface WorkflowEvent {
  stage: WorkflowStage;
  status: StageStatus;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  message_key: string;
}

export interface WorkflowErrorItem {
  stage: WorkflowStage;
  code: string;
}

export interface WorkflowSuccessResponse {
  schema_version: "1.1";
  run_id: string;
  session_id: string;
  overall_status: "success" | "partial_success";
  locale: Locale;
  topic: Topic;
  attempt: Attempt | null;
  attempt_status: AttemptStatus;
  result: {
    text: string;
    ai_status: AiStatus;
  };
  integrations: {
    telegram: {
      status: TelegramStatus;
      message_id?: number;
    };
    sheets: {
      status: SheetsStatus;
    };
  };
  timings: {
    processing_time_ms: number;
    total_time_ms: number;
  };
  events: WorkflowEvent[];
  errors: WorkflowErrorItem[];
  idempotent_replay: boolean;
}

export const publicErrorCodes = [
  "VALIDATION_ERROR",
  "WORKFLOW_TIMEOUT",
  "WORKFLOW_UNAVAILABLE",
  "RUN_ALREADY_PROCESSING",
  "RUN_STATE_UNKNOWN",
  "SESSION_LIMIT_REACHED",
  "RATE_LIMITED",
] as const;
export type PublicErrorCode = (typeof publicErrorCodes)[number];

export interface WorkflowErrorResponse {
  schema_version: "1.1";
  overall_status: "failed";
  code: PublicErrorCode;
  message_key: string;
  details?: Record<string, number | string | boolean | null>;
}

export type WorkflowResponse = WorkflowSuccessResponse | WorkflowErrorResponse;

export interface WorkflowFormValues {
  name: string;
  company: string;
  topic: Topic;
}

export type FieldErrors = Partial<Record<keyof WorkflowFormValues, string>>;

export const mockScenarios = [
  "default",
  "success",
  "ai-fallback",
  "telegram-error",
  "sheets-error",
  "attempt-unavailable",
  "timeout-once",
  "unavailable-once",
  "processing-once",
  "state-unknown",
] as const;
export type MockScenario = (typeof mockScenarios)[number];
