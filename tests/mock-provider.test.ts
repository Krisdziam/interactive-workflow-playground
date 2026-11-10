import { describe, expect, it } from "vitest";

import { executeMockWorkflow } from "@/lib/mock/provider";
import type { Attempt, ExecuteWorkflowRequest } from "@/types/workflow";

const request: ExecuteWorkflowRequest = {
  name: "Alex",
  company: "Acme",
  topic: "ai_automation",
  locale: "en",
  session_id: "8f4f4a5f-4160-4dcb-a789-74e5e6699694",
  run_id: "850d5734-6db5-41cc-972b-19949b6640ab",
};

const executeAttempt = (attempt: Attempt) =>
  executeMockWorkflow({
    request,
    attempt,
    scenario: "default",
    invocation: 1,
    latencyMs: 0,
    now: () => Date.UTC(2026, 10, 10, 10, 0, 0),
  });

describe("deterministic mock provider", () => {
  it("maps attempts to success and partial-success scenarios", async () => {
    const responses = await Promise.all([
      executeAttempt(1),
      executeAttempt(2),
      executeAttempt(3),
      executeAttempt(4),
    ]);

    expect(responses.map(({ overall_status }) => overall_status)).toEqual([
      "success",
      "partial_success",
      "partial_success",
      "partial_success",
    ]);
    expect(responses[1].result.ai_status).toBe("fallback");
    expect(responses[2].integrations.telegram.status).toBe("error");
    expect(responses[3].integrations.sheets.status).toBe("error");
  });

  it("returns overlapping verified AI and Telegram timestamps", async () => {
    const response = await executeAttempt(1);
    const ai = response.events.find(({ stage }) => stage === "ai")!;
    const telegram = response.events.find(({ stage }) => stage === "telegram")!;

    expect(Date.parse(telegram.started_at)).toBeLessThan(
      Date.parse(ai.completed_at!),
    );
    expect(response.timings.processing_time_ms).not.toBe(
      response.timings.total_time_ms,
    );
  });

  it("never exposes a Telegram chat id or credentials", async () => {
    const serialized = JSON.stringify(await executeAttempt(1));

    expect(serialized).not.toMatch(/chat[._-]?id/i);
    expect(serialized).not.toMatch(/token|secret|credential/i);
  });

  it("fails once on timeout and permits a same-run retry", async () => {
    await expect(
      executeMockWorkflow({
        request,
        attempt: 1,
        scenario: "timeout-once",
        invocation: 1,
        latencyMs: 0,
      }),
    ).rejects.toMatchObject({
      code: "WORKFLOW_TIMEOUT",
      canRetrySameRun: true,
    });

    await expect(
      executeMockWorkflow({
        request,
        attempt: 1,
        scenario: "timeout-once",
        invocation: 2,
        latencyMs: 0,
      }),
    ).resolves.toMatchObject({ run_id: request.run_id });
  });
});
