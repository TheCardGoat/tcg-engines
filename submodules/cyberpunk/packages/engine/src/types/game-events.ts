import type {
  CardZone,
  CardType,
  CardColor,
  CardClassification,
  CardKeyword,
  DieType,
} from "@tcg/cyberpunk-types";
import type { GameEvent as BaseGameEvent } from "@tcg/engine-core";
import type { CardInstanceId, PlayerId, GigDieId } from "./branded.ts";
import type { PrivateField } from "../logging/private-field.ts";

/**
 * Re-export of the engine-core game-event base type.
 * Cyberpunk's own strongly typed `GameEvent` union is kept as the
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
  | GigsSwappedEvent
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
  | DeckCardsPlacedEvent
  | LegendsShuffledEvent
  | StatModifiedEvent
  | RuleGrantedEvent
  | SearchPerformedEvent
  | CardsRevealedEvent
  | ActionLogEvent;

export interface CardMovedEvent {
  /** Ordered deck destination, when known at the time of the move. */
  deckPlacement?: "top" | "bottom";
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
  /** Last valid facts, captured before the defeat moves or detaches this card. */
  snapshot: DefeatedCardSnapshot;
  /**
   * When Gear is defeated because its host left the field, the host unit id so
   * Gear {Defeated} abilities can still resolve `selector: "host"` after detach.
   */
  hostId?: CardInstanceId;
}

export interface DefeatedCardSnapshot {
  controllerId: PlayerId;
  zone: CardZone;
  cardTypes: CardType[];
  color: CardColor;
  classifications: CardClassification[];
  keywords: CardKeyword[];
  spent: boolean;
  faceDown: boolean;
  hasLag: boolean;
  playedThisTurn?: boolean;
  cost: number;
  effectivePower: number;
  attachedGearIds: CardInstanceId[];
  attachedToId: CardInstanceId | null;
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
  previousValue?: number;
  playerId: PlayerId;
  origin: "gainGig" | "reroll";
}

export interface GigDieMovedEvent {
  type: "gigDieMoved";
  dieId: GigDieId;
  from: string;
  to: string;
  playerId: PlayerId;
  /** Present when the die changes owner. Omitted for same-seat fixer ↔ gig moves. */
  fromPlayerId?: PlayerId;
}

export interface GigStolenEvent {
  type: "gigStolen";
  dieId: GigDieId;
  /** All Gigs stolen simultaneously by the same steal action. */
  dieIds?: GigDieId[];
  fromPlayerId: PlayerId;
  toPlayerId: PlayerId;
  sourceCardId?: CardInstanceId;
}

export interface GigValueChangedEvent {
  /** Controller of the effect causing the change; null for manual/judge edits. */
  sourcePlayerId: PlayerId | null;
  type: "gigValueChanged";
  dieId: GigDieId;
  previousValue: number;
  newValue: number;
  /** Player whose effect or action adjusted the Gig. Omitted for non-adjustment value changes. */
  adjustedByPlayerId?: PlayerId;
  /** Controller of the Gig whose value changed. */
  playerId: PlayerId;
}

export interface GigsSwappedEvent {
  type: "gigsSwapped";
  dieIds: [GigDieId, GigDieId];
  /** Values and die types before control changed, in dieIds order. */
  dieValues: [number, number];
  dieTypes: [DieType, DieType];
  /** Player whose effect performed the swap. */
  playerId: PlayerId;
  /** Controllers of the dice immediately before the swap, parallel to dieIds. */
  fromPlayerIds: [PlayerId, PlayerId];
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
  rivalId: PlayerId;
  attackKind: "fight" | "direct";
  playerId: PlayerId;
}

export interface AttackResolvedEvent {
  type: "attackResolved";
  attackerId: CardInstanceId;
  defenderId: CardInstanceId | null;
  rivalId: PlayerId;
  attackKind: "fight" | "direct";
  result: "attackerWins" | "defenderWins" | "mutual" | "gigsStolen" | "blocked";
  gigsStolen?: number;
  /** Losers whose defeat a sacrificial Gear absorbs; the viewer labels these. */
  preventedCardIds?: CardInstanceId[];
  playerId: PlayerId;
}

