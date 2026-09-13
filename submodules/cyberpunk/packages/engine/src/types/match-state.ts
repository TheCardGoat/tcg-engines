import type {
  CardDefinition,
  CardZone,
  CardTargetDSL,
  CostModifier,
  RuleModifier,
  Effect,
  DelayedEffect,
  ScryDestination,
  CardType,
  Condition,
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

export type AttackStep = "attack" | "react" | "fight" | "steal";

export type FightResult = "attackerWins" | "defenderWins" | "mutual";

export type ActiveEffectKind =
  | "powerModifier"
  | "powerMultiplier"
  | "grantRule"
  | "costModifier"
  | "defeatAtEndOfTurnIfAttacked"
  | "preventNextRivalFightDefeat"
  | "nextFightWinGigSteal"
  | "winsFightsAgainst"
  | "defeatRivalOnNextFriendlyFightLoss"
  | "rivalGoSoloCostIncrease";
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
  minPowerMargin?: number;
  winsFightsAgainst?: { classifications: string[] };
  amount?: number;
  conditions?: Condition[];
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
  /** Delayed sub-effects to execute at a later timing */
  delayedEffects?: Effect[];
  delayedTiming?: DelayedEffect["timing"];
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
  /**
   * Resume index into the main ability `effects` list (not option/nested bodies).
   */
  nextEffectIndex: number;
  costsPaid?: boolean;
  /**
   * Nested effect body mid-resolution (chooseEffect option, partial expansion,
   * if/else follow-ups). Resume runs this list first; `nextEffectIndex` on the
   * outer ability is preserved independently.
   */
  continuation?: {
    effects: import("@tcg/cyberpunk-types").Effect[];
    nextIndex: number;
  };
  remainingEffects?: Effect[];
}

export interface TurnMetadata {
  turnNumber: number;
  activePlayerId: PlayerId;
  previousTurnNoGigTaken: boolean;
  gigTakenThisTurn: boolean;
  playedCardTypesThisTurn: Partial<Record<string, CardType[]>>;
  overtimeActive: boolean;
  suspendedEndTurn?: {
    playerId: PlayerId;
    turnNumber: number;
  };
  pendingChoice?: PendingChoice;
  abilityFiredThisTurn: FiredAbilityEntry[];
  triggerQueue: QueuedTrigger[];
  currentTrigger?: ResolvingTrigger;
  nextTriggerId: number;
}

export type PendingChoice =
  | ScryPendingChoice
  | RevealDestinationPendingChoice
  | ChooseTargetPendingChoice
  | ChooseEffectPendingChoice
  | ChooseTriggerPendingChoice
  | ChooseGigsToStealPendingChoice
  | PreventGigStealPendingChoice
  | ChooseCardToPlayPendingChoice
  | ChooseCardToMovePendingChoice
  | ChooseCardTypePendingChoice
  | GainGigPendingChoice;

/** Discriminator union of every {@link PendingChoice} variant. */
export type PendingChoiceType = PendingChoice["type"];

/** Discriminator union of every {@link ChooseTargetPendingChoice} sub-type. */
export type ChooseTargetSubType = ChooseTargetPendingChoice["payload"]["type"];

export interface ScryPendingChoice {
  type: "scry";
  chooserId: PlayerId;
  effectId: string;
  payload: {
    player: string;
    amount: number;
    destinations: ScryDestination[];
    /** Card instance IDs snapshotted at creation time — the revealed search window. */
    revealedCardIds: CardInstanceId[];
    sourceCardId?: CardInstanceId;
    sourcePlayerId?: PlayerId;
  };
}

export interface RevealDestinationPendingChoice {
  type: "revealDestination";
  chooserId: PlayerId;
  effectId: string;
  payload: {
    player: PlayerId;
    destinations: ["hand", "trash"];
    revealedCardIds: CardInstanceId[];
    sourceCardId?: CardInstanceId;
    sourcePlayerId?: PlayerId;
    drawIfDestination?: {
      destination: "hand" | "trash";
      player: PlayerId;
      amount: number;
    };
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
    logReason?: "costMatchedFriendlyGig";
    contextTargets?: Record<string, string[]>;
    boundTargets?: Record<string, string[]>;
    selectedBindingId?: string;
    targetPurpose?: "attachHost" | "playCard";
    availableEddiesAfterCosts?: number;
    effectiveCostsByCardId?: Record<string, number>;
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
  payload: {
    options: ChooseEffectOption[];
    sourceCardId: CardInstanceId;
    sourcePlayerId: PlayerId;
    abilityIndex: number;
    boundTargets: Record<string, string[]>;
    contextTargets: Record<string, string[]>;
  };
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

/**
 * Offered to the defending player (the rival about to have a Gig stolen) when
 * they control a card with the `preventsGigStealByDiscard` rule (e.g. Alt
 * Cunningham — Mother of Daemons). For each Gig a rival Unit would steal, the
 * defender may discard one hand card whose cost equals that Gig's face value to
 * keep the Gig. The resolver move discards the chosen cards and steals only the
 * remaining dice.
 */
export interface PreventGigStealPendingChoice {
  type: "preventGigSteal";
  chooserId: PlayerId;
  effectId: string;
  payload: {
    attackerId: CardInstanceId;
    rivalId: PlayerId;
    attackerName: string;
    attackerPower: number;
    /** Each Gig about to be stolen, with its current face value. */
    stealEntries: Array<{ dieId: GigDieId; value: number }>;
    /** Snapshot of the defender's discard-eligible hand cards (cost included). */
    handEntries: Array<{ cardId: CardInstanceId; cost: number }>;
    /** Present when a card effect, rather than a direct attack, is stealing the Gigs. */
    effectSteal?: {
      sourcePlayerId: PlayerId;
      sourceCardId: CardInstanceId;
    };
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
    boundTargets?: Record<string, string[]>;
    sourceCardId?: CardInstanceId;
    sourcePlayerId?: PlayerId;
    abilityIndex?: number;
    ifEffects?: Effect[];
    /**
     * Applied when the player declines an optional free-play offer
     * (e.g. Judy Álvarez — Nothing to Doubt: add the revealed card to hand).
     */
    elseEffects?: Effect[];
    canDecline?: boolean;
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
    /**
     * Optional binding id. When set, the chosen card ids are published into the
     * trigger's persistent boundTargets[outputBinding] (a `string[]`, even when
     * `selection.max` is 1) after resolution, so a later effect in the same
     * ability can reference the just-moved card(s) (e.g. "play the Gear you
     * just recovered from trash").
     */
    outputBinding?: string;
  };
}

export interface ChooseCardTypePendingChoice {
  type: "chooseCardType";
  chooserId: PlayerId;
  effectId: string;
  payload: {
    cardTypes: CardType[];
    sourceCardId: CardInstanceId;
    sourcePlayerId: PlayerId;
    abilityIndex: number;
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
