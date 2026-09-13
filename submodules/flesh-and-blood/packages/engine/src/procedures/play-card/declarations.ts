import { createFabLoopGuard, isUpToCount, type FabModalAbility } from "@tcg/flesh-and-blood-types";
import { resolveModalChooseSelection } from "../../abilities.ts";
import { declaredObjectTargetBounds } from "../../kernel/declared-target-bounds.ts";
import type { FabMatchState } from "../../state.ts";
import type { FabProcessId } from "../../rules/events.ts";
import type { FabDecisionAnswer, FabDecisionContinuation } from "../../rules/process.ts";
import { type FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import {
  collectDeclaredTargets,
  type FabDeclarationContext,
} from "../../kernel/trigger-declaration.ts";
import { playStaticResourceCostReduction } from "../../rules/legality/play.ts";
import { buildFabRulesView, resolveFabEventBindings } from "../../rules/state-rules-view.ts";
import type { FabPlayProcedureResult } from "./types.ts";
import { advanced, failure, reversePlay } from "./types.ts";
import type { FabTargetRef } from "../../rules/targets.ts";

import { advancePlayAssetPayment } from "./payment.ts";
import { paymentCandidates } from "./helpers.ts";
import {
  createFabEntityTargetDecision,
  createFabExactEntityTargetDecision,
  createFabNumericDecision,
  createFabOptionDecision,
} from "../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../kernel/decision-state.ts";
import {
  distinctPrintedNameCount,
  targetRequiresDifferentNames,
} from "../../kernel/different-names.ts";
import {
  USURP_COST_ID,
  boundedMixedObjectCostParts,
  boundedMixedCostCandidates,
  banishPlayCostCount,
  declaredAllBanishHandPlayCost,
  declaredAnyNumberBanishHandPlayCost,
  declaredDestroyPlayCost,
  declaredMixedAlternativePlayCost,
  declaredMoveToDeckPlayCost,
  declaredNamedDiscardPlayCost,
  declaredOptionalBanishHandPlayCost,
  declaredRequiredBanishHandPlayCost,
  declaredRemoveCountersPlayCost,
  declaredSoulBanishPlayCost,
  declaredTapPlayCost,
  destroyPlayCostCount,
  handBanishPlayCostBounds,
  isChargePlayCost,
  isMoveToDeckPlayCost,
  isMixedAlternativePlayCost,
  isOptionalBanishGraveyardPlayCost,
  isPlayCostDeclared,
  isRandomBanishHandPlayCost,
  isRequiredBanishGraveyardPlayCost,
  isResourcePlayCost,
  mixedAlternativePlayCostCandidates,
  moveToDeckCostCandidates,
  moveToDeckPlayCostFrom,
  namedDiscardPlayCostCount,
  numericCounterCountOnObject,
  optionalPlayCostIsPayable,
  optionalPlayCostsDeclared,
  pendingPlayCostAbilityId,
  playCostDeclaredKey,
  playCostFilter,
  playCostSpecs,
  PLAY_COST_OPTIONALS_DECLARED_KEY,
  PLAY_COST_PENDING_KEY,
  PLAY_COST_STAR_DECLARED_KEY,
  removeCountersPlayCostCandidates,
  removeCountersPlayCostMin,
  isSoulBanishXPlayCost,
  soulBanishPlayCostMax,
  starPlayCostDeclared,
  tapPlayCostCount,
  usesPrintedXResourceCost,
  destroyPlayCostCandidates,
  variableTapCostCandidates,
  zonePlayCostCandidates,
} from "./effect-costs.ts";

const PAY_OPTION_ID = "pay";
const DECLINE_OPTION_ID = "decline";

export function resumeFabPlayX(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "play-x" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "numeric" }>,
  options: FabEventTransactionOptions,
): FabPlayProcedureResult {
  const process = state.rulesProcess;
  const procedure = process?.procedure;
  if (!process || process.processId !== continuation.processId || procedure?.kind !== "play-card")
    return failure(
      state,
      "The persisted FAB play X declaration no longer exists.",
      "stale_play_process",
    );
  const removeCounters = declaredRemoveCountersPlayCost(procedure.object, procedure.costBindings);
  if (
    removeCounters &&
    procedure.effectCostTargetIds.length === 1 &&
    typeof procedure.costBindings["counters-removed-for-cost"] !== "number"
  ) {
    const targetId = procedure.effectCostTargetIds[0]!;
    const min = removeCountersPlayCostMin(removeCounters.cost);
    const available =
      removeCounters.cost.class === "effect" && removeCounters.cost.type === "remove-counters"
        ? numericCounterCountOnObject(state, targetId, removeCounters.cost)
        : 0;
    if (!Number.isInteger(answer.value) || answer.value < min || answer.value > available)
      return failure(
        state,
        "The chosen counter-cost amount is outside the legal range.",
        "invalid_play_x",
      );
    procedure.costBindings = {
      ...procedure.costBindings,
      "counters-removed-for-cost": answer.value,
    };
    return advanceFabPlayDeclarations(state, options);
  }
  if (usesPrintedXResourceCost(procedure.object) && procedure.chosenX === null) {
    const player = state.players[procedure.actorId]!;
    const available =
      player.chiPoints +
      player.resourcePoints +
      paymentCandidates(state, procedure.actorId, procedure.object.instanceId, []).reduce(
        (total, candidate) => total + candidate.value,
        0,
      );
    if (!Number.isInteger(answer.value) || answer.value < 0 || answer.value > available)
      return failure(
        state,
        "The chosen X is outside the legal resource-cost range.",
        "invalid_play_x",
      );
    const destroyCost = declaredDestroyPlayCost(procedure.object, procedure.costBindings);
    const tapCost = declaredTapPlayCost(procedure.object, procedure.costBindings);
    if (
      (destroyCost &&
        destroyPlayCostCount(destroyCost.cost) === "x" &&
        answer.value > destroyPlayCostCandidates(state, procedure.actorId, destroyCost).length) ||
      (tapCost &&
        tapPlayCostCount(tapCost.cost) === "x" &&
        answer.value >
          variableTapCostCandidates(state, procedure.actorId, playCostFilter(tapCost.cost)).length)
    )
      return failure(
        state,
        "The chosen X exceeds the available additional-cost objects.",
        "invalid_play_x",
      );
    procedure.chosenX = answer.value;
    procedure.resourceCost = answer.value;
    procedure.costBindings = {
      ...procedure.costBindings,
      x: answer.value,
      ...(destroyCost && destroyPlayCostCount(destroyCost.cost) === "x"
        ? { "destroyed-this-way": answer.value }
        : {}),
    };
    return advanceFabPlayDeclarations(state, options);
  }
  const destroy = declaredDestroyPlayCost(procedure.object, procedure.costBindings);
  const count = destroy ? destroyPlayCostCount(destroy.cost) : null;
  if (count === "x" && procedure.chosenX === null) {
    if (!destroy) return failure(state, "Destroy-cost X has no declared cost.", "invalid_play_x");
    const available = destroyPlayCostCandidates(state, procedure.actorId, destroy).length;
    if (!Number.isInteger(answer.value) || answer.value < 0 || answer.value > available)
      return failure(
        state,
        "The chosen X is outside the legal destroy-cost range.",
        "invalid_play_x",
      );
    procedure.chosenX = answer.value;
    procedure.costBindings = {
      ...procedure.costBindings,
      x: answer.value,
      "destroyed-this-way": answer.value,
    };
    return advanceFabPlayDeclarations(state, options);
  }
  const tap = declaredTapPlayCost(procedure.object, procedure.costBindings);
  const tapCount = tap ? tapPlayCostCount(tap.cost) : null;
  if (tapCount === "x" && procedure.chosenX === null) {
    if (!tap) return failure(state, "Tap-cost X has no declared cost.", "invalid_play_x");
    const filter = playCostFilter(tap.cost);
    const available = variableTapCostCandidates(state, procedure.actorId, filter).length;
    if (!Number.isInteger(answer.value) || answer.value < 0 || answer.value > available)
      return failure(state, "The chosen X is outside the legal tap-cost range.", "invalid_play_x");
    procedure.chosenX = answer.value;
    procedure.costBindings = {
      ...procedure.costBindings,
      x: answer.value,
    };
    return advanceFabPlayDeclarations(state, options);
  }
  return failure(
    state,
    "The FAB play procedure does not expect an X declaration.",
    "invalid_play_x",
  );
}

