import type { FabMatchState } from "../../../state.ts";
import type { FabProcessId, ProposedEvent } from "../../../rules/events.ts";
import type { FabRulesProcess } from "../../../rules/process.ts";
import type { FabEventTransactionOptions } from "../../../kernel/process-runner/index.ts";
import { nextFabDestinationRef, snapshotObject } from "../../../rules/snapshots.ts";
import { buildFabRulesView } from "../../../rules/state-rules-view.ts";
import { commitStep } from "../helpers.ts";
import { advanceFabEndTurnProcedure } from "../advance.ts";
import { finishFabRulesProcess } from "../../../kernel/process-state.ts";
import { planFabEndPhaseDraws } from "../draw-to-intellect.ts";

const ARENA_PERMANENT_ZONES = [
  "arena",
  "head",
  "chest",
  "arms",
  "legs",
  "weapon1",
  "weapon2",
  "heroZone",
] as const;

export type EndTurnStageCtx = {
  state: FabMatchState;
  options: FabEventTransactionOptions;
  process: FabRulesProcess;
  procedure: Extract<FabRulesProcess["procedure"], { kind: "end-turn" }>;
};

export function handleResetAssets(ctx: EndTurnStageCtx): void {
  const { state, options, process, procedure } = ctx;
  procedure.stage = "draw";
  const rulesView = buildFabRulesView(state);
  const allyInstanceIds = Object.values(state.objects).flatMap((object) => {
    const evaluated = rulesView.object({
      instanceId: object.instanceId,
      incarnation: object.incarnation,
    });
    if (!evaluated?.current.typeBox.subtypes.includes("Ally")) return [];
    const needsReset =
      (object.lifeGained ?? 0) !== 0 ||
      (object.lifeLost ?? 0) !== 0 ||
      object.counters.some((counter) => counter.kind === "damage");
    return needsReset ? [object.instanceId] : [];
  });
  const untapEvents: ProposedEvent[] = rulesView
    .objects({ controllerId: procedure.actorId, zones: ARENA_PERMANENT_ZONES })
    .filter((object) =>
      state.objects[object.ref.instanceId]?.markers.some((marker) => marker.kind === "tapped"),
    )
    .map((object) => {
      const snapshot = snapshotObject(
        state,
        object.ref.instanceId,
        procedure.actorId,
        object.zone.zone,
        rulesView,
      );
      return {
        name: "set-tapped" as const,
        processId: process.processId,
        cause: {
          kind: "rule" as const,
          rule: "end-phase-untap",
          controllerId: procedure.actorId,
        },
        controllerId: procedure.actorId,
        source: null,
        affected: [snapshot],
        bindings: {},
        data: { object: snapshot, tapped: false },
      };
    });
  if (
    untapEvents.length > 0 ||
    allyInstanceIds.length > 0 ||
    state.playerIds.some(
      (id) => state.players[id]!.actionPoints !== 0 || state.players[id]!.resourcePoints !== 0,
    )
  ) {
    commitStep(state, options, [
      ...untapEvents,
      {
        name: "reset-turn-assets",
        processId: process.processId,
        cause: {
          kind: "rule",
          rule: "end-phase-assets-expire",
          controllerId: procedure.actorId,
        },
        controllerId: procedure.actorId,
        source: null,
        affected: [],
        bindings: {},
        data: { playerIds: state.playerIds, allyInstanceIds },
      },
    ]);
  } else advanceFabEndTurnProcedure(state, options);
  return;
}

export function handleDraw(ctx: EndTurnStageCtx): void {
  const { state, options, process, procedure } = ctx;

  procedure.stage = "advance-turn";
  const draws = planFabEndPhaseDraws(state, process.processId, procedure.actorId);
  if (draws.length > 0) commitStep(state, options, draws);
  else advanceFabEndTurnProcedure(state, options);
  return;
}

