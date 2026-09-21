import { registerGameAdapter } from "@tcg/shared/game-adapter";
import { fleshAndBloodServerAdapter } from "./adapter.ts";

export { fleshAndBloodServerAdapter } from "./adapter.ts";
export { listFleshAndBloodDeckPresets } from "./deck-presets.ts";
export { fleshAndBloodDeckInterchangeAdapter } from "./deck-interchange.ts";
export { FleshAndBloodServerEngine } from "./server-engine.ts";
// Stable per-mode action labels the simulator matches its priority controls
// against; re-exported so clients need no direct engine dependency for them.
export {
  FAB_ARM_PRIORITY_HOLD_LABEL,
  FAB_AUTOMATION_PREFERENCE_LABELS,
  FAB_PRIORITY_MODE_ACTION_LABEL,
  FAB_PRIORITY_MODES,
  FAB_SCOPED_AUTO_PASS_LABELS,
} from "@tcg/flesh-and-blood-engine/legal-commands";
export { fabScopedAutoPassActionIdentity } from "./interaction.ts";
export {
  parseFabGameAnalytics,
  parseFabPersistedGameAnalyticsV1,
  type FabPersistedGameAnalyticsV1,
} from "./analytics.ts";
export {
  FAB_ANALYTICS_SCHEMA_VERSION_V2,
  buildFabGameAnalyticsV2,
  parseFabGameAnalyticsV2,
  parseFabPersistedGameAnalyticsV2,
  parseFabAnalyticsTransitionReceiptV2,
  projectFabAnalyticsFactsV2,
  type FabAnalyticsCardRefV2,
  type FabAnalyticsFactV2,
  type FabAnalyticsPlayerSeedV2,
  type FabAnalyticsTransitionReceiptV2,
  type FabAnalyticsTurnPlayerSummaryV2,
  type FabGameAnalyticsV2,
  type FabGameAnalytics,
  type FabHandActionV2,
  type FabHandCycleV2,
  type FabPersistedGameAnalyticsV2,
} from "./analytics-v2.ts";
export {
  FAB_GAMEPLAY_META_PROJECTION_VERSION,
  fabGameplayMetaLineKey,
  projectFabGameplayMeta,
  type FabGameplayMetaAction,
  type FabGameplayMetaLine,
  type FabGameplayMetaPlayer,
  type FabGameplayMetaProjection,
} from "./analytics-meta.ts";
export {
  FAB_PUBLIC_POST_GAME_SCHEMA,
  FAB_PUBLIC_POST_GAME_SCHEMA_VERSION,
  isPublicPostGameStatsV1,
  projectPublicPostGameStatsV1,
  type PublicPostGameCardV1,
  type PublicPostGameParticipantV1,
  type PublicPostGameSeatV1,
  type PublicPostGameStatsV1,
  type PublicPostGameTotalsV1,
  type PublicPostGameTurnV1,
} from "./analytics-public.ts";
export {
  fabAnimationPlayerRef,
  fabAnimationValueAnchorRef,
  fabAnimationZoneFace,
  fabAnimationZoneRef,
  type FabAnimationValueKind,
} from "./animation-refs.ts";
export {
  commandForFabSubmission,
  fabOpponentTriggerYieldActionIdentity,
  fabOptionalTriggerAutomationTargetMode,
  projectFabInteraction,
  type FabInteractionProjection,
  type FabOptionalTriggerAutomationTargetMode,
} from "./interaction.ts";
/**
 * Register the Flesh and Blood adapter with the global registry. Idempotent.
 */
export function registerFleshAndBloodServerAdapter(): void {
  registerGameAdapter(fleshAndBloodServerAdapter);
}

export { fabInteractionControl, type FabInteractionControl } from "./interaction-controls.ts";

export {
  captureFabZoneLocations,
  fabLatestAnnouncementTransition,
  fabHiddenZoneTransfers,
  redactFabTransferLocations,
  type FabAnnouncementState,
  type FabAnnouncementTransition,
  type FabCombatStep,
  type FabZoneLocations,
} from "./state-transfers";