export function resumeFabPlayCostTarget(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "play-cost-target" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "entity-target" }>,
  options: FabEventTransactionOptions,
): FabPlayProcedureResult {
  const process = state.rulesProcess;
  const procedure = process?.procedure;
  if (!process || process.processId !== continuation.processId || procedure?.kind !== "play-card")
    return failure(
      state,
      "The persisted FAB play cost declaration no longer exists.",
      "stale_play_process",
    );
  const mixedParts = boundedMixedObjectCostParts(procedure.object);
  const mixedIndex = procedure.costBindings["mixed-cost-pending"];
  if (mixedParts && typeof mixedIndex === "number") {
    const part = mixedParts[mixedIndex];
    if (!part) return failure(state, "Missing mixed-cost component.", "invalid_play_cost_targets");
    const candidates = boundedMixedCostCandidates(
      state,
      procedure.actorId,
      procedure.object.instanceId,
      part,
    );
    const chosen = candidates.filter((candidate) =>
      answer.instanceIds.includes(candidate.instanceId),
    );
    if (
      chosen.length !== answer.instanceIds.length ||
      new Set(answer.instanceIds).size !== chosen.length ||
      chosen.length > part.maximum
    )
      return failure(
        state,
        "The selected mixed-cost objects exceed the legal component.",
        "invalid_play_cost_targets",
      );
    procedure.effectCostTargetIds.push(...answer.instanceIds);
    procedure.costBindings = {
      ...procedure.costBindings,
      [`mixed-cost-part:${mixedIndex}`]: chosen,
      "objects-paid-for-cost": procedure.effectCostTargetIds.length,
    };
    return advanceFabPlayDeclarations(state, options);
  }
  if (
    procedure.effectCostTargetIds.length > 0 &&
    !declaredSoulBanishPlayCost(procedure.object, procedure.costBindings) &&
    !declaredRequiredBanishHandPlayCost(procedure.object, procedure.costBindings) &&
    !declaredAnyNumberBanishHandPlayCost(procedure.object, procedure.costBindings) &&
    !declaredRemoveCountersPlayCost(procedure.object, procedure.costBindings)
  )
    return failure(
      state,
      "The FAB play procedure does not expect destroy-cost targets.",
      "invalid_play_cost_targets",
    );
  const unique = new Set(answer.instanceIds);
  if (unique.size !== answer.instanceIds.length)
    return failure(
      state,
      "The cost declaration must contain distinct objects.",
      "invalid_play_cost_targets",
    );
  const destroy = declaredDestroyPlayCost(procedure.object, procedure.costBindings);
  const tapCost = declaredTapPlayCost(procedure.object, procedure.costBindings);
  const move = declaredMoveToDeckPlayCost(procedure.object, procedure.costBindings);
  const discard = declaredNamedDiscardPlayCost(procedure.object, procedure.costBindings);
  const soul = declaredSoulBanishPlayCost(procedure.object, procedure.costBindings);
  const anyNumberHandBanish = declaredAnyNumberBanishHandPlayCost(
    procedure.object,
    procedure.costBindings,
  );
  const optionalHandBanish = declaredOptionalBanishHandPlayCost(
    procedure.object,
    procedure.costBindings,
  );
  const requiredHandBanish = declaredRequiredBanishHandPlayCost(
    procedure.object,
    procedure.costBindings,
  );
  const removeCounters = declaredRemoveCountersPlayCost(procedure.object, procedure.costBindings);
  const mixed = declaredMixedAlternativePlayCost(procedure.object, procedure.costBindings);
  if (move) {
    if (answer.instanceIds.length !== 1)
      return failure(
        state,
        "The move-to-deck additional cost requires exactly one card.",
        "invalid_play_cost_targets",
      );
  } else if (tapCost) {
    const count = tapPlayCostCount(tapCost.cost);
    if (count === "x") {
      if (procedure.chosenX === null || answer.instanceIds.length !== procedure.chosenX)
        return failure(
          state,
          "The tap-cost declaration must contain exactly X distinct objects.",
          "invalid_play_cost_targets",
        );
    } else {
      return failure(
        state,
        "The FAB play procedure does not expect tap-cost targets.",
        "invalid_play_cost_targets",
      );
    }
  } else if (destroy) {
    const count = destroyPlayCostCount(destroy.cost);
    if (count === "all" || count === "any-number") {
      procedure.chosenX = answer.instanceIds.length;
      procedure.costBindings = {
        ...procedure.costBindings,
        x: answer.instanceIds.length,
        "destroyed-this-way": answer.instanceIds.length,
        [PLAY_COST_STAR_DECLARED_KEY]: true,
      };
    } else if (count === "x") {
      if (procedure.chosenX === null || answer.instanceIds.length !== procedure.chosenX)
        return failure(
          state,
          "The destroy-cost declaration must contain exactly X distinct objects.",
          "invalid_play_cost_targets",
        );
    } else if (typeof count === "number") {
      if (answer.instanceIds.length !== count)
        return failure(
          state,
          "The destroy-cost declaration must contain the required objects.",
          "invalid_play_cost_targets",
        );
      procedure.chosenX = count;
      procedure.costBindings = {
        ...procedure.costBindings,
        x: count,
        "destroyed-this-way": count,
      };
    } else {
      return failure(
        state,
        "The FAB play procedure does not expect destroy-cost targets.",
        "invalid_play_cost_targets",
      );
    }
  } else if (discard) {
    const needed = namedDiscardPlayCostCount(discard.cost) ?? 1;
    if (answer.instanceIds.length !== needed)
      return failure(
        state,
        "The discard additional cost requires the printed number of cards.",
        "invalid_play_cost_targets",
      );
  } else if (optionalHandBanish) {
    const bounds = handBanishPlayCostBounds(optionalHandBanish.cost, optionalHandBanish.optional);
    if (!bounds || bounds.max !== 1 || answer.instanceIds.length !== 1)
      return failure(
        state,
        "The optional hand-banish additional cost requires exactly one card.",
        "invalid_play_cost_targets",
      );
  } else if (requiredHandBanish) {
    const bounds = handBanishPlayCostBounds(requiredHandBanish.cost, requiredHandBanish.optional);
    if (!bounds || bounds.max === null || answer.instanceIds.length !== bounds.min)
      return failure(
        state,
        "The hand-banish additional cost requires the printed number of cards.",
        "invalid_play_cost_targets",
      );
  } else if (anyNumberHandBanish) {
    const bounds = handBanishPlayCostBounds(anyNumberHandBanish.cost, anyNumberHandBanish.optional);
    if (!bounds || answer.instanceIds.length < bounds.min)
      return failure(
        state,
        "The hand-banish alternative cost requires its printed minimum.",
        "invalid_play_cost_targets",
      );
    procedure.chosenX = answer.instanceIds.length;
    procedure.costBindings = {
      ...procedure.costBindings,
      "banished-for-cost": answer.instanceIds.length,
      x: answer.instanceIds.length,
      [PLAY_COST_STAR_DECLARED_KEY]: true,
    };
  } else if (soul) {
    if (isSoulBanishXPlayCost(soul.cost)) {
      if (answer.instanceIds.length === 0)
        return failure(state, "X can't be 0.", "invalid_play_cost_targets");
      procedure.chosenX = answer.instanceIds.length;
    } else {
      const max = soulBanishPlayCostMax(soul.cost) ?? 0;
      if (answer.instanceIds.length > max)
        return failure(
          state,
          "The soul-banish additional cost exceeds its printed maximum.",
          "invalid_play_cost_targets",
        );
    }
    procedure.costBindings = {
      ...procedure.costBindings,
      "banished-for-cost": answer.instanceIds.length,
      x: answer.instanceIds.length,
      [PLAY_COST_STAR_DECLARED_KEY]: true,
    };
  } else if (removeCounters) {
    if (answer.instanceIds.length !== 1)
      return failure(
        state,
        "The remove-counters additional cost requires exactly one object.",
        "invalid_play_cost_targets",
      );
  } else if (mixed) {
    if (answer.instanceIds.length !== 1)
      return failure(
        state,
        "The alternative cost requires exactly one object.",
        "invalid_play_cost_targets",
      );
  } else {
    return failure(
      state,
      "The FAB play procedure does not expect cost targets.",
      "invalid_play_cost_targets",
    );
  }
  procedure.effectCostTargetIds.push(...answer.instanceIds);
  return advanceFabPlayDeclarations(state, options);
}

