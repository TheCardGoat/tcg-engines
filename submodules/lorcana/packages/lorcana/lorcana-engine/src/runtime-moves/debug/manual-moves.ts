/**
 * Manual/Debug Moves for Lorcana Runtime
 *
 * These moves allow manual manipulation of game state for debugging,
 * testing, and admin purposes. They bypass normal game rules.
 */

import {
  type CardInstanceId,
  type PlayerId,
  type RuntimeValidationResult,
  type ZoneId,
} from "#core";
import { type LorcanaMoveDefinition } from "../../types";
import {
  emitTriggeredLorcanaEvent,
  flushTriggeredEventsToBag,
} from "../effects/triggered-abilities";
import { advanceTurnToNextPlayer } from "../moves/turn/pass-turn";
import { moveCardOutOfPlayWithStack } from "../state/shift-stack";
import { isDiscardZoneKey, recordDiscardExitThisTurn } from "../state/turn-metrics";
import { validateCardExists } from "../shared/validation-helpers";
import { runGameStateCheck } from "../state/game-state-check";

type ZoneRefLike = { zone: string; playerId?: string };

function parseZoneRef(zoneId: string): ZoneRefLike {
  const [zone, playerId] = zoneId.split(":");
  return { zone, ...(playerId != null ? { playerId } : {}) };
}

const manualMoveDefinitionDefaults = {
  ignorePriority: true,
};

/**
 * Manually move a card to any zone
 */
export const manualMoveCard: LorcanaMoveDefinition<"manualMoveCard"> = {
  ...manualMoveDefinitionDefaults,

  execute: (ctx) => {
    const { cardId, targetZoneId, position } = ctx.args;
    const targetZoneRef = parseZoneRef(targetZoneId);

    // Convert position to index option for moveCard
    let index: number | undefined;
    if (position === "top") {
      index = undefined; // Default is top (end of array)
    } else if (position === "bottom") {
      index = 0; // Bottom is index 0
    } else if (typeof position === "number") {
      index = position;
    }

    // Move card to target zone
    const currentZoneKey = ctx.framework.state._zonesPrivate.cardIndex[cardId]?.zoneKey;
    const cardMeta = ctx.cards.require(cardId).meta;
    const isFromPlay = currentZoneKey?.startsWith("play:") ?? false;
    const isToPlay = targetZoneRef.zone === "play";
    const hasCardsUnder = Array.isArray(cardMeta?.cardsUnder) && cardMeta.cardsUnder.length > 0;

    if (isFromPlay && !isToPlay && hasCardsUnder) {
      moveCardOutOfPlayWithStack(ctx, cardId, targetZoneRef, { index });
    } else {
      ctx.framework.zones.moveCard(cardId, targetZoneRef, { index });
      // Manual move is a hard reset of transient card state.
      ctx.cards.clearMeta(cardId);
    }

    if (isDiscardZoneKey(currentZoneKey) && targetZoneRef.zone !== "discard") {
      recordDiscardExitThisTurn(ctx);
      const ownerId = ctx.framework.state._zonesPrivate.cardIndex[cardId]?.ownerID as
        | PlayerId
        | undefined;
      if (ownerId) {
        emitTriggeredLorcanaEvent(
          ctx,
          "cardLeftDiscard",
          { cardId, ownerId, toZone: targetZoneRef.zone },
          {
            event: "leave-discard",
            playerId: ownerId,
            subjectCardId: cardId,
            fromZone: "discard",
            toZone: targetZoneRef.zone,
          },
        );
        flushTriggeredEventsToBag(ctx);
      }
    }
  },

  validate: (ctx): RuntimeValidationResult => {
    const { cardId, targetZoneId } = ctx.args;

    // Basic validation - card must exist
    const cardExists = validateCardExists(ctx, cardId);
    if (!cardExists.valid) return cardExists;

    // Target zone must exist
    let zoneCards: readonly string[] | undefined;
    try {
      zoneCards = ctx.framework.zones.getCards(parseZoneRef(targetZoneId));
    } catch {
      zoneCards = undefined;
    }
    if (zoneCards === undefined) {
      return { valid: false, error: "Target zone not found", errorCode: "ZONE_NOT_FOUND" };
    }

    return { valid: true };
  },

  available: (ctx) => getAllCardIds(ctx).length > 0 && getAllZoneIds(ctx).length > 0,
};

/**
 * Manually exert a card (set to exerted state)
 */
export const manualExertCard: LorcanaMoveDefinition<"manualExertCard"> = {
  ...manualMoveDefinitionDefaults,
  validate: (ctx): RuntimeValidationResult => {
    const { cardId } = ctx.args;
    return validateCardExists(ctx, cardId);
  },

  execute: (ctx) => {
    const { cardId } = ctx.args;

    // Set card to exerted state
    ctx.cards.patchMeta(cardId, { state: "exerted" });
  },
  available: (ctx) => getAllCardIds(ctx).length > 0,
};

/**
 * Manually ready a card (set to ready state)
 */
export const manualReadyCard: LorcanaMoveDefinition<"manualReadyCard"> = {
  ...manualMoveDefinitionDefaults,
  validate: (ctx): RuntimeValidationResult => {
    const { cardId } = ctx.args;
    return validateCardExists(ctx, cardId);
  },

  execute: (ctx) => {
    const { cardId } = ctx.args;

    // Set card to ready state
    ctx.cards.patchMeta(cardId, { state: "ready" });
    const playerId = ctx.framework.state._zonesPrivate.cardIndex[cardId]?.ownerID;
    if (playerId) {
      emitTriggeredLorcanaEvent(
        ctx,
        "cardReadied",
        { cardId, isManual: true },
        { event: "ready", playerId, subjectCardId: cardId },
      );
      flushTriggeredEventsToBag(ctx);
    }
  },
  available: (ctx) => getAllCardIds(ctx).length > 0,
};