export function handleAdvanceTurn(ctx: EndTurnStageCtx): void {
  const { state, options, process, procedure } = ctx;
  procedure.stage = "start-phase";
  commitStep(state, options, [
    {
      name: "advance-turn",
      processId: process.processId,
      cause: { kind: "rule", rule: "next-turn-begins", controllerId: procedure.nextPlayerId },
      controllerId: procedure.nextPlayerId,
      source: null,
      affected: [],
      bindings: {},
      data: {
        previousPlayerId: procedure.actorId,
        nextPlayerId: procedure.nextPlayerId,
        nextTurnNumber: state.turnNumber + 1,
      },
    },
  ]);
  return;
}

export function handleStartPhase(ctx: EndTurnStageCtx): void {
  const { state, options, process, procedure } = ctx;
  procedure.stage = "action-phase";
  // CR 8.3.42 Suspense: at the START of the turn player's turn, remove a
  // suspense counter from each of their suspense auras (destroy at zero).
  // Bundled into the same commitStep as the start-phase event so the removal
  // lands inside the start-phase window, before the action-phase begins —
  // mirrors how handleEndPhase bundles quell destroys with the end-phase event.
  commitStep(state, options, [
    {
      name: "start-phase",
      processId: process.processId,
      cause: { kind: "rule", rule: "start-phase-begins", controllerId: procedure.nextPlayerId },
      controllerId: procedure.nextPlayerId,
      source: null,
      affected: [],
      bindings: {},
      data: { turnPlayerId: procedure.nextPlayerId, turnNumber: state.turnNumber },
    },
    ...planFabStartPhaseSuspense(state, process.processId, procedure.nextPlayerId),
  ]);
  return;
}

/**
 * CR 8.3.42 Suspense: "At the start of your turn, remove a suspense counter
 * from this." Runs for the player whose turn is beginning (`nextPlayerId`),
 * inside the start-phase stage. Returns the proposed counter-removed (and
 * destroy-at-zero) events; `handleStartPhase` commits them alongside the
 * start-phase event so they fire before any action-phase behavior.
 */
export function planFabStartPhaseSuspense(
  state: FabMatchState,
  processId: FabProcessId,
  ownerId: string,
): ProposedEvent[] {
  let resetOffset = 0;
  return state.containers.zonesByPlayerId[ownerId]!.arena.flatMap((instanceId): ProposedEvent[] => {
    const object = snapshotObject(state, instanceId, ownerId, "arena");
    const live = state.objects[instanceId];
    const suspenseCount =
      live?.counters
        .filter((c) => c.kind === "named" && c.name === "suspense")
        .reduce((sum, c) => sum + c.count, 0) ?? 0;
    if (suspenseCount <= 0) return [];
    const events: ProposedEvent[] = [
      {
        name: "counter-removed",
        processId,
        cause: { kind: "rule", rule: "suspense", controllerId: ownerId },
        controllerId: ownerId,
        source: object,
        affected: [object],
        bindings: {},
        data: { object, counter: "suspense", amount: 1 },
      },
    ];
    if (suspenseCount === 1) {
      events.push({
        name: "destroy",
        processId,
        cause: { kind: "rule", rule: "suspense", controllerId: ownerId },
        controllerId: ownerId,
        source: object,
        affected: [object],
        bindings: {},
        data: {
          object,
          destinationRef: nextFabDestinationRef(state, object, resetOffset++),
          from: "permanent",
          to: "graveyard",
          reason: "destroy",
        },
      });
    }
    return events;
  });
}

export function handleActionPhase(ctx: EndTurnStageCtx): void {
  const { state, options, process, procedure } = ctx;
  procedure.stage = "complete";
  commitStep(state, options, [
    {
      name: "action-phase-start",
      processId: process.processId,
      cause: {
        kind: "rule",
        rule: "action-phase-begins",
        controllerId: procedure.nextPlayerId,
      },
      controllerId: procedure.nextPlayerId,
      source: null,
      affected: [],
      bindings: {},
      data: { turnPlayerId: procedure.nextPlayerId, turnNumber: state.turnNumber },
    },
  ]);
  return;
}

export function handleComplete(ctx: EndTurnStageCtx): void {
  const { state } = ctx;
  finishFabRulesProcess(state, ctx.process.processId);
  return;
}
