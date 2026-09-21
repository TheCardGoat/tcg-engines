import type { CardInstanceId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { ChooseCardToMovePendingChoice } from "../types/match-state.ts";
import {
  enqueueEventTriggers,
  executeAbilityEffects,
  resumeCurrentTrigger,
} from "../ability-executor.ts";
import { bottomDeckCardsSimultaneously } from "../effects/bottom-deck.ts";
import type { ResolutionContext } from "../effects/target-resolver.ts";
import { removeFromGameIfGoSolo } from "./remove-from-game.ts";
import { tryDefOf } from "../state/lookups.ts";

export interface ResolveCardToMoveInput extends MoveInput {
  args: {
    cardId?: string;
    pass?: boolean;
  };
}

export const resolveCardToMoveMove: MoveDefinition<ResolveCardToMoveInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseCardToMove") return false;
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseCardToMove") {
      return { valid: false, error: "No chooseCardToMove pending", errorCode: "NO_PENDING_CHOICE" };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }
    if (input.args.pass) return { valid: true };
    const { cardId } = input.args;
    if (!cardId) {
      return {
        valid: false,
        error: "Must provide cardId or pass:true",
        errorCode: "INVALID_INPUT",
      };
    }
    const typedChoice = choice as ChooseCardToMovePendingChoice;
    if (!typedChoice.payload.cardIds.includes(cardId as CardInstanceId)) {
      return { valid: false, error: "Card is not a valid choice", errorCode: "INVALID_CHOICE" };
    }
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice as ChooseCardToMovePendingChoice;
    const {
      resolvedAttachToId,
      destination,
      boundTargets,
      sourceCardId,
      sourcePlayerId,
      abilityIndex,
      ifEffects,
      elseEffects,
    } = choice.payload;

    operations.game.setPendingChoice(undefined);

    const ctx: ResolutionContext = {
      state,
      sourceCardId,
      sourcePlayerId,
      abilityIndex,
      contextTargets: {},
      boundTargets,
    };

    if (input.args.pass) {
      const followupStatus = executeAbilityEffects(elseEffects, ctx, operations, 0, {
        nested: true,
      });
      operations.log.emit({
        type: "resolveCardToMove",
        playerId,
        timestamp: Date.now(),
        turnNumber: state.G.turnMetadata.turnNumber,
        passed: true,
      });
      if (followupStatus === "suspended") return;
      resumeCurrentTrigger(state, operations);
      return;
    }

    const { cardId } = input.args;
    if (!cardId) return;

    const card = state.G.cardIndex[cardId];
    if (!card) return;
    const def = tryDefOf(card);
    const cardName = def?.displayName ?? def?.name;

    if (resolvedAttachToId) {
      // Attach-to-unit flow (e.g. Panam): detach gear, move to field, attach to target.
      if (card.meta.attachedToId) {
        operations.card.detachGear(cardId as CardInstanceId);
      }
      operations.zone.moveCard(cardId as CardInstanceId, "field", playerId);
      operations.card.attachGear(cardId as CardInstanceId, resolvedAttachToId as CardInstanceId);
    } else if (destination === "deckBottom") {
      bottomDeckCardsSimultaneously([cardId as CardInstanceId], state, operations);
    } else if (choice.payload.defeat) {
      // Defeat-branded trash move ("You may defeat X" offered through ifYouDo).
      // CR 11.19.2 — the moved card and its attached Gear count as defeated:
      // emit cardDefeated and enqueue {Defeated} triggers like handleDefeat.
      const attachedGearIds = [...(card.meta.attachedGearIds ?? [])];
      const hadAttachedCards = attachedGearIds.length > 0;
      const defeatedHostId = card.meta.attachedToId as CardInstanceId | undefined;
      if (card.meta.attachedToId) {
        operations.card.detachGear(cardId as CardInstanceId);
      }
      operations.card.moveAttachedGear(cardId as CardInstanceId, "trash");
      operations.zone.moveCard(cardId as CardInstanceId, "trash", card.ownerId);
      const defeatedEvent = {
        type: "cardDefeated" as const,
        cardId: cardId as CardInstanceId,
        defeatedBy: sourceCardId,
        playerId: card.ownerId,
        hadAttachedCards,
        // The card was detached above; carry the host so `selector: "host"`
        // still resolves for the defeated Gear's own {Defeated} effects.
        ...(defeatedHostId ? { hostId: defeatedHostId } : {}),
      };
      operations.event.emit(defeatedEvent);
      enqueueEventTriggers(defeatedEvent, state, operations);
      for (const gearId of attachedGearIds) {
        const gear = state.G.cardIndex[gearId as string];
        if (!gear) continue;
        const gearEvent = {
          type: "cardDefeated" as const,
          cardId: gearId as CardInstanceId,
          defeatedBy: sourceCardId,
          playerId: gear.controllerId,
          hadAttachedCards: false,
          hostId: cardId as CardInstanceId,
        };
        operations.event.emit(gearEvent);
        enqueueEventTriggers(gearEvent, state, operations);
      }
      removeFromGameIfGoSolo(state, operations, cardId as CardInstanceId);
    } else {
      // Generic move to a destination zone (e.g. discard to trash).
      const destZone = (destination ?? "trash") as import("@tcg/cyberpunk-types").CardZone;
      if (card.meta.attachedToId) {
        operations.card.detachGear(cardId as CardInstanceId);
      }
      operations.card.moveAttachedGear(cardId as CardInstanceId, destZone);
      operations.zone.moveCard(cardId as CardInstanceId, destZone, card.ownerId);
    }

    const followupStatus = executeAbilityEffects(ifEffects, ctx, operations, 0, { nested: true });

    operations.log.emit({
      type: "resolveCardToMove",
      playerId,
      timestamp: Date.now(),
      turnNumber: state.G.turnMetadata.turnNumber,
      cardId: cardId as CardInstanceId,
      cardName,
    });
    if (followupStatus === "suspended") return;
    resumeCurrentTrigger(state, operations);
  },
};
