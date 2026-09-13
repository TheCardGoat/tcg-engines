import type { FabMatchState } from "../../../state.ts";
import type { ProposedEvent } from "../../../rules/events.ts";
import type { FabRulesProcess } from "../../../rules/process.ts";
import type { FabEventTransactionOptions } from "../../../kernel/process-runner/index.ts";
import { nextFabDestinationRef, snapshotObject } from "../../../rules/snapshots.ts";
import { commitStep } from "../helpers.ts";
import { advanceFabEndTurnProcedure } from "../advance.ts";
import { createFabEntityTargetDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";
import { arsenalHasRoom } from "../../../rules/arsenal-capacity.ts";

export type EndTurnStageCtx = {
  state: FabMatchState;
  options: FabEventTransactionOptions;
  process: FabRulesProcess;
  procedure: Extract<FabRulesProcess["procedure"], { kind: "end-turn" }>;
};

export function handleTraverse(ctx: EndTurnStageCtx): void {
  const { state, options, process, procedure } = ctx;

  // IAR Traverse: optional end-phase flip of a double-faced hero with the
  // traverse keyword. Reminder: "Flip. Your { h } does not change."
  procedure.stage = "return-intimidated";
  if (!procedure.traverse) {
    advanceFabEndTurnProcedure(state, options);
    return;
  }
  const heroId = state.containers.zonesByPlayerId[procedure.actorId]!.heroZone[0];
  if (!heroId) {
    advanceFabEndTurnProcedure(state, options);
    return;
  }
  const hero = snapshotObject(state, heroId, procedure.actorId, "heroZone");
  const hasTraverse = hero.current.keywords.some((keyword) => keyword.name === "traverse");
  if (!hasTraverse) {
    advanceFabEndTurnProcedure(state, options);
    return;
  }
  commitStep(state, options, [
    {
      name: "transform",
      processId: process.processId,
      cause: { kind: "rule", rule: "traverse", controllerId: procedure.actorId },
      controllerId: procedure.actorId,
      source: hero,
      affected: [hero],
      bindings: {},
      data: {
        object: hero,
        previous: hero,
        into: "traverse",
      },
    },
  ]);
  return;
}

export function handleReturnIntimidated(ctx: EndTurnStageCtx): void {
  const { state, options, process, procedure } = ctx;

  procedure.stage = "arsenal";
  let resetOffset = 0;
  const returns = state.playerIds.flatMap((playerId) =>
    state.players[playerId]!.intimidatedInstanceIds.flatMap((entry): ProposedEvent[] => {
      if (!state.containers.zonesByPlayerId[playerId]!.banished.includes(entry.instanceId))
        return [];
      const object = snapshotObject(state, entry.instanceId, playerId, "banished");
      return [
        {
          name: "move-zone",
          processId: process.processId,
          cause: { kind: "rule", rule: "intimidate-returns", controllerId: playerId },
          controllerId: playerId,
          source: null,
          affected: [object],
          bindings: {},
          data: {
            object,
            destinationRef: nextFabDestinationRef(state, object, resetOffset++),
            from: "banished",
            // CR 8.5.1c: banish-until returns to the card's previous zone;
            // intimidate entries carry "hand" here.
            to: entry.returnToZone,
            reason: "rule",
          },
        },
      ];
    }),
  );
  if (returns.length > 0) commitStep(state, options, returns);
  else advanceFabEndTurnProcedure(state, options);
  return;
}

export function handleArsenal(ctx: EndTurnStageCtx): void {
  const { state, options, process, procedure } = ctx;

  if (!procedure.arsenalDecisionResolved) {
    const candidates = arsenalHasRoom(state, procedure.actorId)
      ? state.containers.zonesByPlayerId[procedure.actorId]!.hand.map((instanceId) => {
          const object = snapshotObject(state, instanceId, procedure.actorId, "hand");
          return {
            instanceId,
            label: object.current.names.join(" // ") || instanceId,
            target: { kind: "object" as const, ref: object.ref },
          };
        })
      : [];
    if (candidates.length > 0) {
      publishFabDecision(
        state,
        createFabEntityTargetDecision(state, {
          actorId: procedure.actorId,
          label: "Arsenal a card",
          requestedCount: 1,
          upTo: true,
          candidates,
          continuation: {
            kind: "turn-arsenal",
            processId: process.processId,
            playerId: procedure.actorId,
          },
        }),
      );
      return;
    }
    procedure.arsenalDecisionResolved = true;
  }

  procedure.stage = "pitch-order";
  const instanceId = procedure.arsenalCardId;
  if (!instanceId) {
    advanceFabEndTurnProcedure(state, options);
    return;
  }
  const object = snapshotObject(state, instanceId, procedure.actorId, "hand");
  commitStep(state, options, [
    {
      name: "move-zone",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "arsenal" },
      controllerId: procedure.actorId,
      source: object,
      affected: [object],
      bindings: {},
      data: {
        object,
        destinationRef: nextFabDestinationRef(state, object),
        from: "hand",
        to: "arsenal",
        reason: "rule",
        faceDown: true,
      },
    },
  ]);
  return;
}
