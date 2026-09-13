import type { FabMatchState } from "../../state.ts";
import type { FabDecisionAnswer, FabDecisionContinuation } from "../../rules/process.ts";
import type { FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import { advanceFabEndTurnProcedure } from "./advance.ts";

export function resumeFabTurnPitchOrder(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "turn-pitch-order" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "ordering" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  const procedure = state.rulesProcess?.procedure;
  if (
    !state.rulesProcess ||
    state.rulesProcess.processId !== continuation.processId ||
    state.rulesProcess.stage !== "procedure" ||
    !procedure ||
    procedure.kind !== "end-turn" ||
    procedure.stage !== "pitch-order"
  )
    throw new Error("The persisted FAB pitch-order procedure no longer exists.");
  procedure.pitchOrders[continuation.playerId] = [...answer.orderedIds];
  advanceFabEndTurnProcedure(state, options);
  return state;
}

export function resumeFabTurnHeave(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "turn-heave" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "entity-target" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  const procedure = state.rulesProcess?.procedure;
  if (
    !state.rulesProcess ||
    state.rulesProcess.processId !== continuation.processId ||
    state.rulesProcess.stage !== "procedure" ||
    !procedure ||
    procedure.kind !== "end-turn" ||
    procedure.stage !== "heave" ||
    procedure.actorId !== continuation.playerId
  ) {
    throw new Error("The persisted FAB Heave procedure no longer exists.");
  }
  procedure.heaveDecisionResolved = true;
  procedure.heaveInstanceId = answer.instanceIds[0] ?? null;
  advanceFabEndTurnProcedure(state, options);
  return state;
}

export function resumeFabTurnArsenal(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "turn-arsenal" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "entity-target" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  const procedure = state.rulesProcess?.procedure;
  if (
    !state.rulesProcess ||
    state.rulesProcess.processId !== continuation.processId ||
    state.rulesProcess.stage !== "procedure" ||
    !procedure ||
    procedure.kind !== "end-turn" ||
    procedure.stage !== "arsenal" ||
    procedure.actorId !== continuation.playerId
  ) {
    throw new Error("The persisted FAB arsenal procedure no longer exists.");
  }
  procedure.arsenalDecisionResolved = true;
  procedure.arsenalCardId = answer.instanceIds[0] ?? null;
  advanceFabEndTurnProcedure(state, options);
  return state;
}
