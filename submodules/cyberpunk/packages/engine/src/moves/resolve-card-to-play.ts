import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { ChooseCardToPlayPendingChoice } from "../types/match-state.ts";
import type { MatchState } from "../types/match-state.ts";
import {
  abandonCurrentTrigger,
  continueTriggerResolution,
  enqueueEventTriggers,
  executeAbilityEffects,
  resumeCurrentTrigger,
} from "../ability-executor.ts";
import { defOf } from "../state/lookups.ts";
import { computeEffectiveCost } from "./compute-effective-cost.ts";
import { availableEddies, canSpendSelectedEddies } from "./eddie-resources.ts";
import { playSelectedCard } from "./play-selected-card.ts";
import { listLegalGearAttachHosts } from "../state/gear-attachment.ts";
import type { ResolutionContext } from "../effects/target-resolver.ts";

const CHOSEN_CARD_BINDING = "__chosenCardToPlay";

export interface ResolveCardToPlayInput extends MoveInput {
  args: {
    cardId?: string;
    /** Optional when a client submits the Gear and host together. */
    attachToId?: string;
    paymentSourceIds?: string[];
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
      if (
        input.args.paymentSourceIds !== undefined &&
        !canSpendSelectedEddies(
          (state as MatchState).G,
          playerId,
          cost,
          input.args.paymentSourceIds as CardInstanceId[],
        )
      ) {
        return { valid: false, error: "Invalid payment sources", errorCode: "INVALID_PAYMENT" };
      }
    }
    const card = (state as MatchState).G.cardIndex[cardId];
    if (attachToId && card && defOf(card).type !== "gear") {
      return {
        valid: false,
        error: "Only Gear can have an attach host",
        errorCode: "INVALID_ARGS",
      };
    }
    if (card && defOf(card).type === "gear") {
      const attachId = attachToId ?? typedChoice.payload.resolvedAttachToId;
      const hosts = pendingGearAttachHosts(
        state as MatchState,
        typedChoice,
        cardId as CardInstanceId,
        playerId,
      );
      if (!attachId && hosts.length === 0) {
        return {
          valid: false,
          error: "Gear has no legal attach host",
          errorCode: "INVALID_CHOICE",
        };
      }
      if (attachId && !hosts.includes(attachId)) {
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
      if (choice.payload.onDecline === "resumeTrigger") {
        resumeCurrentTrigger(state as MatchState, operations);
        return;
      }
      abandonCurrentTrigger(state as MatchState, operations);
      return;
    }

    const { cardId, attachToId, paymentSourceIds } = input.args;
    if (!cardId) return;
    const card = (state as MatchState).G.cardIndex[cardId];
    let attachId = resolvedAttachToId ?? attachToId;
    if (card && defOf(card).type === "gear") {
      if (!attachId) {
        const hosts = pendingGearAttachHosts(
          state as MatchState,
          choice,
          cardId as CardInstanceId,
          playerId,
        );
        if (hosts.length === 0) return;
        operations.game.setPendingChoice({
          type: "chooseTarget",
          chooserId: pendingGearAttachChooser(state as MatchState, choice, playerId),
          effectId: choice.effectId,
          payload: {
            type: "effectTarget",
            targetKind: "card",
            eligibleIds: hosts,
            min: 1,
            max: 1,
            canDecline: false,
            effect: {
              effect: "playCard",
              free,
              target: { selector: "bound", id: CHOSEN_CARD_BINDING },
              attachTo: { selector: "bound", id: "__chosenGearHost" },
            },
            sourceCardId,
            sourcePlayerId,
            abilityIndex,
            contextTargets: {},
            boundTargets: {
              ...boundTargets,
              [CHOSEN_CARD_BINDING]: [cardId],
            },
            ifEffects,
            targetPurpose: "attachHost",
          },
        });
        return;
      }
    }
    const result = playSelectedCard({
      state: state as MatchState,
      operations,
      playerId,
      cardId: cardId as CardInstanceId,
      free,
      resolvedAttachToId: attachId,
      ...(paymentSourceIds === undefined
        ? {}
        : { paymentSourceIds: paymentSourceIds as CardInstanceId[] }),
    });
    if (!result) return;

    // Clear the old pending choice before processing cardPlayed so that any new
    // pendingChoice set by downstream triggers is not overwritten.
    operations.game.setPendingChoice(undefined);

    enqueueEventTriggers(result.cardPlayedEvent, state as MatchState, operations);
    continueTriggerResolution(state as MatchState, operations);

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

function pendingGearAttachChooser(
  state: MatchState,
  choice: ChooseCardToPlayPendingChoice,
  fallbackPlayerId: PlayerId,
): PlayerId {
  const sourcePlayerId = choice.payload.sourcePlayerId ?? fallbackPlayerId;
  const attachTo = choice.payload.attachTo;
  const selection = attachTo && "selection" in attachTo ? attachTo.selection : undefined;
  if (selection?.chooser === "rival") {
    return state.ctx.playerIds.find((id) => id !== sourcePlayerId) ?? fallbackPlayerId;
  }
  return sourcePlayerId;
}

function pendingGearAttachHosts(
  state: MatchState,
  choice: ChooseCardToPlayPendingChoice,
  gearId: CardInstanceId,
  playerId: PlayerId,
): string[] {
  const attachTo = choice.payload.attachTo;
  if (!attachTo) return listLegalGearAttachHosts(state, gearId, playerId);
  const ctx: ResolutionContext = {
    state,
    sourceCardId: choice.payload.sourceCardId ?? gearId,
    sourcePlayerId: choice.payload.sourcePlayerId ?? playerId,
    abilityIndex: choice.payload.abilityIndex ?? 0,
    contextTargets: {},
    boundTargets: choice.payload.boundTargets ?? {},
  };
  return listLegalGearAttachHosts(state, gearId, playerId, { target: attachTo, context: ctx });
}
