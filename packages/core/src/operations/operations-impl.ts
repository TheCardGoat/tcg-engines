import type { Logger } from "../logging";
import type { CardId, PlayerId } from "../types";
import type { InternalState } from "../types/state";
import type { CardOperations } from "./card-operations";
import type { CounterOperations } from "./counter-operations";
import type { GameOperations } from "./game-operations";
import type { ZoneOperations } from "./zone-operations";

/**
 * Create a ZoneOperations implementation backed by InternalState
 *
 * @param state - Internal state to operate on (will be mutated)
 * @param logger - Optional logger for TRACE-level logging
 * @returns ZoneOperations implementation
 */
export const createZoneOperations = <TCardDef, TCardMeta>(
  state: InternalState<TCardDef, TCardMeta>,
  logger?: Logger,
): ZoneOperations => {
  const zoneOps: ZoneOperations = {
    bulkMove: ({ from, to, count, playerId, position = "bottom" }) => {
      const sourceCards = zoneOps.getCardsInZone(from, playerId);
      const movedCards: CardId[] = [];

      for (let i = 0; i < count && i < sourceCards.length; i++) {
        const cardId = sourceCards[i];
        if (cardId) {
          zoneOps.moveCard({
            cardId,
            position,
            targetZoneId: to,
          });
          movedCards.push(cardId);
        }
      }

      return movedCards;
    },

    createDeck: ({ zoneId, playerId, cardCount, shuffle = false }) => {
      const createdCards: CardId[] = [];

      // Create card instances
      for (let i = 0; i < cardCount; i++) {
        const cardId = `${playerId}-${zoneId}-${i}` as CardId;
        createdCards.push(cardId);

        // Add card to internal state
        state.cards[cardId as string] = {
          definitionId: "placeholder", // Games can customize this
          owner: playerId,
          controller: playerId, // Initially controller equals owner
          zone: zoneId,
          position: i,
        };

        // Add to zone
        const zone = state.zones[zoneId as string];
        if (zone) {
          zone.cardIds.push(cardId);
        }
      }

      // Shuffle if requested
      if (shuffle) {
        zoneOps.shuffleZone(zoneId, playerId);
      }

      return createdCards;
    },

    drawCards: ({ from, to, count, playerId }) => {
      const sourceCards = zoneOps.getCardsInZone(from, playerId);
      const drawnCards: CardId[] = [];

      for (let i = 0; i < count && i < sourceCards.length; i++) {
        const cardId = sourceCards[i];
        if (cardId) {
          zoneOps.moveCard({
            cardId,
            position: "bottom",
            targetZoneId: to,
          });
          drawnCards.push(cardId);
        }
      }

      return drawnCards;
    },

    getCardZone: (cardId) => {
      const card = state.cards[cardId as string];
      return card?.zone;
    },

    getCardsInZone: (zoneId, ownerId?) => {
      const zone = state.zones[zoneId as string];
      if (!zone) {
        return [];
      }

      let cards = zone.cardIds;

      // Filter by owner if specified
      if (ownerId !== undefined) {
        cards = cards.filter((cardId) => {
          const card = state.cards[cardId as string];
          return card && card.owner === ownerId;
        }) as CardId[];
      }

      // Return a copy to prevent external mutation
      return [...cards];
    },

    moveCard: ({ cardId, targetZoneId, position = "bottom" }) => {
      logger?.trace("Moving card", { cardId, position, targetZoneId });
      // Find current zone and remove card
      let sourceZoneId: string | undefined;
      for (const zoneId in state.zones) {
        const zone = state.zones[zoneId];
        if (!zone) {continue;}
        const index = zone.cardIds.indexOf(cardId);
        if (index !== -1) {
          zone.cardIds.splice(index, 1);
          sourceZoneId = zoneId;

          // Update positions in source zone if ordered
          if (zone.config.ordered) {
            for (let i = index; i < zone.cardIds.length; i++) {
              const cid = zone.cardIds[i];
              if (!cid) {continue;}
              if (state.cards[cid]) {
                state.cards[cid].position = i;
              }
            }
          }
          break;
        }
      }

      // Add to target zone
      const targetZone = state.zones[targetZoneId as string];
      if (!targetZone) {
        throw new Error(`Target zone ${targetZoneId} does not exist`);
      }

      let targetPosition: number | undefined;

      if (position === "top") {
        targetZone.cardIds.unshift(cardId);
        targetPosition = 0;

        // Update positions of other cards in ordered zones
        if (targetZone.config.ordered) {
          for (let i = 1; i < targetZone.cardIds.length; i++) {
            const cid = targetZone.cardIds[i] as string;
            if (state.cards[cid]) {
              state.cards[cid].position = i;
            }
          }
        }
      } else if (position === "bottom") {
        targetZone.cardIds.push(cardId);
        targetPosition = targetZone.config.ordered ? targetZone.cardIds.length - 1 : undefined;
      } else {
        // Numeric position
        const idx = position as number;
        targetZone.cardIds.splice(idx, 0, cardId);
        targetPosition = targetZone.config.ordered ? idx : undefined;

        // Update positions of cards after insertion point
        if (targetZone.config.ordered) {
          for (let i = idx + 1; i < targetZone.cardIds.length; i++) {
            const cid = targetZone.cardIds[i] as string;
            if (state.cards[cid]) {
              state.cards[cid].position = i;
            }
          }
        }
      }

      // Update card's zone and position
      const card = state.cards[cardId as string];
      if (card) {
        card.zone = targetZoneId;
        card.position = targetPosition;
      }
    },

    mulligan: ({ hand, deck, drawCount, playerId }) => {
      const handCards = zoneOps.getCardsInZone(hand, playerId);

      // Move all hand cards back to deck
      for (const cardId of handCards) {
        zoneOps.moveCard({
          cardId,
          position: "bottom",
          targetZoneId: deck,
        });
      }

      // Shuffle deck
      zoneOps.shuffleZone(deck, playerId);

      // Draw new hand
      zoneOps.drawCards({ count: drawCount, from: deck, playerId, to: hand });
    },

    shuffleZone: (zoneId, ownerId?) => {
      const zone = state.zones[zoneId as string];
      if (!zone) {
        return;
      }

      // Simple Fisher-Yates shuffle
      // Note: In production, this should use a seeded RNG for determinism
      const cards = [...zone.cardIds];
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = cards[i];
        const swapCard = cards[j];
        if (temp && swapCard) {
          cards[i] = swapCard;
          cards[j] = temp;
        }
      }

      zone.cardIds = cards;

      // Update positions if ordered
      if (zone.config.ordered) {
        for (let i = 0; i < cards.length; i++) {
          const cardId = cards[i] as string;
          if (state.cards[cardId]) {
            state.cards[cardId].position = i;
          }
        }
      }
    },
  };

  return zoneOps;
};

