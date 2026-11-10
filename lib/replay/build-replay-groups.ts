import type { WorkflowEvent } from "@/types/workflow";

export interface ReplayGroup {
  id: string;
  startedAtMs: number;
  completedAtMs: number;
  events: WorkflowEvent[];
}

const toTimestamp = (value: string | null, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : fallback;
};

export function buildReplayGroups(events: WorkflowEvent[]): ReplayGroup[] {
  const ordered = [...events].sort(
    (a, b) => Date.parse(a.started_at) - Date.parse(b.started_at),
  );
  const groups: ReplayGroup[] = [];

  for (const event of ordered) {
    const startedAtMs = toTimestamp(event.started_at, 0);
    const completedAtMs = toTimestamp(event.completed_at, startedAtMs);
    const previous = groups.at(-1);

    if (previous && startedAtMs < previous.completedAtMs) {
      previous.events.push(event);
      previous.completedAtMs = Math.max(previous.completedAtMs, completedAtMs);
      previous.id = previous.events.map(({ stage }) => stage).join("+");
      continue;
    }

    groups.push({
      id: event.stage,
      startedAtMs,
      completedAtMs,
      events: [event],
    });
  }

  return groups;
}
