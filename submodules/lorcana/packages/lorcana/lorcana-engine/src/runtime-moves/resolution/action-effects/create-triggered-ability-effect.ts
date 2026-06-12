import type { Condition, Effect, Trigger } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import { resolveTemporaryEffectWindow } from "../../effects/temporary-effects";
import { registerAbility } from "../../effects/triggered-abilities";
import { getCombinedSelectionTargets } from "./selection-state";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";

type CreateTriggeredAbilityEffectLike = {
  type: "create-triggered-ability";
  ability: {
    id?: string;
    name?: string;
    trigger: Trigger;
    sourceZones?: ("play" | "hand" | "discard" | "inkwell")[];
    condition?: Condition;
    effect: Effect;
    autoResolve?: boolean;
  };
  lifecycle:
    | {
        kind: "floating";
        duration: unknown;
      }
    | {
        kind: "delayed";
        timing: "end-of-turn" | "start-of-next-turn" | "end-of-next-turn";
      };
};

export function isCreateTriggeredAbilityEffect(
  effect: unknown,
): effect is CreateTriggeredAbilityEffectLike {
  if (
    typeof effect !== "object" ||
    effect === null ||
    !("type" in effect) ||
    (effect as { type?: unknown }).type !== "create-triggered-ability"
  ) {
    return false;
  }

  const lifecycle = (effect as { lifecycle?: unknown }).lifecycle;
  return (
    typeof lifecycle === "object" &&
    lifecycle !== null &&
    "kind" in lifecycle &&
    (((lifecycle as { kind?: unknown }).kind === "floating" && "duration" in lifecycle) ||
      ((lifecycle as { kind?: unknown }).kind === "delayed" && "timing" in lifecycle))
  );
}

function resolveLifecycle(
  ctx: PlayCardExecutionContext,
  effect: CreateTriggeredAbilityEffectLike,
): Parameters<typeof registerAbility>[1]["lifecycle"] {
  if (effect.lifecycle.kind === "delayed") {
    return {
      kind: "delayed",
      timing: effect.lifecycle.timing,
    };
  }

  const currentTurn = ctx.framework.state.status.turn ?? 1;
  const { startsAtTurn, expiresAtTurn } = resolveTemporaryEffectWindow(
    currentTurn,
    effect.lifecycle.duration,
  );

  return {
    kind: "floating",
    startsAtTurn,
    expiresAtTurn,
  } as const;
}

/**
 * Checks whether the ability's inner effect depends on a previous-target
 * reference. When it does, and the resolution context has no prior targets
 * (e.g. because the preceding step had no valid targets), the triggered
 * ability should not be registered — there is nothing for it to act on.
 */
function abilityEffectRequiresPreviousTarget(abilityEffect: Effect): boolean {
  if (!abilityEffect || typeof abilityEffect !== "object") {
    return false;
  }

  const target = (abilityEffect as { target?: unknown }).target;
  if (typeof target === "string" && target === "previous-target") {
    return true;
  }
  if (
    typeof target === "object" &&
    target !== null &&
    "ref" in target &&
    (target as { ref?: unknown }).ref === "previous-target"
  ) {
    return true;
  }
  return false;
}

export function resolveCreateTriggeredAbilityEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: CreateTriggeredAbilityEffectLike,
  resolutionInput: ActionResolutionInput,
): void {
  // Skip registration when the ability targets previous-target but no prior
  // target exists (e.g. the preceding sequence step found no valid targets).
  if (abilityEffectRequiresPreviousTarget(effect.ability.effect)) {
    const priorTargets = getCombinedSelectionTargets(resolutionInput);
    if (priorTargets.length === 0) {
      return;
    }
  }

  registerAbility(ctx as unknown as Parameters<typeof registerAbility>[0], {
    controllerId: cardPlayed.playerId,
    sourceId: cardPlayed.cardId,
    cardPlayed: {
      ...cardPlayed,
      singerIds: cardPlayed.singerIds ? [...cardPlayed.singerIds] : undefined,
    },
    ability: {
      id: effect.ability.id,
      name: effect.ability.name,
      trigger: effect.ability.trigger,
      sourceZones: effect.ability.sourceZones,
      condition: effect.ability.condition,
      effect: effect.ability.effect,
      ...(effect.ability.autoResolve === true ? { autoResolve: true } : {}),
    },
    lifecycle: resolveLifecycle(ctx, effect),
    resolutionInput,
  });
}
