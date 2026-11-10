"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { translate, translateMessageKey } from "@/lib/i18n/translate";
import {
  buildReplayGroups,
  type ReplayGroup,
} from "@/lib/replay/build-replay-groups";
import type {
  Locale,
  StageStatus,
  WorkflowEvent,
  WorkflowStage,
  WorkflowSuccessResponse,
} from "@/types/workflow";

const stageLabelKeys: Record<
  WorkflowStage,
  | "workflow.webhook"
  | "workflow.sessionLookup"
  | "workflow.ai"
  | "workflow.telegram"
  | "workflow.sheets"
  | "workflow.completed"
> = {
  webhook: "workflow.webhook",
  session_lookup: "workflow.sessionLookup",
  ai: "workflow.ai",
  telegram: "workflow.telegram",
  sheets: "workflow.sheets",
  workflow: "workflow.completed",
};

const stageGlyphs: Record<WorkflowStage, string> = {
  webhook: "↳",
  session_lookup: "◇",
  ai: "✦",
  telegram: "➤",
  sheets: "▦",
  workflow: "✓",
};

function WorkflowNode({
  event,
  status,
  locale,
}: {
  event: WorkflowEvent;
  status: StageStatus;
  locale: Locale;
}) {
  const isResolved = !["waiting", "processing"].includes(status);

  return (
    <article className="workflow-node" data-status={status}>
      <div aria-hidden="true" className="node-icon">
        {stageGlyphs[event.stage]}
      </div>
      <div className="node-copy">
        <div className="node-heading-row">
          <h3>{translate(locale, stageLabelKeys[event.stage])}</h3>
          <span className="node-status" data-status={status}>
            {translate(locale, `status.${status}` as never)}
          </span>
        </div>
        <p>
          {isResolved
            ? translateMessageKey(locale, event.message_key)
            : status === "processing"
              ? "•••"
              : "—"}
        </p>
        <code>
          {isResolved && event.duration_ms !== null
            ? `${event.duration_ms} ms`
            : "···"}
        </code>
      </div>
    </article>
  );
}

function ReplayLayer({
  group,
  groupIndex,
  completedGroups,
  activeGroup,
  locale,
}: {
  group: ReplayGroup;
  groupIndex: number;
  completedGroups: number;
  activeGroup: number | null;
  locale: Locale;
}) {
  const isParallel = group.events.length > 1;
  const statusFor = (event: WorkflowEvent): StageStatus => {
    if (groupIndex < completedGroups) {
      return event.status;
    }
    if (groupIndex === activeGroup) {
      return "processing";
    }
    return "waiting";
  };

  return (
    <div className="replay-layer" data-parallel={isParallel}>
      {groupIndex > 0 ? (
        <span aria-hidden="true" className="flow-line" />
      ) : null}
      {isParallel ? (
        <div className="parallel-label">
          <span>{translate(locale, "workflow.parallel")}</span>
          <i aria-hidden="true" />
        </div>
      ) : null}
      <div className="replay-layer-grid">
        {group.events.map((event) => (
          <WorkflowNode
            event={event}
            key={event.stage}
            locale={locale}
            status={statusFor(event)}
          />
        ))}
      </div>
    </div>
  );
}

export function WorkflowReplay({
  response,
  locale,
  reducedMotion,
  onComplete,
}: {
  response: WorkflowSuccessResponse;
  locale: Locale;
  reducedMotion: boolean;
  onComplete: () => void;
}) {
  const groups = useMemo(
    () => buildReplayGroups(response.events),
    [response.events],
  );
  const [completedGroups, setCompletedGroups] = useState(
    reducedMotion ? groups.length : 0,
  );
  const [activeGroup, setActiveGroup] = useState<number | null>(
    reducedMotion ? null : 0,
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    let currentGroup = 0;

    const schedule = (callback: () => void, duration: number) => {
      timerRef.current = setTimeout(callback, duration);
    };

    if (reducedMotion) {
      schedule(() => {
        if (!cancelled) onComplete();
      }, 650);
    } else {
      const playGroup = () => {
        const group = groups[currentGroup];
        if (!group) {
          schedule(() => {
            if (!cancelled) onComplete();
          }, 480);
          return;
        }

        setActiveGroup(currentGroup);
        schedule(
          () => {
            if (cancelled) return;
            setCompletedGroups(currentGroup + 1);
            currentGroup += 1;
            if (currentGroup >= groups.length) {
              setActiveGroup(null);
              schedule(() => {
                if (!cancelled) onComplete();
              }, 560);
            } else {
              playGroup();
            }
          },
          group.events.length > 1 ? 720 : 470,
        );
      };

      schedule(playGroup, 0);
    }

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [groups, onComplete, reducedMotion, response.run_id]);

  const visibleEvents = groups
    .slice(0, completedGroups)
    .flatMap((group) => group.events);

  return (
    <div className="replay-stage">
      <div className="stage-heading">
        <p className="stage-eyebrow">
          <span aria-hidden="true">●</span>
          VERIFIED RESPONSE · {response.schema_version}
        </p>
        <h1 className="stage-title">{translate(locale, "workflow.title")}</h1>
        <p className="stage-description">
          {translate(locale, "workflow.replayNote")}
        </p>
      </div>

      <div className="replay-flow">
        {groups.map((group, index) => (
          <ReplayLayer
            activeGroup={activeGroup}
            completedGroups={completedGroups}
            group={group}
            groupIndex={index}
            key={group.id}
            locale={locale}
          />
        ))}
      </div>

      <div className="replay-actions">
        <button className="text-button" onClick={onComplete} type="button">
          {translate(locale, "workflow.skipReplay")}
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <details className="execution-log">
        <summary>
          <span>{translate(locale, "result.details")}</span>
          <code>
            {visibleEvents.length}/{response.events.length} events
          </code>
        </summary>
        <ol>
          {visibleEvents.map((item) => (
            <li key={`${item.stage}-${item.started_at}`}>
              <span className="log-status" data-status={item.status} />
              <span>{translateMessageKey(locale, item.message_key)}</span>
              <code>{item.duration_ms ?? "—"} ms</code>
            </li>
          ))}
        </ol>
      </details>

      <p className="sr-only" aria-live="polite">
        {activeGroup === null
          ? translate(locale, "workflow.replayComplete")
          : groups[activeGroup]?.events
              .map((item) => translate(locale, stageLabelKeys[item.stage]))
              .join(", ")}
      </p>
    </div>
  );
}
