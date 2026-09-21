/**
 * Board-state correction moves. These bypass normal play rules: no costs,
 * no triggers, no turn checks. The platform gates them behind bilateral
 * `enable_manual_mode`. They stay out of {@link MOVE_IDS} so AI / prompts
 * never enumerate them (`available` is always false as a second belt).
 */

import type { CardZone } from "@tcg/cyberpunk-types";
import type { CardInstanceId, GigDieId, PlayerId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput, MoveValidationResult } from "../types/commands.ts";
import type { Operations } from "../operations/index.ts";
import { DIE_MAX_VALUES, type GigDieLocation } from "../types/gig-die.ts";
import { defOf } from "../state/lookups.ts";
import { abandonCurrentTrigger } from "../ability-executor.ts";
import { endTurn, resumeSuspendedEndTurn } from "./pass-phase.ts";
import { getEffectiveRules, recomputeActiveEffects } from "../active-effects/index.ts";

export const MANUAL_MOVE_IDS = [
  "manualSetGigValue",
  "manualMoveGig",
  "manualMoveCard",
  "manualAttachGear",
  "manualDetachGear",
  "manualExertCard",
  "manualReadyCard",
  "manualDrawCard",
  "manualClearPendingResolution",
  "manualResetCombat",
  "manualForcePassTurn",
  "manualSetEddies",
  "manualResetOncePerTurn",
  "manualSetCardFace",
  "manualReadyAll",
  "manualRecomputeActiveEffects",
  "manualDropEffectBagEntry",
] as const;

export type ManualMoveId = (typeof MANUAL_MOVE_IDS)[number];

export const MANUAL_CARD_ZONES = [
  "hand",
  "field",
  "eddieArea",
  "trash",
  "legendArea",
  "deck",
] as const;
export type ManualCardZone = (typeof MANUAL_CARD_ZONES)[number];
export type ManualDeckPosition = "top" | "bottom";

const ZONE_LABEL: Record<ManualCardZone, string> = {
  hand: "Hand",
  field: "Field",
  eddieArea: "Eddie",
  trash: "Trash",
  legendArea: "Legends",
  deck: "Deck",
};

function isManualCardZone(zone: string): zone is ManualCardZone {
  return (MANUAL_CARD_ZONES as readonly string[]).includes(zone);
}

const manualMoveDefaults = {
  available: () => false,
  handlesPendingChoice: true as const,
  undoable: true,
};

function playerNotFound(): MoveValidationResult {
  return { valid: false, error: "Player not found", errorCode: "PLAYER_NOT_FOUND" };
}

function syncEddieMembership(
  operations: Operations,
  player: { eddieCardIds: CardInstanceId[]; eddies: number },
  playerId: PlayerId,
  cardId: CardInstanceId,
  fromZone: CardZone,
  toZone: CardZone,
): void {
  if (fromZone === "eddieArea" && toZone !== "eddieArea") {
    const idx = player.eddieCardIds.indexOf(cardId);
    if (idx !== -1) player.eddieCardIds.splice(idx, 1);
    if (player.eddies > 0) {
      player.eddies -= 1;
      operations.event.emit({
        type: "eddiesSpent",
        playerId,
        amount: 1,
        forWhat: "manualCorrection",
      });
    }
    return;
  }
  if (toZone === "eddieArea" && fromZone !== "eddieArea") {
    if (!player.eddieCardIds.includes(cardId)) player.eddieCardIds.push(cardId);
    operations.game.gainEddies(playerId, 1);
  }
}

export interface ManualSetGigValueInput extends MoveInput {
  args: { dieId: string; value: number };
}

