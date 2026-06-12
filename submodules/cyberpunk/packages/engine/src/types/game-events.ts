import type { CardZone } from "@tcg/cyberpunk-types";
import type { GameEvent as BaseGameEvent } from "@tcg/engine-core";
import type { CardInstanceId, PlayerId, GigDieId } from "./branded.ts";
import type { PrivateField } from "../logging/private-field.ts";

/**
 * Re-export of the engine-core game-event base type.
 * Cyberpunk's own `GameEvent` union (37 specific event types) is kept as the
 * primary export because it carries strongly-typed payload shapes.
 */
export type { BaseGameEvent };

export type GameEvent =
  | CardMovedEvent
  | CardsDrawnEvent
  | CardPlayedEvent
  | CardDefeatedEvent
  | CardSpentEvent
  | CardReadiedEvent
  | EddiesSpentEvent
  | EddiesGainedEvent
  | GigDieRolledEvent
  | GigDieMovedEvent
  | GigStolenEvent
  | GigValueChangedEvent
  | LegendFlippedEvent
  | LegendCalledEvent
  | CardSoldEvent
  | AttackDeclaredEvent
  | AttackResolvedEvent
  | BlockerActivatedEvent
  | TurnStartedEvent
  | TurnEndedEvent
  | PhaseChangedEvent
  | GameEndedEvent
  | CardAttachedEvent
  | CardDetachedEvent
  | EffectTriggeredEvent
  | EffectTargetedEvent
  | DeckShuffledEvent
  | StatModifiedEvent
  | RuleGrantedEvent
  | SearchPerformedEvent
  | CardsRevealedEvent
  | ActionLogEvent;

export interface CardMovedEvent {
  type: "cardMoved";
  cardId: CardInstanceId;
  fromZone: CardZone;
  toZone: CardZone;
  playerId: PlayerId;
}

export interface CardsDrawnEvent {
  type: "cardsDrawn";
  playerId: PlayerId;
  count: number;
  cardIds: CardInstanceId[];
}

export interface CardPlayedEvent {
  type: "cardPlayed";
  cardId: CardInstanceId;
  playerId: PlayerId;
  cost: number;
}

export interface CardDefeatedEvent {
  type: "cardDefeated";
  cardId: CardInstanceId;
  defeatedBy: CardInstanceId | null;
  playerId: PlayerId;
}

export interface CardSpentEvent {
  type: "cardSpent";
  cardId: CardInstanceId;
  playerId: PlayerId;
}

export interface CardReadiedEvent {
  type: "cardReadied";
  cardId: CardInstanceId;
  playerId: PlayerId;
}

export interface EddiesSpentEvent {
  type: "eddiesSpent";
  playerId: PlayerId;
  amount: number;
  forWhat: string;
}

export interface EddiesGainedEvent {
  type: "eddiesGained";
  playerId: PlayerId;
  amount: number;
}

export interface GigDieRolledEvent {
  type: "gigDieRolled";
  dieId: GigDieId;
  dieType: string;
  result: number;
  playerId: PlayerId;
}

export interface GigDieMovedEvent {
  type: "gigDieMoved";
  dieId: GigDieId;
  from: string;
  to: string;
  playerId: PlayerId;
}

export interface GigStolenEvent {
  type: "gigStolen";
  dieId: GigDieId;
  fromPlayerId: PlayerId;
  toPlayerId: PlayerId;
  sourceCardId?: CardInstanceId;
}

export interface GigValueChangedEvent {
  type: "gigValueChanged";
  dieId: GigDieId;
  previousValue: number;
  newValue: number;
  playerId: PlayerId;
}

export interface LegendFlippedEvent {
  type: "legendFlipped";
  cardId: CardInstanceId;
  playerId: PlayerId;
}

export interface LegendCalledEvent {
  type: "legendCalled";
  cardId: CardInstanceId;
  playerId: PlayerId;
}

export interface CardSoldEvent {
  type: "cardSold";
  cardId: CardInstanceId;
  playerId: PlayerId;
}

export interface AttackDeclaredEvent {
  type: "attackDeclared";
  attackerId: CardInstanceId;
  defenderId: CardInstanceId | null;
  attackKind: "fight" | "direct";
  playerId: PlayerId;
}

export interface AttackResolvedEvent {
  type: "attackResolved";
  attackerId: CardInstanceId;
  defenderId: CardInstanceId | null;
  attackKind: "fight" | "direct";
  result: "attackerWins" | "defenderWins" | "mutual" | "gigsStolen" | "blocked";
  gigsStolen?: number;
  playerId: PlayerId;
}

export interface BlockerActivatedEvent {
  type: "blockerActivated";
  blockerId: CardInstanceId;
  originalTarget: CardInstanceId | null;
  playerId: PlayerId;
}

