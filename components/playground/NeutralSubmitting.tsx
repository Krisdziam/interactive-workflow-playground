import { translate } from "@/lib/i18n/translate";
import type { Locale } from "@/types/workflow";

export function NeutralSubmitting({
  locale,
  runId,
}: {
  locale: Locale;
  runId: string;
}) {
  return (
    <div className="submitting-stage">
      <div aria-hidden="true" className="request-orbit">
        <span className="orbit orbit-one" />
        <span className="orbit orbit-two" />
        <span className="orbit-core">↗</span>
      </div>

      <p className="stage-eyebrow">
        <span className="eyebrow-pulse" />
        {translate(locale, "submitting.eyebrow")}
      </p>
      <h1 className="stage-title">{translate(locale, "submitting.title")}</h1>
      <p className="stage-description">
        {translate(locale, "submitting.description")}
      </p>
      <div className="integrity-note">
        <span aria-hidden="true">◇</span>
        <span>{translate(locale, "submitting.integrity")}</span>
      </div>
      <code className="run-reference">run · {runId.slice(0, 8)}</code>
    </div>
  );
}
