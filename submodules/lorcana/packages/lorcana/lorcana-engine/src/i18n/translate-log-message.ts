import type { LorcanaLogMessage, LorcanaLogMessageKey } from "../types/log-messages";
import type { LorcanaLogLocale } from "./log-translation-contract";
import { renderLorcanaLogTemplate } from "./render-log-template";

type TranslateOptions = {
  locale?: LorcanaLogLocale;
};

function renderTypedLogMessage<TKey extends LorcanaLogMessageKey>(
  message: LorcanaLogMessage<TKey>,
  locale: LorcanaLogLocale,
): string {
  return renderLorcanaLogTemplate(message.key, message.values, locale);
}

export function translateLorcanaLogMessage(
  message: LorcanaLogMessage,
  options: TranslateOptions = {},
): string {
  return renderTypedLogMessage(message, options.locale ?? "en");
}