export function resumeFabPlayDeclaration(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "play-mode" | "play-target" }>,
  answer: FabDecisionAnswer | readonly FabTargetRef[],
  options: FabEventTransactionOptions,
): FabPlayProcedureResult {
  const process = state.rulesProcess;
  const procedure = process?.procedure;
  if (!process || process.processId !== continuation.processId || procedure?.kind !== "play-card") {
    return failure(
      state,
      "The persisted FAB play declaration no longer exists.",
      "stale_play_process",
    );
  }
  if (continuation.kind === "play-mode") {
    if (!("kind" in answer) || answer.kind !== "option")
      return failure(state, "The FAB play declaration expected modes.", "invalid_play_declaration");
    const pendingCost = pendingPlayCostAbilityId(procedure.costBindings);
    if (pendingCost) {
      const paid = answer.optionIds.includes(PAY_OPTION_ID);
      procedure.costBindings = {
        ...procedure.costBindings,
        [playCostDeclaredKey(pendingCost)]: paid,
        [PLAY_COST_PENDING_KEY]: false,
      };
    } else {
      const abilities =
        procedure.object.current.abilities.filter(
          (ability) =>
            (ability.kind === "resolution" || ability.kind === "modal") &&
            !("trigger" in ability && ability.trigger),
        ) ?? [];
      const modal = abilities.find(
        (ability): ability is FabModalAbility => ability.kind === "modal",
      );
      if (modal?.modal.allowRepeat) {
        procedure.declaredModes.push(...answer.optionIds);
      } else {
        procedure.declaredModes.splice(0, procedure.declaredModes.length, ...answer.optionIds);
        procedure.modesDeclared = true;
      }
    }
  } else {
    if ("kind" in answer)
      return failure(
        state,
        "The FAB play declaration expected targets.",
        "invalid_play_declaration",
      );
    procedure.declaredTargets[continuation.targetKey] = answer;
  }
  return advanceFabPlayDeclarations(state, options);
}

