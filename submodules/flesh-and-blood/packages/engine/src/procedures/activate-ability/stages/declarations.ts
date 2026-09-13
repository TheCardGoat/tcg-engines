import type { FabActivatedAbility } from "@tcg/flesh-and-blood-types";
import { declaredObjectTargetBounds } from "../../../kernel/declared-target-bounds.ts";
import { type FabMatchState } from "../../../state.ts";
import type { FabDecisionAnswer, FabDecisionContinuation } from "../../../rules/process.ts";
import { type FabEventTransactionOptions } from "../../../kernel/process-runner/index.ts";
import {
  collectDeclaredTargets,
  type FabDeclarationContext,
} from "../../../kernel/trigger-declaration.ts";
import { buildFabRulesView } from "../../../rules/state-rules-view.ts";
import {
  activationBanishRequirements,
  activationDiscardRequirements,
  activationDestroyRequirements,
  activationTapRequirements,
  activationUntapRequirements,
  activationChargeRequirements,
  activationMoveToDeckRequirements,
  activationRemoveCounterRequirements,
  activationRevealRequirements,
  activationTurnFaceUpRequirements,
  activationTurnFaceDownRequirements,
  numericCounterFilterToken,
} from "../costs/requirements.ts";
import {
  activationPaymentCandidates,
  advanced,
  rejected,
  reverseActivation,
  isEquipmentSeatName,
  legalEquipDestinationSeats,
} from "../helpers.ts";
import { fabTargetUiId, type FabTargetRef } from "../../../rules/targets.ts";
import type { FabActivationProcedureResult } from "../types.ts";
import { activationNeedsEquipDestination, applyActivationTargetScope } from "./quote.ts";
import {
  createFabEntityTargetDecision,
  createFabExactEntityTargetDecision,
  createFabNumericDecision,
  createFabOptionDecision,
} from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";
import type { FabActivateProcedure } from "../../../rules/process.ts";
import {
  distinctPrintedNameCount,
  targetRequiresDifferentNames,
} from "../../../kernel/different-names.ts";

import { advanceActivationPayment } from "./payment.ts";

function availableVariableBanishTargets(
  state: FabMatchState,
  procedure: FabActivateProcedure,
  options: FabEventTransactionOptions,
): number {
  const requirement = activationBanishRequirements(procedure.cost, [], 0)[0];
  if (!requirement) return 0;
  return options.legalTargets(
    state,
    {
      controllerId: procedure.actorId,
      source: procedure.object,
      abilityId: procedure.abilityId,
      bindings: procedure.costBindings,
      declaredTargets: procedure.declaredTargets,
    },
    requirement.target,
  ).length;
}

export function resumeFabActivationDeclaration(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "activation-target" }>,
  targets: readonly FabTargetRef[],
  options: FabEventTransactionOptions,
): FabActivationProcedureResult {
  const process = state.rulesProcess;
  const procedure = process?.procedure;
  if (!process || process.processId !== continuation.processId || procedure?.kind !== "activate") {
    return rejected(
      state,
      "The persisted FAB activation declaration no longer exists.",
      "stale_activation_process",
    );
  }
  procedure.declaredTargets[continuation.targetKey] = targets;
  const result = advanceFabActivationDeclarations(state, options);
  return result;
}

export function resumeFabActivationEquipDestination(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "activation-equip-destination" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "option" }>,
  options: FabEventTransactionOptions,
): FabActivationProcedureResult {
  const process = state.rulesProcess;
  const procedure = process?.procedure;
  if (!process || process.processId !== continuation.processId || procedure?.kind !== "activate") {
    return rejected(
      state,
      "The persisted FAB equipment destination decision no longer exists.",
      "stale_activation_process",
    );
  }
  const destination = answer.optionIds[0];
  if (!isEquipmentSeatName(destination))
    return rejected(state, "Invalid FAB equipment destination.", "invalid_activation_destination");
  procedure.equipDestination = destination;
  const result = advanceFabActivationDeclarations(state, options);
  return result;
}

/**
 * Resume after the player chooses X for a variable self-counter activation cost
 * (Blaze Firemind "Remove X energy counters").
 */
