import type { FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import { executeFabEventTransaction } from "../../kernel/transaction/index.ts";
import { mutateInPlace } from "../../copy-on-write.ts";
import { opponentOf, type FabMatchState } from "../../state.ts";
import { evaluateCanonicalCondition } from "../../rules/condition-evaluator.ts";
import { fabLayerKeywords } from "../../rules/layers.ts";
import { fabTriggerStateCondition } from "../../rules/trigger-patterns.ts";
import type { FabTriggerSource } from "../../rules/trigger-matcher.ts";
import { beginFabLayerResolution } from "../layer-resolution/index.ts";
import { advanceFabCombatStep } from "../combat/combat-step.ts";
import { resolveFabCombatDamage } from "../combat/combat-damage.ts";
import { closeFabCombatChain } from "../combat/combat-close.ts";
import { beginFabEndTurnProcedure } from "../turn/index.ts";
import { passFabPriority, priorityPasses, resetFabPriorityPasses } from "../../priority.ts";

/**
 * One committed priority pass within the current CR window (CR 1.11.4a).
 *
 * A full pass cycle hands control to the window's advance step: the top rules
 * layer resolves (stack), the combat chain advances (CR 7), or the Action
 * Phase ends (CR 4.3.4). This module owns that orchestration; command handlers
 * only commit the pass and report.
 */
export type FabPassAdvanceResult =
  | { readonly accepted: true; readonly state: FabMatchState }
  | {
      readonly accepted: false;
      readonly state: FabMatchState;
      readonly error: string;
      readonly errorCode?: string;
    };

function commitPriorityPass(
  state: FabMatchState,
  actorId: string,
  scope: "stack" | "combat" | "open",
  resetPasses: boolean,
): FabMatchState {
  const nextPlayerId = opponentOf(state, actorId);
  return mutateInPlace(state, (draft) => {
    draft.stateID += 1;
    draft.counters.process += 1;
    draft.counters.batch += 1;
    draft.counters.event += 1;
    if (scope === "combat" && !draft.combat?.open) {
      throw new Error("FAB combat priority pass requires an open combat chain.");
    }
    // Any pass commit — manual or automation-drained — consumes the seat's
    // one-shot priority hold ("play and hold" ends when you pass).
    if (draft.priorityHoldArmed[actorId]) {
      const { [actorId]: _cleared, ...remainingArms } = draft.priorityHoldArmed;
      draft.priorityHoldArmed = remainingArms;
    }
    passFabPriority(draft, nextPlayerId);
    if (resetPasses) {
      resetFabPriorityPasses(draft);
    }
  });
}

function resolveTopRulesStackLayer(
  state: FabMatchState,
  options: FabEventTransactionOptions,
): FabPassAdvanceResult {
  const layer = state.rulesStack[state.rulesStack.length - 1];
  if (!layer) {
    return {
      accepted: false,
      state,
      error: "Rules stack is empty.",
      errorCode: "empty_rules_stack",
    };
  }
  // CR 6.6.5b: an event+state trigger's state is checked when the event
  // occurs (generation), not again at resolution. Thaw (CR 6.6.6a) pays
  // "banish it" as the layer is added; re-checking "in your graveyard"
  // here would cease the layer after that cost and skip the chosen mode.
  // Resolution-time ability conditions (6.1.3 / 6.6.1d) still re-check.
  const resolutionStateCondition =
    layer.kind === "triggered" && layer.trigger.kind === "state"
      ? fabTriggerStateCondition(layer.trigger)
      : null;
  if (layer.kind === "triggered" && (resolutionStateCondition || layer.abilityCondition)) {
    const source: FabTriggerSource = {
      abilityId: layer.abilityId,
      controllerId: layer.controllerId,
      source: layer.source,
      trigger: layer.trigger,
      abilityCondition: layer.abilityCondition,
      resolution: layer.resolution,
      layerKeywords: fabLayerKeywords(layer),
      functionalZones: [],
      origin: state.delayedTriggers.some((entry) => entry.delayedTriggerId === layer.abilityId)
        ? "delayed"
        : "static",
      bindings: {
        objects: Object.fromEntries(
          Object.entries(layer.bindings).flatMap(([key, value]) =>
            value && typeof value === "object" && "ref" in value
              ? [[key, [value.ref]] as const]
              : [],
          ),
        ),
        numbers: Object.fromEntries(
          Object.entries(layer.bindings).flatMap(([key, value]) =>
            typeof value === "number" ? [[key, value] as const] : [],
          ),
        ),
        strings: Object.fromEntries(
          Object.entries(layer.bindings).flatMap(([key, value]) =>
            typeof value === "string" || typeof value === "boolean"
              ? [[key, String(value)] as const]
              : [],
          ),
        ),
      },
    };
    if (
      [resolutionStateCondition, layer.abilityCondition].some(
        (condition) =>
          condition && !evaluateCanonicalCondition(state, condition, source, layer.triggeringEvent),
      )
    ) {
      const ceased = executeFabEventTransaction(
        state,
        (processId) => [
          {
            name: "remove-rules-layer",
            processId,
            cause: {
              kind: "rule",
              rule: "state condition false at resolution",
              controllerId: layer.controllerId,
            },
            controllerId: layer.controllerId,
            source: layer.source,
            affected: [layer.source],
            bindings: layer.bindings,
            data: {
              layerId: layer.layerId,
              reason: "ceased",
            },
          },
        ],
        options,
      );
      return { accepted: true, state: ceased.state };
    }
  }

  const resolved = beginFabLayerResolution(state, layer.layerId, options);
  if (!resolved.accepted) {
    return {
      accepted: false,
      state,
      error: resolved.error,
      errorCode: resolved.errorCode,
    };
  }
  return { accepted: true, state: resolved.state };
}

function advanceCombat(
  state: FabMatchState,
  actorId: string,
  options: FabEventTransactionOptions,
): FabPassAdvanceResult {
  const combat = state.combat;
  if (!combat?.activeLink) {
    return { accepted: false, state, error: "No active combat.", errorCode: "no_combat" };
  }
  if (combat.step === "attack" || combat.step === "defend" || combat.step === "damage") {
    const advanced = advanceFabCombatStep(state, options);
    if (!advanced.accepted) return advanced;
    return { accepted: true, state: advanced.state };
  }
  if (combat.step === "reaction") {
    const resolved = resolveFabCombatDamage(state, options);
    if (!resolved.accepted) return resolved;
    return { accepted: true, state: resolved.state };
  }
  if (combat.step === "resolution") {
    const closed = closeFabCombatChain(state, actorId, options);
    if (!closed.accepted) return closed;
    return { accepted: true, state: closed.state };
  }
  return {
    accepted: false,
    state,
    error: `Combat step ${combat.step} is not valid for the current link.`,
    errorCode: "invalid_combat_step",
  };
}

export function advanceFabPassCycle(
  state: FabMatchState,
  actorId: string,
  options: FabEventTransactionOptions,
): FabPassAdvanceResult {
  if (state.rulesStack.length > 0) {
    const resolvingLayerId = state.rulesStack.at(-1)!.layerId;
    const completesPassCycle = priorityPasses(state) + 1 >= state.playerIds.length;
    const passedState = commitPriorityPass(state, actorId, "stack", completesPassCycle);
    if (
      completesPassCycle &&
      (!passedState.rulesProcess || passedState.rulesProcess.stage === "procedure") &&
      !passedState.decision &&
      passedState.rulesStack.at(-1)?.layerId === resolvingLayerId
    ) {
      return resolveTopRulesStackLayer(passedState, options);
    }
    return { accepted: true, state: passedState };
  }

  const combat = state.combat;
  if (!combat?.open) {
    const completesPassCycle = priorityPasses(state) + 1 >= state.playerIds.length;
    const passedState = commitPriorityPass(state, actorId, "open", completesPassCycle);
    if (!completesPassCycle) {
      return { accepted: true, state: passedState };
    }

    // CR 1.11.4a and 4.3.4: with an empty stack and no combat chain, a full
    // pass cycle ends the Action Phase. Reuse the normal end-turn procedure;
    // neither player declared an arsenal card, so its optional choice is null.
    const ended = beginFabEndTurnProcedure(
      passedState,
      state.activePlayerId,
      null,
      options,
      false,
      true,
    );
    if (!ended.accepted) return ended;
    return { accepted: true, state: ended.state };
  }

  const step = combat.step;
  const completesPassCycle = priorityPasses(state) + 1 >= state.playerIds.length;
  const passedState = commitPriorityPass(state, actorId, "combat", completesPassCycle);
  if (
    completesPassCycle &&
    !passedState.rulesProcess &&
    !passedState.decision &&
    passedState.combat?.step === step
  ) {
    return advanceCombat(passedState, actorId, options);
  }
  return { accepted: true, state: passedState };
}
