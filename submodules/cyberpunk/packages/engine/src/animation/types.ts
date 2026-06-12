import type { CardZone } from "@tcg/cyberpunk-types";
import type { CardInstanceId, GigDieId, PlayerId } from "../types/branded.ts";

export type AnimationStepKind =
  | "cardMove"
  | "cardExit"
  | "cardEnter"
  | "cardAttach"
  | "cardLand"
  | "legendReveal"
  | "effectTarget"
  | "resourceFloat"
  | "combat"
  | "gigMove"
  | "phaseChange";

export type ResourceKind = "eddies";

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
  kind: "cardMove";
  cardId: CardInstanceId;
  fromZone: CardZone;
  toZone: CardZone;
  playerId: PlayerId;
}

export interface CardExitStep extends BaseStep {
  kind: "cardExit";
  cardId: CardInstanceId;
  fromZone: CardZone;
  playerId: PlayerId;
  exitReason: CardExitReason;
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
 * A face-down Legend flips into its revealed card. The card stays in the
 * legend area; this is an identity/state reveal rather than a zone move.
 */
export interface LegendRevealStep extends BaseStep {
  kind: "legendReveal";
  cardId: CardInstanceId;
  playerId: PlayerId;
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
}

export interface ResourceFloatStep extends BaseStep {
  kind: "resourceFloat";
  resource: ResourceKind;
  playerId: PlayerId;
  /** Signed delta (negative = spent, positive = gained). */
  delta: number;
}

export interface CombatStep extends BaseStep {
  kind: "combat";
  attackerId: CardInstanceId;
  defenderId: CardInstanceId | null;
  attackKind: "fight" | "direct";
  playerId: PlayerId;
}

export interface GigMoveStep extends BaseStep {
  kind: "gigMove";
  dieId: GigDieId;
  from: "fixerArea" | "gigArea";
  to: "gigArea";
  fromPlayerId: PlayerId;
  toPlayerId: PlayerId;
  moveKind: "gain" | "steal";
}

export interface PhaseChangeStep extends BaseStep {
  kind: "phaseChange";
  from: string;
  to: string;
  playerId: PlayerId;
}

export type AnimationStep =
  | CardMoveStep
  | CardExitStep
  | CardEnterStep
  | CardAttachStep
  | CardLandStep
  | LegendRevealStep
  | EffectTargetStep
  | ResourceFloatStep
  | CombatStep
  | GigMoveStep
  | PhaseChangeStep;

export interface AnimationScript {
  steps: AnimationStep[];
  totalDurationMs: number;
}

export const EMPTY_ANIMATION_SCRIPT: AnimationScript = Object.freeze({
  steps: [],
  totalDurationMs: 0,
});