export function advanceFabPlayDeclarations(
  state: FabMatchState,
  options: FabEventTransactionOptions,
): FabPlayProcedureResult {
  const process = state.rulesProcess;
  const procedure = process?.procedure;
  if (!process || procedure?.kind !== "play-card") {
    return failure(state, "The play procedure is missing.", "stale_play_process");
  }
  // The procedure LKI is the declaration-time face (CR 5.1.2c / 9.2.3).
  // Do not look up the physical split card's flattened/default properties.
  const evaluated = procedure.object;
  const abilities =
    evaluated?.current.abilities.filter(
      (ability) =>
        (ability.kind === "resolution" || ability.kind === "modal") &&
        !("trigger" in ability && ability.trigger),
    ) ?? [];
  const modal = abilities.find((ability): ability is FabModalAbility => ability.kind === "modal");
  const context: FabDeclarationContext = {
    controllerId: procedure.actorId,
    source: procedure.object,
    abilityId: modal?.id ?? abilities[0]?.id ?? "play-card",
    bindings: procedure.costBindings,
    declaredTargets: procedure.declaredTargets,
  };
  const cardName = evaluated.current.names.join(" // ") || procedure.object.instanceId;

  const optionalDeclaration = declareOptionalPlayCosts(state, process.processId, procedure);
  if (optionalDeclaration) return optionalDeclaration;

  const mixedParts = boundedMixedObjectCostParts(procedure.object);
  if (mixedParts) {
    for (const [index, part] of mixedParts.entries()) {
      if (Array.isArray(procedure.costBindings[`mixed-cost-part:${index}`])) continue;
      const candidates = boundedMixedCostCandidates(
        state,
        procedure.actorId,
        procedure.object.instanceId,
        part,
      );
      if (candidates.length === 0 || part.maximum === 0) {
        procedure.costBindings = {
          ...procedure.costBindings,
          [`mixed-cost-part:${index}`]: [],
          "objects-paid-for-cost": procedure.effectCostTargetIds.length,
        };
        continue;
      }
      procedure.costBindings = { ...procedure.costBindings, "mixed-cost-pending": index };
      publishFabDecision(
        state,
        createFabEntityTargetDecision(state, {
          actorId: procedure.actorId,
          label: `Choose up to ${part.maximum} cards to ${part.type} for ${cardName}.`,
          requestedCount: Math.min(part.maximum, candidates.length),
          upTo: true,
          candidates: candidates.map((candidate) => ({
            instanceId: candidate.instanceId,
            target: { kind: "object" as const, ref: candidate.ref },
            label: candidate.current.names.join(" // "),
          })),
          continuation: { kind: "play-cost-target", processId: process.processId },
        }),
      );
      return advanced(state);
    }
  }
  if (usesPrintedXResourceCost(procedure.object) && procedure.chosenX === null) {
    const player = state.players[procedure.actorId]!;
    const available =
      player.chiPoints +
      player.resourcePoints +
      paymentCandidates(
        state,
        procedure.actorId,
        procedure.object.instanceId,
        procedure.pitchedInstanceIds,
      ).reduce((total, candidate) => total + candidate.value, 0);
    publishFabDecision(
      state,
      createFabNumericDecision(state, {
        actorId: procedure.actorId,
        min: 0,
        max: available,
        label: `Choose X for ${cardName}.`,
        continuation: { kind: "play-x", processId: process.processId },
      }),
    );
    return advanced(state);
  }

  const destroy = declaredDestroyPlayCost(procedure.object, procedure.costBindings);
  const destroyCount = destroy ? destroyPlayCostCount(destroy.cost) : null;
  if (destroy && destroyCount === "x" && procedure.chosenX === null) {
    const candidates = destroyPlayCostCandidates(state, procedure.actorId, destroy);
    publishFabDecision(
      state,
      createFabNumericDecision(state, {
        actorId: procedure.actorId,
        min: 0,
        max: candidates.length,
        label: `Choose X for ${cardName}.`,
        continuation: { kind: "play-x", processId: process.processId },
      }),
    );
    return advanced(state);
  }
  if (destroy && procedure.effectCostTargetIds.length === 0) {
    const candidates = destroyPlayCostCandidates(state, procedure.actorId, destroy).map(
      (candidate) => ({
        instanceId: candidate.instanceId,
        target: { kind: "object" as const, ref: candidate.ref },
        label: candidate.current.names.join(" // ") || candidate.instanceId,
      }),
    );
    if (
      (destroyCount === "all" || destroyCount === "any-number") &&
      !starPlayCostDeclared(procedure.costBindings)
    ) {
      if (candidates.length === 0) {
        procedure.chosenX = 0;
        procedure.costBindings = {
          ...procedure.costBindings,
          x: 0,
          "destroyed-this-way": 0,
          [PLAY_COST_STAR_DECLARED_KEY]: true,
        };
      } else {
        publishFabDecision(
          state,
          createFabEntityTargetDecision(state, {
            actorId: procedure.actorId,
            label: `Choose any number of objects to destroy for ${cardName}.`,
            requestedCount: Math.max(candidates.length, 1),
            upTo: true,
            candidates,
            continuation: { kind: "play-cost-target", processId: process.processId },
          }),
        );
        return advanced(state);
      }
    }
    if (destroyCount === "x" && procedure.chosenX !== null && procedure.chosenX > 0) {
      if (candidates.length < procedure.chosenX)
        return reversePlay(state, process.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "Required destroy-cost objects are unavailable.",
        });
      publishFabDecision(
        state,
        createFabEntityTargetDecision(state, {
          actorId: procedure.actorId,
          label: `Choose ${procedure.chosenX} object${procedure.chosenX === 1 ? "" : "s"} to destroy for ${cardName}.`,
          requestedCount: procedure.chosenX,
          upTo: false,
          candidates,
          continuation: { kind: "play-cost-target", processId: process.processId },
        }),
      );
      return advanced(state);
    }
    if (typeof destroyCount === "number" && destroyCount > 0) {
      if (candidates.length < destroyCount)
        return reversePlay(state, process.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "Required destroy-cost objects are unavailable.",
        });
      publishFabDecision(
        state,
        createFabEntityTargetDecision(state, {
          actorId: procedure.actorId,
          label: `Choose ${destroyCount} object${destroyCount === 1 ? "" : "s"} to destroy for ${cardName}.`,
          requestedCount: destroyCount,
          upTo: false,
          candidates,
          continuation: { kind: "play-cost-target", processId: process.processId },
        }),
      );
      return advanced(state);
    }
  }

  const tap = declaredTapPlayCost(procedure.object, procedure.costBindings);
  const tapCount = tap ? tapPlayCostCount(tap.cost) : null;
  if (tapCount === "x" && procedure.chosenX === null) {
    const filter = tap ? playCostFilter(tap.cost) : undefined;
    const candidates = variableTapCostCandidates(state, procedure.actorId, filter);
    publishFabDecision(
      state,
      createFabNumericDecision(state, {
        actorId: procedure.actorId,
        min: 0,
        max: candidates.length,
        label: `Choose X for ${cardName}.`,
        continuation: { kind: "play-x", processId: process.processId },
      }),
    );
    return advanced(state);
  }
  if (tap && procedure.effectCostTargetIds.length === 0) {
    const filter = playCostFilter(tap.cost);
    const candidates = variableTapCostCandidates(state, procedure.actorId, filter).map(
      (candidate) => ({
        instanceId: candidate.instanceId,
        target: { kind: "object" as const, ref: candidate.ref },
        label: candidate.current.names.join(" // ") || candidate.instanceId,
      }),
    );
    if (tapCount === "x" && procedure.chosenX !== null && procedure.chosenX > 0) {
      if (candidates.length < procedure.chosenX)
        return reversePlay(state, process.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "Required tap-cost objects are unavailable.",
        });
      publishFabDecision(
        state,
        createFabEntityTargetDecision(state, {
          actorId: procedure.actorId,
          label: `Choose ${procedure.chosenX} object${procedure.chosenX === 1 ? "" : "s"} to tap for ${cardName}.`,
          requestedCount: procedure.chosenX,
          upTo: false,
          candidates,
          continuation: { kind: "play-cost-target", processId: process.processId },
        }),
      );
      return advanced(state);
    }
  }

  const move = declaredMoveToDeckPlayCost(procedure.object, procedure.costBindings);
  if (move && procedure.effectCostTargetIds.length === 0) {
    const filter = playCostFilter(move.cost);
    const from = isMoveToDeckPlayCost(move.cost) ? moveToDeckPlayCostFrom(move.cost) : "hand";
    const pool = moveToDeckCostCandidates(
      state,
      procedure.actorId,
      procedure.object.instanceId,
      filter,
      from,
    );
    if (pool.length < 1)
      return reversePlay(state, process.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "The additional cost cannot be paid.",
      });
    if (pool.length === 1) {
      procedure.effectCostTargetIds = [pool[0]!.instanceId];
    } else {
      publishFabDecision(
        state,
        createFabEntityTargetDecision(state, {
          actorId: procedure.actorId,
          label: `Choose a card to put on the bottom of your deck for ${cardName}.`,
          requestedCount: 1,
          upTo: false,
          candidates: pool.map((candidate) => ({
            instanceId: candidate.instanceId,
            target: { kind: "object" as const, ref: candidate.ref },
            label: candidate.current.names.join(" // ") || candidate.instanceId,
          })),
          continuation: { kind: "play-cost-target", processId: process.processId },
        }),
      );
      return advanced(state);
    }
  }

  const requiredRandomBanish = playCostSpecs(procedure.object).find((spec) => {
    if (spec.optional || spec.role === "alternative-cost") {
      if (isPlayCostDeclared(procedure.costBindings, spec.abilityId) !== true) return false;
    }
    return (
      isRandomBanishHandPlayCost(spec.cost) ||
      isRequiredBanishGraveyardPlayCost(spec.cost, spec.optional)
    );
  });
  if (requiredRandomBanish) {
    const from =
      requiredRandomBanish.cost.class === "effect" && requiredRandomBanish.cost.type === "banish"
        ? requiredRandomBanish.cost.from
        : "hand";
    const needed = banishPlayCostCount(requiredRandomBanish.cost) ?? 1;
    const zone = from === "graveyard" ? "graveyard" : "hand";
    const available = zonePlayCostCandidates(
      state,
      procedure.actorId,
      procedure.object.instanceId,
      zone,
      playCostFilter(requiredRandomBanish.cost),
    ).length;
    if (available < needed) {
      return reversePlay(state, process.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "The additional banish cost cannot be paid.",
      });
    }
  }

  const optionalHandBanish = declaredOptionalBanishHandPlayCost(
    procedure.object,
    procedure.costBindings,
  );
  if (optionalHandBanish && procedure.effectCostTargetIds.length === 0) {
    const candidates = zonePlayCostCandidates(
      state,
      procedure.actorId,
      procedure.object.instanceId,
      "hand",
      playCostFilter(optionalHandBanish.cost),
    ).map((candidate) => ({
      instanceId: candidate.instanceId,
      target: { kind: "object" as const, ref: candidate.ref },
      label: candidate.current.names.join(" // ") || candidate.instanceId,
    }));
    if (candidates.length < 1)
      return reversePlay(state, process.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "The additional hand-banish cost cannot be paid.",
      });
    if (candidates.length === 1) {
      procedure.effectCostTargetIds = [candidates[0]!.instanceId];
    } else {
      publishFabDecision(
        state,
        createFabEntityTargetDecision(state, {
          actorId: procedure.actorId,
          label: `Choose a card to banish from hand for ${cardName}.`,
          requestedCount: 1,
          upTo: false,
          candidates,
          continuation: { kind: "play-cost-target", processId: process.processId },
        }),
      );
      return advanced(state);
    }
  }

  const requiredHandBanish = declaredRequiredBanishHandPlayCost(
    procedure.object,
    procedure.costBindings,
  );
  if (requiredHandBanish && procedure.effectCostTargetIds.length === 0) {
    const bounds = handBanishPlayCostBounds(requiredHandBanish.cost, requiredHandBanish.optional);
    const needed = bounds?.min ?? 1;
    const candidates = zonePlayCostCandidates(
      state,
      procedure.actorId,
      procedure.object.instanceId,
      "hand",
      playCostFilter(requiredHandBanish.cost),
    ).map((candidate) => ({
      instanceId: candidate.instanceId,
      target: { kind: "object" as const, ref: candidate.ref },
      label: candidate.current.names.join(" // ") || candidate.instanceId,
    }));
    if (candidates.length < needed)
      return reversePlay(state, process.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "The additional hand-banish cost cannot be paid.",
      });
    if (candidates.length === needed) {
      procedure.effectCostTargetIds = candidates.map((candidate) => candidate.instanceId);
    } else {
      publishFabDecision(
        state,
        createFabEntityTargetDecision(state, {
          actorId: procedure.actorId,
          label: `Choose ${needed} card${needed === 1 ? "" : "s"} to banish from hand for ${cardName}.`,
          requestedCount: needed,
          upTo: false,
          candidates,
          continuation: { kind: "play-cost-target", processId: process.processId },
        }),
      );
      return advanced(state);
    }
  }

  const allHandBanish = declaredAllBanishHandPlayCost(procedure.object, procedure.costBindings);
  if (allHandBanish && procedure.effectCostTargetIds.length === 0) {
    // "Banish your hand" has no selection: the whole (filtered) hand is the
    // cost, including the empty-hand case.
    procedure.effectCostTargetIds = zonePlayCostCandidates(
      state,
      procedure.actorId,
      procedure.object.instanceId,
      "hand",
      playCostFilter(allHandBanish.cost),
    ).map((candidate) => candidate.instanceId);
  }

  const anyNumberHandBanish = declaredAnyNumberBanishHandPlayCost(
    procedure.object,
    procedure.costBindings,
  );
  if (
    anyNumberHandBanish &&
    !starPlayCostDeclared(procedure.costBindings) &&
    procedure.effectCostTargetIds.length === 0
  ) {
    const candidates = zonePlayCostCandidates(
      state,
      procedure.actorId,
      procedure.object.instanceId,
      "hand",
      playCostFilter(anyNumberHandBanish.cost),
    ).map((candidate) => ({
      instanceId: candidate.instanceId,
      target: { kind: "object" as const, ref: candidate.ref },
      label: candidate.current.names.join(" // ") || candidate.instanceId,
    }));
    const min =
      handBanishPlayCostBounds(anyNumberHandBanish.cost, anyNumberHandBanish.optional)?.min ?? 0;
    if (candidates.length < min) {
      return reversePlay(state, process.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "The additional hand-banish cost cannot be paid.",
      });
    }
    if (candidates.length === 0) {
      procedure.costBindings = {
        ...procedure.costBindings,
        "banished-for-cost": 0,
        x: 0,
        [PLAY_COST_STAR_DECLARED_KEY]: true,
      };
    } else {
      publishFabDecision(
        state,
        createFabExactEntityTargetDecision(state, {
          actorId: procedure.actorId,
          label: `Choose any number of cards to banish from hand for ${cardName}.`,
          min,
          max: candidates.length,
          candidates,
          continuation: { kind: "play-cost-target", processId: process.processId },
        }),
      );
      return advanced(state);
    }
  }

  const discardCost = declaredNamedDiscardPlayCost(procedure.object, procedure.costBindings);
  if (discardCost && procedure.effectCostTargetIds.length === 0) {
    const needed = namedDiscardPlayCostCount(discardCost.cost) ?? 1;
    const candidates = zonePlayCostCandidates(
      state,
      procedure.actorId,
      procedure.object.instanceId,
      "hand",
      playCostFilter(discardCost.cost),
    ).map((candidate) => ({
      instanceId: candidate.instanceId,
      target: { kind: "object" as const, ref: candidate.ref },
      label: candidate.current.names.join(" // ") || candidate.instanceId,
    }));
    if (candidates.length < needed)
      return reversePlay(state, process.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "The named discard additional cost cannot be paid.",
      });
    publishFabDecision(
      state,
      createFabEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label: `Choose ${needed} card${needed === 1 ? "" : "s"} to discard for ${cardName}.`,
        requestedCount: needed,
        upTo: false,
        candidates,
        continuation: { kind: "play-cost-target", processId: process.processId },
      }),
    );
    return advanced(state);
  }

  const soulCost = declaredSoulBanishPlayCost(procedure.object, procedure.costBindings);
  if (
    soulCost &&
    !starPlayCostDeclared(procedure.costBindings) &&
    procedure.effectCostTargetIds.length === 0
  ) {
    const isX = isSoulBanishXPlayCost(soulCost.cost);
    const candidates = zonePlayCostCandidates(
      state,
      procedure.actorId,
      procedure.object.instanceId,
      "soul",
      playCostFilter(soulCost.cost),
    ).map((candidate) => ({
      instanceId: candidate.instanceId,
      target: { kind: "object" as const, ref: candidate.ref },
      label: candidate.current.names.join(" // ") || candidate.instanceId,
    }));
    const max = isX ? candidates.length : (soulBanishPlayCostMax(soulCost.cost) ?? 0);
    const isUpTo = !isX && isUpToCount(soulCost.cost.count);
    if (isX && candidates.length === 0) {
      return reversePlay(state, process.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "The additional soul-banish cost cannot be paid.",
      });
    }
    if (!isX && !isUpTo && (max < 1 || candidates.length < max)) {
      return reversePlay(state, process.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "The additional soul-banish cost cannot be paid.",
      });
    }
    if (!isX && isUpTo && (candidates.length === 0 || max === 0)) {
      procedure.costBindings = {
        ...procedure.costBindings,
        "banished-for-cost": 0,
        [PLAY_COST_STAR_DECLARED_KEY]: true,
      };
    } else if (!isX && !isUpTo && candidates.length === max) {
      procedure.effectCostTargetIds = candidates.map((candidate) => candidate.instanceId);
      procedure.costBindings = {
        ...procedure.costBindings,
        "banished-for-cost": max,
        [PLAY_COST_STAR_DECLARED_KEY]: true,
      };
    } else {
      publishFabDecision(
        state,
        isX
          ? createFabExactEntityTargetDecision(state, {
              actorId: procedure.actorId,
              label: `Choose 1 or more cards to banish from soul for ${cardName} (X).`,
              min: 1,
              max: candidates.length,
              candidates,
              continuation: { kind: "play-cost-target", processId: process.processId },
            })
          : createFabEntityTargetDecision(state, {
              actorId: procedure.actorId,
              label: isUpTo
                ? `Choose up to ${max} card${max === 1 ? "" : "s"} to banish from soul for ${cardName}.`
                : `Choose ${max} card${max === 1 ? "" : "s"} to banish from soul for ${cardName}.`,
              requestedCount: max,
              upTo: isUpTo,
              candidates,
              continuation: { kind: "play-cost-target", processId: process.processId },
            }),
      );
      return advanced(state);
    }
  }

  const removeCost = declaredRemoveCountersPlayCost(procedure.object, procedure.costBindings);
  if (
    removeCost &&
    removeCost.cost.class === "effect" &&
    removeCost.cost.type === "remove-counters"
  ) {
    if (procedure.effectCostTargetIds.length === 0) {
      const candidates = removeCountersPlayCostCandidates(
        state,
        procedure.actorId,
        removeCost.cost,
      ).map((candidate) => ({
        instanceId: candidate.instanceId,
        target: { kind: "object" as const, ref: candidate.ref },
        label: candidate.current.names.join(" // ") || candidate.instanceId,
      }));
      if (candidates.length === 0)
        return reversePlay(state, process.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The remove-counters additional cost cannot be paid.",
        });
      publishFabDecision(
        state,
        createFabEntityTargetDecision(state, {
          actorId: procedure.actorId,
          label: `Choose an object to remove counters from for ${cardName}.`,
          requestedCount: 1,
          upTo: false,
          candidates,
          continuation: { kind: "play-cost-target", processId: process.processId },
        }),
      );
      return advanced(state);
    }
    if (typeof procedure.costBindings["counters-removed-for-cost"] !== "number") {
      const targetId = procedure.effectCostTargetIds[0]!;
      const min = removeCountersPlayCostMin(removeCost.cost);
      const available = numericCounterCountOnObject(state, targetId, removeCost.cost);
      if (available < min)
        return reversePlay(state, process.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The remove-counters additional cost cannot be paid.",
        });
      if (available === min) {
        procedure.costBindings = {
          ...procedure.costBindings,
          "counters-removed-for-cost": min,
        };
      } else {
        publishFabDecision(
          state,
          createFabNumericDecision(state, {
            actorId: procedure.actorId,
            min,
            max: available,
            label: `Choose how many counters to remove for ${cardName}.`,
            continuation: { kind: "play-x", processId: process.processId },
          }),
        );
        return advanced(state);
      }
    }
  }

  const mixedCost = declaredMixedAlternativePlayCost(procedure.object, procedure.costBindings);
  if (
    mixedCost &&
    isMixedAlternativePlayCost(mixedCost.cost) &&
    procedure.effectCostTargetIds.length === 0
  ) {
    const candidates = mixedAlternativePlayCostCandidates(
      state,
      procedure.actorId,
      procedure.object.instanceId,
      mixedCost.cost,
    ).map((candidate) => ({
      instanceId: candidate.instanceId,
      target: { kind: "object" as const, ref: candidate.ref },
      label: candidate.current.names.join(" // ") || candidate.instanceId,
    }));
    if (candidates.length === 0)
      return reversePlay(state, process.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "The alternative cost cannot be paid.",
      });
    publishFabDecision(
      state,
      createFabEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label: `Choose a card to discard or destroy for ${cardName}.`,
        requestedCount: 1,
        upTo: false,
        candidates,
        continuation: { kind: "play-cost-target", processId: process.processId },
      }),
    );
    return advanced(state);
  }

  if (modal && !procedure.modesDeclared) {
    // A numeric `up-to` modal bound is a finite player-choice declaration.
    // Treat the bound as the maximum here so explicit modeIds can select the
    // printed upper branch (the existing declaration surface requires a
    // concrete mode list before resolving targets).
    const view = buildFabRulesView(state);
    const amountContext = {
      controllerId: procedure.actorId,
      source: procedure.object.ref,
      bindings: resolveFabEventBindings(procedure.costBindings),
    };
    const resolvedChoose = resolveModalChooseSelection(modal, {
      condition: (condition) => view.evaluateCondition(condition, amountContext),
      amount: (amount) => view.evaluateAmount(amount, amountContext).value,
    });
    const chooseIsUpTo = resolvedChoose?.kind === "up-to";
    const chooseIsAll = resolvedChoose?.kind === "all";
    const chooseIsAnyNumber = resolvedChoose?.kind === "any-number";
    const chooseIsOneOrMore = resolvedChoose?.kind === "one-or-more";
    const choose = resolvedChoose?.count ?? null;
    if (choose === null || choose < 0) {
      return failure(state, "The modal choice count is unsupported.", "unsupported_modal_count");
    }
    if (chooseIsAll && !modal.modal.random && !modal.modal.allowRepeat) {
      procedure.declaredModes.splice(
        0,
        procedure.declaredModes.length,
        ...modal.modes.map((mode) => mode.id),
      );
      procedure.modesDeclared = true;
    } else if (choose === 0) {
      procedure.modesDeclared = true;
    } else if (modal.modal.random) {
      const available = [...modal.modes];
      const modalDeclarationGuard = createFabLoopGuard({ label: "play: random modal declaration" });
      while (procedure.declaredModes.length < choose && available.length > 0) {
        modalDeclarationGuard.tick();
        const [mode] = available.splice(options.randomIndex(state, available.length), 1);
        if (mode) procedure.declaredModes.push(mode.id);
        if (modal.modal.allowRepeat && mode) available.push(mode);
      }
      procedure.modesDeclared = true;
    } else if (modal.modal.allowRepeat) {
      if (procedure.declaredModes.length >= choose) {
        procedure.modesDeclared = true;
      } else {
        publishFabDecision(
          state,
          createFabOptionDecision(state, {
            actorId: procedure.actorId,
            label: `Choose mode ${procedure.declaredModes.length + 1} of ${choose} for ${cardName}.`,
            min: 1,
            max: 1,
            options: modal.modes.map((mode) => ({ id: mode.id, label: mode.text })),
            continuation: { kind: "play-mode", processId: process.processId },
          }),
        );
        return advanced(state);
      }
    } else {
      const minimumChoices = chooseIsOneOrMore
        ? 1
        : chooseIsAnyNumber
          ? 0
          : chooseIsUpTo
            ? Math.min(1, choose)
            : choose;
      publishFabDecision(
        state,
        createFabOptionDecision(state, {
          actorId: procedure.actorId,
          label: `Choose mode${choose === 1 ? "" : "s"} for ${cardName}.`,
          min: minimumChoices,
          max: choose,
          options: modal.modes.map((mode) => ({ id: mode.id, label: mode.text })),
          continuation: { kind: "play-mode", processId: process.processId },
        }),
      );
      return advanced(state);
    }
  }

  const describedEffects = abilities.flatMap((ability) => {
    if ("modal" in ability && ability.modal && ability.modes) {
      const modes = ability.modes;
      return [
        ...(ability.effect ? [{ effect: ability.effect, description: ability.text }] : []),
        ...procedure.declaredModes.flatMap((modeId) => {
          const mode = modes.find((candidate) => candidate.id === modeId);
          return mode ? [{ effect: mode.effect, description: mode.text }] : [];
        }),
      ];
    }
    return ability.effect ? [{ effect: ability.effect, description: ability.text }] : [];
  });
  const targetRequirement = describedEffects
    .flatMap(({ effect, description }, index) =>
      collectDeclaredTargets(effect, `effect-${index}`).map((requirement) => ({
        ...requirement,
        description,
      })),
    )
    .find((requirement) => !(requirement.key in procedure.declaredTargets));
  if (targetRequirement) {
    // Freeze-family (cold-snap): an on-stack object target whose `player` is
    // a deferred binding (target-controller / iteration-subject) only
    // materializes during resolution — the pre-play check cannot count its
    // candidates. Skip the precheck for such requirements; the resolution
    // layer's own findDecision opens the choice when it can actually see
    // the bound player.
    const candidates = options.legalTargets(state, context, targetRequirement.target);
    const bounds =
      targetRequirement.target.selector === "any-hero"
        ? { count: 1, min: 1 }
        : declaredObjectTargetBounds(
            targetRequirement.target,
            (amount) => options.evaluateAmount(state, amount, context),
            targetRequirement.optionalEffectPath !== undefined,
            candidates.length,
          );
    if (bounds === null)
      return failure(state, "The target count is unsupported.", "unsupported_target_count");
    const { count, min } = bounds;
    if (count === 0 && min === 0) {
      procedure.declaredTargets[targetRequirement.key] = [];
      return advanceFabPlayDeclarations(state, options);
    }
    if (
      candidates.length < min ||
      (targetRequiresDifferentNames(targetRequirement.target) &&
        distinctPrintedNameCount(candidates) < min)
    ) {
      // Freeze-family escape (cold-snap): an on-stack object target whose
      // `player` is a deferred binding (target-controller / iteration-
      // subject) only materializes during resolution. When the pre-play
      // count cannot see such candidates, proceed with no declaration —
      // the resolution layer's findDecision opens the choice when the
      // binding exists. Cards whose targets ARE countable keep the normal
      // play-time declaration.
      const tp = targetRequirement.target as {
        selector?: string;
        player?: string;
      };
      const deferredBinding =
        tp.selector === "object" &&
        (tp.player === "target-controller" || tp.player === "iteration-subject");
      if (deferredBinding && candidates.length < min) {
        procedure.declaredTargets[targetRequirement.key] = [];
        return advanceFabPlayDeclarations(state, options);
      }
      const targetDescription = targetRequirement.description.trim().replace(/[.!?]+$/, "");
      return reversePlay(state, process.processId, procedure.actorId, {
        code: "required_targets_unavailable",
        message: targetDescription
          ? `${cardName} couldn't be played because “${targetDescription}” had no legal target.`
          : `${cardName} couldn't be played because it had no legal target. Check the card's target requirements.`,
        targetDescription,
      });
    }
    publishFabDecision(
      state,
      createFabEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label: `Choose targets for ${cardName}.`,
        requestedCount: count,
        upTo: min === 0,
        candidates,
        continuation: {
          kind: "play-target",
          processId: process.processId,
          targetKey: targetRequirement.key,
        },
        differentNames: targetRequiresDifferentNames(targetRequirement.target),
      }),
    );
    return advanced(state);
  }

  // CR 5.1.6: costs are paid after targets. Apply only the `it`-binding
  // reduction delta here — additional resource costs were already added
  // when optional costs were declared.
  applyDeclaredTargetCostDelta(state, procedure);
  procedure.stage = "asset-payment";
  return advancePlayAssetPayment(state, options);
}