export const manualSetGigValueMove: MoveDefinition<ManualSetGigValueInput> = {
  ...manualMoveDefaults,
  validate({ state, input }) {
    const die = state.G.gigDice[input.args.dieId];
    if (!die) return { valid: false, error: "Die not found", errorCode: "DIE_NOT_FOUND" };
    if (die.location !== "gigArea") {
      return { valid: false, error: "Die is not in a gig area", errorCode: "DIE_NOT_IN_GIG_AREA" };
    }
    const max = DIE_MAX_VALUES[die.dieType];
    if (!Number.isInteger(input.args.value) || input.args.value < 1 || input.args.value > max) {
      return {
        valid: false,
        error: `Value must be an integer from 1 to ${max}`,
        errorCode: "INVALID_GIG_VALUE",
      };
    }
    return { valid: true };
  },
  execute({ state, playerId, input, operations }) {
    const dieId = input.args.dieId as GigDieId;
    const die = state.G.gigDice[dieId as string];
    if (!die) return;
    operations.gig.setGigValue(dieId, input.args.value);
    operations.event.emit({
      type: "actionLog",
      messageKey: "move.manualSetGigValue",
      params: { dieLabel: die.dieType, value: input.args.value },
      playerId,
    });
  },
};

export interface ManualMoveGigInput extends MoveInput {
  args: { dieId: string; toPlayerId: string; location: GigDieLocation };
}

export const manualMoveGigMove: MoveDefinition<ManualMoveGigInput> = {
  ...manualMoveDefaults,
  validate({ state, input }) {
    const die = state.G.gigDice[input.args.dieId];
    if (!die) return { valid: false, error: "Die not found", errorCode: "DIE_NOT_FOUND" };
    if (input.args.location !== "gigArea" && input.args.location !== "fixerArea") {
      return { valid: false, error: "Invalid gig location", errorCode: "INVALID_GIG_LOCATION" };
    }
    if (!state.G.players[input.args.toPlayerId]) return playerNotFound();
    return { valid: true };
  },
  execute({ state, playerId, input, operations }) {
    const dieId = input.args.dieId as GigDieId;
    const die = state.G.gigDice[dieId as string];
    if (!die) return;
    const location = input.args.location;
    operations.gig.relocate(dieId, {
      ownerId: input.args.toPlayerId as PlayerId,
      location,
    });
    const destination =
      location === "fixerArea"
        ? "Fixer"
        : input.args.toPlayerId === playerId
          ? "own Gigs"
          : "rival Gigs";
    operations.event.emit({
      type: "actionLog",
      messageKey: "move.manualMoveGig",
      params: { dieLabel: die.dieType, destination },
      playerId,
    });
  },
};

export interface ManualMoveCardInput extends MoveInput {
  args: {
    cardId: string;
    toZone: ManualCardZone;
    deckPosition?: ManualDeckPosition;
    /** Trash is ordered; bottom places the card at the bottom of the pile. */
    trashPosition?: ManualDeckPosition;
  };
}

export const manualMoveCardMove: MoveDefinition<ManualMoveCardInput> = {
  ...manualMoveDefaults,
  validate({ state, input }) {
    const card = state.G.cardIndex[input.args.cardId];
    if (!card) return { valid: false, error: "Card not found", errorCode: "CARD_NOT_FOUND" };
    if (!isManualCardZone(input.args.toZone)) {
      return { valid: false, error: "Invalid correction zone", errorCode: "INVALID_ZONE" };
    }
    if (card.zone === input.args.toZone && input.args.toZone !== "deck") {
      return { valid: false, error: "Card is already in that zone", errorCode: "ALREADY_IN_ZONE" };
    }
    if (input.args.toZone === "legendArea" && defOf(card).type !== "legend") {
      return {
        valid: false,
        error: "Only Legends can move to the Legend area",
        errorCode: "NOT_LEGEND",
      };
    }
    if (!state.G.players[card.ownerId as string]) return playerNotFound();
    return { valid: true };
  },
  execute({ state, playerId, input, operations }) {
    const cardId = input.args.cardId as CardInstanceId;
    const card = state.G.cardIndex[cardId as string];
    if (!card) return;
    const toZone = input.args.toZone;
    const fromZone = card.zone;
    const ownerId = card.ownerId;
    const owner = state.G.players[ownerId as string];
    if (!owner) return;

    if (card.meta.attachedToId) {
      operations.card.detachGear(cardId);
    }
    if (toZone !== "field" && toZone !== "legendArea") {
      const gearIds = card.meta.attachedGearIds.slice();
      for (const gearId of gearIds) {
        operations.card.detachGear(gearId);
      }
    }

    operations.zone.moveCard(cardId, toZone, ownerId, {
      index: toZone === "trash" && input.args.trashPosition === "bottom" ? 0 : undefined,
    });
    if (toZone === "deck") {
      const position = input.args.deckPosition === "bottom" ? "bottom" : "top";
      const deck = owner.zones.deck;
      const idx = deck.indexOf(cardId);
      if (idx !== -1) deck.splice(idx, 1);
      if (position === "top") operations.zone.moveCardsToTop(ownerId, [cardId]);
      else operations.zone.moveCardsToBottom(ownerId, [cardId]);
    }
    syncEddieMembership(operations, owner, ownerId, cardId, fromZone, toZone);

    const cardName = defOf(card).displayName;
    const destination =
      toZone === "deck"
        ? input.args.deckPosition === "bottom"
          ? "bottom of Deck"
          : "top of Deck"
        : ZONE_LABEL[toZone];
    operations.event.emit({
      type: "actionLog",
      messageKey: "move.manualMoveCard",
      params: { cardName, destination },
      playerId,
      cardIds: [cardId as string],
    });
  },
};