/**
 * Create a CardOperations implementation backed by InternalState
 *
 * @param state - Internal state to operate on (will be mutated)
 * @param logger - Optional logger for TRACE-level logging
 * @returns CardOperations implementation
 */
export const createCardOperations = <TCardDef, TCardMeta>(
  state: InternalState<TCardDef, TCardMeta>,
  logger?: Logger,
): CardOperations<TCardMeta> => ({
  getCardMeta: (cardId) => {
    logger?.trace("Getting card meta", { cardId });
    return (state.cardMetas[cardId as string] || {}) as Partial<TCardMeta>;
  },

  getCardOwner: (cardId) => {
    const card = state.cards[cardId as string];
    return card?.owner;
  },

  queryCards: (predicate) => {
    const results: CardId[] = [];
    for (const cardId in state.cardMetas) {
      const meta = state.cardMetas[cardId];
      if (predicate(cardId as CardId, meta as Partial<TCardMeta>)) {
        results.push(cardId as CardId);
      }
    }
    return results;
  },

  setCardMeta: (cardId, meta) => {
    logger?.trace("Setting card meta", { cardId });
    state.cardMetas[cardId as string] = meta;
  },

  updateCardMeta: (cardId, meta) => {
    logger?.trace("Updating card meta", { cardId, updates: meta });
    const existing = state.cardMetas[cardId as string];
    if (existing) {
      Object.assign(existing, meta);
    } else {
      state.cardMetas[cardId as string] = meta as TCardMeta;
    }
  },
});

/**
 * Create a GameOperations implementation backed by InternalState
 *
 * @param state - Internal state to operate on (will be mutated)
 * @param logger - Optional logger for TRACE-level logging
 * @returns GameOperations implementation
 */
