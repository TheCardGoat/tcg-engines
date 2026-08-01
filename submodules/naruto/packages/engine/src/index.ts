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
  CHARACTER_EFFECTS,
  LEADER_EFFECTS,
  queueChoice,
  resolveChoice,
  runSupportEffect,
  startExSummon,
  startLeaderEffect,
  characterAbilityBlock,
  leaderEffectBlock,
  runCharacterAbility,
  runOnSummonTriggers,
  runWhenAttackingTriggers,
} from "./effects";
export type { CharacterEffectHandler, LeaderEffectHandler } from "./effects";
export { LOG_KEYS, pushLog } from "./log";
export type { LogKey } from "./log";
export {
  boardCharacters,
  bracketNames,
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
  faceUpChakra,
  findCharacter,
  freeSupportSlot,
  handSupportBlock,
  hasActivatableSupport,
  hasCharacterRoom,
  hasRush,
  isImmuneTo,
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
  SUPPORT_TEXT_PATTERNS,
} from "./queries";
export type { BlockReason, CharacterLocation, KoFilter, SupportTiming } from "./queries";
export { applyAction, resolveChain, startTurn } from "./reducer";
export { random, shuffle } from "./rng";
export type { RandomResult, ShuffleResult } from "./rng";
export {
  DEFAULT_RULES,
  OFFICIAL_RULES,
  PROVISIONAL_RULES,
} from "./rules";
export type { GameRules, OfficialRules, ProvisionalRules } from "./rules";
export {
  buildDeck,
  copyLimit,
  createInitialState,
  createInstances,
  createPlayerInstances,
  deckCounts,
  deckIssues,
  DEFAULT_SEED,
  defaultMatchup,
  emptySlots,
  expandCounts,
  isLegalDeck,
  playableLeaders,
  poolForLeader,
  PREBUILT_DECKS,
  prebuiltDeckList,
  randomPrebuilt,
  repairDeck,
} from "./setup";
export type { DeckIssue, DeckList, GameConfig, PlayerSetup, PrebuiltDeck } from "./setup";
export type {
  AttackerKind,
  CardInstance,
  ChainLink,
  ChakraInstance,
  CharacterInstance,
  ChoiceOption,
  ChoiceZone,
  EffectKind,
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
  TargetKind,
} from "./types";
