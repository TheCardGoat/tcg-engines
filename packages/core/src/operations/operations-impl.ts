import type { CardId, PlayerId, ZoneId } from "../types";
import type { InternalState } from "../types/state";
import type { CardOperations } from "./card-operations";
import type { ZoneOperations } from "./zone-operations";

/**
 * Create a ZoneOperations implementation backed by InternalState
 *
 * @param state - Internal state to operate on (will be mutated)
 * @returns ZoneOperations implementation
 */
export const createZoneOperations = <TCardDef, TCardMeta>(
  state: InternalState<TCardDef, TCardMeta>,
): ZoneOperations => {
  return {
    moveCard: ({ cardId, targetZoneId, position = "bottom" }) => {
      // Find current zone and remove card
      let sourceZoneId: string | undefined;
      for (const zoneId in state.zones) {
        const zone = state.zones[zoneId];
        if (!zone) continue;
        const index = zone.cardIds.indexOf(cardId);
        if (index !== -1) {
          zone.cardIds.splice(index, 1);
          sourceZoneId = zoneId;

          // Update positions in source zone if ordered
          if (zone.config.ordered) {
            for (let i = index; i < zone.cardIds.length; i++) {
              const cid = zone.cardIds[i];
              if (!cid) continue;
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
        targetPosition = targetZone.config.ordered
          ? targetZone.cardIds.length - 1
          : undefined;
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
        card.zoneId = targetZoneId;
        card.position = targetPosition;
      }
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
          return card && card.ownerId === ownerId;
        }) as CardId[];
      }

      // Return a copy to prevent external mutation
      return [...cards];
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

    getCardZone: (cardId) => {
      const card = state.cards[cardId as string];
      return card?.zoneId;
    },
  };
};

/**
 * Create a CardOperations implementation backed by InternalState
 *
 * @param state - Internal state to operate on (will be mutated)
 * @returns CardOperations implementation
 */
export const createCardOperations = <TCardDef, TCardMeta>(
  state: InternalState<TCardDef, TCardMeta>,
): CardOperations<TCardMeta> => {
  return {
    getCardMeta: (cardId) => {
      return (state.cardMetas[cardId as string] || {}) as Partial<TCardMeta>;
    },

    updateCardMeta: (cardId, meta) => {
      const existing = state.cardMetas[cardId as string];
      if (existing) {
        Object.assign(existing, meta);
      } else {
        state.cardMetas[cardId as string] = meta as TCardMeta;
      }
    },

    setCardMeta: (cardId, meta) => {
      state.cardMetas[cardId as string] = meta;
    },

    getCardOwner: (cardId) => {
      const card = state.cards[cardId as string];
      return card?.ownerId;
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
  };
};
