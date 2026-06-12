export type { GundamLogLocale } from "./log-translation-contract.ts";
export {
  assertGundamLogTranslationContract,
  collectGundamLogTranslationIssues,
  GUNDAM_LOG_TRANSLATIONS_BY_LOCALE,
} from "./log-translation-contract.ts";
export { getGundamLogTemplate, renderGundamLogTemplate } from "./render-log-template.ts";
export { translateGundamLogMessage } from "./translate-log-message.ts";
