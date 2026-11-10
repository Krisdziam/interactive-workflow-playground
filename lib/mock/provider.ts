import { buildTwinResponse } from "@/lib/i18n/translate";
import type {
  Attempt,
  ExecuteWorkflowRequest,
  MockScenario,
  PublicErrorCode,
  WorkflowErrorItem,
  WorkflowEvent,
  WorkflowSuccessResponse,
} from "@/types/workflow";

export class MockWorkflowRequestError extends Error {
  constructor(
    readonly code: PublicErrorCode,
    readonly canRetrySameRun: boolean,
  ) {
    super(code);
    this.name = "MockWorkflowRequestError";
  }
}

interface ExecuteMockOptions {
  request: ExecuteWorkflowRequest;
  attempt: Attempt;
  scenario: MockScenario;
  invocation: number;
  latencyMs?: number;
  now?: () => number;
}

const wait = (durationMs: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, durationMs));

const iso = (baseMs: number, offsetMs: number) =>
  new Date(baseMs + offsetMs).toISOString();

const event = (
  baseMs: number,
  definition: Omit<WorkflowEvent, "started_at" | "completed_at"> & {
    started: number;
    completed: number;
  },
): WorkflowEvent => ({
  stage: definition.stage,
  status: definition.status,
  started_at: iso(baseMs, definition.started),
  completed_at: iso(baseMs, definition.completed),
  duration_ms: definition.completed - definition.started,
  message_key: definition.message_key,
});

export function resolveMockScenario(
  scenario: MockScenario,
  attempt: Attempt,
): Exclude<
  MockScenario,
  | "default"
  | "timeout-once"
  | "unavailable-once"
  | "processing-once"
  | "state-unknown"
> {
  if (scenario !== "default") {
    return scenario as Exclude<
      MockScenario,
      | "default"
      | "timeout-once"
      | "unavailable-once"
      | "processing-once"
      | "state-unknown"
    >;
  }

  const byAttempt = {
    1: "success",
    2: "ai-fallback",
    3: "telegram-error",
    4: "sheets-error",
  } as const;

  return byAttempt[attempt];
}

function throwTransientScenario(
  scenario: MockScenario,
  invocation: number,
): void {
  if (scenario === "state-unknown") {
    throw new MockWorkflowRequestError("RUN_STATE_UNKNOWN", false);
  }

  if (invocation !== 1) {
    return;
  }

  if (scenario === "timeout-once") {
    throw new MockWorkflowRequestError("WORKFLOW_TIMEOUT", true);
  }
  if (scenario === "unavailable-once") {
    throw new MockWorkflowRequestError("WORKFLOW_UNAVAILABLE", true);
  }
  if (scenario === "processing-once") {
    throw new MockWorkflowRequestError("RUN_ALREADY_PROCESSING", true);
  }
}

function mockMessageId(runId: string, attempt: Attempt): number {
  const runFragment = Number.parseInt(runId.slice(0, 4), 16);
  const stableFragment = Number.isFinite(runFragment) ? runFragment % 800 : 0;
  return 1800 + stableFragment + attempt;
}

export async function executeMockWorkflow({
  request,
  attempt,
  scenario,
  invocation,
  latencyMs = 720,
  now = Date.now,
}: ExecuteMockOptions): Promise<WorkflowSuccessResponse> {
  if (latencyMs > 0) {
    await wait(latencyMs);
  }

  throwTransientScenario(scenario, invocation);

  const resolvedScenario =
    scenario === "timeout-once" ||
    scenario === "unavailable-once" ||
    scenario === "processing-once"
      ? "success"
      : resolveMockScenario(scenario, attempt);
  const attemptUnavailable = resolvedScenario === "attempt-unavailable";
  const aiFallback = resolvedScenario === "ai-fallback";
  const telegramError = resolvedScenario === "telegram-error";
  const sheetsError = resolvedScenario === "sheets-error" || attemptUnavailable;
  const errors: WorkflowErrorItem[] = [];

  if (attemptUnavailable) {
    errors.push({ stage: "session_lookup", code: "SHEETS_READ_FAILED" });
  }
  if (aiFallback) {
    errors.push({ stage: "ai", code: "AI_FALLBACK_USED" });
  }
  if (telegramError) {
    errors.push({ stage: "telegram", code: "TELEGRAM_SEND_FAILED" });
  }
  if (sheetsError && !attemptUnavailable) {
    errors.push({ stage: "sheets", code: "SHEETS_FINALIZE_FAILED" });
  }

  const overallStatus = errors.length > 0 ? "partial_success" : "success";
  const responseAttempt = attemptUnavailable ? null : attempt;
  const baseMs = now();
  const events: WorkflowEvent[] = [
    event(baseMs, {
      stage: "webhook",
      status: "success",
      started: 0,
      completed: 54,
      duration_ms: 54,
      message_key: "event.webhook.received",
    }),
    event(baseMs, {
      stage: "session_lookup",
      status: attemptUnavailable ? "error" : "success",
      started: 72,
      completed: 224,
      duration_ms: 152,
      message_key: attemptUnavailable
        ? "event.session.unavailable"
        : "event.session.lookup",
    }),
    event(baseMs, {
      stage: "ai",
      status: aiFallback ? "fallback" : "success",
      started: 260,
      completed: 1130,
      duration_ms: 870,
      message_key: aiFallback ? "event.ai.fallback" : "event.ai.generated",
    }),
    event(baseMs, {
      stage: "telegram",
      status: telegramError ? "error" : "success",
      started: 272,
      completed: 692,
      duration_ms: 420,
      message_key: telegramError
        ? "event.telegram.failed"
        : "event.telegram.accepted",
    }),
    event(baseMs, {
      stage: "sheets",
      status: sheetsError ? "error" : "success",
      started: 1172,
      completed: 1350,
      duration_ms: 178,
      message_key: sheetsError ? "event.sheets.failed" : "event.sheets.saved",
    }),
    event(baseMs, {
      stage: "workflow",
      status: "success",
      started: 1360,
      completed: 1418,
      duration_ms: 58,
      message_key:
        overallStatus === "success"
          ? "event.workflow.completed"
          : "event.workflow.partial",
    }),
  ];

  return {
    schema_version: "1.1",
    run_id: request.run_id,
    session_id: request.session_id,
    overall_status: overallStatus,
    locale: request.locale,
    topic: request.topic,
    attempt: responseAttempt,
    attempt_status: attemptUnavailable ? "unavailable" : "available",
    result: {
      text: buildTwinResponse({
        locale: request.locale,
        name: request.name,
        company: request.company,
        topic: request.topic,
        attempt: responseAttempt,
      }),
      ai_status: aiFallback ? "fallback" : "success",
    },
    integrations: {
      telegram: telegramError
        ? { status: "error" }
        : {
            status: "success",
            message_id: mockMessageId(request.run_id, attempt),
          },
      sheets: { status: sheetsError ? "error" : "success" },
    },
    timings: {
      processing_time_ms: 870,
      total_time_ms: 1418 + attempt * 17,
    },
    events,
    errors,
    idempotent_replay: false,
  };
}
