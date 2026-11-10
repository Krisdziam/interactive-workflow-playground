import { describe, expect, it } from "vitest";

import { buildReplayGroups } from "@/lib/replay/build-replay-groups";
import type { WorkflowEvent } from "@/types/workflow";

const event = (
  stage: WorkflowEvent["stage"],
  started: number,
  completed: number,
): WorkflowEvent => ({
  stage,
  status: "success",
  started_at: new Date(started).toISOString(),
  completed_at: new Date(completed).toISOString(),
  duration_ms: completed - started,
  message_key: `event.${stage}`,
});

describe("verified replay grouping", () => {
  it("sorts by timestamp and preserves overlapping AI/Telegram work", () => {
    const groups = buildReplayGroups([
      event("sheets", 1200, 1300),
      event("telegram", 310, 700),
      event("webhook", 0, 50),
      event("ai", 300, 1100),
      event("session_lookup", 60, 220),
    ]);

    expect(groups.map((group) => group.id)).toEqual([
      "webhook",
      "session_lookup",
      "ai+telegram",
      "sheets",
    ]);
    expect(groups[2].events.map(({ stage }) => stage)).toEqual([
      "ai",
      "telegram",
    ]);
  });

  it("does not merge adjacent non-overlapping events", () => {
    expect(
      buildReplayGroups([
        event("webhook", 0, 50),
        event("session_lookup", 50, 100),
      ]),
    ).toHaveLength(2);
  });
});
