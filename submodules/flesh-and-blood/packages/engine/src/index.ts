// ── State ─────────────────────────────────────────────────────────────────────
export {
  FAB_DEFAULT_AUTOMATION_PREFERENCES,
  FAB_MATCH_SCHEMA_VERSION,
  opponentOf,
  type FabAutomationPreferences,
  type FabLogEntry,
  type FabMatchState,
  type FabPlayerState,
} from "./state.ts";
export type { FabRulesAssets } from "./game/assets.ts";
export type {
  FabAttackTarget,
  FabActiveAttackRef,
  FabChainLink,
  FabCombatState,
  FabCombatStep,
  FabDefendOrigin,
  FabLastClosedCombat,
} from "./game/combat.ts";
export type {
  FabAttackProxyId,
  FabCanonicalCardId,
  FabObjectInstanceId,
  FabPlayerId,
} from "./game/identity.ts";
export {
  fabAttackProxyId,
  fabCanonicalCardId,
  fabObjectInstanceId,
  fabPlayerId,
} from "./game/identity.ts";
export type { FabPhase } from "./game/turn.ts";
export {
  FAB_ZONE_KINDS,
  createFabContainerModel,
  createEmptyFabZones,
  createFabRuntimeContainers,
  type FabContainerModel,
  type FabPlayerContainers,
  type FabSharedZones,
  type FabSubcardsByHostId,
  type FabZoneKind,
  type FabZoneRef,
  type FabZones,
} from "./game/zones.ts";
export {
  lookupObject,
  type FabCounterRecord,
  type FabObjectHistory,
  type FabObjectMarker,
  type FabObjectRecord,
} from "./game/objects.ts";
export type {
  FabOwnActionOrigin,
  FabPriorityWindow,
  FabPriorityWindowKind,
  FabPriorityWindowOrigin,
} from "./priority.ts";
export { compileFabMatchProgram, type FabMatchProgram } from "./match-program.ts";
export {
  collectFabSnapshotValidationIssues,
  createFabMatchContext,
  isFabMatchSnapshotV21,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
  FabSnapshotSerializationRefusalError,
  type FabDefinitionRegistry,
  type FabMatchContext,
  type FabMatchSnapshotV21,
  type FabPersistedPlayerV17,
  type FabPersistedObjectRecordV17,
  type FabSnapshotValidationIssue,
} from "./snapshot/match-context.ts";
export {
  getFabRuntimeDerived,
  invalidateFabRuntimeDerived,
  type FabRuntimeDerived,
} from "./runtime-derived.ts";
export { collectReachableFabLki } from "./game/lki.ts";

