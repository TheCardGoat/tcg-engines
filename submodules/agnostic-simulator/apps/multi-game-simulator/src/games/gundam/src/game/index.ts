export { GundamGameProvider, useGundamGame } from "./context.tsx";

export {
  createDevRuntime,
  DEV_PLAYER_ONE,
  DEV_PLAYER_TWO,
  type DevCardEntry,
  type DevPlayerFixture,
  type DevPlayerId,
  type DevRuntime,
  type DevRuntimeConfig,
} from "./dev-runtime.ts";

export {
  DEFAULT_FIXTURE,
  FIXTURES,
  PARAMETERIZED_FIXTURES,
  resolveFixture,
  type FixtureFactory,
  type FixtureName,
} from "./fixtures/index.ts";

export type {
  EngineAdapter,
  EngineAdapterConfig,
  TurnTaggedLogEntry,
  TurnTaggedMoveLog,
} from "./adapter.ts";
export { createEngineAdapter } from "./adapter.ts";

export type { GameStore, GameSnapshot } from "./store.ts";
export type { PendingController } from "./pending.ts";

export type {
  BoardProjection,
  CardInstanceId,
  MoveName,
  PartialInput,
  PendingState,
  SubmitOutcome,
  ViewerId,
  ZoneId,
} from "./types.ts";

export { asCardInstanceId, asMoveName, asViewerId, asZoneId } from "./types.ts";

export {
  useBoardProjection,
  useInteractionView,
  useLogEntries,
  useMoveLogs,
  usePending,
  useStatus,
  useViewerId,
  useZone,
  type PendingMoveControls,
} from "./hooks.ts";

export {
  useCardLegality,
  useCardDisabledReason,
  useCurrentTargetingStep,
  type CardLegality,
  type TargetingStep,
} from "./selectors/cardLegality.ts";

export {
  findDualModeMatchInInteractionView,
  useDualModeMatch,
  type DualModeMatch,
} from "./selectors/dualModeCard.ts";

export {
  interactionViewHasSourceCard,
  interactionViewSourceCardIds,
  protocolTargetSelection,
  type ProtocolTargetSelection,
} from "./selectors/interactionView.ts";

export {
  RIBBON_PHASES,
  phaseLabel,
  stepLabel,
  usePhaseLabel,
  usePriorityHolder,
  type PhaseLabel,
  type PriorityHolder,
} from "./labels.ts";
