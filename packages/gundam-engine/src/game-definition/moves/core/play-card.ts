import {
  type CardId,
  createMove,
  getZoneSize,
  moveCard,
  type ZoneId,
} from "@tcg/core";
import { useGundamOps } from "../../../operations";
import type {
  GundamCardMeta,
  GundamGameState,
  GundamMoves,
} from "../../../types";
import {
  and,
  cardInHand,
  cardOwnedByPlayer,
  isMainPhase,
} from "../../../validators";

/**
 * Checks if a card is a unit card
 * TODO: Look up actual card definition when card registry is available
 */
function isUnitCard(_cardId: CardId): boolean {
  // TODO: Look up card definition and verify cardType === "UNIT"
  // For now, assume all cards are valid units if we don't have better info
  return true; // Placeholder
}

/**
 * Checks if a card is a base card
 * TODO: Look up actual card definition when card registry is available
 */
function isBaseCard(_cardId: CardId): boolean {
  // TODO: Look up card definition and verify cardType === "BASE"
  return false; // Placeholder: defaulted to false to avoid collision with unit test until registry
}

/**
 * Gets the cost of a card (placeholder - will be enhanced with card definitions)
 */
function getCardCost(_cardId: CardId): number {
  // TODO: Look up actual card cost from card definitions
  // For now, return a placeholder cost
  return 2;
}

/**
 * Play Card Move
 *
 * Unified move for playing cards from hand:
 * - Deploy Units (paying cost, checking battle area capacity)
 * - Deploy Bases (paying cost, checking base section capacity)
 * - Play Command cards (paying cost)
 *
 * Rule References:
 * 5-7. Play
 * 7-5-2. Playing Cards from the Hand
 */
export const playCard = createMove<
  GundamGameState,
  GundamMoves,
  "playCard",
  GundamCardMeta
>({
  condition: and(
    isMainPhase(),
    (state, context) => cardInHand(context.params.cardId)(state, context),
    (state, context) =>
      cardOwnedByPlayer(context.params.cardId)(state, context),
    (state, context) => {
      const { playerId } = context;
      const { cardId } = context.params;
      const ops = useGundamOps(context);

      // 1. Cost Check
      const cost = getCardCost(cardId);
      const activeResources = state.gundam.activeResources[playerId] ?? 0;
      if (activeResources < cost) return false;

      // 2. Capacity & Type Checks
      const cardType = ops.getCardType(cardId);

      // Unit Logic
      if (cardType === "UNIT" || isUnitCard(cardId)) {
        const battleArea = state.zones.battleArea[playerId];
        if (!battleArea) return false;
        if (getZoneSize(battleArea) >= 6) return false;
        return true;
      }

      // Base Logic
      if (cardType === "BASE" || isBaseCard(cardId)) {
        const baseSection = state.zones.baseSection[playerId];
        if (!baseSection) return false;
        if (getZoneSize(baseSection) >= 1) return false;
        return true;
      }

      // Command Logic (no capacity check usually, just goes to trash after resolution/pending)
      if (cardType === "COMMAND") {
        return true;
      }

      return true;
    },
  ),
  reducer: (draft, context) => {
    const { playerId } = context;
    const { cardId } = context.params;
    const ops = useGundamOps(context);

    // 1. Pay Cost
    const cost = getCardCost(cardId);
    const activeResources = draft.gundam.activeResources[playerId] ?? 0;

    if (activeResources < cost) {
      throw new Error(
        `Insufficient resources: need ${cost}, have ${activeResources}`,
      );
    }
    draft.gundam.activeResources[playerId] = activeResources - cost;

    // 2. Determine Target Zone
    const cardType = ops.getCardType(cardId);
    let targetZoneId: ZoneId = "battleArea" as ZoneId; // Default to battleArea for units

    if (cardType === "BASE" || isBaseCard(cardId)) {
      targetZoneId = "baseSection" as ZoneId;
      // Validate capacity
      const baseSection = draft.zones.baseSection[playerId];
      if (baseSection && getZoneSize(baseSection) >= 1) {
        throw new Error("Base section is already occupied (max 1 base)");
      }
    } else if (cardType === "COMMAND") {
      targetZoneId = "trash" as ZoneId; // Commands go to trash after use (simplified)
    } else {
      // UNIT or Default
      targetZoneId = "battleArea" as ZoneId;
      // Validate capacity
      const battleArea = draft.zones.battleArea[playerId];
      if (battleArea && getZoneSize(battleArea) >= 6) {
        throw new Error("Battle area is at maximum capacity (6 units)");
      }
    }

    // 3. Move Card
    context.zones.moveCard({
      cardId,
      targetZoneId,
    });

    // 4. Set Position to Active (for Units/Bases)
    if (targetZoneId !== "trash") {
      // TODO: Check if cards enter rested due to effects?
      // Rule 5-4-1-1: Generally set as active
      ops.activateCard(cardId);
    }
  },
});
