import { translate, translateMessageKey } from "@/lib/i18n/translate";
import type {
  FieldErrors,
  Locale,
  Topic,
  WorkflowFormValues,
} from "@/types/workflow";

const topicOptions: Array<{
  value: Topic;
  labelKey:
    | "topic.ai_automation"
    | "topic.api_integrations"
    | "topic.workflow_optimization";
  hintKey:
    | "topic.ai_automation.hint"
    | "topic.api_integrations.hint"
    | "topic.workflow_optimization.hint";
  glyph: string;
}> = [
  {
    value: "ai_automation",
    labelKey: "topic.ai_automation",
    hintKey: "topic.ai_automation.hint",
    glyph: "✦",
  },
  {
    value: "api_integrations",
    labelKey: "topic.api_integrations",
    hintKey: "topic.api_integrations.hint",
    glyph: "↗",
  },
  {
    value: "workflow_optimization",
    labelKey: "topic.workflow_optimization",
    hintKey: "topic.workflow_optimization.hint",
    glyph: "⌁",
  },
];

export function WorkflowRunForm({
  locale,
  values,
  errors,
  attemptsUsed,
  onChange,
  onSubmit,
}: {
  locale: Locale;
  values: WorkflowFormValues;
  errors: FieldErrors;
  attemptsUsed: number;
  onChange: (values: WorkflowFormValues) => void;
  onSubmit: () => void;
}) {
  const available = Math.max(0, 4 - attemptsUsed);

  return (
    <form
      className="run-form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="form-grid">
        <div className="field-group">
          <div className="field-label-row">
            <label className="field-label" htmlFor="recruiter-name">
              {translate(locale, "form.name.label")}
            </label>
            <span className="field-required">
              {translate(locale, "form.required")}
            </span>
          </div>
          <input
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            className="text-input"
            id="recruiter-name"
            maxLength={60}
            onChange={(event) =>
              onChange({ ...values, name: event.target.value })
            }
            placeholder={translate(locale, "form.name.placeholder")}
            type="text"
            value={values.name}
          />
          {errors.name ? (
            <p className="field-error" id="name-error" role="alert">
              {translateMessageKey(locale, errors.name)}
            </p>
          ) : null}
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="company-name">
            {translate(locale, "form.company.label")}
          </label>
          <input
            aria-describedby={errors.company ? "company-error" : undefined}
            aria-invalid={Boolean(errors.company)}
            autoComplete="organization"
            className="text-input"
            id="company-name"
            maxLength={80}
            onChange={(event) =>
              onChange({ ...values, company: event.target.value })
            }
            placeholder={translate(locale, "form.company.placeholder")}
            type="text"
            value={values.company}
          />
          {errors.company ? (
            <p className="field-error" id="company-error" role="alert">
              {translateMessageKey(locale, errors.company)}
            </p>
          ) : null}
        </div>
      </div>

      <fieldset className="topic-fieldset">
        <legend className="field-label">
          {translate(locale, "form.topic.label")}
        </legend>
        <div className="topic-grid">
          {topicOptions.map((option) => (
            <label className="topic-option" key={option.value}>
              <input
                checked={values.topic === option.value}
                className="sr-only"
                name="topic"
                onChange={() => onChange({ ...values, topic: option.value })}
                type="radio"
                value={option.value}
              />
              <span aria-hidden="true" className="topic-glyph">
                {option.glyph}
              </span>
              <span className="topic-copy">
                <strong>{translate(locale, option.labelKey)}</strong>
                <small>{translate(locale, option.hintKey)}</small>
              </span>
              <span aria-hidden="true" className="topic-check">
                ✓
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <button className="primary-cta" type="submit">
        <span>{translate(locale, "form.submit")}</span>
        <span aria-hidden="true" className="cta-arrow">
          ↗
        </span>
      </button>

      <div className="form-meta">
        <span className="runs-available">
          <span aria-hidden="true" className="status-dot" />
          {translate(
            locale,
            available === 1 ? "form.oneRunAvailable" : "form.runsAvailable",
            { count: available },
          )}
        </span>
        <span>{translate(locale, "page.duration")}</span>
      </div>

      <p className="privacy-note">{translate(locale, "form.privacy")}</p>
    </form>
  );
}