// ── Rules event transaction kernel ───────────────────────────────────────────
export type {
  CommittedEvent,
  FabCommittedEventBatch,
  FabDecisionId,
  FabEventBatchId,
  FabEventBindings,
  FabEventCause,
  FabEventId,
  FabGameEvent,
  FabGameEventName,
  FabGameEventDataByName,
  FabLayerId,
  FabObjectSnapshot,
  FabProcessId,
  FabRulesCheckpointId,
  FabProposedEventGroup,
  FabRulesProcedureEventName,
  ProposedEvent,
} from "./rules/events.ts";
export {
  buildFabRulesView,
  effectivePlayerIntellect,
  findObjectZone,
} from "./rules/state-rules-view.ts";
export { quoteFabAttackTargets, quoteFabDefense, quoteFabPlay } from "./rules/legality-quotes.ts";
export type {
  FabAttackTargetCandidate,
  FabAttackTargetQuote,
  FabAttackTargetRequest,
  FabDefenseDenialReason,
  FabDefenseOrigin,
  FabDefenseQuote,
  FabDefenseRequest,
  FabPlayDenialReason,
  FabPlayOrigin,
  FabPlayQuote,
  FabPlayRequest,
} from "./rules/legality-quotes.ts";
export type {
  FabActivatedLayer,
  FabCardLayer,
  FabRulesStackLayer,
  FabTriggeredResolution,
  FabTriggeredLayer,
} from "./rules/layers.ts";
export { assertNeverLayer } from "./rules/layers.ts";
export type {
  FabDecision,
  FabDecisionAnswer,
  FabDecisionContinuation,
  FabCanonicalReplacementEffect,
  FabDelayedTrigger,
  FabDeterministicCounters,
  FabPendingTrigger,
  FabPersistedReplacement,
  FabPlayCardProcedure,
  FabReplacementCandidate,
  FabRulesProcess,
  FabRulesProcedure,
  FabRulesProcessStage,
} from "./rules/process.ts";
export { commitProposedEventBatch } from "./kernel/transaction-kernel.ts";
export type {
  DeepReadonly,
  FabCommitOptions,
  FabCommitResult,
  FabEventReducer,
  FabEventReduction,
  FabReplacementEffect,
  FabRulesSnapshot,
} from "./kernel/transaction-kernel.ts";
export {
  applyTriggerCollection,
  collectEventTriggers,
  collectStateTriggers,
  matchesTriggerEvent,
} from "./rules/trigger-matcher.ts";
export { snapshotFunctionalTriggerSources, snapshotObject } from "./rules/snapshots.ts";
export { reduceFabGameEvent } from "./kernel/event-reducer.ts";
export {
  appendFabEventGroup,
  createPlayProcedure,
  reduceFabEventJournal,
} from "./kernel/event-journal.ts";
export type { FabEventJournalResult } from "./kernel/event-journal.ts";
export { beginFabPlayProcedure, resumeFabPlayPayment } from "./procedures/play-card/index.ts";
export type { FabPlayProcedureResult } from "./procedures/play-card/index.ts";
export {
  beginFabActivationProcedure,
  quoteFabActivation,
  resumeFabActivationDeclaration,
  resumeFabActivationX,
  resumeFabActivationPayment,
} from "./procedures/activate-ability/index.ts";
export type {
  FabActivationProcedureResult,
  FabActivationQuote,
  FabActivationRequest,
} from "./procedures/activate-ability/index.ts";
export { FAB_EVENT_PRODUCTION_SUPPORT } from "./rules/event-production-support.ts";
export type { FabEventProductionSupport } from "./rules/event-production-support.ts";
export { FAB_EFFECT_SEMANTICS_BY_TYPE, effectSemanticKind } from "./rules/effect-semantics.ts";
export type { FabEffectSemanticKind, FabEffectSemanticsByType } from "./rules/effect-semantics.ts";
export { FAB_CONTINUOUS_ATOM_STAGE } from "./rules/continuous/ir.ts";
export type {
  FabContinuousApplication,
  FabContinuousAtom,
  FabContinuousAtomKind,
  FabContinuousEffectInstance,
  FabEvaluatedContribution,
  FabLayerContinuousEffectInstance,
  FabObjectRef,
  FabResolvedBindings,
  FabRuleAction,
  FabRulesStage,
  FabRulesSubjectRef,
  FabRulesTimestamp,
  FabStaticContinuousEffectInstance,
} from "./rules/continuous/ir.ts";
export {
  compileFabContinuousEffect,
  compileFabStaticPropertyAbility,
} from "./rules/continuous/compiler.ts";
export { evaluateFabRules, FabRulesEvaluationError } from "./rules/rules-evaluator.ts";
export type { EvaluateFabRulesInput } from "./rules/rules-evaluator.ts";
export type {
  FabActiveContinuousAtom,
  FabEvalContext,
  FabEvaluatedObject,
  FabEvaluatedObjectProperties,
  FabEvaluatedRule,
  FabObjectQuery,
  FabPropertyProvenance,
  FabResolvedAmount,
  FabRulesBaseObject,
  FabRulesExplanation,
  FabRulesView,
} from "./rules/rules-view.ts";
export type {
  FabContinuousCompileError,
  FabContinuousCompileInput,
  FabContinuousCompileResult,
} from "./rules/continuous/compiler.ts";
export {
  executeFabEventJournalTransaction,
  executeFabEventTransaction,
} from "./kernel/transaction/index.ts";
export {
  finishDeferredFabRulesProcess,
  resumeFabContinuousReplacementOrdering,
  resumeFabReplacementOrdering,
  commitFabReplacementConsequenceTarget,
  commitFabReplacementCostTarget,
  resumeFabReplacementCostConsequence,
} from "./kernel/process-runner/index.ts";
export type {
  FabEventJournalTransactionResult,
  FabEventTransactionOptions,
  FabEventTransactionResult,
} from "./kernel/process-runner/index.ts";
export { advanceTriggerDeclarations } from "./kernel/trigger-declaration.ts";
export type {
  FabTargetCandidate,
  FabTriggerDeclarationOptions,
} from "./kernel/trigger-declaration.ts";
export { submitFabDecision } from "./procedures/decisions/index.ts";
export type {
  FabDecisionResumeOptions,
  FabDecisionSubmission,
  FabDecisionSubmitResult,
} from "./procedures/decisions/index.ts";
export type {
  FabTriggerCollectionResult,
  FabTriggerMatchContext,
  FabTriggerSource,
} from "./rules/trigger-matcher.ts";

