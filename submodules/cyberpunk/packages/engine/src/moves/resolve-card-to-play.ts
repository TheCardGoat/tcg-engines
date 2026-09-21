import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { ChooseCardToPlayPendingChoice } from "../types/match-state.ts";
import type { MatchState } from "../types/match-state.ts";
import {
  abandonCurrentTrigger,
  executeAbilityEffects,
  processCardSpentEventsSince,
  processEventTriggers,
  resumeCurrentTrigger,
} from "../ability-executor.ts";
import type { ResolutionContext } from "../effects/target-resolver.ts";
import { defOf } from "../state/lookups.ts";
import { computeEffectiveCost } from "./compute-effective-cost.ts";
import { availableEddies } from "./eddie-resources.ts";
import { playSelectedCard } from "./play-selected-card.ts";
import { listLegalGearAttachHosts } from "../state/gear-attachment.ts";

export interface ResolveCardToPlayInput extends MoveInput {
  args: {
    cardId?: string;
    /** Required when free-playing Gear without a pre-resolved host. */
    attachToId?: string;
    pass?: boolean;
  };
}

export const resolveCardToPlayMove: MoveDefinition<ResolveCardToPlayInput> = {
  handlesPendingChoice: true,
  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseCardToPlay") return false;
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseCardToPlay") {
      return { valid: false, error: "No chooseCardToPlay pending", errorCode: "NO_PENDING_CHOICE" };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }
    const typedChoice = choice as ChooseCardToPlayPendingChoice;
    if (input.args.pass) {
      return typedChoice.payload.canDecline
        ? { valid: true }
        : { valid: false, error: "Cannot decline this play", errorCode: "CANNOT_PASS" };
    }
    const { cardId, attachToId } = input.args;
    if (!cardId) {
      return { valid: false, error: "cardId required", errorCode: "INVALID_ARGS" };
    }
    if (!typedChoice.payload.cardIds.includes(cardId as CardInstanceId)) {
      return { valid: false, error: "Card is not a valid choice", errorCode: "INVALID_CHOICE" };
    }
    if (!typedChoice.payload.free) {
      const cost = computeEffectiveCost(state as MatchState, cardId as CardInstanceId, playerId);
      if (availableEddies(state as MatchState, playerId) < cost) {
        return { valid: false, error: "Not enough eddies", errorCode: "INSUFFICIENT_EDDIES" };
      }
    }
    const card = (state as MatchState).G.cardIndex[cardId];
    if (card && defOf(card).type === "gear") {
      const attachId =
        attachToId ??
        typedChoice.payload.resolvedAttachToId ??
        soleGearHost(state as MatchState, cardId as CardInstanceId, playerId);
      if (!attachId) {
        return {
          valid: false,
          error: "Gear free-play requires an attach host",
          errorCode: "INVALID_ARGS",
        };
      }
      const hosts = listLegalGearAttachHosts(
        state as MatchState,
        cardId as CardInstanceId,
        playerId,
      );
      if (!hosts.includes(attachId)) {
        return { valid: false, error: "Invalid gear attach host", errorCode: "INVALID_CHOICE" };
      }
    }
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice as ChooseCardToPlayPendingChoice;
    const {
      free,
      resolvedAttachToId,
      boundTargets,
      sourceCardId,
      sourcePlayerId,
      abilityIndex,
      ifEffects,
      elseEffects,
    } = choice.payload;

    if (input.args.pass) {
      operations.game.setPendingChoice(undefined);
      if (
        elseEffects &&
        elseEffects.length > 0 &&
        sourceCardId &&
        sourcePlayerId &&
        abilityIndex !== undefined
      ) {
        const ctx: ResolutionContext = {
          state,
          sourceCardId,
          sourcePlayerId,
          abilityIndex,
          contextTargets: {},
          boundTargets: boundTargets ?? {},
        };
        const followupStatus = executeAbilityEffects(elseEffects, ctx, operations, 0, {
          nested: true,
        });
        if (followupStatus === "suspended") return;
        resumeCurrentTrigger(state as MatchState, operations);
        return;
      }
      abandonCurrentTrigger(state as MatchState, operations);
      return;
    }

    const { cardId, attachToId } = input.args;
    if (!cardId) return;
    const card = (state as MatchState).G.cardIndex[cardId];
    let attachId = resolvedAttachToId ?? attachToId;
    if (card && defOf(card).type === "gear") {
      attachId = attachId ?? soleGearHost(state as MatchState, cardId as CardInstanceId, playerId);
      if (!attachId) return;
    }
    const result = playSelectedCard({
      state: state as MatchState,
      operations,
      playerId,
      cardId: cardId as CardInstanceId,
      free,
      resolvedAttachToId: attachId,
    });
    if (!result) return;

    // Clear the old pending choice before processing cardPlayed so that any new
    // pendingChoice set by downstream triggers is not overwritten.
    operations.game.setPendingChoice(undefined);

    processCardSpentEventsSince(result.eventsBeforePayment, state as MatchState, operations);
    processEventTriggers(result.cardPlayedEvent, state as MatchState, operations);

    if (
      ifEffects &&
      ifEffects.length > 0 &&
      sourceCardId &&
      sourcePlayerId &&
      abilityIndex !== undefined
    ) {
      const ctx: ResolutionContext = {
        state,
        sourceCardId,
        sourcePlayerId,
        abilityIndex,
        contextTargets: {},
        boundTargets: boundTargets ?? {},
      };
      const followupStatus = executeAbilityEffects(ifEffects, ctx, operations, 0, { nested: true });
      if (followupStatus === "suspended") return;
    }

    resumeCurrentTrigger(state as MatchState, operations);
  },
};

function soleGearHost(
  state: MatchState,
  gearId: CardInstanceId,
  playerId: PlayerId,
): string | undefined {
  const hosts = listLegalGearAttachHosts(state, gearId, playerId);
  return hosts.length === 1 ? hosts[0] : undefined;
}
