import { translate } from "@/lib/i18n/translate";
import type { Locale, PublicErrorCode } from "@/types/workflow";

const errorMessageKeys: Record<
  PublicErrorCode,
  | "error.VALIDATION_ERROR"
  | "error.WORKFLOW_TIMEOUT"
  | "error.WORKFLOW_UNAVAILABLE"
  | "error.RUN_ALREADY_PROCESSING"
  | "error.RUN_STATE_UNKNOWN"
  | "error.SESSION_LIMIT_REACHED"
  | "error.RATE_LIMITED"
> = {
  VALIDATION_ERROR: "error.VALIDATION_ERROR",
  WORKFLOW_TIMEOUT: "error.WORKFLOW_TIMEOUT",
  WORKFLOW_UNAVAILABLE: "error.WORKFLOW_UNAVAILABLE",
  RUN_ALREADY_PROCESSING: "error.RUN_ALREADY_PROCESSING",
  RUN_STATE_UNKNOWN: "error.RUN_STATE_UNKNOWN",
  SESSION_LIMIT_REACHED: "error.SESSION_LIMIT_REACHED",
  RATE_LIMITED: "error.RATE_LIMITED",
};

export function ErrorState({
  locale,
  code,
  runId,
  canRetrySameRun,
  onRetry,
  onNewRun,
}: {
  locale: Locale;
  code: PublicErrorCode;
  runId: string;
  canRetrySameRun: boolean;
  onRetry: () => void;
  onNewRun: () => void;
}) {
  return (
    <section className="error-stage" aria-labelledby="request-error-title">
      <div aria-hidden="true" className="error-symbol">
        !
      </div>
      <p className="stage-eyebrow">{code}</p>
      <h1 className="stage-title" id="request-error-title">
        {translate(locale, "error.title")}
      </h1>
      <p className="stage-description">
        {translate(locale, errorMessageKeys[code])}
      </p>
      <code className="run-reference">run · {runId.slice(0, 8)}</code>

      <div className="error-actions">
        {canRetrySameRun ? (
          <button
            className="primary-cta compact"
            onClick={onRetry}
            type="button"
          >
            {translate(locale, "action.retrySame")}
            <span aria-hidden="true">↻</span>
          </button>
        ) : null}
        <button className="text-button" onClick={onNewRun} type="button">
          {translate(
            locale,
            canRetrySameRun ? "action.newRun" : "action.backToForm",
          )}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
