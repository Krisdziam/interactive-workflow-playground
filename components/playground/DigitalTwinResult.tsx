import { translate, translateMessageKey } from "@/lib/i18n/translate";
import type { Locale, WorkflowSuccessResponse } from "@/types/workflow";

import { RunLimitBanner } from "./RunLimitBanner";

function StatusMark({
  status,
}: {
  status: "success" | "error" | "fallback" | "skipped";
}) {
  return (
    <span aria-hidden="true" className="proof-mark" data-status={status}>
      {status === "success"
        ? "✓"
        : status === "fallback"
          ? "↻"
          : status === "skipped"
            ? "—"
            : "!"}
    </span>
  );
}

export function DigitalTwinResult({
  response,
  locale,
  attemptsUsed,
  contactUrl,
  onNewRun,
}: {
  response: WorkflowSuccessResponse;
  locale: Locale;
  attemptsUsed: number;
  contactUrl?: string;
  onNewRun: () => void;
}) {
  const telegram = response.integrations.telegram;
  const sheets = response.integrations.sheets;
  const attemptLabel =
    response.attempt_status === "available" && response.attempt !== null
      ? translate(locale, "twin.attempt", { attempt: response.attempt })
      : translate(locale, "twin.attemptUnavailable");

  return (
    <div className="result-stage">
      <div className="result-heading">
        <p className="stage-eyebrow">
          <span className="online-dot" />
          {translate(locale, "twin.online")}
        </p>
        <p className="result-summary">
          {translate(
            locale,
            response.overall_status === "success"
              ? "result.success"
              : "result.partial",
          )}
        </p>
      </div>

      <section className="twin-scene" aria-labelledby="twin-title">
        <div className="avatar-column">
          <div
            aria-label={translate(locale, "twin.avatarLabel")}
            className="digital-avatar"
            role="img"
          >
            <span className="avatar-ring avatar-ring-one" />
            <span className="avatar-ring avatar-ring-two" />
            <span className="avatar-grid" />
            <strong>K</strong>
            <i aria-hidden="true">DIGITAL</i>
          </div>
          <div className="avatar-caption">
            <span>{attemptLabel}</span>
            <span>·</span>
            <span>{translate(locale, `topic.${response.topic}` as never)}</span>
          </div>
        </div>

        <div className="twin-message">
          <div className="message-topline">
            <div>
              <p>{translate(locale, "twin.mockResponse")}</p>
              <h1 id="twin-title">{translate(locale, "twin.name")}</h1>
            </div>
            <span className="ai-status" data-status={response.result.ai_status}>
              <StatusMark status={response.result.ai_status} />
              AI · {response.result.ai_status.toUpperCase()}
            </span>
          </div>
          <p className="twin-response">{response.result.text}</p>
        </div>
      </section>

      <section
        aria-label={translate(locale, "result.details")}
        className="proof-strip"
      >
        <article className="proof-item">
          <StatusMark status={telegram.status} />
          <div>
            <p>{translate(locale, "telegram.title")}</p>
            <strong>
              {translate(
                locale,
                telegram.status === "success"
                  ? "telegram.accepted"
                  : telegram.status === "skipped"
                    ? "telegram.skipped"
                    : "telegram.failed",
              )}
            </strong>
            <small>{translate(locale, "telegram.route")}</small>
          </div>
          {telegram.status === "success" && telegram.message_id ? (
            <code>
              {translate(locale, "telegram.messageId")} · {telegram.message_id}
            </code>
          ) : null}
          <span className="proof-tooltip">
            {translate(locale, "telegram.acceptanceNote")}
          </span>
        </article>

        <article className="proof-item">
          <StatusMark status={sheets.status} />
          <div>
            <p>{translate(locale, "sheets.title")}</p>
            <strong>
              {translate(
                locale,
                sheets.status === "success" ? "sheets.saved" : "sheets.failed",
              )}
            </strong>
            <small>run · {response.run_id.slice(0, 8)}</small>
          </div>
          <code>{response.schema_version}</code>
        </article>

        <article className="proof-item timing-proof">
          <div className="timing-row">
            <span>{translate(locale, "twin.processingTime")}</span>
            <strong>{response.timings.processing_time_ms} ms</strong>
          </div>
          <div className="timing-row">
            <span>{translate(locale, "twin.totalTime")}</span>
            <strong>{response.timings.total_time_ms} ms</strong>
          </div>
          <code>{attemptLabel}</code>
        </article>
      </section>

      {response.errors.length > 0 ? (
        <details className="integration-notes">
          <summary>{translate(locale, "result.integrationIssues")}</summary>
          <ul>
            {response.errors.map((error) => (
              <li key={`${error.stage}-${error.code}`}>
                <span>{error.stage.replace("_", " ")}</span>
                <strong>
                  {translateMessageKey(locale, `error.${error.code}`)}
                </strong>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {attemptsUsed >= 4 ? (
        <RunLimitBanner contactUrl={contactUrl} locale={locale} />
      ) : (
        <div className="result-actions">
          <button className="secondary-cta" onClick={onNewRun} type="button">
            {translate(locale, "result.newRun")}
            <span aria-hidden="true">↗</span>
          </button>
          <code>{response.run_id}</code>
        </div>
      )}
    </div>
  );
}