export interface ManualAttachGearInput extends MoveInput {
  args: { gearId: string; hostId: string };
}

export const manualAttachGearMove: MoveDefinition<ManualAttachGearInput> = {
  ...manualMoveDefaults,
  validate({ state, input }) {
    const gear = state.G.cardIndex[input.args.gearId];
    const host = state.G.cardIndex[input.args.hostId];
    if (!gear) return { valid: false, error: "Gear not found", errorCode: "CARD_NOT_FOUND" };
    if (!host) return { valid: false, error: "Host not found", errorCode: "HOST_NOT_FOUND" };
    if (defOf(gear).type !== "gear") {
      return { valid: false, error: "Card is not gear", errorCode: "NOT_GEAR" };
    }
    if (defOf(host).type === "gear") {
      return { valid: false, error: "Cannot attach to gear", errorCode: "INVALID_HOST" };
    }
    if (host.zone !== "field" && host.zone !== "legendArea") {
      return { valid: false, error: "Host must be on the field", errorCode: "INVALID_HOST_ZONE" };
    }
    if (gear.ownerId !== host.ownerId) {
      return {
        valid: false,
        error: "Gear and host must share an owner",
        errorCode: "OWNER_MISMATCH",
      };
    }
    if (gear.meta.attachedToId === host.instanceId) {
      return {
        valid: false,
        error: "Already attached to that host",
        errorCode: "ALREADY_ATTACHED",
      };
    }
    return { valid: true };
  },
  execute({ state, playerId, input, operations }) {
    const gearId = input.args.gearId as CardInstanceId;
    const hostId = input.args.hostId as CardInstanceId;
    const gear = state.G.cardIndex[gearId as string];
    const host = state.G.cardIndex[hostId as string];
    if (!gear || !host) return;

    if (gear.meta.attachedToId) {
      operations.card.detachGear(gearId);
    }
    if (gear.zone === "eddieArea") {
      const owner = state.G.players[gear.ownerId as string];
      if (owner) {
        syncEddieMembership(operations, owner, gear.ownerId, gearId, "eddieArea", host.zone);
      }
    }
    if (gear.zone !== host.zone) {
      operations.zone.moveCard(gearId, host.zone, host.ownerId);
    }
    operations.card.attachGear(gearId, hostId);

    operations.event.emit({
      type: "actionLog",
      messageKey: "move.manualAttachGear",
      params: { gearName: defOf(gear).displayName, hostName: defOf(host).displayName },
      playerId,
      cardIds: [gearId as string, hostId as string],
    });
  },
};

export interface ManualDetachGearInput extends MoveInput {
  args: { gearId: string };
}

