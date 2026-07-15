import type { CardInstanceId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { MatchState } from "../types/match-state.ts";
import type { Ability, TargetDSL, TargetSelectionDSL } from "@tcg/cyberpunk-types";
import { continueTriggerResolution, resumeCurrentTrigger } from "../ability-executor.ts";
import { evaluateCondition, resolveTarget } from "../effects/target-resolver.ts";
import type { ResolutionContext } from "../effects/target-resolver.ts";
import { defOf } from "../state/lookups.ts";
import { isReactStep } from "./is-react-step.ts";
import { availableEddies, availableEddiesAfterAbilityCosts } from "./eddie-resources.ts";
import { computeEffectiveCost } from "./compute-effective-cost.ts";

export interface ActivateAbilityInput extends MoveInput {
  args: {
    cardId: string;
    abilityIndex: number;
  };
}

export const activateAbilityMove: MoveDefinition<ActivateAbilityInput> = {
  available({ state, playerId }) {
    if (state.G.gamePhase !== "main") return false;

    const isDefending = isReactStep(state, playerId);
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
        if (!canHostActivatedAbility(card, cardDef, zone)) continue;

        const abilities: Ability[] =
          (cardDef as import("@tcg/cyberpunk-types").StructuredCardDefinition)?.abilities ?? [];
        for (const ability of abilities) {
          if (ability.trigger?.trigger === "activated") {
            if (state.G.attackState && isDefending) {
              const isQuick = ability.keyword === "quick" || cardDef.keywords.includes("quick");
              if (!isQuick) continue;
            }
            if (canActivateAbility(ability, state, cardId as CardInstanceId, playerId)) return true;
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
    if (!canHostActivatedAbility(card, cardDef, card.zone)) {
      return {
        valid: false,
        error: "Activated ability source is not in play",
        errorCode: "NOT_ON_FIELD",
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

    const isDefending = isReactStep(state, playerId);
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

    if (!canResolveActivatedAbility(ability, state, cardId as CardInstanceId, playerId)) {
      return {
        valid: false,
        error: "Ability has no valid targets",
        errorCode: "NO_VALID_TARGETS",
      };
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
    const attachedToCard = card.meta.attachedToId
      ? state.G.cardIndex[card.meta.attachedToId as string]
      : undefined;
    const activateParams = {
      cardName: cardDef.displayName,
      ...(attachedToCard ? { attachedToName: defOf(attachedToCard).displayName } : {}),
    };
    const messageKey = attachedToCard ? "move.activateAbility.attached" : "move.activateAbility";

    operations.event.emit({
      type: "actionLog",
      messageKey,
      params: activateParams,
      playerId,
    });

    state.G.turnMetadata.currentTrigger = {
      id: `activated-${cardId}-${abilityIndex}-${state.G.turnMetadata.nextTriggerId++}`,
      sourceCardId: cardId as CardInstanceId,
      sourcePlayerId: playerId,
      abilityIndex,
      abilityText: ability.text,
      optional: false,
      event: {
        type: "actionLog",
        messageKey,
        params: activateParams,
        playerId,
      },
      contextTargets: {},
      boundTargets: {},
      order: state.G.turnMetadata.nextTriggerId,
      nextEffectIndex: 0,
    };
    resumeCurrentTrigger(state as MatchState, operations);
    continueTriggerResolution(state as MatchState, operations);
  },
};

export function canHostActivatedAbility(
  card: { zone: string; meta: { attachedToId: CardInstanceId | null; faceDown: boolean } },
  cardDef: { type: string },
  zone: string,
): boolean {
  if (zone === "field") return card.zone === "field";
  if (zone !== "legendArea" || card.zone !== "legendArea") return false;
  if (cardDef.type === "legend") return !card.meta.faceDown;
  return card.meta.attachedToId !== null;
}

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
      const targets = resolveTarget(cost.target, ctx);
      for (const id of targets) {
        const c = state.G.cardIndex[id as string];
        if (c?.meta.spent) return false;
        if ((id as string) === (cardId as string) && c?.meta.hasLag) {
          const cardDef = c ? defOf(c) : undefined;
          // ADRENALINE is attack-scoped; it does not override Lag for self-spend effects.
          if (cardDef?.type === "unit") return false;
        }
      }
    }
    if (cost.cost === "payEddies" && availableEddies(state, playerId) < cost.amount) {
      return false;
    }
  }
  return true;
}

export function canActivateAbility(
  ability: Ability,
  state: MatchState,
  cardId: CardInstanceId,
  playerId: import("../types/branded.ts").PlayerId,
): boolean {
  return (
    canPayCosts(ability, state, cardId, playerId) &&
    canResolveActivatedAbility(ability, state, cardId, playerId)
  );
}

/**
 * Activated abilities are player-selected actions, so the prompt and move
 * validator must filter out abilities that would immediately fizzle for lack
 * of required targets.
 */
export function canResolveActivatedAbility(
  ability: Ability,
  state: MatchState,
  cardId: CardInstanceId,
  playerId: import("../types/branded.ts").PlayerId,
): boolean {
  const ctx: ResolutionContext = {
    state,
    sourceCardId: cardId,
    sourcePlayerId: playerId,
    abilityIndex: -1,
    contextTargets: {},
    boundTargets: {},
  };

  const selectableBindings: NonNullable<Ability["bindings"]> = [];
  for (const binding of ability.bindings ?? []) {
    const targets = resolveTarget(binding.target, ctx);
    const min = getSelectionMin(binding.target);
    if (targets.length < min) return false;

    if (getSelectionMode(binding.target) === "choose") {
      selectableBindings.push(binding);
    } else {
      ctx.boundTargets[binding.id] = targets;
    }
  }

  if (ability.conditions?.length && !ability.conditions.every((c) => evaluateCondition(c, ctx))) {
    return false;
  }

  if (selectableBindings.length === 1) {
    const binding = selectableBindings[0]!;
    const targets = resolveTarget(binding.target, ctx);
    const min = getSelectionMin(binding.target);
    const max = getSelectionMax(binding.target);
    if (min === 1 && max === 1) {
      const remainingEddies = availableEddiesAfterAbilityCosts(
        ability,
        state,
        cardId,
        playerId,
        ctx.boundTargets,
      );
      return targets.some((targetId) =>
        requiredEffectsHaveTargets(
          ability,
          {
            ...ctx,
            boundTargets: {
              ...ctx.boundTargets,
              [binding.id]: [targetId],
            },
          },
          remainingEddies,
        ),
      );
    }
  }

  return requiredEffectsHaveTargets(
    ability,
    ctx,
    availableEddiesAfterAbilityCosts(ability, state, cardId, playerId, ctx.boundTargets),
  );
}

function requiredEffectsHaveTargets(
  ability: Ability,
  ctx: ResolutionContext,
  remainingEddies: number,
): boolean {
  for (const effect of ability.effects) {
    if (effect.conditions?.length && !effect.conditions.every((c) => evaluateCondition(c, ctx))) {
      continue;
    }
    if (effect.optional || effect.effect === "scry") continue;
    if (!("target" in effect) || !effect.target) continue;

    const target = effect.target;
    if (target.selector === "bound") {
      const declared = ability.bindings?.find((binding) => binding.id === target.id);
      if (
        declared &&
        getSelectionMode(declared.target) === "choose" &&
        ctx.boundTargets[target.id] === undefined
      ) {
        continue;
      }
    }
    const targets = resolveTarget(target, ctx);
    if (targets.length === 0) return false;
    if (effect.effect === "playCard" && effect.free !== true) {
      const canPayAtLeastOne = targets.some((targetId) => {
        const card = ctx.state.G.cardIndex[targetId as string];
        if (!card) return false;
        return (
          computeEffectiveCost(ctx.state, targetId as CardInstanceId, ctx.sourcePlayerId) <=
          remainingEddies
        );
      });
      if (!canPayAtLeastOne) return false;
    }
  }

  return true;
}

function getSelectionMin(target: TargetDSL): number {
  const selection = getSelection(target);
  return selection?.min ?? 1;
}

function getSelectionMax(target: TargetDSL): number {
  const selection = getSelection(target);
  return selection?.max ?? 1;
}

function getSelectionMode(target: TargetDSL): TargetSelectionDSL["mode"] | undefined {
  const selection = getSelection(target);
  return selection?.mode;
}

function getSelection(target: TargetDSL): TargetSelectionDSL | undefined {
  return "selection" in target ? target.selection : undefined;
}
