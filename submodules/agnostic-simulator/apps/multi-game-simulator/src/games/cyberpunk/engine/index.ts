import {
  AUTOMATED_ACTION_STRATEGIES,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  type AIStrategy,
} from "@tcg/cyberpunk-engine";

export {
  EngineProvider,
  type AISideConfig,
  type AiLogEntry,
  type AiTakeoverState,
  type MoveLogEntry,
  type RawEngineEventEntry,
  type EngineAction,
  type LocalCommandCommit,
  type CyberpunkPostGameContext,
  type PostGameSurface,
} from "./EngineProvider";
export {
  useEngine,
  useEngineOptional,
  useEngineInteractionView,
  useNativePromptPresentation,
} from "./engineContext";
export {
  PLAYER_SIDE_TO_ID,
  formatPlayerIdentityMeta,
  isVisibleSubscriptionTier,
  otherSide,
  type PlayerConnectionBySide,
  type PlayerConnectionInfo,
  type PlayerConnectionStatus,
  type PlayerIdentityBySide,
  type PlayerIdentityInfo,
  type Side,
} from "./sides";

export {
  CHAT_PRESET_KEYS,
  CHAT_PRESETS,
  CHAT_MAX_LENGTH,
  chatMessageText,
  type ChatMessage,
  type ChatPresetKey,
  type PresetChatMessage,
  type TextChatMessage,
  type SystemChatMessage,
} from "./chat";

export type {
  AnimationScript,
  AnimationStep,
  CardAttachStep,
  CardEnterStep,
  CardExitStep,
  CardLandStep,
  CardMoveStep,
  CombatStep,
  EffectTargetSpec,
  EffectTargetStep,
  GigMoveStep,
  LegendRevealStep,
  PhaseChangeStep,
  ResourceFloatStep,
  CyberpunkTestEngine,
  GameEvent,
  MoveLog,
} from "@tcg/cyberpunk-engine";
export { getGearAttachTargets } from "./dropMapping";
export { interactionSubmissionToEngineAction } from "./interactionDispatch";
export { getProgramSpatialTargets } from "./programTargets";
export {
  interactionActionIsAvailable,
  interactionViewActionHasCandidate,
  interactionViewActionIdsForCandidate,
  interactionViewAttachTargets,
  interactionViewAbilityIndexForCard,
  interactionViewCanAttackRival,
  interactionViewCanFightTarget,
  interactionViewHasAttacker,
  interactionViewHasAttackUnitAttacker,
  interactionViewHasAttackers,
} from "./interactionViewHelpers";

// AI strategies. Re-exported so consumers can pick one without reaching across
// the boundary into `@tcg/cyberpunk-engine`.
export {
  defaultStrategy,
  firstLegalStrategy,
  randomStrategy,
  passOnlyStrategy,
  attackUnitOnlyStrategy,
  callLegendOnlyStrategy,
  greedyStrategy,
  AUTOMATED_ACTION_STRATEGIES,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  type AIStrategy,
} from "@tcg/cyberpunk-engine";

/** Curated strategy descriptors — single source of truth for the UI dropdown. */
export type StrategyId =
  | "default"
  | "greedy"
  | "random"
  | "first-legal"
  | "pass-only"
  | "attack-unit-only"
  | "call-legend-only";

export interface StrategyDescriptor {
  id: StrategyId;
  label: string;
  description: string;
  strategy: AIStrategy;
  testOnly?: boolean;
}

const STRATEGY_IDS: ReadonlySet<StrategyId> = new Set([
  "default",
  "greedy",
  "random",
  "first-legal",
  "pass-only",
  "attack-unit-only",
  "call-legend-only",
]);

export function isStrategyId(value: unknown): value is StrategyId {
  return typeof value === "string" && (STRATEGY_IDS as Set<string>).has(value);
}

export const AI_STRATEGIES: ReadonlyArray<StrategyDescriptor> = AUTOMATED_ACTION_STRATEGIES.map(
  (option) => ({
    id: isStrategyId(option.id) ? option.id : DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    label: option.label,
    description: option.description,
    strategy: option.strategy,
    testOnly: option.testOnly,
  }),
);

/** Look up a descriptor by id. */
export function getStrategyById(id: string): StrategyDescriptor | undefined {
  return AI_STRATEGIES.find((s) => s.id === id);
}

/** Reverse lookup: which descriptor wraps the given strategy reference? */
export function findStrategyDescriptor(
  strategy: AIStrategy | null,
): StrategyDescriptor | undefined {
  if (!strategy) {
    return undefined;
  }
  return AI_STRATEGIES.find((s) => s.strategy === strategy);
}

export {
  AI_SPEED_MS,
  resolveAiStatus,
  type AiMode,
  type AiSpeed,
  type AiStatus,
  type ResolveAiStatusInput,
} from "./aiStatus";

export { useBoardMode, statusToMode, type BoardMode } from "./useBoardMode";
export {
  useInteractionPermission,
  useInteractionPermissions,
  computePermissions,
  type Permission,
} from "./useInteractionPermission";
export {
  listScenarios,
  getScenario,
  SCENARIO_GROUPS,
  DEFAULT_SCENARIO,
  type ScenarioId,
  type ScenarioGroup,
  type Scenario,
} from "./fixtures/scenarios";
export {
  PRACTICE_DECK_FIXTURES,
  DEFAULT_BOT_PRACTICE_DECK_ID,
  DEFAULT_PLAYER_PRACTICE_DECK_ID,
  getPracticeDeckFixture,
  getPracticeCardCatalog,
  createPracticeMatchConfig,
  savePracticeMatchConfig,
  loadPracticeMatchConfig,
  clearPracticeMatchSessions,
  createImportedPracticeMatchConfig,
  createPracticeAiConfig,
  createPracticeEngine,
  createPracticeConfigFromDeckPayload,
  createWebviewReadyMessage,
  isAllowedCardDatabaseOrigin,
  parseDeckImportMessage,
  postWebviewMessage,
  resolveDeckImportMessage,
  type CyberpunkDeckImportMessage,
  type CyberpunkDeckPayload,
  type CyberpunkWebviewOutboundMessage,
  type DeckImportError,
  type PracticeDeckFixture,
  type PracticeMatchConfig,
} from "./practice";
export {
  useSideZones,
  useCardView,
  useCardViewByName,
  WIN_GIG_THRESHOLD,
  type ZoneCardView,
  type CardActiveEffectView,
  type GigDieView,
  type SideZoneViews,
  type EngineCardType,
  type EffectiveRule,
} from "./zoneViews";
export type { CardDragSource, DropTarget, CardDropEvent } from "./dropEvent";
export { mapDropToAction, type DropContext } from "./dropMapping";

export type { MoveId, DieType, StepResult } from "@tcg/cyberpunk-engine";

export {
  UserConfigProvider,
  useUserConfig,
  useSetUserConfig,
  type UserConfig,
  type DiceDisplayMode,
  type DiceImageColor,
  type DicierStyle,
} from "./UserConfigContext";