export function resumeFabActivationX(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "activation-x" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "numeric" }>,
  options: FabEventTransactionOptions,
): FabActivationProcedureResult {
  const process = state.rulesProcess;
  const procedure = process?.procedure;
  if (!process || process.processId !== continuation.processId || procedure?.kind !== "activate") {
    return rejected(
      state,
      "The persisted FAB activation X cost decision no longer exists.",
      "stale_activation_process",
    );
  }
  if (
    (!procedure.xCounterCost && !procedure.xResourceCost && !procedure.xBanishCost) ||
    procedure.chosenX !== null
  ) {
    return rejected(
      state,
      "The FAB activation does not expect a variable X cost choice.",
      "invalid_activation_x",
    );
  }
  const available = procedure.xCounterCost
    ? (state.objects[procedure.object.instanceId]?.counters.find(
        (counter) => counter.kind === "named" && counter.name === procedure.xCounterCost!.counter,
      )?.count ?? 0)
    : procedure.xBanishCost
      ? availableVariableBanishTargets(state, procedure, options)
      : Math.floor(
          (state.players[procedure.actorId]!.resourcePoints +
            activationPaymentCandidates(
              state,
              procedure.actorId,
              [
                ...procedure.pitchedInstanceIds,
                ...(procedure.selfMoveToDeck || procedure.discardSelf
                  ? [procedure.object.instanceId]
                  : []),
              ],
              "resources",
            ).reduce((total, candidate) => total + candidate.value, 0) -
            procedure.xResourceCost!.plus) /
            procedure.xResourceCost!.multiplier,
        );
  const minimum = procedure.xCounterCost ? 1 : 0;
  if (answer.value < minimum || answer.value > available) {
    return rejected(
      state,
      "The chosen X is outside the legal counter range.",
      "invalid_activation_x",
    );
  }
  procedure.chosenX = answer.value;
  if (procedure.xCounterCost) {
    procedure.counterCosts = [
      {
        operation: procedure.xCounterCost.operation,
        counter: procedure.xCounterCost.counter,
        amount: answer.value,
      },
    ];
  } else if (procedure.xResourceCost) {
    procedure.resourceCost =
      answer.value * procedure.xResourceCost!.multiplier + procedure.xResourceCost!.plus;
  }
  // Stamp X onto cost bindings so the activate layer can filter targets
  // (arcane-damage-effect-equal-to-x) and later effects can read it.
  procedure.costBindings = { ...procedure.costBindings, x: answer.value };
  const result = advanceFabActivationDeclarations(state, options);
  return result;
}