export const manualDetachGearMove: MoveDefinition<ManualDetachGearInput> = {
  ...manualMoveDefaults,
  validate({ state, input }) {
    const gear = state.G.cardIndex[input.args.gearId];
    if (!gear) return { valid: false, error: "Gear not found", errorCode: "CARD_NOT_FOUND" };
    if (!gear.meta.attachedToId) {
      return { valid: false, error: "Gear is not attached", errorCode: "NOT_ATTACHED" };
    }
    return { valid: true };
  },
  execute({ state, playerId, input, operations }) {
    const gearId = input.args.gearId as CardInstanceId;
    const gear = state.G.cardIndex[gearId as string];
    if (!gear) return;
    operations.card.detachGear(gearId);
    operations.event.emit({
      type: "actionLog",
      messageKey: "move.manualDetachGear",
      params: { gearName: defOf(gear).displayName },
      playerId,
      cardIds: [gearId as string],
    });
  },
};

export interface ManualExertCardInput extends MoveInput {
  args: { cardId: string };
}

export const manualExertCardMove: MoveDefinition<ManualExertCardInput> = {
  ...manualMoveDefaults,
  validate({ state, input }) {
    const card = state.G.cardIndex[input.args.cardId];
    if (!card) return { valid: false, error: "Card not found", errorCode: "CARD_NOT_FOUND" };
    if (card.meta.spent) {
      return { valid: false, error: "Card is already spent", errorCode: "ALREADY_SPENT" };
    }
    return { valid: true };
  },
  execute({ state, playerId, input, operations }) {
    const cardId = input.args.cardId as CardInstanceId;
    const card = state.G.cardIndex[cardId as string];
    if (!card) return;
    operations.card.spend(cardId);
    if (card.zone === "eddieArea") {
      const owner = state.G.players[card.ownerId as string];
      if (owner && owner.eddies > 0) {
        owner.eddies -= 1;
        operations.event.emit({
          type: "eddiesSpent",
          playerId: card.ownerId,
          amount: 1,
          forWhat: "manualCorrection",
        });
      }
    }
    operations.event.emit({
      type: "actionLog",
      messageKey: "move.manualExertCard",
      params: { cardName: defOf(card).displayName },
      playerId,
      cardIds: [cardId as string],
    });
  },
};

export interface ManualReadyCardInput extends MoveInput {
  args: { cardId: string };
}

export const manualReadyCardMove: MoveDefinition<ManualReadyCardInput> = {
  ...manualMoveDefaults,
  validate({ state, input }) {
    const card = state.G.cardIndex[input.args.cardId];
    if (!card) return { valid: false, error: "Card not found", errorCode: "CARD_NOT_FOUND" };
    if (!card.meta.spent) {
      return { valid: false, error: "Card is already ready", errorCode: "ALREADY_READY" };
    }
    return { valid: true };
  },
  execute({ state, playerId, input, operations }) {
    const cardId = input.args.cardId as CardInstanceId;
    const card = state.G.cardIndex[cardId as string];
    if (!card) return;
    operations.card.ready(cardId);
    if (card.zone === "eddieArea") {
      operations.game.gainEddies(card.ownerId, 1);
    }
    operations.event.emit({
      type: "actionLog",
      messageKey: "move.manualReadyCard",
      params: { cardName: defOf(card).displayName },
      playerId,
      cardIds: [cardId as string],
    });
  },
};

export interface ManualDrawCardInput extends MoveInput {
  args: { from: ManualDeckPosition; playerId?: string };
}

