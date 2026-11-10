import { translate } from "@/lib/i18n/translate";
import type { Locale } from "@/types/workflow";

export function LocaleSwitcher({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <div
      aria-label={translate(locale, "locale.label")}
      className="locale-switcher"
      role="group"
    >
      {(["en", "uk"] as const).map((option) => (
        <button
          aria-pressed={locale === option}
          className="locale-option"
          data-active={locale === option}
          key={option}
          onClick={() => onChange(option)}
          type="button"
        >
          {option === "uk" ? "UA" : "EN"}
        </button>
      ))}
    </div>
  );
}
