/** Host entrypoint. Does not publish raw match state or test/practice registries. */
export type { FabPriorityWindow, FabPriorityWindowKind } from "./priority.ts";
export * from "./cards.ts";
export * from "./pregame.ts";
export {
  DEFAULT_FAB_STARTING_LIFE,
  createFabMatchInitialState,
  drawCards,
  rollMatchRandom,
} from "./initialize.ts";
export type { FabCardsMaps, InitializeFabMatchInput } from "./initialize.ts";
export type { FabAutomationPreferences, FabPriorityAutomationMode } from "./state.ts";
export type { FabOwnActionOrigin, FabPriorityWindowOrigin } from "./priority.ts";
export { FAB_MOVE_NAMES, decodeFabCommand, isFabMoveName } from "./moves.ts";
export type {
  FabCommand,
  FabCommandExecutionContext,
  FabCommandFailure,
  FabCommandTransition,
  FabMoveLog,
  FabMoveLogMessage,
  FabMoveName,
  FabUndoBarrier,
  FabUndoBarrierReason,
} from "./moves.ts";
export { applyFabCommand, FabMatchRuntime } from "./runtime.ts";
export {
  renderFabPlayerLog,
  renderFabPlayerLogMessage,
  isFabPlayerLog,
  visibleFabPlayerLog,
  visibleFabPlayerLogMessages,
  type FabPlayerLog,
  type FabPlayerLogActorLabel,
  type FabPlayerLogCardReference,
  type FabPlayerLogEntry,
  type FabPlayerLogMessage,
  type FabPlayerLogTarget,
  type FabVisiblePlayerLog,
  type FabVisiblePlayerLogEntry,
} from "./player-log.ts";
export {
  FAB_FACE_DOWN,
  projectFabViewerResources,
  projectFabViewerState,
  type FabViewer,
  type FabViewerPlayerState,
  type FabViewerResources,
  type FabViewerState,
  type FabViewerTurnReveal,
} from "./view.ts";
export type {
  FabViewerEffect,
  FabViewerEffectExpiry,
  FabViewerEffectFilter,
  FabViewerEffectImpact,
  FabViewerEffectOrigin,
  FabViewerEffectScope,
  FabViewerEffectSource,
} from "./viewer-effects.ts";
export {
  createFabMatchContext,
  isFabMatchSnapshotV21,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
  type FabDefinitionRegistry,
  type FabMatchContext,
  type FabMatchSnapshotV21,
} from "./snapshot/match-context.ts";
export type { FabDecision, FabDecisionAnswer } from "./rules/process.ts";
/** Trusted host/adapters may immediately project committed events to bounded
 * animation and analytics records. They must never serialize this stream to a
 * viewer or include it in a match snapshot. */
export type { CommittedEvent, FabObjectSnapshot } from "./rules/events.ts";
export { readFabWaitState, type FabWaitState, type FabWaitWindow } from "./game/wait-state.ts";