export const manualDrawCardMove: MoveDefinition<ManualDrawCardInput> = {
  ...manualMoveDefaults,
  validate({ state, playerId, input }) {
    const ownerId = (input.args.playerId ?? playerId) as string;
    const owner = state.G.players[ownerId];
    if (!owner) return playerNotFound();
    if (owner.zones.deck.length === 0) {
      return { valid: false, error: "Deck is empty", errorCode: "EMPTY_DECK" };
    }
    if (input.args.from !== "top" && input.args.from !== "bottom") {
      return { valid: false, error: "Invalid deck position", errorCode: "INVALID_DECK_POSITION" };
    }
    return { valid: true };
  },
  execute({ state, playerId, input, operations }) {
    const ownerId = (input.args.playerId ?? playerId) as typeof playerId;
    const owner = state.G.players[ownerId as string];
    if (!owner || owner.zones.deck.length === 0) return;
    const cardId =
      input.args.from === "bottom"
        ? owner.zones.deck[owner.zones.deck.length - 1]
        : owner.zones.deck[0];
    if (!cardId) return;
    operations.zone.moveCard(cardId, "hand", ownerId);
    const card = state.G.cardIndex[cardId as string];
    operations.event.emit({
      type: "actionLog",
      messageKey: "move.manualDrawCard",
      params: {
        destination: input.args.from === "bottom" ? "bottom of Deck" : "top of Deck",
        cardName: card ? defOf(card).displayName : "a card",
      },
      playerId,
      cardIds: [cardId as string],
    });
  },
};

export interface ManualClearPendingResolutionInput extends MoveInput {
  args: { scope: ManualClearResolutionScope };
}

export type ManualClearResolutionScope = "current" | "all";

/**
 * Un-stick a match that is wedged inside an ability or trigger resolution.
 * Unlike {@link cancelPendingResolutionMove} this drops ANY in-progress
 * trigger (not just player-activated abilities) and, with scope "all",
 * drains the whole queued-trigger stack. The abandoned resolution's effects
 * are discarded; remaining queued triggers continue to resolve normally.
 */
export const manualClearPendingResolutionMove: MoveDefinition<ManualClearPendingResolutionInput> = {
  ...manualMoveDefaults,
  validate({ state, input }) {
    if (input.args.scope !== "current" && input.args.scope !== "all") {
      return { valid: false, error: "Invalid clear scope", errorCode: "INVALID_CLEAR_SCOPE" };
    }
    const metadata = state.G.turnMetadata;
    if (!metadata.currentTrigger && metadata.triggerQueue.length === 0) {
      return {
        valid: false,
        error: "No ability or trigger resolution to clear",
        errorCode: "NO_PENDING_RESOLUTION",
      };
    }
    return { valid: true };
  },
  execute({ state, playerId, input, operations }) {
    const metadata = state.G.turnMetadata;
    const current = metadata.currentTrigger;
    const queueCleared = input.args.scope === "all" ? metadata.triggerQueue.length : 0;
    if (input.args.scope === "all") {
      metadata.triggerQueue = [];
    }
    abandonCurrentTrigger(state, operations);
    resumeSuspendedEndTurn(state, operations);

    const sourceCard = current ? state.G.cardIndex[current.sourceCardId as string] : undefined;
    if (sourceCard) {
      operations.event.emit({
        type: "actionLog",
        messageKey: "move.manualClearPendingResolution",
        params: { cardName: defOf(sourceCard).displayName },
        playerId,
      });
    }
    if (queueCleared > 0) {
      operations.event.emit({
        type: "actionLog",
        messageKey: "move.manualClearTriggerStack",
        params: { count: queueCleared },
        playerId,
      });
    }
  },
};

export interface ManualResetCombatInput extends MoveInput {
  args: Record<string, never>;
}

/**
 * Abandon the entire in-progress attack transaction and return to the main
 * phase. The current resolution, every queued trigger, and any pending choice
 * are discarded with the combat so board correction cannot leave an orphaned
 * prompt or stack behind.
 */
