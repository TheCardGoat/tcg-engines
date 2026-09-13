import type { FabLogKey, FabLogMessageValuesByName, FabLogValuePrimitive } from "./messages.ts";
import { FAB_LOG_TRANSLATIONS_BY_LOCALE, type FabLogLocale } from "./translation-contract.ts";

export type FabLogTemplatePrimitive = FabLogValuePrimitive;
export type FabLogTemplateValue =
  | FabLogTemplatePrimitive
  | readonly FabLogTemplatePrimitive[]
  | undefined;

/** Typed interpolation payload for direct renderer callers. */
export type FabLogTemplateValues<TKey extends FabLogKey> = {
  [TValueKey in keyof FabLogMessageValuesByName[TKey]]: FabLogTemplateValue;
};

const TEMPLATE_TOKEN_PATTERN = /\{([a-zA-Z0-9_]+)\}/g;

function stringifyLogTemplateValue(value: FabLogTemplateValue): string {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry)).join(", ");
  }
  if (value === undefined) return "";
  return String(value);
}

export function getFabLogTemplate(key: FabLogKey, locale: FabLogLocale = "en"): string {
  return FAB_LOG_TRANSLATIONS_BY_LOCALE[locale][key];
}

/**
 * Render a log template. Values may be the typed payload or the loose record
 * carried on a persisted `FabMoveLogMessage`, so the simulator can re-render
 * canonical records without the engine's typed context.
 */
export function renderFabLogTemplate<TKey extends FabLogKey>(
  key: TKey,
  values: FabLogTemplateValues<TKey> | Readonly<Record<string, FabLogTemplateValue>>,
  locale: FabLogLocale = "en",
): string {
  const template = getFabLogTemplate(key, locale);
  return template.replaceAll(TEMPLATE_TOKEN_PATTERN, (_match, rawKey: string) => {
    const placeholderKey = rawKey as keyof FabLogTemplateValues<TKey>;
    return stringifyLogTemplateValue(
      (values as Readonly<Record<string, FabLogTemplateValue>>)[placeholderKey],
    );
  });
}
