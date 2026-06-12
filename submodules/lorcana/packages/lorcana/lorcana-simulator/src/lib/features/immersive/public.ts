export {
  detectImmersiveCapabilities,
  isRunningStandalonePwa,
  type ImmersiveCapabilities,
} from "./immersive-capabilities.js";
export {
  isFullscreenActive,
  requestFullscreenSafe,
  type FullscreenRequestResult,
} from "./immersive-actions.js";
export {
  immersiveExperience,
  ImmersiveExperienceState,
  type ImmersiveMode,
  type ImmersiveStartOutcome,
} from "./immersive-state.svelte.js";
export {
  IMMERSIVE_ROUTE_ATTRIBUTE,
  IMMERSIVE_ROUTE_VALUE,
  IMMERSIVE_SESSION_STORAGE_KEY,
  persistImmersiveSessionStarted,
  readImmersiveSessionStarted,
  setImmersiveDocumentChrome,
} from "./immersive-session.js";
