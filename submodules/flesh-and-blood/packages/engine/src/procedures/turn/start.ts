import type { FabMatchState } from "../../state.ts";
import type { FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import { startFabRulesProcess } from "../../kernel/process-state.ts";
import { finishFabRulesProcess } from "../../kernel/process-state.ts";
import { commitStep, process } from "./helpers.ts";
import { planFabStartPhaseSuspense } from "./stages/turn.ts";

/**
 * CR 4.1.9 and 4.2: after opening hands are drawn, the first turn begins with
 * a real Start Phase. Keeping it as a persisted procedure lets optional
 * start-of-turn triggers pause and resume before the Action Phase opens.
 */
export function beginFabInitialTurnProcedure(state: FabMatchState): void {
  state.counters.process += 1;
  const processId = `process-${state.counters.process}` as const;
  startFabRulesProcess(
    state,
    process(processId, {
      kind: "start-turn",
      actorId: state.activePlayerId,
      stage: "start-phase",
      eventGroups: [],
    }),
  );
}

export function advanceFabInitialTurnProcedure(
  state: FabMatchState,
  options: FabEventTransactionOptions,
): void {
  const rulesProcess = state.rulesProcess;
  const procedure = rulesProcess?.procedure;
  if (
    !rulesProcess ||
    !procedure ||
    procedure.kind !== "start-turn" ||
    rulesProcess.stage !== "procedure"
  )
    return;
  if (state.decision || state.rulesStack.length > 0) return;

  const stage = procedure.stage;
  switch (stage) {
    case "start-phase":
      procedure.stage = "action-phase";
      commitStep(state, options, [
        {
          name: "start-phase",
          processId: rulesProcess.processId,
          cause: {
            kind: "rule",
            rule: "initial-start-phase-begins",
            controllerId: procedure.actorId,
          },
          controllerId: procedure.actorId,
          source: null,
          affected: [],
          bindings: {},
          data: { turnPlayerId: procedure.actorId, turnNumber: state.turnNumber },
        },
        ...planFabStartPhaseSuspense(state, rulesProcess.processId, procedure.actorId),
      ]);
      return;
    case "action-phase":
      procedure.stage = "complete";
      commitStep(state, options, [
        {
          name: "action-phase-start",
          processId: rulesProcess.processId,
          cause: {
            kind: "rule",
            rule: "action-phase-begins",
            controllerId: procedure.actorId,
          },
          controllerId: procedure.actorId,
          source: null,
          affected: [],
          bindings: {},
          data: { turnPlayerId: procedure.actorId, turnNumber: state.turnNumber },
        },
      ]);
      return;
    case "complete":
      finishFabRulesProcess(state, rulesProcess.processId);
      return;
    default: {
      const _exhaustive: never = stage;
      throw new Error(`Unhandled initial-turn stage: ${JSON.stringify(_exhaustive)}`);
    }
  }
}
