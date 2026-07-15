/**
 * Lorcana Log Translation APIs
 */

export type { LorcanaLogLocale } from "./log-translation-contract";
export {
  assertLorcanaLogTranslationContract,
  collectLorcanaLogTranslationIssues,
} from "./log-translation-contract";
export { getLorcanaLogTemplate, renderLorcanaLogTemplate } from "./render-log-template";
export { translateLorcanaLogMessage } from "./translate-log-message";
