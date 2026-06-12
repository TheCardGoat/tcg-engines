/**
 * Lorcana Domain Events
 *
 * Type-safe domain event definitions for the Lorcana engine.
 * Each event type maps to its payload structure.
 */

import type { EventAPI, GameEvent } from "#core";
import type { CardInstanceId, PlayerId } from "#core";
import type { Classification } from "@tcg/lorcana-types";
import { getLogger } from "@logtape/logtape";
const logger = getLogger("domain-events");

// =============================================================================
// Event Payload Interfaces
// =============================================================================

export interface DynamicAmountEventSnapshot {
  lastEffectPerformed?: boolean;
  triggerBatchKey?: string;
  triggerAmount?: number;
  playedCardSingerCount?: number;
  playedCardUsedShift?: boolean;
  strengthBeforeBanish?: number;
  cardsUnderCountBeforeBanish?: number;
  cardsUnderIdsBeforeBanish?: ReadonlyArray<CardInstanceId>;
  classificationsBeforeBanish?: ReadonlyArray<Classification>;
  keywordsBeforeBanish?: ReadonlyArray<string>;
  damageDealt?: number;
  healedAmount?: number;
  lastEffectTargetCount?: number;
  revealedCardIds?: ReadonlyArray<CardInstanceId>;
  /** Card ID of the last card returned from discard in the current effect sequence */
  lastReturnedFromDiscardCardId?: CardInstanceId;
  revealWindowIds?: ReadonlyArray<string>;
  /** Card IDs discarded during the current effect sequence (accumulated across multiple discard steps) */
  discardedCardIds?: ReadonlyArray<CardInstanceId>;
  /** Number of cards drawn during the current effect sequence (accumulated across multiple draw steps) */
  drawnCount?: number;
  /**
   * Per-draw snapshot: how many cards the drawing player has drawn this turn
   * at the moment this specific draw event was emitted. Used to evaluate
   * "cards-drawn-by-player" turn-metric conditions per event rather than
   * against the batch-updated game state.
   */
  drawCountForPlayerThisTurn?: number;
  namedCardName?: string;
  chosenCardId?: CardInstanceId;
  chosenCardCost?: number;
  subjectCardId?: CardInstanceId;
  triggerSourceCardId?: CardInstanceId;
  attackerId?: CardInstanceId;
  defenderId?: CardInstanceId;
  fromZone?: string;
  toZone?: string;
  subjectAtLocationId?: CardInstanceId;
  charactersAtSourceLocationBeforeBanish?: ReadonlyArray<CardInstanceId>;
  vanishChosenCards?: ReadonlyArray<{
    cardId: CardInstanceId;
    chooserId: PlayerId;
  }>;
  /**
   * Card IDs that were explicitly targeted in earlier steps of the current
   * effect sequence. Used by {@link requireDifferentTargets} to exclude prior
   * targets from the candidate pool when a staged sequence resolves each step
   * as a separate pending effect (e.g. Three Arrows: step 1 deals 2 damage to
   * a chosen character, step 2 may deal 1 damage to *another* chosen character).
   *
   * Accumulated across multiple steps — each resolving step appends its
   * targets to preserve the full prior-target set.
   */
  previouslyTargetedCardIds?: ReadonlyArray<CardInstanceId>;
}

export interface CardExertedPayload {
  cardId: CardInstanceId;
  source?: string;
  isManual?: boolean;
}

export interface CardReadiedPayload {
  cardId: CardInstanceId;
  source?: string;
  zone?: string;
  isManual?: boolean;
}

export interface AllCardsReadiedPayload {
  playerId: PlayerId;
  count: number;
}

export type DamageDealtPayload =
  | {
      targetId: CardInstanceId;
      amount: number;
      newDamage: number;
      sourceId?: CardInstanceId;
      damageType: "combat" | "effect" | "put";
    }
  | {
      cardId: CardInstanceId;
      damage: number;
      isManual: true;
    };

export interface DamageMovedPayload {
  sourceCharacterId: CardInstanceId;
  targetId: CardInstanceId;
  amount: number;
  abilitySourceId: CardInstanceId;
}

export type CardMovedPayload =
  | {
      cardId: CardInstanceId;
      fromZone: string;
      toZone: string;
      playerId: PlayerId;
    }
  | {
      cardId: CardInstanceId;
      toZone: string;
      position: "top" | "bottom" | number | null;
      isManual: true;
    };

export interface CardBanishedPayload {
  cardId: CardInstanceId;
  sourceId: CardInstanceId | null;
  reason: string;
  snapshot?: DynamicAmountEventSnapshot;
}

export interface InkChangedPayload {
  playerId: PlayerId;
  operation: "add" | "remove" | "set";
  newTotal: number;
  amount: number;
  newAvailable: number;
}

export type LoreChangedPayload =
  | {
      playerId: PlayerId;
      operation: "add" | "remove" | "set";
      previousLore: number;
      source: string;
      amount: number;
      newLore: number;
    }
  | {
      playerId: PlayerId;
      oldLore: number;
      newLore: number;
      isManual: true;
    };

export interface QuestCompletedPayload {
  cardId: CardInstanceId;
  playerId: PlayerId;
  loreGained: number;
}

export interface CardsDrawnPayload {
  playerId: PlayerId;
  amount: number;
  cardIds?: CardInstanceId[];
  /** Present only on mandatory start-of-turn draws; used to route to the turnStart log instead of move outcomes. */
  source?: "mandatory-draw";
}

export interface CardsDiscardedPayload {
  playerId: PlayerId;
  amount: number;
  cardIds: CardInstanceId[];
}

export interface TurnPassedPayload {
  previousPlayer: PlayerId;
  newPlayer: PlayerId;
}