export const manualResetCombatMove: MoveDefinition<ManualResetCombatInput> = {
  ...manualMoveDefaults,
  validate({ state }) {
    if (!state.G.attackState) {
      return { valid: false, error: "No combat in progress", errorCode: "NO_ACTIVE_COMBAT" };
    }
    return { valid: true };
  },
  execute({ state, playerId, operations }) {
    const attack = state.G.attackState;
    if (!attack) return;
    const metadata = state.G.turnMetadata;
    const current = metadata.currentTrigger;
    const queueCleared = metadata.triggerQueue.length;
    metadata.triggerQueue = [];
    abandonCurrentTrigger(state, operations);
    const attacker = state.G.cardIndex[attack.attackerId as string];
    operations.game.setAttackState(null);
    const sourceCard = current ? state.G.cardIndex[current.sourceCardId as string] : undefined;
    if (sourceCard) {
      operations.event.emit({
        type: "actionLog",
        messageKey: "move.manualClearPendingResolution",
        params: { cardName: defOf(sourceCard).displayName },
        playerId,
      });
    }
    if (queueCleared > 0) {
      operations.event.emit({
        type: "actionLog",
        messageKey: "move.manualClearTriggerStack",
        params: { count: queueCleared },
        playerId,
      });
    }
    operations.event.emit({
      type: "actionLog",
      messageKey: "move.manualResetCombat",
      params: { attackerName: attacker ? defOf(attacker).displayName : "unknown attacker" },
      playerId,
    });
  },
};

export interface ManualForcePassTurnInput extends MoveInput {
  args: Record<string, never>;
}

/**
 * Un-stick the turn entirely: drop any pending choice, in-progress trigger,
 * queued trigger stack, and in-progress combat, then run the normal end-turn
 * transition for the active player. End-of-turn triggers fired by the
 * transition resolve (or suspend the flip) exactly like a real pass.
 */
export const manualForcePassTurnMove: MoveDefinition<ManualForcePassTurnInput> = {
  ...manualMoveDefaults,
  validate({ state }) {
    if (state.G.gameEnded) {
      return { valid: false, error: "Game has ended", errorCode: "GAME_ENDED" };
    }
    if (state.G.gamePhase !== "main") {
      return { valid: false, error: "Not in the main phase", errorCode: "INVALID_PHASE" };
    }
    return { valid: true };
  },
  execute({ state, operations }) {
    const metadata = state.G.turnMetadata;
    const queueCleared = metadata.triggerQueue.length;
    const attack = state.G.attackState;
    const attacker = attack ? state.G.cardIndex[attack.attackerId as string] : undefined;
    const hadCombat = attack !== null;
    metadata.triggerQueue = [];
    operations.game.setPendingChoice(undefined);
    metadata.currentTrigger = undefined;
    if (hadCombat) {
      operations.game.setAttackState(null);
      operations.event.emit({
        type: "actionLog",
        messageKey: "move.manualResetCombat",
        params: { attackerName: attacker ? defOf(attacker).displayName : "unknown attacker" },
        playerId: metadata.activePlayerId,
      });
    }
    if (queueCleared > 0) {
      operations.event.emit({
        type: "actionLog",
        messageKey: "move.manualClearTriggerStack",
        params: { count: queueCleared },
        playerId: metadata.activePlayerId,
      });
    }
    endTurn(state, metadata.activePlayerId, operations);
  },
};

export interface ManualSetEddiesInput extends MoveInput {
  args: { playerId?: string; amount: number };
}

/**
 * Set a player's Eddie count directly. Eddies are a plain counter (gig
 * steals mint them without Eddie cards), so any non-negative amount is
 * legal. `spentEddies` is zeroed so the next start-of-turn refund cannot
 * re-grant the difference.
 */
export const manualSetEddiesMove: MoveDefinition<ManualSetEddiesInput> = {
  ...manualMoveDefaults,
  validate({ state, playerId, input }) {
    const ownerId = (input.args.playerId ?? playerId) as string;
    const owner = state.G.players[ownerId];
    if (!owner) return playerNotFound();
    if (!Number.isInteger(input.args.amount) || input.args.amount < 0) {
      return {
        valid: false,
        error: "Eddies must be a non-negative integer",
        errorCode: "INVALID_EDDIE_AMOUNT",
      };
    }
    return { valid: true };
  },
  execute({ state, playerId, input, operations }) {
    const ownerId = (input.args.playerId ?? playerId) as string;
    const owner = state.G.players[ownerId];
    if (!owner) return;
    owner.eddies = input.args.amount;
    owner.spentEddies = 0;
    operations.event.emit({
      type: "actionLog",
      messageKey: "move.manualSetEddies",
      params: { count: input.args.amount },
      playerId,
    });
  },
};