export interface BlockerActivatedEvent {
  type: "blockerActivated";
  attackerId: CardInstanceId;
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

/** Scry or search placed looked-at cards back on the deck without shuffling. */
export interface DeckCardsPlacedEvent {
  type: "deckCardsPlaced";
  playerId: PlayerId;
}

/** Legends were turned face-down and their zone order was randomized. */
export interface LegendsShuffledEvent {
  type: "legendsShuffled";
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
  /** The acting viewer. A public reveal is also shown to their Rival. */
  playerId: PlayerId;
  audience: "public" | "private";
  /**
   * Exhaustive private viewer list for reveals that several players legally
   * see (e.g. a Rival chooses the destination of the owner's revealed deck
   * cards). Ignored for public reveals; defaults to `[playerId]`.
   */
  viewers?: readonly PlayerId[];
  /** Physical source of the cards, before any subsequent move. */
  fromZone: CardZone;
  ownerId: PlayerId;
  /**
   * Card whose ability caused the reveal (e.g. the attacking unit). Public
   * information even when the revealed identities stay private, so viewers
   * can tell why the deck is being revealed.
   */
  sourceCardId?: CardInstanceId;
}

/**
 * All known action-log message keys. Kept here so that `ActionLogEvent.messageKey`
 * is statically typed and both producers (moves) and consumers (UI, tests) share
 * the same key union without circular imports.
 */
export type ActionLogMessageKey =
  | "move.rejected"
  | "move.playCard"
  | "move.playCard.gear"
  | "move.sellCard"
  | "move.callLegend"
  | "move.attackUnit"
  | "move.attackRival"
  | "move.useBlocker"
  | "move.resolveAttack.fight.attackerWins"
  | "move.resolveAttack.fight.attackerWins.prevented"
  | "move.resolveAttack.fight.defenderWins"
  | "move.resolveAttack.fight.defenderWins.prevented"
  | "move.resolveAttack.fight.mutual"
  | "move.resolveAttack.fight.mutual.prevented"
  | "move.resolveAttack.fight.mutual.attackerPrevented"
  | "move.resolveAttack.fight.mutual.bothPrevented"
  | "move.resolveAttack.direct"
  | "move.resolveAttack.ended"
  | "move.resolveRedirectDefeat"
  | "move.readyStep.cantReady"
  | "move.turnEnded"
  | "game.overtimeStarted"
  | "game.overtimeFirstEmptyTurn"
  | "game.overtimeFinalTurn"
  | "move.concede"
  | "move.activateAbility"
  | "move.activateAbility.attached"
  | "move.searchDeck.reveal"
  | "move.searchDeck.revealNamed"
  | "move.searchDeck.revealSelected"
  | "move.resolveSearchDeck"
  | "move.resolveSearchDeckNamed"
  | "move.resolveRevealDestination"
  | "move.resolveAdjustGig"
  | "move.manualSetGigValue"
  | "move.manualMoveGig"
  | "move.manualMoveCard"
  | "move.manualAttachGear"
  | "move.manualDetachGear"
  | "move.manualExertCard"
  | "move.manualReadyCard"
  | "move.manualDrawCard"
  | "move.manualClearPendingResolution"
  | "move.manualClearTriggerStack"
  | "move.manualResetCombat"
  | "move.manualForcePassTurn"
  | "move.manualSetEddies"
  | "move.manualResetOncePerTurn"
  | "move.manualSetCardFace"
  | "move.manualReadyAll"
  | "move.manualRecomputeActiveEffects"
  | "move.manualDropEffectBagEntry"
  | "effect.discard.resolved"
  | "effect.draw.resolved"
  | "effect.draw.skipped"
  | "effect.skipped"
  | "effect.noAction"
  | "effect.noValidTargets"
  | "effect.modifyPower.resolved"
  | "effect.insufficientTargets"
  | "effect.spend.skippedAlreadySpent"
  | "effect.trashFromDeck.resolved"
  | "effect.sellFromDeck.resolved"
  | "trigger.autoResolved"
  | "trigger.resolved"
  | "trigger.orderPending"
  | "trigger.orderSelected"
  | "trigger.noValidTargets"
  | "trigger.resolutionFailed"
  | "trigger.requiredTargetUnavailable"
  | "trigger.insufficientTargets"
  | "trigger.stealGig"
  | "trigger.targetResolved"
  | "trigger.targetResolved.deckBottom"
  | "trigger.targetResolved.rerollGig"
  | "trigger.grantRule.cantAttack"
  | "trigger.defeatedTarget"
  | "trigger.defeatFailed"
  | "effect.callLegend.free"
  | "effect.callLegend.skippedAlreadyCalled"
  | "trigger.copyGigValue"
  | "trigger.copyGigValueFailed"
  | "trigger.delayedDefeat"
  | "trigger.revealTopCardType.hit"
  | "trigger.revealTopCardType.miss"
  | "setup.blankEddie"
  | "setup.firstPlayerChoice";

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
