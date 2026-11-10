import { describe, expect, it } from "vitest";

import {
  experienceReducer,
  initialExperienceState,
} from "@/lib/state/experience-machine";

describe("experience state machine", () => {
  it("enters a neutral submitting state without response events", () => {
    const state = experienceReducer(initialExperienceState, {
      type: "SUBMIT_STARTED",
      runId: "run-id",
      attempt: 1,
      scenario: "success",
    });

    expect(state.phase).toBe("submitting");
    expect(state).not.toHaveProperty("response");
    expect(state).not.toHaveProperty("events");
  });

  it("ignores replay completion outside replay", () => {
    expect(
      experienceReducer(initialExperienceState, {
        type: "REPLAY_COMPLETED",
      }),
    ).toEqual(initialExperienceState);
  });

  it("preserves the same run id for a retryable error", () => {
    const state = experienceReducer(initialExperienceState, {
      type: "REQUEST_FAILED",
      code: "WORKFLOW_TIMEOUT",
      runId: "same-run",
      attempt: 2,
      scenario: "timeout-once",
      canRetrySameRun: true,
    });

    expect(state).toMatchObject({
      phase: "request_error",
      runId: "same-run",
      canRetrySameRun: true,
    });
  });
});
