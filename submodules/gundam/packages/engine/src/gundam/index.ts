/**
 * Gundam TCG — Game Module
 *
 * Exports everything needed to run a Gundam game on top of the engine framework.
 */

// ── Runtime Setup ─────────────────────────────────────────────────────────────
export { createInitialGundamG, deriveGundamRuntimeCard } from "./config.ts";

// ── Zone Configuration ────────────────────────────────────────────────────────
export { gundamZones, type GundamZoneId, isGundamZoneId, zoneKey } from "./zones.ts";

// ── Flow ──────────────────────────────────────────────────────────────────────
export { gundamFlow } from "./flow.ts";

// ── Moves ─────────────────────────────────────────────────────────────────────
export {
  gundamMoves,
  chooseFirstPlayer,
  alterHand,
  deployUnit,
  deployBase,
  playCommand,
  activateAbility,
  assignPilot,
  playCommandAsPilot,
  declareBlock,
  enterBattle,
  passBlock,
  passBattleAction,
  passTurn,
  passActionStep,
  concede,
  resolveEffect,
} from "./moves/index.ts";
export {
  GUNDAM_MOVE_METADATA,
  getMoveMetadata,
  type GundamMoveMetadata,
  type GundamMoveCategory,
} from "./moves/metadata.ts";

// ── Pending Effects ───────────────────────────────────────────────────────────
export {
  enqueuePendingEffect,
  enqueueOwnCardTriggers,
  enqueueObserverTriggers,
  drainPendingEffects,
  requiresPlayerChoice,
  nextPendingEffectId,
  buildPendingChoicePrompt,
} from "./effects/pending-effects.ts";

// ── Rules ─────────────────────────────────────────────────────────────────────
export {
  getEffectiveStats,
  getKeywordValue,
  hasKeyword,
  hasRestriction,
  satisfiesLinkCondition,
  isLinkUnit,
  canAttack,
  canBlock,
  getDamage,
  isDefeated,
  getAvailableResources,
  getResourceLevel,
  buildTargetResolutionContext,
  type EffectiveUnitStats,
} from "./rules/derived-state.ts";

// ── Effect Execution ──────────────────────────────────────────────────────────
export {
  executeCardEffect,
  executeDirectives,
  type EffectExecutionContext,
} from "./effects/executor.ts";
export { handleRecoverHPAction } from "./effects/handlers/combat.ts";

// ── Board Projection ──────────────────────────────────────────────────────────
export { projectGundamBoardView } from "./projection/project-board.ts";

// ── Events ────────────────────────────────────────────────────────────────────
export { emitGundamEvent, type GundamDomainEvent, type GundamEventKind } from "./events.ts";

// ── Logging ──────────────────────────────────────────────────────────────────
export {
  emitGundamLog,
  typedGundamLog,
  logPhaseEntered,
  logCombatDamage,
  logUnitDefeated,
  logShieldRemoved,
  logCombatResolved,
  GUNDAM_LOG_TRANSLATION_KEYS,
  GUNDAM_LOG_TRANSLATION_VALUE_KEYS,
  type GundamLogMessageKey,
  type GundamLogMessageMap,
  type GundamGameLogEntry,
  type GundamLogVisibility,
  type GundamLogCategory,
} from "./logging.ts";

// ── i18n ─────────────────────────────────────────────────────────────────────
export {
  translateGundamLogMessage,
  renderGundamLogTemplate,
  getGundamLogTemplate,
  assertGundamLogTranslationContract,
  GUNDAM_LOG_TRANSLATIONS_BY_LOCALE,
  type GundamLogLocale,
} from "./i18n/index.ts";

// ── Game State Types ──────────────────────────────────────────────────────────
export type {
  GundamG,
  GundamPlayerState,
  PendingCombatState,
  TurnMetadata,
  ContinuousEffectEntry,
  ContinuousEffectPayload,
  GundamCardMeta,
  GundamRuntimeCard,
  GundamBoardView,
  GundamPlayerBoardView,
  // Move inputs
  ChooseFirstPlayerArgs,
  AlterHandArgs,
  DeployUnitArgs,
  DeployBaseArgs,
  PlayCommandArgs,
  ActivateAbilityArgs,
  AssignPilotArgs,
  PlayCommandAsPilotArgs,
  DeclareBlockArgs,
  EnterBattleArgs,
  PassBlockArgs,
  PassBattleActionArgs,
  ConcedeArgs,
  SkipOpponentTurnArgs,
  DropOpponentArgs,
  PendingChoicePrompt,
  PendingTargetSelectionPrompt,
  PendingOptionalPrompt,
  PendingOrderingPrompt,
  PendingEffect,
} from "./types.ts";

// ── Testing ───────────────────────────────────────────────────────────────────
export {
  GundamTestEngine,
  GundamPlayerActions,
  PLAYER_ONE,
  PLAYER_TWO,
  registerGundamMatchers,
  expectSuccess,
  expectFailure,
  createMockUnit,
  createMockResource,
  createMockCommand,
  createMockPilot,
  createMockBase,
  testLogger,
  engineLogger,
  activeResources,
  restedResources,
  findStatModifier,
  countStatModifiers,
  hasKeywordGrant,
  hasContinuousRestriction,
  hasPreventDamage,
  hasPreventDamageToZone,
  hasForceAttackTarget,
  hasGrantAttackTargetOption,
  getContinuousEffects,
  getCardZoneKey,
  expectAttackRedirectedTo,
  expectCardInTrash,
  expectCardInHand,
  getDamageCounter,
  isCardExhausted,
  markAsLinkUnit,
  firstIdOr,
  seedShieldsFromDeck,
  giveShield,
  seedBaseAsShield,
  assertResourceShape,
  assertResourceInert,
  assertResourceReminderText,
} from "./testing/index.ts";
export type {
  GundamPlayerId,
  TestPlayerState,
  TestCardEntry,
  PlayerTestProxy,
  LogLevel,
} from "./testing/index.ts";