export function advanceFabActivationDeclarations(
  state: FabMatchState,
  options: FabEventTransactionOptions,
): FabActivationProcedureResult {
  const processState = state.rulesProcess;
  const procedure = processState?.procedure;
  if (!processState || procedure?.kind !== "activate") {
    return rejected(state, "The activation procedure is missing.", "stale_activation_process");
  }
  const objectRecord = state.objects[procedure.object.instanceId];
  const rulesView = buildFabRulesView(state);
  const sourceRef = objectRecord
    ? { instanceId: objectRecord.instanceId, incarnation: objectRecord.incarnation }
    : null;
  const evaluatedSource = sourceRef ? rulesView.object(sourceRef) : null;
  const originalAbility = sourceRef
    ? rulesView
        .functionalAbilities(sourceRef)
        .find(
          (candidate): candidate is FabActivatedAbility =>
            candidate.kind === "activated" && candidate.id === procedure.abilityId,
        )
    : undefined;
  const ability = applyActivationTargetScope(
    state,
    rulesView,
    sourceRef,
    procedure.actorId,
    originalAbility ?? null,
  );
  const sourceName = evaluatedSource?.current.names.join(" // ") || procedure.object.instanceId;
  if (!ability)
    return rejected(state, "The activated ability no longer exists.", "stale_activation_ability");
  // Variable X counter cost (Blaze): declare X before other targets / payment.
  if (
    (procedure.xCounterCost || procedure.xResourceCost || procedure.xBanishCost) &&
    procedure.chosenX === null
  ) {
    const available = procedure.xCounterCost
      ? (objectRecord?.counters.find(
          (counter) => counter.kind === "named" && counter.name === procedure.xCounterCost!.counter,
        )?.count ?? 0)
      : procedure.xBanishCost
        ? availableVariableBanishTargets(state, procedure, options)
        : Math.floor(
            (state.players[procedure.actorId]!.resourcePoints +
              activationPaymentCandidates(
                state,
                procedure.actorId,
                [
                  ...procedure.pitchedInstanceIds,
                  ...(procedure.selfMoveToDeck || procedure.discardSelf
                    ? [procedure.object.instanceId]
                    : []),
                ],
                "resources",
              ).reduce((total, candidate) => total + candidate.value, 0) -
              procedure.xResourceCost!.plus) /
              procedure.xResourceCost!.multiplier,
          );
    if (procedure.xCounterCost && available < 1) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "The activation source lacks counters for a variable X cost.",
      });
    }
    publishFabDecision(
      state,
      createFabNumericDecision(state, {
        actorId: procedure.actorId,
        min: procedure.xCounterCost ? 1 : 0,
        max: available,
        label: procedure.xCounterCost
          ? `Choose X (${procedure.xCounterCost.counter} counters to remove) for ${sourceName}.`
          : procedure.xBanishCost
            ? `Choose X (cards to banish) for ${sourceName}.`
            : `Choose X for ${sourceName} (${procedure.xResourceCost!.multiplier}X + ${procedure.xResourceCost!.plus} resources).`,
        continuation: {
          kind: "activation-x",
          processId: processState.processId,
        },
      }),
    );
    return advanced(state);
  }
  const context: FabDeclarationContext = {
    controllerId: procedure.actorId,
    source: procedure.object,
    abilityId: ability.id,
    bindings: procedure.costBindings,
    declaredTargets: procedure.declaredTargets,
  };
  const costTargetRequirement = activationTurnFaceUpRequirements(procedure.cost).find(
    (requirement) =>
      requirement.target.selector === "object" && !(requirement.key in procedure.declaredTargets),
  );
  if (costTargetRequirement?.target.selector === "object") {
    const count = options.evaluateAmount(state, costTargetRequirement.target.count, context);
    if (count === null) {
      return rejected(
        state,
        "The activation cost target count is unsupported.",
        "unsupported_cost_target_count",
      );
    }
    const candidates = options.legalTargets(state, context, costTargetRequirement.target);
    if (candidates.length < count) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "Required activation cost targets are unavailable.",
      });
    }
    publishFabDecision(
      state,
      createFabEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label: `Choose a card to turn face up for ${sourceName}.`,
        requestedCount: count,
        upTo: false,
        candidates,
        continuation: {
          kind: "activation-target",
          processId: processState.processId,
          targetKey: costTargetRequirement.key,
        },
      }),
    );
    return advanced(state);
  }
  const faceDownCostRequirement = activationTurnFaceDownRequirements(procedure.cost).find(
    (requirement) => !(requirement.key in procedure.declaredTargets),
  );
  if (faceDownCostRequirement) {
    const candidates = options.legalTargets(state, context, faceDownCostRequirement.target);
    if (typeof faceDownCostRequirement.target.count !== "number") {
      if (
        faceDownCostRequirement.target.count.type !== "all" &&
        faceDownCostRequirement.target.count.type !== "any-number"
      ) {
        return rejected(
          state,
          "The activation face-down cost count is unsupported.",
          "unsupported_cost_target_count",
        );
      }
      procedure.declaredTargets[faceDownCostRequirement.key] = candidates.map(
        (candidate) => candidate.target,
      );
      return advanceFabActivationDeclarations(state, options);
    }
    const count = faceDownCostRequirement.target.count;
    if (candidates.length < count) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "Required activation cost targets are unavailable.",
      });
    }
    publishFabDecision(
      state,
      createFabExactEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label: `Choose a card to turn face down for ${sourceName}.`,
        min: count,
        max: Math.min(count, candidates.length),
        candidates,
        continuation: {
          kind: "activation-target",
          processId: processState.processId,
          targetKey: faceDownCostRequirement.key,
        },
      }),
    );
    return advanced(state);
  }
  const chargeCostRequirement = activationChargeRequirements(procedure.cost).find(
    (requirement) => !(requirement.key in procedure.declaredTargets),
  );
  if (chargeCostRequirement) {
    const alreadyChosen = new Set(
      Object.values(procedure.declaredTargets).flatMap((targets) => targets.map(fabTargetUiId)),
    );
    const candidates = options
      .legalTargets(state, context, chargeCostRequirement.target)
      .filter(
        (candidate) =>
          !alreadyChosen.has(candidate.instanceId) &&
          candidate.instanceId !== procedure.object.instanceId,
      );
    const need = chargeCostRequirement.count;
    if (candidates.length < need) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "Required activation charge is unavailable.",
      });
    }
    if (candidates.length === need) {
      procedure.declaredTargets[chargeCostRequirement.key] = candidates.map(
        (candidate) => candidate.target,
      );
      return advanceFabActivationDeclarations(state, options);
    }
    publishFabDecision(
      state,
      createFabExactEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label: `Choose a card to charge for ${sourceName}.`,
        min: need,
        max: need,
        candidates,
        continuation: {
          kind: "activation-target",
          processId: processState.processId,
          targetKey: chargeCostRequirement.key,
        },
      }),
    );
    return advanced(state);
  }
  const discardCostRequirement = activationDiscardRequirements(procedure.cost).find(
    (requirement) => !(requirement.key in procedure.declaredTargets),
  );
  if (discardCostRequirement) {
    const alreadyChosen = new Set(
      Object.values(procedure.declaredTargets).flatMap((targets) => targets.map(fabTargetUiId)),
    );
    const candidates = options
      .legalTargets(state, context, discardCostRequirement.target)
      .filter(
        (candidate) =>
          candidate.instanceId !== procedure.object.instanceId &&
          !alreadyChosen.has(candidate.instanceId),
      );
    const min = discardCostRequirement.min;
    const max = discardCostRequirement.max ?? candidates.length;
    if (candidates.length < min) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "Required activation discard is unavailable.",
      });
    }
    // CR 1.8.6c: a pool no larger than the exact cost is determined.
    if (min === max && candidates.length === min) {
      procedure.declaredTargets[discardCostRequirement.key] = candidates.map(
        (candidate) => candidate.target,
      );
      return advanceFabActivationDeclarations(state, options);
    }
    publishFabDecision(
      state,
      createFabExactEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label:
          min === max && min === 1
            ? `Choose a card to discard for ${sourceName}.`
            : min === max
              ? `Choose ${min} cards to discard for ${sourceName}.`
              : `Choose any number of cards to discard for ${sourceName}.`,
        min,
        max,
        candidates,
        continuation: {
          kind: "activation-target",
          processId: processState.processId,
          targetKey: discardCostRequirement.key,
        },
      }),
    );
    return advanced(state);
  }
  const moveToDeckCostRequirement = activationMoveToDeckRequirements(procedure.cost).find(
    (requirement) => !(requirement.key in procedure.declaredTargets),
  );
  if (moveToDeckCostRequirement) {
    const alreadyChosen = new Set(
      Object.values(procedure.declaredTargets).flatMap((targets) => targets.map(fabTargetUiId)),
    );
    const candidates = options
      .legalTargets(state, context, moveToDeckCostRequirement.target)
      .filter((candidate) => !alreadyChosen.has(candidate.instanceId));
    const need = moveToDeckCostRequirement.count;
    if (candidates.length < need) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "Required activation put-on-deck cost is unavailable.",
      });
    }
    publishFabDecision(
      state,
      createFabExactEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label:
          need === 1
            ? `Choose a card to put on the ${moveToDeckCostRequirement.position} of your deck for ${sourceName}.`
            : `Choose ${need} cards to put on the ${moveToDeckCostRequirement.position} of your deck for ${sourceName}.`,
        min: need,
        max: need,
        candidates,
        continuation: {
          kind: "activation-target",
          processId: processState.processId,
          targetKey: moveToDeckCostRequirement.key,
        },
      }),
    );
    return advanced(state);
  }
  const revealCostRequirement = activationRevealRequirements(procedure.cost).find(
    (requirement) => !(requirement.key in procedure.declaredTargets),
  );
  if (revealCostRequirement) {
    const candidates = options.legalTargets(state, context, revealCostRequirement.target);
    if (candidates.length < 1) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "Required activation reveal is unavailable.",
      });
    }
    publishFabDecision(
      state,
      createFabExactEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label: `Choose a card to reveal for ${sourceName}.`,
        min: 1,
        max: 1,
        candidates,
        continuation: {
          kind: "activation-target",
          processId: processState.processId,
          targetKey: revealCostRequirement.key,
        },
      }),
    );
    return advanced(state);
  }
  const banishCostRequirement = activationBanishRequirements(
    procedure.cost,
    [],
    procedure.chosenX ?? undefined,
  ).find((requirement) => !(requirement.key in procedure.declaredTargets));
  if (banishCostRequirement) {
    if (banishCostRequirement.count === 0) {
      procedure.declaredTargets[banishCostRequirement.key] = [];
      return advanceFabActivationDeclarations(state, options);
    }
    const alreadyChosen = new Set(
      Object.values(procedure.declaredTargets).flatMap((targets) => targets.map(fabTargetUiId)),
    );
    const candidates = options
      .legalTargets(state, context, banishCostRequirement.target)
      .filter((candidate) => !alreadyChosen.has(candidate.instanceId));
    const need = banishCostRequirement.count;
    if (candidates.length < need) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "Required activation banish is unavailable.",
      });
    }
    publishFabDecision(
      state,
      createFabExactEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label:
          need === 1
            ? `Choose a card to banish for ${sourceName}.`
            : `Choose ${need} cards to banish for ${sourceName}.`,
        min: need,
        max: need,
        candidates,
        continuation: {
          kind: "activation-target",
          processId: processState.processId,
          targetKey: banishCostRequirement.key,
        },
      }),
    );
    return advanced(state);
  }
  const destroyCostRequirement = activationDestroyRequirements(procedure.cost).find(
    (requirement) => !(requirement.key in procedure.declaredTargets),
  );
  if (destroyCostRequirement) {
    const alreadyChosen = new Set(
      Object.values(procedure.declaredTargets).flatMap((targets) => targets.map(fabTargetUiId)),
    );
    const candidates = options
      .legalTargets(state, context, destroyCostRequirement.target)
      .filter((candidate) => !alreadyChosen.has(candidate.instanceId));
    const need = destroyCostRequirement.count;
    if (candidates.length < need) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "Required activation destroy target is unavailable.",
      });
    }
    publishFabDecision(
      state,
      createFabExactEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label:
          need === 1
            ? `Choose a card to destroy for ${sourceName}.`
            : `Choose ${need} cards to destroy for ${sourceName}.`,
        min: need,
        max: need,
        candidates,
        continuation: {
          kind: "activation-target",
          processId: processState.processId,
          targetKey: destroyCostRequirement.key,
        },
      }),
    );
    return advanced(state);
  }
  const tapCostRequirement = activationTapRequirements(procedure.cost).find(
    (requirement) => !(requirement.key in procedure.declaredTargets),
  );
  if (tapCostRequirement) {
    const candidates = options
      .legalTargets(state, context, tapCostRequirement.target)
      .filter((ref) => {
        const live = state.objects[ref.instanceId];
        return live && !live.markers.some((m) => m.kind === "tapped");
      });
    if (candidates.length < 1) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "Required activation tap target is unavailable.",
      });
    }
    publishFabDecision(
      state,
      createFabExactEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label: `Choose a card to tap for ${sourceName}.`,
        min: 1,
        max: 1,
        candidates,
        continuation: {
          kind: "activation-target",
          processId: processState.processId,
          targetKey: tapCostRequirement.key,
        },
      }),
    );
    return advanced(state);
  }
  const untapCostRequirement = activationUntapRequirements(procedure.cost).find(
    (requirement) => !(requirement.key in procedure.declaredTargets),
  );
  if (untapCostRequirement) {
    const candidates = options
      .legalTargets(state, context, untapCostRequirement.target)
      .filter((ref) => {
        const live = state.objects[ref.instanceId];
        return live && live.markers.some((m) => m.kind === "tapped");
      });
    if (candidates.length < 1) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "Required activation untap target is unavailable.",
      });
    }
    publishFabDecision(
      state,
      createFabExactEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label: `Choose a card to untap for ${sourceName}.`,
        min: 1,
        max: 1,
        candidates,
        continuation: {
          kind: "activation-target",
          processId: processState.processId,
          targetKey: untapCostRequirement.key,
        },
      }),
    );
    return advanced(state);
  }
  const removeCounterCostRequirement = activationRemoveCounterRequirements(procedure.cost).find(
    (requirement) => !(requirement.key in procedure.declaredTargets),
  );
  if (removeCounterCostRequirement) {
    const candidates = options.legalTargets(state, context, removeCounterCostRequirement.target);
    if (candidates.length < 1) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "Required activation counter target is unavailable.",
      });
    }
    const counterLabel =
      removeCounterCostRequirement.counter.kind === "named"
        ? removeCounterCostRequirement.counter.name
        : numericCounterFilterToken(
            removeCounterCostRequirement.counter.property,
            removeCounterCostRequirement.counter.value,
          );
    publishFabDecision(
      state,
      createFabExactEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label: `Choose a permanent to remove a ${counterLabel} counter from for ${sourceName}.`,
        min: 1,
        max: 1,
        candidates,
        continuation: {
          kind: "activation-target",
          processId: processState.processId,
          targetKey: removeCounterCostRequirement.key,
        },
      }),
    );
    return advanced(state);
  }
  if (
    activationNeedsEquipDestination(ability, evaluatedSource?.current.keywords ?? []) &&
    procedure.equipDestination === null
  ) {
    const seats = legalEquipDestinationSeats(state, procedure.actorId, procedure.object.instanceId);
    if (seats.length === 0) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_targets_unavailable",
        message: "No empty equipment zone is available to equip to.",
      });
    }
    if (seats.length === 1) {
      procedure.equipDestination = seats[0]!;
      return advanceFabActivationDeclarations(state, options);
    }
    publishFabDecision(
      state,
      createFabOptionDecision(state, {
        actorId: procedure.actorId,
        label: `Choose an equipment zone to equip ${sourceName} to.`,
        min: 1,
        max: 1,
        options: seats.map((seat) => ({
          id: seat,
          label: seat.charAt(0).toUpperCase() + seat.slice(1),
        })),
        continuation: {
          kind: "activation-equip-destination",
          processId: processState.processId,
        },
      }),
    );
    return advanced(state);
  }
  const targetRequirement = collectDeclaredTargets(ability.effect, "effect-0").find(
    (requirement) => !(requirement.key in procedure.declaredTargets),
  );
  if (targetRequirement) {
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
      return rejected(
        state,
        "The activation target count is unsupported.",
        "unsupported_target_count",
      );
    const { count, min } = bounds;
    if (count === 0) {
      procedure.declaredTargets[targetRequirement.key] = [];
      return advanceFabActivationDeclarations(state, options);
    }
    if (
      candidates.length < min ||
      (targetRequiresDifferentNames(targetRequirement.target) &&
        distinctPrintedNameCount(candidates) < min)
    ) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_targets_unavailable",
        message: "Required activation targets are unavailable.",
      });
    }
    publishFabDecision(
      state,
      createFabExactEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label: `Choose targets for ${sourceName}.`,
        min,
        max: Math.min(count, candidates.length),
        candidates,
        continuation: {
          kind: "activation-target",
          processId: processState.processId,
          targetKey: targetRequirement.key,
        },
        ...(targetRequiresDifferentNames(targetRequirement.target) ? { differentNames: true } : {}),
      }),
    );
    return advanced(state);
  }

  procedure.stage = "costs";
  return advanceActivationPayment(state, options);
}
