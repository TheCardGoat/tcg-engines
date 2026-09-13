import type { FabMatchState } from "../../../state.ts";
import type { ProposedEvent } from "../../../rules/events.ts";
import type { FabRulesProcess } from "../../../rules/process.ts";
import type { FabEventTransactionOptions } from "../../../kernel/process-runner/index.ts";
import { nextFabDestinationRef, snapshotObject } from "../../../rules/snapshots.ts";
import { commitStep } from "../helpers.ts";
import { advanceFabEndTurnProcedure } from "../advance.ts";
import { createFabOrderingDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";

export type EndTurnStageCtx = {
  state: FabMatchState;
  options: FabEventTransactionOptions;
  process: FabRulesProcess;
  procedure: Extract<FabRulesProcess["procedure"], { kind: "end-turn" }>;
};

export function handlePitchOrder(ctx: EndTurnStageCtx): void {
  const { state, options, process, procedure } = ctx;

  const awaiting = state.playerIds.find(
    (playerId) =>
      state.containers.zonesByPlayerId[playerId]!.pitch.length > 1 &&
      !procedure.pitchOrders[playerId],
  );
  if (awaiting) {
    publishFabDecision(
      state,
      createFabOrderingDecision(state, {
        actorId: awaiting,
        label:
          "Privately build the bottom of your deck from deepest to nearest the top; select the deepest pitched card first.",
        entries: state.containers.zonesByPlayerId[awaiting]!.pitch.map((instanceId) => ({
          id: instanceId,
          label:
            snapshotObject(state, instanceId, awaiting, "pitch").current.names.join(" // ") ||
            instanceId,
        })),
        continuation: {
          kind: "turn-pitch-order",
          processId: process.processId,
          playerId: awaiting,
        },
      }),
    );
    return;
  }
  procedure.stage = "return-pitch";
  advanceFabEndTurnProcedure(state, options);
  return;
}

export function handleReturnPitch(ctx: EndTurnStageCtx): void {
  const { state, options, process, procedure } = ctx;

  procedure.stage = "reset-assets";
  let resetOffset = 0;
  const moves = state.playerIds.flatMap((playerId) => {
    const pitch = state.containers.zonesByPlayerId[playerId]!.pitch;
    const ordered = procedure.pitchOrders[playerId] ?? pitch;
    return [...ordered].reverse().map((instanceId): ProposedEvent => {
      const object = snapshotObject(state, instanceId, playerId, "pitch");
      return {
        name: "move-zone",
        processId: process.processId,
        cause: { kind: "rule", rule: "end-phase-pitch-return", controllerId: playerId },
        controllerId: playerId,
        source: null,
        affected: [object],
        bindings: {},
        data: {
          object,
          destinationRef: nextFabDestinationRef(state, object, resetOffset++),
          from: "pitch",
          to: "deck",
          reason: "rule",
          position: "bottom",
        },
      };
    });
  });
  if (moves.length > 0) commitStep(state, options, moves);
  else advanceFabEndTurnProcedure(state, options);
  return;
}