// ── Card definitions ──────────────────────────────────────────────────────────
export {
  toFabCardDefinition,
  registerFabCardDefinition,
  normalizeBaseObjectProperties,
  basePropertiesOf,
  baseHasDefense,
  baseHasKeyword,
  baseKeywordNames,
  basePitchValue,
  baseCardCost,
  baseCardPower,
  baseCardDefense,
  DEFAULT_HERO_INTELLECT,
  type FabCardDefinitionInput,
  type FabRegisteredCardDefinition,
  type FabKeywordRef,
} from "./cards.ts";

export {
  hitTriggerAbilities,
  pitchTriggerAbilities,
  fragmentTriggerAbilities,
  abilitiesOf,
  evaluateAbilityCondition,
  evaluateLifeComparison,
  matchLastAttackIdentity,
  comboAbilities,
} from "./abilities.ts";

// ── Deterministic RNG ─────────────────────────────────────────────────────────
export { nextRandom, seedFromString, shuffleWith, type FabPrngState } from "./random.ts";

// ── Pregame card-pool selection ──────────────────────────────────────────────
export {
  createDefaultFabPregameSelection,
  FAB_FORMAT_RULES,
  fabEquipmentSlotForDefinition,
  fabHeroDeckbuildingAccess,
  fabRequiredDeckCount,
  isFabArenaCardDefinition,
  reconcileFabPregameSelection,
  validateFabPregameSelection,
  type FabCardPoolEntry,
  type FabCardPoolSource,
  type FabFormatRules,
  type FabHeroAge,
  type FabHeroDeckbuildingAccess,
  type FabPregameFormat,
  type FabDeckSelectionEntry,
  type FabEquipmentSlot,
  type FabPregameCardPool,
  type FabPregameIssue,
  type FabPregameSelection,
  type FabPregameValidation,
} from "./pregame.ts";

// ── Initialization ────────────────────────────────────────────────────────────
export {
  DEFAULT_FAB_STARTING_LIFE,
  createFabMatchInitialState,
  drawCards,
  rollMatchRandom,
  type FabCardsMaps,
  type InitializeFabMatchInput,
} from "./initialize.ts";

// ── Moves ─────────────────────────────────────────────────────────────────────
export {
  FAB_MOVE_NAMES,
  decodeFabCommand,
  isFabMoveName,
  type FabCommand,
  type FabCommandTransition,
  type FabCommandExecutionContext,
  type FabCommandFailure,
  type FabCommandResult,
  type FabCommandStatus,
  type FabCommandSuccess,
  type FabMoveName,
  type FabMoveLog,
  type FabMoveLogMessage,
} from "./moves.ts";

// ── Runtime ───────────────────────────────────────────────────────────────────
export { applyFabCommand, FabMatchRuntime } from "./runtime.ts";

