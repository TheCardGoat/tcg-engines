import type { FabMatchState } from "../../../state.ts";
import type { ProposedEvent } from "../../../rules/events.ts";
import type { FabRulesProcess } from "../../../rules/process.ts";
import type { FabEventTransactionOptions } from "../../../kernel/process-runner/index.ts";
import { basePropertiesOf } from "../../../cards.ts";
import {
  createSyntheticFabObjectSnapshot,
  nextFabDestinationRef,
  snapshotObject,
  syntheticTokenBaseProperties,
} from "../../../rules/snapshots.ts";
import { buildFabRulesView } from "../../../rules/state-rules-view.ts";
import { createFabEntityTargetDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";
import { arsenalHasRoom } from "../../../rules/arsenal-capacity.ts";
import { commitStep } from "../helpers.ts";
import { advanceFabEndTurnProcedure } from "../advance.ts";
import { fabPlayerId } from "../../../game/identity.ts";

export type EndTurnStageCtx = {
  state: FabMatchState;
  options: FabEventTransactionOptions;
  process: FabRulesProcess;
  procedure: Extract<FabRulesProcess["procedure"], { kind: "end-turn" }>;
};

export function handleEndPhase(ctx: EndTurnStageCtx): void {
  const { state, options, process, procedure } = ctx;
  // Capture Blood Debt eligibility at the beginning-of-end-phase event. The
  // stack may resolve Decay and other triggers before the dedicated Blood Debt
  // stage resumes; objects created during those resolutions did not exist when
  // the beginning event occurred and must not be included.
  procedure.bloodDebtCandidateRefs = state.containers.zonesByPlayerId[
    procedure.actorId
  ]!.banished.flatMap((instanceId) => {
    const object = snapshotObject(state, instanceId, procedure.actorId, "banished");
    return !object.faceDown &&
      object.current.keywords.some((keyword) => keyword.name === "blood-debt")
      ? [object.ref]
      : [];
  });
  procedure.stage = "blood-debt";
  // CR 8.3.19 Quell: equipment used this turn is destroyed at the beginning
  // of the end phase (any seat — quell can fire on either player's damage).
  let resetOffset = 0;
  const quellDestroys: ProposedEvent[] = [];
  for (const playerId of state.playerIds) {
    const player = state.players[playerId];
    if (!player) continue;
    for (const zone of ["head", "chest", "arms", "legs"] as const) {
      for (const instanceId of state.containers.zonesByPlayerId[playerId]![zone]) {
        const live = state.objects[instanceId];
        if (
          !live?.markers.some(
            (marker) => marker.kind === "status" && marker.value === "quell-pending-destroy",
          )
        ) {
          continue;
        }
        const object = snapshotObject(state, instanceId, playerId, zone);
        quellDestroys.push({
          name: "destroy",
          processId: process.processId,
          cause: { kind: "rule", rule: "quell", controllerId: playerId },
          controllerId: playerId,
          source: object,
          affected: [object],
          bindings: {},
          data: {
            object,
            destinationRef: nextFabDestinationRef(state, object, resetOffset++),
            from: object.zone,
            to: "graveyard",
            reason: "destroy",
          },
        });
      }
    }
  }
  // CR 8.5.58 Sharpen: at the beginning of the end phase, remove all +1{p}
  // counters from each card sharpened this turn.
  const sharpenClears: ProposedEvent[] = [];
  for (const playerId of state.playerIds) {
    for (const zone of ["arena", "head", "chest", "arms", "legs", "weapon1", "weapon2"] as const) {
      for (const instanceId of state.containers.zonesByPlayerId[playerId]![zone]) {
        const live = state.objects[instanceId];
        if (
          !live?.markers.some(
            (marker) => marker.kind === "status" && marker.value === "sharpened-this-turn",
          )
        ) {
          continue;
        }
        const object = snapshotObject(state, instanceId, playerId, zone);
        const amount = live.counters
          .filter(
            (counter) =>
              counter.kind === "numeric" && counter.property === "power" && counter.value === 1,
          )
          .reduce((sum, counter) => sum + (counter.kind === "numeric" ? counter.count : 0), 0);
        // The reducer fail-closes on count 0; skip cards whose +1{p} counters
        // were already removed by another effect this turn.
        if (amount < 1) continue;
        sharpenClears.push({
          name: "numeric-counter-removed",
          processId: process.processId,
          cause: { kind: "rule", rule: "sharpen-end-phase", controllerId: playerId },
          controllerId: playerId,
          source: object,
          affected: [object],
          bindings: {},
          data: {
            object,
            property: "power",
            value: 1,
            count: amount,
          },
        });
      }
    }
  }
  commitStep(state, options, [
    {
      name: "end-phase",
      processId: process.processId,
      cause: { kind: "rule", rule: "end-phase-begins", controllerId: procedure.actorId },
      controllerId: procedure.actorId,
      source: null,
      affected: [],
      bindings: {},
      data: { turnPlayerId: procedure.actorId, turnNumber: state.turnNumber },
    },
    ...quellDestroys,
    ...sharpenClears,
  ]);
  return;
}

export function handleDecay(ctx: EndTurnStageCtx): void {
  const { state, options, process, procedure } = ctx;

  // Decay (IAR): at the beginning of your end phase, put a −1{ h } counter on
  // each permanent you control with decay (e.g. Restless Magister).
  procedure.stage = "heave";
  const decayEvents = state.containers.zonesByPlayerId[procedure.actorId]!.arena.flatMap(
    (instanceId): ProposedEvent[] => {
      const object = snapshotObject(state, instanceId, procedure.actorId, "arena");
      if (!object.current.keywords.some((keyword) => keyword.name === "decay")) return [];
      return [
        {
          name: "numeric-counter-added",
          processId: process.processId,
          cause: { kind: "rule", rule: "decay", controllerId: procedure.actorId },
          controllerId: procedure.actorId,
          source: object,
          affected: [object],
          bindings: {},
          data: {
            object,
            property: "life",
            value: -1,
            count: 1,
          },
        },
      ];
    },
  );
  if (decayEvents.length > 0) commitStep(state, options, decayEvents);
  else advanceFabEndTurnProcedure(state, options);
  return;
}

export function handleBloodDebt(ctx: EndTurnStageCtx): void {
  const { state, options, process, procedure } = ctx;

  // CR 8.3.11 / 8.3.11a: at the beginning of the end phase, a blood-debt card
  // that is public in the turn player's banished zone makes them lose 1 life.
  // Face-down (private) banished cards do not trigger blood debt — this is why
  // effects like Grille of Repentance turn blood-debt cards face-down.
  // Snapshot is this stage's banished set: a Corrupted Corpse created later
  // in the same end phase (Decay death) missed the beginning-of-end-phase
  // check. CR 6.6.6b player ordering vs Decay is an open gap
  // (`end-phase/blood-debt-decay-order`).
  procedure.stage = "decay";
  const player = state.players[procedure.actorId]!;
  const banished = state.containers.zonesByPlayerId[procedure.actorId]!.banished;
  const bloodDebtCards = procedure.bloodDebtCandidateRefs.flatMap((ref) => {
    const live = state.objects[ref.instanceId];
    if (!live || live.incarnation !== ref.incarnation || !banished.includes(ref.instanceId)) {
      return [];
    }
    const object = snapshotObject(state, ref.instanceId, procedure.actorId, "banished");
    return !object.faceDown &&
      object.current.keywords.some((keyword) => keyword.name === "blood-debt")
      ? [object]
      : [];
  });
  if (bloodDebtCards.length > 0 && player.life > 0) {
    // Levia et al.: continuous rule-modification restrict lose-life while the
    // printed condition (e.g. banished a power-6+ card this turn) is live.
    const loseLifeRestricted = buildFabRulesView(state)
      .rules("lose-life")
      .some((rule) => rule.mode === "restrict");
    if (loseLifeRestricted) {
      advanceFabEndTurnProcedure(state, options);
      return;
    }
    commitStep(
      state,
      options,
      bloodDebtCards.map((bloodDebtCard) => ({
        name: "lose-life",
        processId: process.processId,
        cause: { kind: "rule", rule: "blood-debt", controllerId: procedure.actorId },
        controllerId: procedure.actorId,
        source: bloodDebtCard,
        affected: [bloodDebtCard],
        bindings: {},
        data: { playerId: procedure.actorId, amount: 1, source: null },
      })),
    );
  } else advanceFabEndTurnProcedure(state, options);
  return;
}

/** CR 8.3.18: optionally pay a card's Heave cost to put it face up into arsenal. */
export function handleHeave(ctx: EndTurnStageCtx): void {
  const { state, options, process, procedure } = ctx;
  const player = state.players[procedure.actorId]!;
  if (!procedure.heaveDecisionResolved) {
    const candidates = arsenalHasRoom(state, procedure.actorId)
      ? state.containers.zonesByPlayerId[procedure.actorId]!.hand.flatMap((instanceId) => {
          const object = snapshotObject(state, instanceId, procedure.actorId, "hand");
          const keyword = object.current.keywords.find((entry) => entry.name === "heave");
          const cost =
            keyword && "value" in keyword && typeof keyword.value === "number"
              ? keyword.value
              : null;
          return cost !== null && cost >= 0 && player.resourcePoints >= cost
            ? [
                {
                  instanceId,
                  label: object.current.names.join(" // ") || instanceId,
                  target: { kind: "object" as const, ref: object.ref },
                },
              ]
            : [];
        })
      : [];
    if (candidates.length === 0) {
      procedure.heaveDecisionResolved = true;
      advanceFabEndTurnProcedure(state, options);
      return;
    }
    publishFabDecision(
      state,
      createFabEntityTargetDecision(state, {
        actorId: procedure.actorId,
        label: "You may pay a Heave cost to put that card face up into your arsenal.",
        requestedCount: 1,
        upTo: true,
        candidates,
        continuation: {
          kind: "turn-heave",
          processId: process.processId,
          playerId: procedure.actorId,
        },
      }),
    );
    return;
  }
  procedure.stage = "traverse";
  const instanceId = procedure.heaveInstanceId;
  if (!instanceId) {
    advanceFabEndTurnProcedure(state, options);
    return;
  }
  const object = snapshotObject(state, instanceId, procedure.actorId, "hand");
  const keyword = object.current.keywords.find((entry) => entry.name === "heave");
  const cost =
    keyword && "value" in keyword && typeof keyword.value === "number" ? keyword.value : null;
  if (cost === null || player.resourcePoints < cost || !arsenalHasRoom(state, procedure.actorId)) {
    throw new Error("The persisted FAB Heave choice is no longer legal.");
  }
  const seismicSurgeCanonicalId = "token:seismic-surge";
  const seismicSurgeBase = state.cardDefinitions[seismicSurgeCanonicalId]
    ? basePropertiesOf(state.cardDefinitions[seismicSurgeCanonicalId])
    : syntheticTokenBaseProperties("seismic-surge");
  const seismicSurges: ProposedEvent[] = Array.from({ length: cost }, (_, index) => {
    const object = createSyntheticFabObjectSnapshot({
      ref: {
        instanceId: `${process.processId}:heave-seismic-surge-${index + 1}`,
        incarnation: state.counters.objectIncarnation + index + 1,
      },
      canonicalId: seismicSurgeCanonicalId,
      objectKind: "created-token",
      baseSource: { kind: "registered" },
      ownerId: procedure.actorId,
      controllerId: procedure.actorId,
      zone: "unknown",
      zoneRef: { playerId: fabPlayerId(procedure.actorId), zone: "arena" },
      base: seismicSurgeBase,
    });
    return {
      name: "create",
      processId: process.processId,
      cause: { kind: "rule", rule: "heave", controllerId: procedure.actorId },
      controllerId: procedure.actorId,
      source: object,
      affected: [object],
      bindings: {},
      data: { playerId: procedure.actorId, object },
    };
  });
  commitStep(state, options, [
    {
      name: "pay-resources",
      processId: process.processId,
      cause: { kind: "rule", rule: "heave", controllerId: procedure.actorId },
      controllerId: procedure.actorId,
      source: object,
      affected: [],
      bindings: {},
      data: { playerId: procedure.actorId, amount: cost },
    },
    {
      name: "move-zone",
      processId: process.processId,
      cause: { kind: "rule", rule: "heave", controllerId: procedure.actorId },
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
        faceDown: false,
      },
    },
    ...seismicSurges,
  ]);
}
