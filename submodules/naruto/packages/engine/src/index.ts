/**
 * @tcg-engines/naruto-engine — pure rules engine for the Naruto Card Game
 * (provisional rules; see README). No UI, no networking, no runtime deps.
 */

export type { Action, ActionType } from "./actions";
export type {
  ActivateCharacterAction,
  ActivateSupportAction,
  ActivateSupportFromHandAction,
  DeclareAttackAction,
  EndTurnAction,
  LeaderEffectAction,
  MulliganAction,
  PassCounterAction,
  RecoveryAction,
  ResolveChoiceAction,
  SetSupportAction,
  SummonAction,
} from "./actions";
export { chooseAiAction, scoreOption } from "./ai";
export {
  EFFECT_COVERAGE,
  incompleteEffectCoverage,
  nonVanillaCardIds,
  unaccountedEffectCardIds,
} from "./effect-coverage";
export type { EffectCoverageEntry, EffectCoverageStatus } from "./effect-coverage";
export {
  CHARACTER_EFFECTS,
  LEADER_EFFECTS,
  queueChoice,
  resolveChoice,
  runSupportEffect,
  startExSummon,
  startLeaderEffect,
  characterAbilityBlock,
  hasCharacterActivateMain,
  hasLeaderEffect,
  leaderEffectBlock,
  runCharacterAbility,
  runOnSummonTriggers,
  runWhenAttackingTriggers,
} from "./effects";
export type { CharacterEffectHandler, LeaderEffectHandler } from "./effects";
export { SUPPORT_EFFECTS, supportEffectOf, supportEffectSummonsCard } from "./support-effects";
export type { SupportEffectDefinition, SupportTiming } from "./support-effects";
export { LOG_KEYS, pushLog } from "./log";
export type { LogKey } from "./log";
export {
  boardCharacters,
  canAct,
  canBeAttacked,
  canSummonEx,
  cardOf,
  chainLinkOf,
  characterAttackBlock,
  characterHealth,
  characterPower,
  deciderOf,
  effectivePower,
  exRequirements,
  EX_REQUIREMENTS_BY_CARD_ID,
  faceUpChakra,
  findCharacter,
  freeSupportSlot,
  handSupportBlock,
  hasActivatableSupport,
  hasCharacterRoom,
  hasRush,
  isImmuneTo,
  isImmuneToEffect,
  koTargets,
  leaderAttackBlock,
  leaderUid,
  newCharacter,
  nextCharacterSlot,
  opponentOf,
  otherPlayer,
  requirementAssignable,
  requirementCandidates,
  requirementOptions,
  supportableTargets,
  supportActivationBlock,
  supportBlock,
  supportTimingClass,
} from "./queries";
export type { BlockReason, CharacterLocation, KoFilter } from "./queries";
export { applyAction, resolveChain, startTurn } from "./reducer";
export { random, shuffle } from "./rng";
export type { RandomResult, ShuffleResult } from "./rng";
export {
  CONFIRMED_STRUCTURAL_RULES,
  NARUTO_PREVIEW_RULES_PROFILE,
  NARUTO_RULES_SOURCE,
  PROVISIONAL_RULES,
} from "./rules";
export type {
  ConfirmedStructuralRules,
  ProvisionalRules,
  RuleSourceReference,
  RulesProfile,
} from "./rules";
export {
  buildDeck,
  copyLimit,
  createInitialState,
  createInstances,
  createPlayerInstances,
  createPracticePlayerInstances,
  createPracticeState,
  deckCounts,
  deckIssues,
  DEFAULT_SEED,
  defaultPreviewMatchup,
  emptySlots,
  expandCounts,
  isLegalDeck,
  playableLeaders,
  poolForLeader,
  practiceDeckIssues,
  PREVIEW_CHAKRA_CARD_IDS,
  PREVIEW_DECKS,
  PREVIEW_SUMMON_CARD_ID,
  previewDeckList,
  randomPreviewDeck,
  repairDeck,
} from "./setup";
export type { DeckIssue, DeckList, GameConfig, PlayerSetup, PreviewDeck } from "./setup";
export type {
  AttackerKind,
  AttackTarget,
  CardInstance,
  ChainLink,
  ChakraInstance,
  CharacterInstance,
  ChoiceOption,
  ChoiceZone,
  EffectKind,
  EffectSourceKind,
  GameState,
  LogActor,
  LogEntry,
  PendingAttack,
  PendingChoice,
  Phase,
  PlayerId,
  PlayerState,
  ResolvingSupport,
  Step,
  SupportInstance,
  SummonInstance,
  TargetKind,
} from "./types";
