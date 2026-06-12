import type {
  CardDefinition,
  CardZone,
  CardTargetDSL,
  CostModifier,
  RuleModifier,
  Effect,
  SearchDeckSelect,
} from "@tcg/cyberpunk-types";
import type { ZoneRuntimeState } from "@tcg/engine-core";
import type { GameEvent } from "./game-events.ts";
import type { CardInstanceId, PlayerId, MatchId, GigDieId } from "./branded.ts";
import type { CardInstance } from "./card-instance.ts";
import type { GigDie } from "./gig-die.ts";
import type { ClockPlayerState, TimeControlConfig } from "@tcg/engine-core";

export type { ZoneRuntimeState };

export type GamePhase = "setup" | "start" | "main" | "end";

export type AttackKind = "fight" | "direct";

export interface AttackState {
  attackerId: CardInstanceId;
  defenderId: CardInstanceId | null;
  rivalId: PlayerId;
  kind: AttackKind;
  step: AttackStep;
  redirectedByBlocker?: boolean;
  gigsToSteal?: number;
  fightResult?: FightResult;
}

export type AttackStep = "offensive" | "defensive" | "fight" | "defeat" | "steal";

export type FightResult = "attackerWins" | "defenderWins" | "mutual";

export type ActiveEffectKind =
  | "powerModifier"
  | "powerMultiplier"
  | "grantRule"
  | "costModifier"
  | "defeatAtEndOfTurnIfAttacked";
export type ActiveEffectOrigin = "static" | "imperative";

export interface ActiveEffect {
  id: string;
  sourceCardId: CardInstanceId;
  targetCardId: CardInstanceId;
  kind: ActiveEffectKind;
  powerModifier?: number;
  powerMultiplier?: number;
  rule?: RuleModifier;
  costModifier?: CostModifier;
  appliesTo?: CardTargetDSL;
  playerId?: PlayerId;
  remainingUses?: number;
  triggered?: boolean;
  duration: "turn" | "continuous" | "untilSourceNextTurn";
  expiresAtStartOfTurnForPlayerId?: PlayerId;
  origin: ActiveEffectOrigin;
  abilityIndex: number;
}

export interface BagEntry {
  id: string;
  sourceCardId: CardInstanceId;
  sourcePlayerId: PlayerId;
  effectIndex: number;
  abilityText: string;
  suspended: boolean;
  /** Delayed sub-effects to execute at end of turn */
  delayedEffects?: Effect[];
  /** Snapshot of resolved bindings from when the delayed effect was created */
  resolvedBindings?: Record<string, string[]>;
}

export interface FiredAbilityEntry {
  cardId: CardInstanceId;
  abilityIndex: number;
}

export interface QueuedTrigger {
  id: string;
  sourceCardId: CardInstanceId;
  sourcePlayerId: PlayerId;
  abilityIndex: number;
  abilityText: string;
  optional?: boolean;
  event: GameEvent;
  contextTargets: Record<string, string[]>;
  boundTargets: Record<string, string[]>;
  order: number;
}

export interface ResolvingTrigger extends QueuedTrigger {
  nextEffectIndex: number;
  costsPaid?: boolean;
}

export interface TurnMetadata {
  turnNumber: number;
  activePlayerId: PlayerId;
  previousTurnNoGigTaken: boolean;
  gigTakenThisTurn: boolean;
  overtimeActive: boolean;
  pendingChoice?: PendingChoice;
  abilityFiredThisTurn: FiredAbilityEntry[];
  triggerQueue: QueuedTrigger[];
  currentTrigger?: ResolvingTrigger;
  nextTriggerId: number;
}

export type PendingChoice =
  | SearchDeckPendingChoice
  | ChooseTargetPendingChoice
  | ChooseEffectPendingChoice
  | ChooseTriggerPendingChoice
  | ChooseGigsToStealPendingChoice
  | ChooseCardToPlayPendingChoice
  | ChooseCardToMovePendingChoice
  | GainGigPendingChoice;

/** Discriminator union of every {@link PendingChoice} variant. */
export type PendingChoiceType = PendingChoice["type"];

/** Discriminator union of every {@link ChooseTargetPendingChoice} sub-type. */
export type ChooseTargetSubType = ChooseTargetPendingChoice["payload"]["type"];

export interface SearchDeckPendingChoice {
  type: "searchDeck";
  chooserId: PlayerId;
  effectId: string;
  payload: {
    player: string;
    lookCount: number;
    target: unknown;
    select: SearchDeckSelect;
    reveal: boolean;
    destination: string;
    remainder: unknown;
    /** Card instance IDs snapshotted at creation time — the revealed search window. */
    revealedCardIds: CardInstanceId[];
    sourceCardId?: CardInstanceId;
    sourcePlayerId?: PlayerId;
  };
}

export interface ChooseTargetPendingChoice {
  type: "chooseTarget";
  chooserId: PlayerId;
  effectId: string;
  payload: {
    type: "discardFromHand" | "adjustGig" | "effectTarget";
    amount?: number;
    player?: string;
    dieId?: GigDieId;
    direction?: string;
    maxAmount?: number;
    chooseUpTo?: boolean;
    targetKind?: "card" | "gig";
    eligibleIds?: string[];
    adjustGig?: {
      direction?: string;
      maxAmount?: number;
      chooseUpTo?: boolean;
    };
    min?: number;
    max?: number;
    canDecline?: boolean;
    effect?: Effect;
    sourceCardId?: CardInstanceId;
    sourcePlayerId?: PlayerId;
    abilityIndex?: number;
    ifEffects?: Effect[];
    elseEffects?: Effect[];
    contextTargets?: Record<string, string[]>;
    boundTargets?: Record<string, string[]>;
    selectedBindingId?: string;
  };
}

