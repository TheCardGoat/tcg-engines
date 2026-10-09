import type { CardZone } from "@tcg/cyberpunk-types";
import type { CardInstanceId, GigDieId, PlayerId } from "../types/branded.ts";

export type AnimationStepKind =
  | "cardMove"
  | "cardExit"
  | "cardEnter"
  | "cardAttach"
  | "cardLand"
  | "cardReveal"
  | "legendReveal"
  | "effectTarget"
  | "resourceFloat"
  | "combat"
  | "combatRedirect"
  | "gigMove"
  | "phaseChange"
  | "entityStateChange"
  | "randomization"
  | "actionEmphasis"
  | "gameResult";

export type ResourceKind = "eddies" | "gig";

export type CardExitReason = "defeated" | "sold" | "discarded";

interface BaseStep {
  /** Stable, deterministic identifier (e.g. "step-0"). Debug-friendly. */
  id: string;
  /** Offset from script start, in milliseconds. */
  startMs: number;
  /** How long this step plays, in milliseconds. */
  durationMs: number;
  /** Origin gameEvent type — for debug/trace overlays. */
  reason: string;
}

export interface CardMoveStep extends BaseStep {
  deckPlacement?: "top" | "bottom";
  kind: "cardMove";
  cardId: CardInstanceId;
  fromZone: CardZone;
  toZone: CardZone;
  playerId: PlayerId;
  /** Authoritative identities before and after the move. */
  sourceFace?: "public" | "hidden";
  destinationFace?: "public" | "hidden";
  /** Present when this card left a host, so motion starts on that unit/legend. */
  fromHostId?: CardInstanceId;
  /** Stage a played Program at the resolving-card anchor, or move it out after resolution. */
  presentation?: "resolving-effect" | "resolved-effect";
}

export interface CardExitStep extends BaseStep {
  kind: "cardExit";
  cardId: CardInstanceId;
  fromZone: CardZone;
  toZone: CardZone;
  playerId: PlayerId;
  exitReason: CardExitReason;
  /** Present when this card left a host, so motion starts on that unit/legend. */
  fromHostId?: CardInstanceId;
}

export interface CardEnterStep extends BaseStep {
  kind: "cardEnter";
  cardId: CardInstanceId;
  toZone: CardZone;
  playerId: PlayerId;
}

/**
 * A gear slides from a player's hand onto its host unit and "snaps" into
 * the gear stack. Emitted instead of `cardMove` when an attach happens —
 * the attach step owns both motion and the host emphasis pulse.
 */
export interface CardAttachStep extends BaseStep {
  kind: "cardAttach";
  gearId: CardInstanceId;
  hostId: CardInstanceId;
  playerId: PlayerId;
}

/**
 * A short emphasis pulse on a card right after it lands in its
 * destination zone — communicates "this card was just played" without
 * extra motion. Emitted for `cardPlayed` of cards that remain visible
 * (units onto field; gear is handled by `cardAttach` instead).
 */
export interface CardLandStep extends BaseStep {
  kind: "cardLand";
  cardId: CardInstanceId;
  playerId: PlayerId;
}

/**
 * A public reveal of one or more cards from a hidden zone. The revealed card
 * becomes public during the animation and can optionally settle into its
 * resulting destination zone.
 */
export interface CardRevealStep extends BaseStep {
  kind: "cardReveal";
  cardId: CardInstanceId;
  fromZone: CardZone;
  toZone?: CardZone;
  deckPlacement?: "top" | "bottom";
  audience: "public" | "private";
  viewerId: PlayerId;
  /**
   * Every private viewer of the reveal identities; `undefined` means only
   * `viewerId`. Ignored for public reveals.
   */
  viewerIds?: readonly PlayerId[];
  /** Owner of the physical source and destination zones, not the viewer. */
  ownerId: PlayerId;
  /** Card whose ability caused the reveal, for the display cue's caption. */
  sourceCardId?: CardInstanceId;
}

/**
 * A face-down Legend flips into its revealed card. The card stays in the
 * legend area; this is an identity/state reveal rather than a zone move.
 */
export interface LegendRevealStep extends BaseStep {
  kind: "legendReveal";
  cardId: CardInstanceId;
  playerId: PlayerId;
  /** Preserve the Legend's physical orientation while its face changes. */
  fromRotationDeg?: number;
  toRotationDeg?: number;
}

