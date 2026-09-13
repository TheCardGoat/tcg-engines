import type { FabMatchState } from "../../state.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";
import type { FabProcessId } from "../../rules/events.ts";
import type { FabRulesProcessStage } from "../../rules/process.ts";
import { advanceTriggerDeclarations } from "../trigger-declaration.ts";
import { proposeContinuousReconciliationEvents } from "../../rules/continuous/reconciler.ts";
import { FabRulesOrderingRequiredError } from "../../rules/rules-evaluator.ts";
import { collectStateTriggers } from "../../rules/trigger-matcher.ts";
import { snapshotFunctionalTriggerSources } from "../../rules/snapshots.ts";
import type { FabEventTransactionOptions } from "./types.ts";
import {
  EQUIP_ZONE_KINDS,
  equipmentListensForEquip,
  markNonListeningEquipmentObserved,
  proposeStartingEquipEvents,
} from "./equip-bootstrap.ts";
import { executeFabEventTransaction } from "../transaction/index.ts";
import { finishFabRulesProcess } from "../process-state.ts";
import { fabTriggerStateCondition } from "../../rules/trigger-patterns.ts";
import { beginFabInitialTurnProcedure } from "../../procedures/turn/index.ts";
import { transitionFabRulesProcessStage } from "../process-state.ts";

export function stabilizeFabRulesStateAtBoundary(
  state: FabMatchState,
  options: FabEventTransactionOptions,
): FabMatchState {
  if (state.gameEnded || state.decision) return state;
  if (state.rulesProcess) {
    if (
      state.rulesProcess.stage === "procedure" &&
      state.rulesProcess.procedure?.kind === "start-turn"
    ) {
      options.advanceProcedure?.(state);
    }
    return state;
  }
  // CR 4.1.4: starting equipment is equipped as the match begins. Emit one
  // equip observation per seated equipment that listens for equip so
  // "when you equip" triggers (Seasoned Saviour) fire at game start.
  // Non-listeners are marked equip-observed so we do not re-scan forever.
  markNonListeningEquipmentObserved(state);
  const hasListeningUnobserved = state.playerIds.some((playerId) => {
    const player = state.players[playerId];
    if (!player) return false;
    return EQUIP_ZONE_KINDS.some((zone) =>
      state.containers.zonesByPlayerId[playerId]![zone].some((instanceId) => {
        const record = state.objects[instanceId];
        if (!record) return false;
        if (
          record.markers.some(
            (marker) => marker.kind === "status" && marker.value === "equip-observed",
          )
        ) {
          return false;
        }
        return equipmentListensForEquip(state, record.canonicalId);
      }),
    );
  });
  if (hasListeningUnobserved) {
    state = executeFabEventTransaction(
      state,
      (processId) => proposeStartingEquipEvents(state, processId),
      options,
    ).state;
    if (state.rulesProcess || state.decision) return state;
  }
  const nextProcessId: FabProcessId = `process-${state.counters.process + 1}`;
  try {
    if (proposeContinuousReconciliationEvents(state, nextProcessId).length === 0) {
      return advanceInitialStartPhaseIfReady(state, options);
    }
  } catch (error) {
    if (!(error instanceof FabRulesOrderingRequiredError)) throw error;
  }
  state = executeFabEventTransaction(state, () => [], options).state;
  return advanceInitialStartPhaseIfReady(state, options);
}

function advanceInitialStartPhaseIfReady(
  state: FabMatchState,
  options: FabEventTransactionOptions,
): FabMatchState {
  if (
    state.turnNumber !== 1 ||
    state.phase !== "start" ||
    state.rulesProcess ||
    state.decision ||
    state.rulesStack.length > 0
  ) {
    return state;
  }
  beginFabInitialTurnProcedure(state);
  options.advanceProcedure?.(state);
  return state;
}

export function advanceFabRulesProcessToBoundary(
  state: FabMatchState,
  options: FabEventTransactionOptions,
): void {
  const stateTriggerGuard = createFabLoopGuard({
    label: "process-runner: state-trigger-scan",
    limit: options.maxIterations,
  });
  while (state.rulesProcess?.stage === "state-trigger-scan" && !state.decision) {
    stateTriggerGuard.tick();
    const process = state.rulesProcess;
    const suppressed = new Set(
      state.rulesStack.flatMap((layer) =>
        layer.kind === "triggered" && fabTriggerStateCondition(layer.trigger) !== null
          ? [`${layer.source.instanceId}:${layer.abilityId}`]
          : [],
      ),
    );
    const collected = collectStateTriggers(
      state,
      snapshotFunctionalTriggerSources(state),
      suppressed,
      options.triggerContext,
      `state:${process.processId}:${stateTriggerGuard.count}`,
    );
    state.triggerLimitUsage = { ...collected.triggerLimitUsage };
    if (collected.pendingTriggers.length === 0) {
      if (process.procedure && process.procedure.stage !== "complete") {
        transitionFabRulesProcessStage(process, "procedure");
        if (state.rulesStack.length === 0) options.advanceProcedure?.(state);
      } else {
        finishFabRulesProcess(state, process.processId);
      }
      return;
    }
    process.pendingTriggers = [...collected.pendingTriggers];
    transitionFabRulesProcessStage(process, "layer-declaration");
    advanceTriggerDeclarations(state, options);
  }
}

export function finishDeferredFabRulesProcess(
  state: FabMatchState,
  options: FabEventTransactionOptions,
): FabMatchState {
  const process = state.rulesProcess;
  if (!process || process.stage !== "trigger-collection") return state;
  const nextStage: FabRulesProcessStage =
    process.pendingTriggers.length > 0 ? "layer-declaration" : "state-trigger-scan";
  transitionFabRulesProcessStage(process, nextStage);
  if (nextStage === "layer-declaration") advanceTriggerDeclarations(state, options);
  advanceFabRulesProcessToBoundary(state, options);
  return state;
}
