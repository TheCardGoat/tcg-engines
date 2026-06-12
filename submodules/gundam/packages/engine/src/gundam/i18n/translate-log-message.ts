import type { GundamGameLogEntry } from "../logging.ts";
import type { GundamLogLocale } from "./log-translation-contract.ts";
import { renderGundamLogTemplate } from "./render-log-template.ts";

type TranslateOptions = {
  locale?: GundamLogLocale;
};

export function translateGundamLogMessage(
  entry: GundamGameLogEntry,
  options: TranslateOptions = {},
): string {
  return renderGundamLogTemplate(entry.type, entry.values, options.locale ?? "en");
}