function declareOptionalPlayCosts(
  state: FabMatchState,
  processId: FabProcessId,
  procedure: Extract<
    NonNullable<FabMatchState["rulesProcess"]>["procedure"],
    { readonly kind: "play-card" }
  >,
): FabPlayProcedureResult | null {
  const specs = playCostSpecs(procedure.object).filter(
    (spec) => spec.optional || spec.role === "alternative-cost",
  );
  if (specs.length === 0) {
    if (!optionalPlayCostsDeclared(procedure.costBindings)) {
      applyDeclaredAssetCostAdjustments(state, procedure);
      procedure.costBindings = {
        ...procedure.costBindings,
        [PLAY_COST_OPTIONALS_DECLARED_KEY]: true,
      };
    }
    return null;
  }
  // Typed begin-play fields already are the declaration (omit = decline).
  // Unpayable optional costs cannot be declared (CR 1.14 / 5.1.6).
  let bindings = procedure.costBindings;
  for (const spec of specs) {
    if (
      spec.abilityId !== USURP_COST_ID &&
      isPlayCostDeclared(bindings, spec.abilityId) !== undefined
    )
      continue;
    const auto = autoDeclareOptionalPlayCost(state, procedure, spec);
    if (auto === undefined) continue;
    bindings = {
      ...bindings,
      [playCostDeclaredKey(spec.abilityId)]: auto,
    };
  }
  if (bindings !== procedure.costBindings) procedure.costBindings = bindings;
  const undeclared = specs.find(
    (spec) => isPlayCostDeclared(procedure.costBindings, spec.abilityId) === undefined,
  );
  if (undeclared) {
    const cardName = procedure.object.current.names.join(" // ") || procedure.object.instanceId;
    procedure.costBindings = {
      ...procedure.costBindings,
      [PLAY_COST_PENDING_KEY]: undeclared.abilityId,
    };
    publishFabDecision(
      state,
      createFabOptionDecision(state, {
        actorId: procedure.actorId,
        label:
          undeclared.role === "alternative-cost"
            ? `Pay the alternative cost for ${cardName}?`
            : `Pay the optional additional cost for ${cardName}?`,
        min: 1,
        max: 1,
        options: [
          { id: PAY_OPTION_ID, label: "Pay" },
          { id: DECLINE_OPTION_ID, label: "Decline" },
        ],
        continuation: { kind: "play-mode", processId },
      }),
    );
    return advanced(state);
  }
  if (!optionalPlayCostsDeclared(procedure.costBindings)) {
    applyDeclaredAssetCostAdjustments(state, procedure);
    procedure.costBindings = {
      ...procedure.costBindings,
      [PLAY_COST_OPTIONALS_DECLARED_KEY]: true,
    };
  }
  return null;
}