export interface ManualResetOncePerTurnInput extends MoveInput {
  args: { playerId?: string };
}

/**
 * Re-arm every once-per-turn limit for a player: legend calls, selling, gig
 * take, and `firstTimeEachTurn` abilities whose ledger entry was burned by a
 * mis-fired or wedged trigger. Clearing `gigTakenThisTurn` means the end-turn
 * overtime check treats the turn as gig-less — an accepted consequence the
 * operator can see on the log.
 */
export const manualResetOncePerTurnMove: MoveDefinition<ManualResetOncePerTurnInput> = {
  ...manualMoveDefaults,
  validate({ state, playerId, input }) {
    const ownerId = (input.args.playerId ?? playerId) as string;
    if (!state.G.players[ownerId]) return playerNotFound();
    return { valid: true };
  },
  execute({ state, playerId, input, operations }) {
    const ownerId = (input.args.playerId ?? playerId) as string;
    const owner = state.G.players[ownerId];
    if (!owner) return;
    owner.calledLegendThisTurn = false;
    owner.calledLegendThisRivalTurn = false;
    owner.soldThisTurn = false;
    state.G.turnMetadata.gigTakenThisTurn = false;
    const metadata = state.G.turnMetadata;
    const firedBefore = metadata.abilityFiredThisTurn.length;
    metadata.abilityFiredThisTurn = metadata.abilityFiredThisTurn.filter(
      (entry) => state.G.cardIndex[entry.cardId as string]?.ownerId !== ownerId,
    );
    operations.event.emit({
      type: "actionLog",
      messageKey: "move.manualResetOncePerTurn",
      params: {
        count: firedBefore - metadata.abilityFiredThisTurn.length,
      },
      playerId,
      cardIds: [ownerId],
    });
  },
};

export interface ManualSetCardFaceInput extends MoveInput {
  args: { cardId: string; faceDown: boolean };
}

/**
 * Flip a Legend in the Legend area face-up or face-down without moving it.
 * Legends are public-identity cards, so no hidden information is revealed.
 */
export const manualSetCardFaceMove: MoveDefinition<ManualSetCardFaceInput> = {
  ...manualMoveDefaults,
  validate({ state, input }) {
    const card = state.G.cardIndex[input.args.cardId];
    if (!card) return { valid: false, error: "Card not found", errorCode: "CARD_NOT_FOUND" };
    if (card.zone !== "legendArea") {
      return {
        valid: false,
        error: "Only a card in the Legend area can be flipped",
        errorCode: "NOT_IN_LEGEND_AREA",
      };
    }
    if (typeof input.args.faceDown !== "boolean") {
      return { valid: false, error: "faceDown must be a boolean", errorCode: "INVALID_FACE" };
    }
    return { valid: true };
  },
  execute({ state, playerId, input, operations }) {
    const card = state.G.cardIndex[input.args.cardId];
    if (!card) return;
    card.meta.faceDown = input.args.faceDown;
    operations.event.emit({
      type: "actionLog",
      messageKey: "move.manualSetCardFace",
      params: {
        cardName: defOf(card).displayName,
        face: input.args.faceDown ? "face-down" : "face-up",
      },
      playerId,
      cardIds: [card.instanceId as string],
    });
  },
};

export interface ManualReadyAllInput extends MoveInput {
  args: { playerId?: string };
}

/**
 * Ready every spent card a player controls on the field, in the Legend area,
 * and in the Eddie area — the manual equivalent of the ready step. Cards
 * locked by the `cantReady` rule stay spent. Eddie cards grant their Eddie
 * when readied, matching {@link manualReadyCardMove}.
 */