export interface CardPlayedPayload {
  playerId: PlayerId;
  cardId: CardInstanceId;
  cardType: "character" | "action" | "item" | "location";
  costType:
    | "standard"
    | "shift"
    | "sing"
    | "singTogether"
    | "free"
    | "sacrifice"
    | "exert-items"
    | "put-on-deck-bottom";
  shiftTargetId?: CardInstanceId;
  singerIds?: readonly CardInstanceId[];
  inkPaid?: number;
  usedShift?: boolean;
}

export interface QuestedPayload {
  playerId: PlayerId;
  cardId: CardInstanceId;
  loreGained: number;
}

export interface ChallengedPayload {
  attackerId: CardInstanceId;
  defenderId: CardInstanceId;
  attackerDamage: number;
  defenderDamage: number;
}

export interface FirstPlayerChosenPayload {
  chooser: PlayerId;
  chosen: PlayerId;
  playerId: PlayerId;
}

export interface HandAlteredPayload {
  playerId: PlayerId;
  cardsMulliganed: number;
  cardsDrawn: number;
}

export interface CardInkedPayload {
  playerId: PlayerId;
  cardId: CardInstanceId;
  from: string;
  to: string;
  exerted?: boolean;
  /**
   * When true, the inked card's identity is hidden from non-owner viewers in
   * the move log (the cardId is wrapped in PrivateField). Set by effect-driven
   * inks from private zones (hand, deck) where the opponent never sees the
   * card. Manual ink (the turn action) leaves this unset so the public record
   * matches the game-server reveal at ink time.
   */
  private?: boolean;
}

export interface DeckShuffledPayload {
  playerId: PlayerId;
  isManual: true;
}

export interface ZoneBottomShuffledPayload {
  zoneId: string;
  count: number;
}

export interface AbilityActivatedPayload {
  playerId: PlayerId;
  cardId: CardInstanceId;
  abilityName?: string;
  abilityIndex: number;
  inkPaid?: number;
}

export interface CardReturnedToHandPayload {
  cardId: CardInstanceId;
  ownerId: PlayerId;
  fromZone: string;
}

export interface PutCardUnderPayload {
  playerId: PlayerId;
  /** The card that was placed under the target */
  cardId: CardInstanceId;
  /** The card that the placed card was put under */
  targetId: CardInstanceId;
}

export interface CardLeftDiscardPayload {
  cardId: CardInstanceId;
  ownerId: PlayerId;
  toZone: string;
}

// =============================================================================
// Event Map
// =============================================================================

/**
 * Lorcana Domain Event Map
 *
 * Maps event type names to their payload types.
 * Used for type-safe event emission via ctx.framework.events.emit().
 */
export interface LorcanaDomainEventMap {
  cardExerted: CardExertedPayload;
  cardReadied: CardReadiedPayload;
  allCardsReadied: AllCardsReadiedPayload;
  damageDealt: DamageDealtPayload;
  cardMoved: CardMovedPayload;
  cardBanished: CardBanishedPayload;
  inkChanged: InkChangedPayload;
  loreChanged: LoreChangedPayload;
  questCompleted: QuestCompletedPayload;
  cardsDrawn: CardsDrawnPayload;
  cardsDiscarded: CardsDiscardedPayload;
  turnPassed: TurnPassedPayload;
  cardPlayed: CardPlayedPayload;
  quested: QuestedPayload;
  challenged: ChallengedPayload;
  firstPlayerChosen: FirstPlayerChosenPayload;
  handAltered: HandAlteredPayload;
  cardInked: CardInkedPayload;
  deckShuffled: DeckShuffledPayload;
  zoneBottomShuffled: ZoneBottomShuffledPayload;
  challengeCleared: Record<string, never>;
  abilityActivated: AbilityActivatedPayload;
  cardReturnedToHand: CardReturnedToHandPayload;
  putCardUnder: PutCardUnderPayload;
  cardLeftDiscard: CardLeftDiscardPayload;
  damageMoved: DamageMovedPayload;
}

/**
 * Typed custom game event for Lorcana
 */
type CustomGameEventFromMap<TEvents> = {
  [K in keyof TEvents & string]: {
    kind: "CUSTOM";
    customType: K;
    data: TEvents[K];
  };
}[keyof TEvents & string];

export type LorcanaDomainEvent = CustomGameEventFromMap<LorcanaDomainEventMap>;

export type LorcanaDomainEventType = keyof LorcanaDomainEventMap & string;

export type LorcanaDomainEventPayload<TType extends LorcanaDomainEventType> =
  LorcanaDomainEventMap[TType];

export function createLorcanaDomainEvent<TType extends LorcanaDomainEventType>(
  customType: TType,
  data: LorcanaDomainEventPayload<TType>,
): Extract<LorcanaDomainEvent, { customType: TType }> {
  return {
    kind: "CUSTOM",
    customType,
    data: data as unknown as Extract<LorcanaDomainEvent, { customType: TType }>["data"],
  } as unknown as Extract<LorcanaDomainEvent, { customType: TType }>;
}

export function emitLorcanaDomainEvent<TType extends LorcanaDomainEventType>(
  events: Pick<EventAPI, "emit">,
  customType: TType,
  data: LorcanaDomainEventPayload<TType>,
): void {
  const lorcanaDomainEvent = createLorcanaDomainEvent(customType, data) as unknown as GameEvent;
  // Don't log the full payload — many domain events contain card IDs and
  // fields that are private/hidden from some viewers (e.g. cardsDrawn.cardIds,
  // cardInked.private). Logging at TRACE was a leak risk and added significant
  // log volume; emit only the discriminator for tracing purposes.
  logger.trace("lorcana.domain_event customType={customType}", { customType });
  events.emit(lorcanaDomainEvent);
}