export type EffectTargetSpec =
  | { kind: "card"; cardId: CardInstanceId }
  | { kind: "gig"; dieId: GigDieId }
  | { kind: "player"; playerId: PlayerId };

/**
 * Brief beam/ray drawn from a source card to one or more target cards or
 * gig dice. Used when a Program (or other effect-bearing card) targets
 * something on resolution — the beam visually establishes causality
 * before the per-target events animate.
 */
export interface EffectTargetStep extends BaseStep {
  kind: "effectTarget";
  sourceCardId: CardInstanceId;
  targets: EffectTargetSpec[];
  playerId: PlayerId;
  presentation?: "source-card" | "resolving-program";
  sourceExit?: { zone: CardZone; playerId: PlayerId };
  label?: string;
  tone?: "positive" | "negative" | "neutral";
}

export interface ResourceFloatStep extends BaseStep {
  kind: "resourceFloat";
  resource: ResourceKind;
  playerId: PlayerId;
  /** Signed delta (negative = spent, positive = gained). */
  delta: number;
  dieId?: GigDieId;
  previousValue?: number;
  newValue?: number;
}

export interface CombatStep extends BaseStep {
  kind: "combat";
  attackerId: CardInstanceId;
  defenderId: CardInstanceId | null;
  rivalId: PlayerId;
  attackKind: "fight" | "direct";
  gigsStolen?: number;
  result?: "attackerWins" | "defenderWins" | "mutual" | "gigsStolen" | "blocked";
  defeatedCardIds?: CardInstanceId[];
  /** Participants whose defeat a sacrificial Gear absorbed; labeled on the result beat. */
  preventedCardIds?: CardInstanceId[];
  playerId: PlayerId;
}

export interface CombatRedirectStep extends BaseStep {
  kind: "combatRedirect";
  attackerId: CardInstanceId;
  blockerId: CardInstanceId;
  originalTargetId: CardInstanceId | null;
  playerId: PlayerId;
}

export interface GigMoveStep extends BaseStep {
  kind: "gigMove";
  dieId: GigDieId;
  from: "fixerArea" | "gigArea";
  to: "fixerArea" | "gigArea";
  fromPlayerId: PlayerId;
  toPlayerId: PlayerId;
  moveKind: "gain" | "steal" | "correct";
}

export interface PhaseChangeStep extends BaseStep {
  kind: "phaseChange";
  from: string;
  to: string;
  playerId: PlayerId;
  variant?: "phase" | "turn";
  turnPlayerId?: PlayerId;
  turnNumber?: number;
}

export interface EntityStateChangeStep extends BaseStep {
  kind: "entityStateChange";
  cardId: CardInstanceId;
  playerId: PlayerId;
  change: "spent" | "readied";
}

export interface RandomizationStep extends BaseStep {
  kind: "randomization";
  playerId: PlayerId;
  randomization: "shuffle";
  zone: "deck" | "legendArea";
}

export interface GameResultStep extends BaseStep {
  kind: "gameResult";
  winnerId: PlayerId | null;
  reasonLabel: string;
}

/** A visual acknowledgment for a choice that has no physical game event. */
export interface ActionEmphasisStep extends BaseStep {
  kind: "actionEmphasis";
  target:
    | { kind: "card"; cardId: CardInstanceId }
    | { kind: "zone"; zone: "hand" | "deck" | "field" | "trash"; playerId: PlayerId };
  tone: "neutral" | "positive" | "negative";
  /**
   * Short display label for debuff-style acknowledgments (e.g. "CAN'T ATTACK"
   * for a granted cantAttack rule). Absent for neutral/positive pulses.
   */
  label?: string;
}

export type AnimationStep =
  | CardMoveStep
  | CardExitStep
  | CardEnterStep
  | CardAttachStep
  | CardLandStep
  | CardRevealStep
  | LegendRevealStep
  | EffectTargetStep
  | ResourceFloatStep
  | CombatStep
  | CombatRedirectStep
  | GigMoveStep
  | PhaseChangeStep
  | EntityStateChangeStep
  | RandomizationStep
  | ActionEmphasisStep
  | GameResultStep;

export interface AnimationScript {
  steps: AnimationStep[];
  totalDurationMs: number;
}

export const EMPTY_ANIMATION_SCRIPT: AnimationScript = Object.freeze({
  steps: [],
  totalDurationMs: 0,
});
