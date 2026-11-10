import { translate } from "@/lib/i18n/translate";
import type { Locale } from "@/types/workflow";

export function RunLimitBanner({
  locale,
  contactUrl,
}: {
  locale: Locale;
  contactUrl?: string;
}) {
  return (
    <section className="limit-banner" aria-labelledby="limit-title">
      <div aria-hidden="true" className="limit-orb">
        4/4
      </div>
      <div className="limit-copy">
        <p className="stage-eyebrow">SESSION QA · COMPLETE</p>
        <h1 id="limit-title">{translate(locale, "limit.title")}</h1>
        <p>{translate(locale, "limit.body")}</p>
        {contactUrl ? (
          <a className="secondary-cta" href={contactUrl} rel="noreferrer">
            {translate(locale, "limit.button")}
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span
            aria-disabled="true"
            className="secondary-cta is-disabled"
            title={translate(locale, "limit.contactPending")}
          >
            {translate(locale, "limit.button")}
            <small>{translate(locale, "limit.contactPending")}</small>
          </span>
        )}
      </div>
    </section>
  );
}