/**
 * One option in a `chooseEffect` modal pending choice. The contract:
 * - `id` is a stable, card-defined identifier the engine resolver uses to
 *   look up which Effect[] to apply. Must be unique within the option set.
 * - `label` is the player-facing description of this option (the AI/UI
 *   uses it for logging and surface display).
 * - `effects` is the engine's effect list for this option, applied in
 *   order when the player picks it.
 *
 * CONTRACT(chooseEffect): when the first modal-effect card lands, this
 * shape, the matching `chooseEffect` engine emitter, the
 * `resolveChooseEffect` move, and the AI resolver heuristic must all
 * land together. See `packages/engine/src/automation/resolvers/choose-effect.ts`.
 */
export interface ChooseEffectOption {
  id: string;
  label: string;
  effects: import("@tcg/cyberpunk-types").Effect[];
}

export interface ChooseEffectPendingChoice {
  type: "chooseEffect";
  chooserId: PlayerId;
  effectId: string;
  payload: { options: ChooseEffectOption[] };
}

export interface ChooseTriggerOption {
  triggerId: string;
  sourceCardId: CardInstanceId;
  sourcePlayerId: PlayerId;
  abilityIndex: number;
  abilityText: string;
  cardName: string;
  optional?: boolean;
}

export interface ChooseTriggerPendingChoice {
  type: "chooseTrigger";
  chooserId: PlayerId;
  effectId: string;
  payload: {
    options: ChooseTriggerOption[];
    canPass?: boolean;
  };
}

export interface ChooseGigsToStealPendingChoice {
  type: "chooseGigsToSteal";
  chooserId: PlayerId;
  effectId: string;
  payload: {
    count: number;
    attackerId: CardInstanceId;
    rivalId: PlayerId;
    eligibleDieIds: GigDieId[];
  };
}

export interface ChooseCardToPlayPendingChoice {
  type: "chooseCardToPlay";
  chooserId: PlayerId;
  effectId: string;
  payload: {
    cardIds: CardInstanceId[];
    free?: boolean;
    attachTo?: unknown;
    resolvedAttachToId?: string;
  };
}

export interface ChooseCardToMovePendingChoice {
  type: "chooseCardToMove";
  chooserId: PlayerId;
  effectId: string;
  payload: {
    cardIds: CardInstanceId[];
    resolvedAttachToId?: string;
    destination?: string;
    boundTargets: Record<string, string[]>;
    sourceCardId: CardInstanceId;
    sourcePlayerId: PlayerId;
    abilityIndex: number;
    ifEffects: Effect[];
    elseEffects: Effect[];
    canDecline?: boolean;
  };
}

/**
 * Step 3 of the start phase ("GAIN A GIG"). The active player picks one die
 * from their fixer area; the d20 must be taken last per the gameplay guide.
 */
export interface GainGigPendingChoice {
  type: "gainGig";
  chooserId: PlayerId;
  effectId: string;
  payload: {
    /** Die ids the player may choose from. Excludes d20 unless it's the only
     *  die left in their fixer area. */
    allowedDieIds: GigDieId[];
  };
}

export interface PlayerState {
  zones: Record<CardZone, CardInstanceId[]>;
  eddies: number;
  spentEddies: number;
  fixerArea: GigDieId[];
  gigArea: GigDieId[];
  soldThisTurn: boolean;
  calledLegendThisTurn: boolean;
  calledLegendThisRivalTurn: boolean;
  firstPlayer: boolean;
  mulliganDone: boolean;
  eddieCardIds: CardInstanceId[];
}

export interface GameState {
  players: Record<string, PlayerState>;
  cardIndex: Record<string, CardInstance>;
  gigDice: Record<string, GigDie>;
  overtime: boolean;
  turnMetadata: TurnMetadata;
  activeEffects: ActiveEffect[];
  nextEffectId: number;
  effectBag: BagEntry[];
  gamePhase: GamePhase;
  attackState: AttackState | null;
  gameEnded: boolean;
  winnerId: PlayerId | null;
  winReason: string | null;
}

export interface RngState {
  state: number;
}

export interface CyberpunkClockPlayerState extends ClockPlayerState {
  isOnClock?: boolean;
  timeoutCount?: number;
  isInNegativeTime?: boolean;
  actionBonusMsGranted?: number;
  turnPassBonusMsGranted?: number;
}

export interface EngineCtx {
  matchId: MatchId;
  stateID: number;
  playerIds: PlayerId[];
  seed: string;
  rngState: RngState | null;
  timeControl?: TimeControlConfig;
  clockState?: Record<string, CyberpunkClockPlayerState>;
}

export interface MatchState {
  G: GameState;
  ctx: EngineCtx;
}

export interface CardCatalog {
  get(definitionId: string): CardDefinition | undefined;
  entries(): IterableIterator<[string, CardDefinition]>;
  size: number;
}

export interface DeckList {
  playerId: string;
  playerName: string;
  legends: string[];
  mainDeck: string[];
}

export interface PlayerSetup {
  id: PlayerId;
  name: string;
}