export const createGameOperations = <TCardDef, TCardMeta>(
  state: InternalState<TCardDef, TCardMeta>,
  logger?: Logger,
): GameOperations => ({
  addPendingMulligan: (playerId: PlayerId) => {
    if (!state.pendingMulligan) {
      state.pendingMulligan = [playerId];
    } else if (!state.pendingMulligan.includes(playerId)) {
      state.pendingMulligan.push(playerId);
    }
  },

  getChoosingFirstPlayer: () => {
    return state.choosingFirstPlayer;
  },

  getOTP: () => {
    return state.otp;
  },

  getPendingMulligan: () => {
    // Return copy to prevent external mutation
    return state.pendingMulligan ? [...state.pendingMulligan] : [];
  },

  removePendingMulligan: (playerId: PlayerId) => {
    if (!state.pendingMulligan) {
      return;
    }
    const index = state.pendingMulligan.indexOf(playerId);
    if (index !== -1) {
      state.pendingMulligan.splice(index, 1);
    }
  },

  setChoosingFirstPlayer: (playerId: PlayerId) => {
    state.choosingFirstPlayer = playerId;
  },

  setOTP: (playerId: PlayerId) => {
    logger?.trace("Setting OTP", { playerId });
    state.otp = playerId;
  },

  setPendingMulligan: (playerIds: PlayerId[]) => {
    state.pendingMulligan = playerIds;
  },
});

/**
 * Internal counter state stored in cardMetas
 * Uses a reserved key to avoid conflicts with game-specific metadata
 */
interface CounterState {
  __counters?: Record<string, number>;
  __flags?: Record<string, boolean>;
}

/**
 * Create a CounterOperations implementation backed by InternalState
 *
 * Counters and flags are stored in cardMetas using reserved keys (__counters, __flags)
 * to avoid conflicts with game-specific metadata.
 *
 * @param state - Internal state to operate on (will be mutated)
 * @param logger - Optional logger for TRACE-level logging
 * @returns CounterOperations implementation
 */
export const createCounterOperations = <TCardDef, TCardMeta>(
  state: InternalState<TCardDef, TCardMeta>,
  logger?: Logger,
): CounterOperations => {
  const getCounterState = (cardId: CardId): CounterState => {
    const meta = state.cardMetas[cardId as string];
    if (!meta) {
      state.cardMetas[cardId as string] = {} as TCardMeta;
    }
    return state.cardMetas[cardId as string] as unknown as CounterState;
  };

  return {
    addCounter: (cardId, type, amount) => {
      logger?.trace("Adding counter", { amount, cardId, type });
      if (amount <= 0) {return;}
      const counterState = getCounterState(cardId);
      if (!counterState.__counters) {
        counterState.__counters = {};
      }
      counterState.__counters[type] = (counterState.__counters[type] ?? 0) + amount;
    },

    clearAllCounters: (cardId) => {
      logger?.trace("Clearing all counters", { cardId });
      const meta = state.cardMetas[cardId as string] as unknown as CounterState;
      if (meta) {
        delete meta.__counters;
        delete meta.__flags;
      }
    },

    clearCounter: (cardId, type) => {
      logger?.trace("Clearing counter", { cardId, type });
      const meta = state.cardMetas[cardId as string] as unknown as CounterState;
      if (meta?.__counters) {
        delete meta.__counters[type];
      }
    },

    getCardsWithCounter: (type, minValue = 1) => {
      const results: CardId[] = [];
      for (const cardId in state.cardMetas) {
        const meta = state.cardMetas[cardId] as unknown as CounterState;
        const counterValue = meta?.__counters?.[type] ?? 0;
        if (counterValue >= minValue) {
          results.push(cardId as CardId);
        }
      }
      return results;
    },

    getCardsWithFlag: (flag, value) => {
      const results: CardId[] = [];
      for (const cardId in state.cardMetas) {
        const meta = state.cardMetas[cardId] as unknown as CounterState;
        const flagValue = meta?.__flags?.[flag] ?? false;
        if (flagValue === value) {
          results.push(cardId as CardId);
        }
      }
      return results;
    },

    getCounter: (cardId, type) => {
      const meta = state.cardMetas[cardId as string] as unknown as CounterState;
      return meta?.__counters?.[type] ?? 0;
    },

    getFlag: (cardId, flag) => {
      const meta = state.cardMetas[cardId as string] as unknown as CounterState;
      return meta?.__flags?.[flag] ?? false;
    },

    removeCounter: (cardId, type, amount) => {
      logger?.trace("Removing counter", { amount, cardId, type });
      if (amount <= 0) {return;}
      const counterState = getCounterState(cardId);
      if (!counterState.__counters) {return;}
      const current = counterState.__counters[type] ?? 0;
      counterState.__counters[type] = Math.max(0, current - amount);
    },

    setFlag: (cardId, flag, value) => {
      logger?.trace("Setting flag", { cardId, flag, value });
      const counterState = getCounterState(cardId);
      if (!counterState.__flags) {
        counterState.__flags = {};
      }
      counterState.__flags[flag] = value;
    },
  };
};
