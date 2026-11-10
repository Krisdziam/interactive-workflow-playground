import { dictionaries, en, type TranslationKey } from "@/lib/i18n/dictionaries";
import type { Attempt, Locale, Topic } from "@/types/workflow";

type InterpolationValues = Record<string, string | number>;

export function translate(
  locale: Locale,
  key: TranslationKey,
  values: InterpolationValues = {},
): string {
  const template = dictionaries[locale][key] ?? en[key] ?? String(key);

  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{{${name}}}`, String(value)),
    template,
  );
}

export function isTranslationKey(value: string): value is TranslationKey {
  return Object.prototype.hasOwnProperty.call(en, value);
}

export function translateMessageKey(locale: Locale, key: string): string {
  return isTranslationKey(key) ? translate(locale, key) : key;
}

const responseKeys: Record<Attempt, TranslationKey> = {
  1: "response.attempt1",
  2: "response.attempt2",
  3: "response.attempt3",
  4: "response.attempt4",
};

const topicSentenceKeys: Record<Topic, TranslationKey> = {
  ai_automation: "topic.ai_automation.sentence",
  api_integrations: "topic.api_integrations.sentence",
  workflow_optimization: "topic.workflow_optimization.sentence",
};

export function buildTwinResponse({
  locale,
  name,
  company,
  topic,
  attempt,
}: {
  locale: Locale;
  name: string;
  company: string;
  topic: Topic;
  attempt: Attempt | null;
}): string {
  const companyContext = company
    ? translate(locale, "company.named", { company })
    : translate(locale, "company.neutral");

  return translate(
    locale,
    attempt === null ? "response.generic" : responseKeys[attempt],
    {
      name,
      company_context: companyContext,
      topic_sentence: translate(locale, topicSentenceKeys[topic]),
    },
  );
}