/**
 * Manually set a card to drying
 */
export const manualDryCard: LorcanaMoveDefinition<"manualDryCard"> = {
  ...manualMoveDefinitionDefaults,
  validate: (ctx): RuntimeValidationResult => {
    const { cardId } = ctx.args;
    return validateCardExists(ctx, cardId);
  },

  execute: (ctx) => {
    const { cardId } = ctx.args;
    ctx.cards.patchMeta(cardId, { isDrying: true });
  },

  available: (ctx) => getAllCardIds(ctx).length > 0,
};

/**
 * Manually set damage on a card
 */
export const manualSetDamage: LorcanaMoveDefinition<"manualSetDamage"> = {
  ...manualMoveDefinitionDefaults,
  validate: (ctx): RuntimeValidationResult => {
    const { cardId, damage } = ctx.args;

    // Basic validation - card must exist
    const cardExists = validateCardExists(ctx, cardId);
    if (!cardExists.valid) return cardExists;

    const zoneKey = ctx.framework.state._zonesPrivate.cardIndex[cardId]?.zoneKey;
    if (!zoneKey?.startsWith("play:")) {
      return { valid: false, error: "Card must be in play", errorCode: "INVALID_CARD_ZONE" };
    }

    // Damage must be non-negative
    if (damage < 0) {
      return { valid: false, error: "Damage cannot be negative", errorCode: "INVALID_DAMAGE" };
    }

    return { valid: true };
  },

  execute: (ctx) => {
    const { cardId, damage } = ctx.args;

    ctx.cards.patchMeta(cardId, { damage });

    // Use GSC sweep so lethal check uses effective (not printed) Willpower (§1.8.1.4).
    runGameStateCheck(ctx);

    flushTriggeredEventsToBag(ctx);
  },
  available: (ctx) => getAllCardIds(ctx).some((cardId) => canSetManualDamage(ctx, cardId)),
};

function canSetManualDamage(_ctx: ManualEnumerationContext, _cardId: CardInstanceId): boolean {
  return true;
}

/**
 * Manually set lore for a player
 */
export const manualSetLore: LorcanaMoveDefinition<"manualSetLore"> = {
  ...manualMoveDefinitionDefaults,
  validate: (ctx): RuntimeValidationResult => {
    const { playerId, amount } = ctx.args;

    // Validate player exists
    const players = Object.keys(ctx.G.lore) as PlayerId[];
    if (!players.includes(playerId as PlayerId)) {
      return { valid: false, error: "Invalid player", errorCode: "INVALID_PLAYER" };
    }

    // Amount must be non-negative
    if (amount < 0) {
      return { valid: false, error: "Lore cannot be negative", errorCode: "INVALID_LORE" };
    }

    return { valid: true };
  },

  execute: (ctx) => {
    const { playerId, amount } = ctx.args;

    ctx.G.lore[playerId as PlayerId] = amount;
  },
  available: (ctx) => getAllPlayerIds(ctx).length > 0,
};

/**
 * Manually shuffle a player's deck
 */
export const manualShuffleDeck: LorcanaMoveDefinition<"manualShuffleDeck"> = {
  ...manualMoveDefinitionDefaults,
  validate: (ctx): RuntimeValidationResult => {
    const { playerId } = ctx.args;

    // Validate player exists
    const players = Object.keys(ctx.G.lore) as PlayerId[];
    if (!players.includes(playerId as PlayerId)) {
      return { valid: false, error: "Invalid player", errorCode: "INVALID_PLAYER" };
    }

    return { valid: true };
  },

  execute: (ctx) => {
    const { playerId } = ctx.args;

    const deckZoneId = `deck` as const;

    // Shuffle the deck zone
    ctx.framework.zones.shuffle({ zone: deckZoneId, playerId: playerId as string });
  },
  available: (ctx) => getAllPlayerIds(ctx).length > 0,
};

/**
 * Manually pass turn (debug override).
 */
export const manualPassTurn: LorcanaMoveDefinition<"manualPassTurn"> = {
  ...manualMoveDefinitionDefaults,
  validate: (): RuntimeValidationResult => ({ valid: true }),

  execute: (ctx) => {
    advanceTurnToNextPlayer(ctx);
  },
  available: () => true,
};

type ManualEnumerationContext = {
  G: { lore: Record<string, number> };
  framework: {
    state: {
      _zonesPrivate: {
        cardIndex: Record<string, { zoneKey?: string } | undefined>;
        zoneCards: Record<string, readonly string[]>;
      };
    };
  };
};

function getAllCardIds(ctx: ManualEnumerationContext): CardInstanceId[] {
  return Object.keys(ctx.framework.state._zonesPrivate.cardIndex) as CardInstanceId[];
}

function getAllZoneIds(ctx: ManualEnumerationContext): ZoneId[] {
  return Object.keys(ctx.framework.state._zonesPrivate.zoneCards)
    .filter((zoneId) => zoneId.includes(":"))
    .map((zoneId) => zoneId as ZoneId);
}

function getAllPlayerIds(ctx: ManualEnumerationContext): PlayerId[] {
  return Object.keys(ctx.G.lore) as PlayerId[];
}