// ── Viewer Projection ─────────────────────────────────────────────────────────
export {
  FAB_FACE_DOWN,
  projectFabViewerState,
  type FabViewer,
  type FabViewerPlayerState,
  type FabViewerState,
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

// ── Fingerprint ───────────────────────────────────────────────────────────────
export const FAB_ENGINE_RUNTIME = "flesh-and-blood-engine:0.1.0:core-skeleton" as const;

// ── Test Harness ──────────────────────────────────────────────────────────────
export {
  FabTestEngine,
  FabPlayerHandle,
  FabMoveFailedError,
  createFabTestState,
  type FabCardRef,
  type FabCardLike,
  type FabTestFixture,
  type FabTestOptions,
  type FabPlayerSetup,
  type FabMatchOptions,
  type FabFixtureCardEntry,
  type FabFixtureZoneKind,
  type FabPlayerFixture,
  type FabTestCommand,
  fabToken,
} from "./testing/test-engine.ts";
export type {
  FabAttackFlowPlayOptions,
  FabArcPlayOptions,
  FabBasePlayOptions,
  FabBeatChestPlayOptions,
  FabChargePlayOptions,
  FabCrankPlayOptions,
  FabDecomposePlayOptions,
  FabDestroyThisPlayOptions,
  FabEquipToZonePlayOptions,
  FabFusePlayOptions,
  FabLightningFlowPlayOptions,
  FabSplitCardPlayOptions,
  FabModeSelection,
  FabModalAssassinPlayOptions,
  FabModalPlayOptions,
  FabNamedCardPlayOptions,
  FabNextAttackPowerPlayOptions,
  FabPayWithCogPlayOptions,
  FabPayWithGoldPlayOptions,
  FabPlayOptions,
  FabScrapPlayOptions,
} from "./testing/play-options.ts";
export {
  inspectFabTestObject,
  registerFabTestObject,
  setFabFixtureObjectSetup,
} from "./testing/test-fixtures.ts";

export {
  DEFAULT_FAB_HARNESS_CONFIG,
  normalizeFabHarnessConfig,
  orderPitchForBottom,
  selectAutoPitchPayment,
  type FabHarnessConfig,
  type FabHarnessConfigResolved,
  type FabPitchStackStrategy,
} from "./testing/harness-config.ts";

// ── Fluent test layer (card refs, must verbs, fluent asserts) ─────────────────
export {
  FabCardRefNotFoundError,
  FabAmbiguousCardRefError,
  isFabCardInstanceRef,
  makeFabInstanceRef,
  findFabInstanceZone,
  listFabCardRefs,
  resolveFabCardRef,
  fabFluentRefInstanceId,
  type FabCardInstanceRef,
  type FabCardRefFilter,
  type FabFluentCardRef,
} from "./testing/card-ref.ts";
export {
  createFabFluentMust,
  type FabFluentMust,
  type FabFluentArsenalOptions,
  type FabFluentAttackOptions,
  type FabFluentReactionOptions,
  type FabFluentRefResult,
} from "./testing/player-fluent.ts";
export {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  expectWinner,
  type FabCardAssert,
  type FabPlayerAssert,
  type FabCombatAssert,
} from "./testing/fluent-assert.ts";

// ── Automation / practice ─────────────────────────────────────────────────────
export {
  listLegalCommands,
  passOnlyStrategy,
  firstLegalStrategy,
  randomStrategy,
  heuristicStrategy,
  valueExtractStrategy,
  defendOnlyStrategy,
  neverDefendStrategy,
  heroProfileStrategy,
  rhinarStrategy,
  teklovossenStrategy,
  arakniStrategy,
  valdaStrategy,
  auroraStrategy,
  oscilioStrategy,
  zyggyStrategy,
  gravyStrategy,
  marlynnStrategy,
  puffinStrategy,
  pleiadesStrategy,
  kayoStrategy,
  lyathStrategy,
  compileTurnLine,
  playFabMatch,
  runFabBench,
  diffFabBenchReports,
  chooseAutomatedAction,
  FAB_AUTOMATED_ACTION_STRATEGIES,
  DEFAULT_FAB_AUTOMATED_ACTION_STRATEGY_ID,
  getFabAutomatedActionStrategyOption,
  getSafeFabAutomatedActionStrategyOption,
  resolveFabAutomatedActionStrategyOption,
  CATALOG_TEST_DEFINITIONS,
  ids as FAB_CATALOG_TEST_IDS,
  PRACTICE_PLAYER_1,
  PRACTICE_PLAYER_2,
  buildFabPracticeTestFixture,
  createFabPracticeMatch,
  FAB_DECK_TEXT_FIXTURES,
  DEFAULT_PLAYER_DECK_ID,
  DEFAULT_BOT_DECK_ID,
  getFabDeckTextFixture,
  getFabDeckTextFixturesByFormat,
  FAB_DECK_CATALOG,
  getFabDeck,
  listFabDecks,
  isFabTournamentDeck,
  type FabLegalCommand,
  type ListLegalCommandsOptions,
  type FabBotStrategy,
  type FabBotDecisionContext,
  type FabLineRankingHint,
  type FabAutomatedActionStrategyOption,
  type FabStrategyScope,
  type FabPracticeMatchFixtureInput,
  type FabPracticeMatch,
  type FabDeckFormat,
  type FabDeckTextFixture,
  type FabDeckCatalogEntry,
  type FabDeckCatalogFormat,
  type FabDeckCatalogQuery,
  type FabDeckKind,
  type FabHeroClass,
} from "./automation/index.ts";