export interface TurnStartedEvent {
  type: "turnStarted";
  playerId: PlayerId;
  turnNumber: number;
}

export interface TurnEndedEvent {
  type: "turnEnded";
  playerId: PlayerId;
  turnNumber: number;
}

export interface PhaseChangedEvent {
  type: "phaseChanged";
  from: string;
  to: string;
  playerId: PlayerId;
}

export interface GameEndedEvent {
  type: "gameEnded";
  winnerId: PlayerId | null;
  reason: string;
}

export interface CardAttachedEvent {
  type: "cardAttached";
  gearId: CardInstanceId;
  hostId: CardInstanceId;
  playerId: PlayerId;
}

export interface CardDetachedEvent {
  type: "cardDetached";
  gearId: CardInstanceId;
  hostId: CardInstanceId;
  playerId: PlayerId;
}

export interface EffectTriggeredEvent {
  type: "effectTriggered";
  sourceCardId: CardInstanceId;
  effectType: string;
  playerId: PlayerId;
}

export type EffectTarget =
  | { kind: "card"; cardId: CardInstanceId }
  | { kind: "gig"; dieId: GigDieId }
  | { kind: "player"; playerId: PlayerId };

/**
 * Emitted when the player resolves an effect's target picker — pairs the
 * source card with the chosen targets so animation/log consumers can draw
 * a connection between them before the per-target events (cardMoved /
 * gigValueChanged / etc.) fire.
 */
export interface EffectTargetedEvent {
  type: "effectTargeted";
  sourceCardId: CardInstanceId;
  targets: EffectTarget[];
  playerId: PlayerId;
}

export interface DeckShuffledEvent {
  type: "deckShuffled";
  playerId: PlayerId;
}

export interface StatModifiedEvent {
  type: "statModified";
  cardId: CardInstanceId;
  stat: string;
  modifier: number;
}

export interface RuleGrantedEvent {
  type: "ruleGranted";
  cardId: CardInstanceId;
  rule: string;
}

export interface SearchPerformedEvent {
  type: "searchPerformed";
  playerId: PlayerId;
  zone: string;
  found: number;
}

export interface CardsRevealedEvent {
  type: "cardsRevealed";
  cardIds: CardInstanceId[];
  playerId: PlayerId;
}

/**
 * All known action-log message keys. Kept here so that `ActionLogEvent.messageKey`
 * is statically typed and both producers (moves) and consumers (UI, tests) share
 * the same key union without circular imports.
 */
export type ActionLogMessageKey =
  | "move.playCard"
  | "move.playCard.gear"
  | "move.sellCard"
  | "move.callLegend"
  | "move.attackUnit"
  | "move.attackRival"
  | "move.useBlocker"
  | "move.resolveAttack.fight.attackerWins"
  | "move.resolveAttack.fight.defenderWins"
  | "move.resolveAttack.fight.mutual"
  | "move.resolveAttack.direct"
  | "move.turnEnded"
  | "move.concede"
  | "move.activateAbility"
  | "move.searchDeck.reveal"
  | "move.resolveSearchDeck"
  | "move.resolveAdjustGig"
  | "effect.draw.resolved"
  | "effect.draw.skipped"
  | "trigger.autoResolved"
  | "trigger.resolved"
  | "trigger.noValidTargets"
  | "trigger.stealGig"
  | "trigger.targetResolved"
  | "trigger.targetResolved.deckBottom"
  | "trigger.grantRule.cantAttack"
  | "trigger.defeatedTarget"
  | "effect.callLegend.free"
  | "trigger.copyGigValue"
  | "trigger.copyGigValueCapped"
  | "trigger.delayedDefeat";

/**
 * Emitted when the engine provides a localised, human-readable summary of a
 * player-visible action or outcome. Not every valid move is guaranteed to emit
 * an action log event, so consumers should treat this as an optional summary
 * layer rather than a complete per-move audit trail.
 *
 * Carries a locale message key and interpolation params so that any UI layer
 * can render what just happened without needing to reconstruct it from raw
 * state diffs.
 */
export interface ActionLogEvent {
  type: "actionLog";
  /** Dot-separated locale key; one of {@link ActionLogMessageKey}. */
  messageKey: ActionLogMessageKey;
  /** Named values interpolated into the localised template string. */
  params: Record<
    string,
    string | number | readonly string[] | PrivateField<string | number | readonly string[]>
  >;
  /** The player who triggered the move. */
  playerId: PlayerId;
  /** Discriminator tag for log categorisation (e.g. "search", "combat"). */
  category?: string;
  /** Card instance IDs referenced by this log — UI uses these for visibility checks. */
  cardIds?: string[];
}
