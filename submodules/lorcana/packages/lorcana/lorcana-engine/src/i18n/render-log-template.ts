import type { LorcanaLogMessageKey, LorcanaLogMessageMap } from "../types/log-messages";
import {
  LORCANA_LOG_TRANSLATIONS_BY_LOCALE,
  type LorcanaLogLocale,
} from "./log-translation-contract";

export type LorcanaLogTemplatePrimitive = string | number | boolean;
export type LorcanaLogTemplateValue =
  | LorcanaLogTemplatePrimitive
  | readonly LorcanaLogTemplatePrimitive[]
  | undefined;

export type LorcanaLogTemplateValues<TKey extends LorcanaLogMessageKey> = {
  [TValueKey in keyof LorcanaLogMessageMap[TKey]]: LorcanaLogTemplateValue;
};

const TEMPLATE_TOKEN_PATTERN = /\{([a-zA-Z0-9_]+)\}/g;

function stringifyLogTemplateValue(value: LorcanaLogTemplateValue): string {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry)).join(", ");
  }

  if (value === undefined) {
    return "";
  }

  return String(value);
}

export function getLorcanaLogTemplate(
  key: LorcanaLogMessageKey,
  locale: LorcanaLogLocale = "en",
): string {
  return LORCANA_LOG_TRANSLATIONS_BY_LOCALE[locale][key];
}

export function renderLorcanaLogTemplate<TKey extends LorcanaLogMessageKey>(
  key: TKey,
  values: LorcanaLogTemplateValues<TKey>,
  locale: LorcanaLogLocale = "en",
): string {
  const template = getLorcanaLogTemplate(key, locale);

  return template.replaceAll(TEMPLATE_TOKEN_PATTERN, (_match, rawKey: string) => {
    const placeholderKey = rawKey as keyof LorcanaLogTemplateValues<TKey>;
    return stringifyLogTemplateValue(values[placeholderKey]);
  });
}
