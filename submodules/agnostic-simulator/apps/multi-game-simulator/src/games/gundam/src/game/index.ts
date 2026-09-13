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
  TurnTaggedPacketAnimation,
} from "./adapter.ts";
export { createEngineAdapter } from "./adapter.ts";

export type { GameStore, GameSnapshot } from "./store.ts";

export type {
  BoardProjection,
  CardInstanceId,
  MoveName,
  PartialInput,
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
  useAcceptedAnimations,
  useStatus,
  useViewerId,
  useZone,
} from "./hooks.ts";

export {
  useCardLegality,
  useCardDisabledReason,
  type CardLegality,
} from "./selectors/cardLegality.ts";

export {
  findDualModeMatchInInteractionView,
  useDualModeMatch,
  type DualModeMatch,
} from "./selectors/dualModeCard.ts";

export {
  interactionViewHasSourceCard,
  interactionViewSourceCardIds,
} from "./selectors/interactionView.ts";

export {
  RIBBON_PHASES,
  displayTurn,
  phaseLabel,
  projectGundamControlState,
  stepLabel,
  useGundamControlState,
  usePhaseLabel,
  usePriorityHolder,
  type GundamControlState,
  type GundamPlayerSide,
  type PhaseLabel,
  type PriorityHolder,
} from "./labels.ts";
