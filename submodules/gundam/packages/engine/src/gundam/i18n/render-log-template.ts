import type { GundamLogMessageKey, GundamLogMessageMap } from "../logging.ts";
import {
  GUNDAM_LOG_TRANSLATIONS_BY_LOCALE,
  type GundamLogLocale,
} from "./log-translation-contract.ts";

export type GundamLogTemplatePrimitive = string | number | boolean;
export type GundamLogTemplateValue =
  | GundamLogTemplatePrimitive
  | readonly GundamLogTemplatePrimitive[]
  | undefined;

export type GundamLogTemplateValues<TKey extends GundamLogMessageKey> = {
  [TValueKey in keyof GundamLogMessageMap[TKey]]: GundamLogTemplateValue;
};

const TEMPLATE_TOKEN_PATTERN = /\{([a-zA-Z0-9_]+)\}/g;

function stringifyLogTemplateValue(value: GundamLogTemplateValue): string {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry)).join(", ");
  }
  if (value === undefined) return "";
  return String(value);
}

export function getGundamLogTemplate(
  key: GundamLogMessageKey,
  locale: GundamLogLocale = "en",
): string {
  return GUNDAM_LOG_TRANSLATIONS_BY_LOCALE[locale][key];
}

export function renderGundamLogTemplate<TKey extends GundamLogMessageKey>(
  key: TKey,
  values: GundamLogTemplateValues<TKey>,
  locale: GundamLogLocale = "en",
): string {
  const template = getGundamLogTemplate(key, locale);
  return template.replaceAll(TEMPLATE_TOKEN_PATTERN, (_match, rawKey: string) => {
    const placeholderKey = rawKey as keyof GundamLogTemplateValues<TKey>;
    return stringifyLogTemplateValue(values[placeholderKey]);
  });
}