export const manualReadyAllMove: MoveDefinition<ManualReadyAllInput> = {
  ...manualMoveDefaults,
  validate({ state, playerId, input }) {
    const ownerId = (input.args.playerId ?? playerId) as string;
    if (!state.G.players[ownerId]) return playerNotFound();
    return { valid: true };
  },
  execute({ state, playerId, input, operations }) {
    const ownerId = (input.args.playerId ?? playerId) as string;
    const owner = state.G.players[ownerId];
    if (!owner) return;
    let readyCount = 0;
    for (const zone of ["field", "legendArea", "eddieArea"] as const) {
      for (const cardId of owner.zones[zone]) {
        const card = state.G.cardIndex[cardId as string];
        if (!card?.meta.spent) continue;
        if (getEffectiveRules(state, cardId).includes("cantReady")) continue;
        operations.card.ready(cardId);
        if (zone === "eddieArea") {
          operations.game.gainEddies(ownerId as typeof playerId, 1);
        }
        readyCount += 1;
      }
    }
    if (readyCount > 0) {
      operations.event.emit({
        type: "actionLog",
        messageKey: "move.manualReadyAll",
        params: { count: readyCount },
        playerId,
      });
    }
  },
};

export interface ManualRecomputeActiveEffectsInput extends MoveInput {
  args: Record<string, never>;
}

/**
 * Rebuild the static active-effects table from scratch. Diagnosis/repair for
 * stale buffs or granted rules after a wedged resolution was force-cleared.
 */
export const manualRecomputeActiveEffectsMove: MoveDefinition<ManualRecomputeActiveEffectsInput> = {
  ...manualMoveDefaults,
  validate() {
    return { valid: true };
  },
  execute({ state, playerId, operations }) {
    recomputeActiveEffects(state);
    operations.event.emit({
      type: "actionLog",
      messageKey: "move.manualRecomputeActiveEffects",
      params: { count: state.G.activeEffects.length },
      playerId,
    });
  },
};

export interface ManualDropEffectBagEntryInput extends MoveInput {
  args: { entryId: string };
}

/** Remove one delayed-effect bag entry (a hanging end-of-turn / after-trigger effect). */
export const manualDropEffectBagEntryMove: MoveDefinition<ManualDropEffectBagEntryInput> = {
  ...manualMoveDefaults,
  validate({ state, input }) {
    const entry = state.G.effectBag.find((candidate) => candidate.id === input.args.entryId);
    if (!entry) {
      return { valid: false, error: "Delayed effect not found", errorCode: "BAG_ENTRY_NOT_FOUND" };
    }
    return { valid: true };
  },
  execute({ state, playerId, input, operations }) {
    const entry = state.G.effectBag.find((candidate) => candidate.id === input.args.entryId);
    if (!entry) return;
    operations.game.removeBagEntry(entry.id);
    operations.event.emit({
      type: "actionLog",
      messageKey: "move.manualDropEffectBagEntry",
      params: { abilityText: entry.abilityText },
      playerId,
      cardIds: [entry.sourceCardId as string],
    });
  },
};

export const manualMoves: Record<ManualMoveId, MoveDefinition<any>> = {
  manualSetGigValue: manualSetGigValueMove,
  manualMoveGig: manualMoveGigMove,
  manualMoveCard: manualMoveCardMove,
  manualAttachGear: manualAttachGearMove,
  manualDetachGear: manualDetachGearMove,
  manualExertCard: manualExertCardMove,
  manualReadyCard: manualReadyCardMove,
  manualDrawCard: manualDrawCardMove,
  manualClearPendingResolution: manualClearPendingResolutionMove,
  manualResetCombat: manualResetCombatMove,
  manualForcePassTurn: manualForcePassTurnMove,
  manualSetEddies: manualSetEddiesMove,
  manualResetOncePerTurn: manualResetOncePerTurnMove,
  manualSetCardFace: manualSetCardFaceMove,
  manualReadyAll: manualReadyAllMove,
  manualRecomputeActiveEffects: manualRecomputeActiveEffectsMove,
  manualDropEffectBagEntry: manualDropEffectBagEntryMove,
};