/**
 * Resolve an optional/alternative play cost without a Pay/Decline prompt.
 * Returns `true`/`false` when the declaration is already determined, or
 * `undefined` when the player must still choose.
 */
function autoDeclareOptionalPlayCost(
  state: FabMatchState,
  procedure: Extract<
    NonNullable<FabMatchState["rulesProcess"]>["procedure"],
    { readonly kind: "play-card" }
  >,
  spec: ReturnType<typeof playCostSpecs>[number],
): boolean | undefined {
  if (spec.abilityId === USURP_COST_ID) {
    return optionalPlayCostIsPayable(state, procedure.actorId, procedure.object.instanceId, spec);
  }
  // Begin-play already carries a typed declaration for these families.
  // Omitting the field is an explicit decline — do not re-ask.
  if (isOptionalBanishGraveyardPlayCost(spec.cost, spec.optional)) {
    return Boolean(procedure.banishCostInstanceId);
  }
  if (isChargePlayCost(spec.cost)) {
    return Boolean(procedure.chargeInstanceId);
  }
  if (!optionalPlayCostIsPayable(state, procedure.actorId, procedure.object.instanceId, spec)) {
    return false;
  }
  return undefined;
}

function applyDeclaredTargetCostDelta(
  state: FabMatchState,
  procedure: Extract<
    NonNullable<FabMatchState["rulesProcess"]>["procedure"],
    { readonly kind: "play-card" }
  >,
): void {
  const view = buildFabRulesView(state);
  const evaluated = view.object(procedure.object.ref);
  if (!evaluated) return;
  const it = Object.values(procedure.declaredTargets).flatMap((refs) =>
    refs.flatMap((ref) => (ref.kind === "object" ? [ref.ref] : [])),
  );
  const quotedReduction = playStaticResourceCostReduction(
    view,
    state,
    procedure.actorId,
    evaluated,
  );
  const boundReduction = playStaticResourceCostReduction(
    view,
    state,
    procedure.actorId,
    evaluated,
    {
      objects: { it },
      numbers: {},
      strings: {},
    },
  );
  procedure.resourceCost = Math.max(0, procedure.resourceCost - (boundReduction - quotedReduction));
}

