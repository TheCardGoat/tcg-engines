import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import {
  collectFabSnapshotValidationIssues,
  createFabMatchContext,
  isFabMatchSnapshotV21,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "./match-context.ts";
import { snapshotObject } from "../rules/snapshots.ts";

function baseSnapshot() {
  const state = FabTestEngine.createStateForRulesTest({
    seed: "snapshot-admission",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
  });
  return { state, snapshot: serializeFabMatchSnapshot(state) };
}

function minimalProcess() {
  return {
    processId: "process-1",
    stage: "event-commit",
    pendingEvents: [],
    futureSubjectEvents: [],
    replacementCandidates: [],
    replacementChoiceResolved: false,
    replacementChoicePlayerIds: [],
    selectedOptionalReplacementIds: [],
    orderedReplacementIds: [],
    appliedReplacementIds: [],
    cancelledContinuousApplicationKeys: [],
    pendingTriggers: [],
    orderedTriggerIds: [],
    triggerPlayerOrder: [],
    orderedTriggerControllers: [],
    stateTriggersOnStack: [],
    resolvingLayerId: null,
    effectChoices: {},
    effectPartitions: {},
    effectOptions: {},
    effectTargets: {},
    iterationCount: 0,
    journalReplacementOrders: {},
    journalReplacementChoices: {},
    journalReplacementChoicePlayerIds: {},
    resolutionEventGroups: [],
    procedure: null,
  };
}

function processWithBinding(
  snapshot: ReturnType<typeof baseSnapshot>["snapshot"],
  binding: object,
) {
  return {
    ...minimalProcess(),
    pendingEvents: [
      {
        name: "gain-life",
        processId: "process-1",
        cause: { kind: "rule", rule: "snapshot-admission", controllerId: "p1" },
        controllerId: "p1",
        source: null,
        affected: [],
        bindings: { moved: binding },
        data: { playerId: "p1", amount: 1 },
      },
    ],
  };
}

describe("V17 snapshot runtime-graph admission", () => {
  it("requires firstTurnPlayerId to identify a seated player", () => {
    const { snapshot } = baseSnapshot();

    expect(isFabMatchSnapshotV21({ ...snapshot, firstTurnPlayerId: null })).toBe(false);
    expect(isFabMatchSnapshotV21({ ...snapshot, firstTurnPlayerId: "spectator" })).toBe(false);
    expect(isFabMatchSnapshotV21({ ...snapshot, firstTurnPlayerId: "p2" })).toBe(true);
  });

  it("admits exact frozen-copy provenance and rejects malformed object derivation", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "snapshot-frozen-copy",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { source: "source-card", copy: "source-card" },
        owners: { p1: ["source", "copy"], p2: [] },
      },
      cardDefinitions: {
        "source-card": { canonicalId: "source-card", name: "Source", types: ["Action"] },
      },
    });
    state.objects.copy = {
      ...state.objects.copy!,
      objectKind: "created-token",
      baseSource: {
        kind: "frozen-copy",
        copyable: state.cardDefinitions["source-card"]!.base,
        source: {
          instanceId: state.objects.source!.instanceId,
          incarnation: state.objects.source!.incarnation,
          canonicalId: state.objects.source!.canonicalId,
        },
        createdByEventId: "event-copy",
      },
    };
    const snapshot = serializeFabMatchSnapshot(state);
    expect(isFabMatchSnapshotV21(snapshot)).toBe(true);

    const copy = snapshot.objects.copy!;
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        objects: { ...snapshot.objects, copy: { ...copy, objectKind: "future-kind" } },
      }),
    ).toBe(false);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        objects: {
          ...snapshot.objects,
          copy: {
            ...copy,
            baseSource: {
              ...copy.baseSource,
              source: { instanceId: "foreign", incarnation: 999, canonicalId: "source-card" },
            },
          },
        },
      }),
    ).toBe(false);
  });
  it("validates continuation bindings as same-instance exact live or LKI action handles", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "snapshot-continuation-binding",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { card1: "card" },
        owners: { p1: ["card1"], p2: [] },
      },
      cardDefinitions: { card: { canonicalId: "card", types: ["Action"] } },
    });
    const binding = {
      ...snapshotObject(state, "card1", "p1", "deck"),
      continuationRef: { instanceId: "card1", incarnation: state.objects.card1!.incarnation },
    };
    const snapshot = serializeFabMatchSnapshot(state);

    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        rulesProcess: processWithBinding(snapshot, binding),
      }),
    ).toBe(true);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        rulesProcess: processWithBinding(snapshot, {
          ...binding,
          continuationRef: { ...binding.continuationRef, instanceId: "other" },
        }),
      }),
    ).toBe(false);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        rulesProcess: processWithBinding(snapshot, {
          ...binding,
          continuationRef: { ...binding.continuationRef, incarnation: 999 },
        }),
      }),
    ).toBe(false);
  });

  it("rejects forged persisted zone-transition identity receipts", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "snapshot-transition-receipt",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { card1: "card" },
        owners: { p1: ["card1"], p2: [] },
      },
      cardDefinitions: { card: { canonicalId: "card", types: ["Action"] } },
    });
    const after = snapshotObject(state, "card1", "p1", "deck");
    const before = {
      ...after,
      ref: { ...after.ref, incarnation: after.ref.incarnation - 1 },
      zoneRef: { playerId: "p1", zone: "hand" },
      zone: "hand",
    };
    const event = {
      name: "move-zone",
      processId: "process-1",
      cause: { kind: "rule", rule: "snapshot-transition", controllerId: "p1" },
      controllerId: "p1",
      source: before,
      affected: [after],
      bindings: {},
      data: {
        object: after,
        destinationRef: after.ref,
        from: "hand",
        to: "deck",
        reason: "move",
        transition: { before, after, identity: "reset" },
      },
    };
    const snapshot = serializeFabMatchSnapshot(state);
    const process = { ...minimalProcess(), pendingEvents: [event] };

    expect(isFabMatchSnapshotV21({ ...snapshot, rulesProcess: process })).toBe(true);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        rulesProcess: {
          ...process,
          pendingEvents: [
            {
              ...event,
              data: {
                ...event.data,
                transition: { ...event.data.transition, identity: "preserved" },
              },
            },
          ],
        },
      }),
    ).toBe(false);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        rulesProcess: {
          ...process,
          pendingEvents: [
            {
              ...event,
              data: {
                ...event.data,
                transition: {
                  ...event.data.transition,
                  after: { ...after, ref: { ...after.ref, instanceId: "foreign" } },
                },
              },
            },
          ],
        },
      }),
    ).toBe(false);
  });

  it("validates the complete deferred clash effect before admitting it", () => {
    const { snapshot } = baseSnapshot();
    const clashOutcome = {
      name: "clash-outcome",
      processId: "process-1",
      cause: { kind: "rule", rule: "snapshot-clash", controllerId: "p1" },
      controllerId: "p1",
      source: null,
      affected: [],
      bindings: {},
      data: {
        clashId: "clash-1",
        firstPlayerId: "p1",
        secondPlayerId: "p2",
        winnerId: "p1",
        firstPower: 4,
        secondPower: 2,
        firstHasPower: true,
        secondHasPower: true,
        revealed: [],
        deferredEffect: {
          type: "deal-damage",
          damageType: "physical",
          amount: 1,
          target: { selector: "hero", who: "opponent" },
        },
      },
    };

    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        rulesProcess: { ...minimalProcess(), pendingEvents: [clashOutcome] },
      }),
    ).toBe(true);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        rulesProcess: {
          ...minimalProcess(),
          pendingEvents: [
            {
              ...clashOutcome,
              data: { ...clashOutcome.data, deferredEffect: { type: "deal-damage" } },
            },
          ],
        },
      }),
    ).toBe(false);
  });

  it("roundtrips a valid snapshot", () => {
    const { state, snapshot } = baseSnapshot();
    const restored = restoreFabMatchSnapshot(
      snapshot,
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    );
    expect(serializeFabMatchSnapshot(restored)).toEqual(snapshot);
  });

  it("admits exact closed-chain facts and rejects malformed hit or defended-power maps", () => {
    const { state, snapshot } = baseSnapshot();
    const lastClosedCombat = {
      attackingPlayerId: "p1",
      defendingPlayerId: "p2",
      defendingInstanceIdsByTarget: { p2: ["defender-1"] },
      attackDidHitByInstanceId: { "attack-1": false },
      defendedAttackPowersByInstanceId: { "defender-1": [2, 4] },
    };
    const exact = { ...snapshot, lastClosedCombat };

    expect(isFabMatchSnapshotV21(exact)).toBe(true);
    if (!isFabMatchSnapshotV21(exact)) throw new Error("expected exact closed-chain snapshot");
    const restored = restoreFabMatchSnapshot(
      exact,
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    );
    expect(restored.lastClosedCombat).toEqual(lastClosedCombat);

    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        lastClosedCombat: {
          ...lastClosedCombat,
          attackDidHitByInstanceId: { "attack-1": "false" },
        },
      }),
    ).toBe(false);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        lastClosedCombat: {
          ...lastClosedCombat,
          defendedAttackPowersByInstanceId: { "defender-1": [2, -1] },
        },
      }),
    ).toBe(false);
  });

  it("admits exact target refs and rejects bare ids or dangling incarnations", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "snapshot-exact-targets",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { card1: "card" },
        owners: { p1: ["card1"], p2: [] },
      },
      cardDefinitions: { card: { canonicalId: "card", types: ["Action"] } },
    });
    const snapshot = serializeFabMatchSnapshot(state);
    const exact = {
      kind: "object",
      ref: { instanceId: "card1", incarnation: state.objects.card1!.incarnation },
    };

    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        rulesProcess: { ...minimalProcess(), effectTargets: { target: [exact] } },
      }),
    ).toBe(true);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        rulesProcess: { ...minimalProcess(), effectTargets: { target: ["card1"] } },
      }),
    ).toBe(false);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        rulesProcess: {
          ...minimalProcess(),
          effectTargets: {
            target: [{ ...exact, ref: { ...exact.ref, incarnation: 999 } }],
          },
        },
      }),
    ).toBe(false);
  });

  it("reports the failing invariant by name when admission refuses a snapshot", () => {
    const { snapshot } = baseSnapshot();
    expect(collectFabSnapshotValidationIssues(snapshot)).toEqual([]);
    expect(
      collectFabSnapshotValidationIssues({
        ...snapshot,
        schemaVersion: snapshot.schemaVersion + 1,
      }).map((issue) => issue.check),
    ).toEqual(["schemaVersion"]);
    const extraKey = collectFabSnapshotValidationIssues({ ...snapshot, rogueField: 1 }).map(
      (issue) => issue.check,
    );
    expect(extraKey).toEqual(["hasExactSnapshotKeys"]);
    const { state } = baseSnapshot();
    expect(() =>
      restoreFabMatchSnapshot(
        { ...snapshot, schemaVersion: snapshot.schemaVersion + 1 },
        createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
      ),
    ).toThrow(/schemaVersion/);
  });

  it.each([
    ["unknown decision", { kind: "future-decision" }],
    ["unknown continuation", { kind: "boolean", continuation: { kind: "future-continuation" } }],
    ["wrong decision version", { kind: "boolean", stateVersion: -1 }],
    ["unseated decision actor", { kind: "boolean", actorId: "spectator" }],
  ])("rejects %s", (_label, override) => {
    const { snapshot } = baseSnapshot();
    const process = minimalProcess();
    const decision: Record<string, unknown> = {
      decisionId: "decision-1",
      stateVersion: snapshot.stateID,
      actorId: "p1",
      label: "Continue?",
      kind: "boolean",
      acceptLabel: "Yes",
      declineLabel: "No",
      continuation: { kind: "replacement-player", processId: "process-1", playerId: "p1" },
    };
    Object.assign(decision, override);
    expect(isFabMatchSnapshotV21({ ...snapshot, rulesProcess: process, decision })).toBe(false);
  });

  it.each([
    ["process stage", { rulesProcess: { ...minimalProcess(), stage: "future-stage" } }],
    ["stack layer", { rulesStack: [{ kind: "future-layer" }] }],
    ["continuous origin", { continuousEffectInstances: [{ origin: "future-origin" }] }],
    [
      "continuous atom",
      { continuousEffectInstances: [{ origin: "static", atoms: [{ kind: "future-atom" }] }] },
    ],
  ])("rejects an unknown %s discriminant", (_label, patch) => {
    const { snapshot } = baseSnapshot();
    expect(isFabMatchSnapshotV21({ ...snapshot, ...patch })).toBe(false);
  });

  it("rejects stale object incarnations and mismatched process references", () => {
    const { snapshot } = baseSnapshot();
    const process = minimalProcess();
    const decision = {
      decisionId: "decision-1",
      stateVersion: snapshot.stateID,
      actorId: "p1",
      label: "Continue?",
      kind: "boolean",
      acceptLabel: "Yes",
      declineLabel: "No",
      continuation: { kind: "replacement-player", processId: "process-2", playerId: "p1" },
    };
    expect(isFabMatchSnapshotV21({ ...snapshot, rulesProcess: process, decision })).toBe(false);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        continuousOrderingDecisions: [
          {
            orderingId: "ordering-1",
            timestamp: { sequence: 1, simultaneousGroupId: null },
            subject: { kind: "object", ref: { instanceId: "gone", incarnation: 99 } },
            stage: 8,
            substage: null,
            orderedAtomIds: [],
            decidedByPlayerId: "p1",
          },
        ],
      }),
    ).toBe(false);
  });

  it("admits only object-stage continuous ordering", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "snapshot-object-continuous-ordering",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { source: "source-card" },
        owners: { p1: ["source"], p2: [] },
      },
      cardDefinitions: {
        "source-card": { canonicalId: "source-card", types: ["Action"] },
      },
    });
    const source = state.objects.source!;
    const snapshot = serializeFabMatchSnapshot(state);
    const ordering = {
      orderingId: "ordering-1",
      timestamp: { sequence: 1, simultaneousGroupId: "group-1" },
      subject: {
        kind: "object",
        ref: { instanceId: source.instanceId, incarnation: source.incarnation },
      },
      stage: 8,
      substage: 2,
      orderedAtomIds: ["set-five:atom", "set-seven:atom"],
      decidedByPlayerId: "p1",
    } as const;

    expect(isFabMatchSnapshotV21({ ...snapshot, continuousOrderingDecisions: [ordering] })).toBe(
      true,
    );
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        continuousOrderingDecisions: [{ ...ordering, stage: "rule", substage: null }],
      }),
    ).toBe(false);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        continuousOrderingDecisions: [
          { ...ordering, subject: { kind: "game" }, stage: 8, substage: 2 },
        ],
      }),
    ).toBe(false);
  });

  it("admits exact seated-player entity candidates and rejects foreign player ids", () => {
    const { snapshot } = baseSnapshot();
    const process = minimalProcess();
    const decision = {
      decisionId: "decision-1",
      stateVersion: snapshot.stateID,
      actorId: "p1",
      label: "Choose a hero",
      kind: "entity-target",
      min: 1,
      max: 1,
      candidates: [
        { instanceId: "p1", target: { kind: "player", playerId: "p1" }, label: "p1" },
        { instanceId: "p2", target: { kind: "player", playerId: "p2" }, label: "p2" },
      ],
      continuation: { kind: "replacement-player", processId: "process-1", playerId: "p1" },
    };
    expect(isFabMatchSnapshotV21({ ...snapshot, rulesProcess: process, decision })).toBe(true);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        rulesProcess: process,
        decision: {
          ...decision,
          candidates: [
            ...decision.candidates,
            {
              instanceId: "foreign-player",
              target: { kind: "player", playerId: "foreign-player" },
              label: "x",
            },
          ],
        },
      }),
    ).toBe(false);
  });

  it("rejects malformed group-choice decisions with unreachable private entries", () => {
    const { snapshot } = baseSnapshot();
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        rulesProcess: minimalProcess(),
        decision: {
          decisionId: "decision-1",
          stateVersion: snapshot.stateID,
          actorId: "p1",
          label: "Choose a same-name group",
          kind: "group-choice",
          entries: [{ id: "unreachable-private-card", label: "hidden" }],
          cohorts: [{ id: "cohort-0", label: "hidden", entryIds: ["unreachable-private-card"] }],
          continuation: {
            kind: "replacement-player",
            processId: "process-1",
            playerId: "p1",
          },
        },
      }),
    ).toBe(false);
  });
});
