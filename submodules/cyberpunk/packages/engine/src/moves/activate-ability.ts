import type { CardInstanceId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { MatchState } from "../types/match-state.ts";
import type { Ability } from "@tcg/cyberpunk-types";
import { executeAbilityEffects, processCardSpentEventsSince } from "../ability-executor.ts";
import { resolveTarget } from "../effects/target-resolver.ts";
import type { ResolutionContext } from "../effects/target-resolver.ts";
import { defOf } from "../state/lookups.ts";
import { isDefensiveStep } from "./is-defensive-step.ts";

export interface ActivateAbilityInput extends MoveInput {
  args: {
    cardId: string;
    abilityIndex: number;
  };
}

export const activateAbilityMove: MoveDefinition<ActivateAbilityInput> = {
  available({ state, playerId }) {
    if (state.G.gamePhase !== "main") return false;

    const isDefending = isDefensiveStep(state, playerId);
    if (state.G.attackState && !isDefending) return false;
    if (!isDefending && state.G.turnMetadata.activePlayerId !== playerId) return false;

    const player = state.G.players[playerId as string];
    if (!player) return false;

    // Check field and legendArea for cards with activated abilities
    for (const zone of ["field", "legendArea"] as const) {
      for (const cardId of player.zones[zone]) {
        const card = state.G.cardIndex[cardId as string];
        if (!card) continue;
        const cardDef = defOf(card);
        if (cardDef.type === "legend" && card.meta.faceDown) continue;

        const abilities: Ability[] =
          (cardDef as import("@tcg/cyberpunk-types").StructuredCardDefinition)?.abilities ?? [];
        for (const ability of abilities) {
          if (ability.trigger?.trigger === "activated") {
            if (state.G.attackState && isDefending) {
              const isQuick = ability.keyword === "quick" || cardDef.keywords.includes("quick");
              if (!isQuick) continue;
            }
            if (canPayCosts(ability, state, cardId, playerId)) return true;
          }
        }
      }
    }

    return false;
  },

  validate({ state, playerId, input }) {
    const { cardId, abilityIndex } = input.args;
    const card = state.G.cardIndex[cardId];
    if (!card) {
      return { valid: false, error: "Card not found", errorCode: "CARD_NOT_FOUND" };
    }

    if ((card.controllerId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your card", errorCode: "NOT_YOUR_CARD" };
    }

    const cardDef = defOf(card);
    if (cardDef.type === "legend" && card.meta.faceDown) {
      return {
        valid: false,
        error: "Legend is face-down",
        errorCode: "LEGEND_FACE_DOWN",
      };
    }

    const abilities: Ability[] =
      (cardDef as import("@tcg/cyberpunk-types").StructuredCardDefinition)?.abilities ?? [];
    const ability = abilities[abilityIndex];
    if (!ability || ability.trigger?.trigger !== "activated") {
      return {
        valid: false,
        error: "No activated ability at this index",
        errorCode: "INVALID_ABILITY",
      };
    }

    const isDefending = isDefensiveStep(state, playerId);
    if (state.G.attackState && !isDefending) {
      return { valid: false, error: "Attack in progress", errorCode: "ATTACK_IN_PROGRESS" };
    }
    if (state.G.attackState && isDefending) {
      const isQuick = ability.keyword === "quick" || cardDef.keywords.includes("quick");
      if (!isQuick) {
        return {
          valid: false,
          error: "Can only activate QUICK abilities as a reaction",
          errorCode: "NOT_QUICK",
        };
      }
    }

    if (!canPayCosts(ability, state, cardId as CardInstanceId, playerId)) {
      return { valid: false, error: "Cannot pay ability costs", errorCode: "CARD_SPENT" };
    }

    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const { cardId, abilityIndex } = input.args;
    const card = state.G.cardIndex[cardId];
    if (!card) return;

    const cardDef = defOf(card);
    const abilities: Ability[] =
      (cardDef as import("@tcg/cyberpunk-types").StructuredCardDefinition)?.abilities ?? [];
    const ability = abilities[abilityIndex]!;

    const ctx: ResolutionContext = {
      state,
      sourceCardId: cardId as CardInstanceId,
      sourcePlayerId: playerId,
      abilityIndex,
      contextTargets: {},
      boundTargets: {},
    };

    // Pay costs
    const eventsBeforeCosts = operations.event.getEmittedEvents().length;
    if (ability.costs) {
      for (const cost of ability.costs) {
        if (cost.cost === "spend") {
          const targets = resolveTarget(cost.target as any, ctx);
          for (const id of targets) {
            operations.card.spend(id as CardInstanceId);
          }
        }
      }
    }
    processCardSpentEventsSince(eventsBeforeCosts, state as MatchState, operations);

    operations.event.emit({
      type: "actionLog",
      messageKey: "move.activateAbility",
      params: { cardName: cardDef.displayName },
      playerId,
    });

    // Execute effects
    executeAbilityEffects(ability.effects, ctx, operations);
  },
};

/**
 * Returns true when every cost on the ability could be paid right now. Mirrors
 * what `validate` checks; surfaced for the prompt builder so it can pre-filter
 * activatable abilities the same way the engine validates them at execution.
 */
export function canPayCosts(
  ability: Ability,
  state: MatchState,
  cardId: CardInstanceId,
  playerId: import("../types/branded.ts").PlayerId,
): boolean {
  if (!ability.costs) return true;

  const ctx: ResolutionContext = {
    state,
    sourceCardId: cardId,
    sourcePlayerId: playerId,
    abilityIndex: -1,
    contextTargets: {},
    boundTargets: {},
  };

  for (const cost of ability.costs) {
    if (cost.cost === "spend") {
      const targets = resolveTarget(cost.target as any, ctx);
      for (const id of targets) {
        const c = state.G.cardIndex[id as string];
        if (c?.meta.spent) return false;
      }
    }
  }
  return true;
}