function applyDeclaredAssetCostAdjustments(
  state: FabMatchState,
  procedure: Extract<
    NonNullable<FabMatchState["rulesProcess"]>["procedure"],
    { readonly kind: "play-card" }
  >,
): void {
  applyDeclaredTargetCostDelta(state, procedure);
  const view = buildFabRulesView(state);
  const specs = playCostSpecs(procedure.object);
  const alternative = specs.find(
    (spec) =>
      spec.role === "alternative-cost" &&
      isPlayCostDeclared(procedure.costBindings, spec.abilityId) === true,
  );
  // CR 5.1.6c: a declared alternative cost that replaces the resource
  // asset-cost starts that cost at zero. Increases/reductions already in
  // the quote were computed from the printed start; a replacing alternative
  // zeroes the remaining resource asset-cost.
  if (alternative) {
    procedure.resourceCost = 0;
    procedure.costBindings = {
      ...procedure.costBindings,
      "alternative-cost-paid": true,
    };
  }
  for (const spec of specs) {
    if (
      spec.role !== "additional-cost" ||
      !isResourcePlayCost(spec.cost) ||
      (spec.optional && isPlayCostDeclared(procedure.costBindings, spec.abilityId) !== true)
    ) {
      continue;
    }
    const amount = spec.cost.amount;
    if (typeof amount === "number") {
      procedure.resourceCost += Math.max(0, amount);
      continue;
    }
    try {
      const resolved = view.evaluateAmount(amount, {
        controllerId: procedure.actorId,
        source: procedure.object.ref,
        bindings: resolveFabEventBindings(procedure.costBindings),
      }).value;
      if (typeof resolved === "number" && Number.isFinite(resolved)) {
        procedure.resourceCost += Math.max(0, resolved);
      }
    } catch {
      // Unbound X at declaration time stays unpaid.
    }
  }
}
