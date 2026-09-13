import type { FabCardDefinitionInput } from "../cards.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { FabMatchRuntime } from "../runtime.ts";
import type { FabMatchState } from "../state.ts";
import type { ProposedEvent } from "./events.ts";
import { describe, expect, it } from "vitest";
import { executeFabEventTransaction } from "../kernel/transaction/index.ts";
import {
  finishDeferredFabRulesProcess,
  resumeFabContinuousOrdering,
  resumeFabContinuousReplacementOrdering,
  resumeFabReplacementFirstPlayer,
  resumeFabReplacementOrdering,
} from "../kernel/process-runner/index.ts";
import { nextFabDestinationRef, snapshotObject } from "./snapshots.ts";
import { buildFabDesiredRulesView, buildFabRulesView } from "./state-rules-view.ts";
import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../snapshot/match-context.ts";

const selfLeavingWatcher: FabCardDefinitionInput = {
  canonicalId: "self-leaving",
  name: "Self Leaving Watcher",
  types: ["Action", "Aura"],
  abilities: [
    {
      kind: "static",
      staticKind: "triggered",
      id: "self-leaving-a1",
      text: "When this leaves the arena, gain 1 life.",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            bindAs: "departed",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
      },
    },
  ],
};

describe("persisted FAB rules process", () => {
  it("persists CR 6.5.2 starting-player selection and gives each controller only their ordering", () => {
    const sourceDefinition: FabCardDefinitionInput = {
      canonicalId: "replacement-order-source",
      name: "Replacement Order Source",
      types: ["Action", "Aura"],
      abilities: [],
    };
    const state = FabTestEngine.createStateForRulesTest({
      seed: "replacement-controller-order",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: {
          p1source: sourceDefinition.canonicalId,
          p1source2: sourceDefinition.canonicalId,
          p2source: sourceDefinition.canonicalId,
        },
        owners: { p1: ["p1source", "p1source2"], p2: ["p2source"] },
      },
      cardDefinitions: { [sourceDefinition.canonicalId]: sourceDefinition },
    });
    state.containers.zonesByPlayerId.p1!.hand = [];
    state.containers.zonesByPlayerId.p1!.deck = [];
    state.containers.zonesByPlayerId.p1!.arena = ["p1source", "p1source2"];
    state.containers.zonesByPlayerId.p2!.hand = [];
    state.containers.zonesByPlayerId.p2!.deck = [];
    state.containers.zonesByPlayerId.p2!.arena = ["p2source"];
    const p1Source = snapshotObject(state, "p1source", "p1", "arena");
    const p1Source2 = snapshotObject(state, "p1source2", "p1", "arena");
    const p2Source = snapshotObject(state, "p2source", "p2", "arena");
    state.replacementEffects = [
      ["p2-put-bottom", "p2", p2Source],
      ["p1-put-bottom-one", "p1", p1Source],
      ["p1-put-bottom-two", "p1", p1Source2],
    ].map(([replacementId, controllerId, source]) => ({
      replacementId: replacementId as string,
      controllerId: controllerId as string,
      source: source as typeof p1Source,
      effect: {
        type: "replacement" as const,
        replacementKind: "standard" as const,
        replaces: {
          name: "move-zone" as const,
          to: "deck" as const,
          position: "top" as const,
        },
        modification: {
          type: "move-card" as const,
          target: { selector: "binding" as const, binding: "it" },
          to: { zone: "deck" as const, position: "bottom" as const },
        },
        duration: "this-turn" as const,
      },
      createdByEventId: null,
      expiresAt: { kind: "turn" as const, turnNumber: state.turnNumber },
      consumptionPolicy: { kind: "on-application" as const },
      applicationPolicy: { kind: "mandatory" as const },
    }));
    const options = {
      triggerContext: { evaluateStateCondition: () => true },
      legalTargets: () => [],
      evaluateAmount: (_state: Readonly<FabMatchState>, amount: unknown) =>
        typeof amount === "number" ? amount : null,
      randomIndex: () => 0,
    } as const;
    const suspended = executeFabEventTransaction(
      state,
      (processId): ProposedEvent[] => [
        {
          name: "move-zone",
          processId,
          cause: { kind: "rule", rule: "replacement-controller-order", controllerId: "p2" },
          controllerId: "p2",
          source: p2Source,
          affected: [p2Source],
          bindings: { it: p2Source },
          data: {
            object: p2Source,
            destinationRef: nextFabDestinationRef(state, p2Source),
            from: "arena",
            to: "deck",
            position: "top",
            reason: "rule",
          },
        },
      ],
      options,
    ).state;

    expect(suspended.decision).toMatchObject({
      actorId: "p1",
      kind: "option",
      min: 1,
      max: 1,
      options: [{ id: "p2" }, { id: "p1" }],
      continuation: { kind: "replacement-first-player" },
    });
    const firstDecision = suspended.decision;
    if (!firstDecision || firstDecision.continuation.kind !== "replacement-first-player") {
      throw new Error("expected persisted replacement starting-player decision");
    }
    const restore = (input: FabMatchState) =>
      restoreFabMatchSnapshot(
        serializeFabMatchSnapshot(input),
        createFabMatchContext(input.cardDefinitions, input.publicCardIdentities),
      );
    const ordered = resumeFabReplacementFirstPlayer(
      restore(suspended),
      firstDecision.continuation,
      { kind: "option", optionIds: ["p2"] },
      options,
    );
    expect(ordered.decision).toMatchObject({
      actorId: "p1",
      kind: "ordering",
      entries: [{ id: "p1-put-bottom-one" }, { id: "p1-put-bottom-two" }],
      continuation: {
        kind: "replacement-order",
        controllerId: "p1",
        replacementKind: "standard",
      },
    });
    const orderDecision = ordered.decision;
    if (!orderDecision || orderDecision.continuation.kind !== "replacement-order") {
      throw new Error("expected controller-owned replacement ordering decision");
    }
    const answer = {
      kind: "ordering" as const,
      orderedIds: ["p1-put-bottom-two", "p1-put-bottom-one"],
    };
    const resumed = resumeFabReplacementOrdering(
      restore(ordered),
      orderDecision.continuation,
      answer,
      options,
    );
    const restored = resumeFabReplacementOrdering(
      restore(ordered),
      orderDecision.continuation,
      answer,
      options,
    );

    expect(restored).toEqual(resumed);
    expect(resumed.containers.zonesByPlayerId.p2!.deck).toEqual(["p2source"]);
    expect(resumed.replacementEffects.map((replacement) => replacement.replacementId)).toEqual([
      "p1-put-bottom-one",
      "p1-put-bottom-two",
    ]);
  });

  it("does not apply a newly granted static effect in an earlier stage until the next process", () => {
    const nestedStaticAbility = {
      id: "newly-functional-name-effect",
      kind: "static" as const,
      staticKind: "continuous" as const,
      text: "This is named Evaluated Later and has +2 power.",
      effect: {
        type: "sequence" as const,
        steps: [
          {
            type: "grant-property" as const,
            property: { kind: "name" as const, value: "Evaluated Later" },
            target: { selector: "self" as const },
            duration: "this-turn" as const,
          },
          {
            type: "modify-numeric" as const,
            property: "power" as const,
            op: "add" as const,
            amount: 2,
            target: { selector: "self" as const },
            duration: "this-turn" as const,
          },
        ],
      },
    };
    const source: FabCardDefinitionInput = {
      canonicalId: "stage-cursor-source",
      name: "Base Name",
      types: ["Action", "Aura"],
      power: 1,
      abilities: [
        {
          id: "grant-static-ability",
          kind: "static",
          staticKind: "continuous",
          text: "This has a static name-changing ability.",
          effect: {
            type: "grant-property",
            property: { kind: "ability", ability: nestedStaticAbility },
            target: { selector: "self" },
            duration: "this-turn",
          },
        },
      ],
    };
    const state = FabTestEngine.createStateForRulesTest({
      seed: "stage-cursor",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { source1: source.canonicalId },
        owners: { p1: ["source1"], p2: [] },
      },
      cardDefinitions: { [source.canonicalId]: source },
    });
    state.containers.zonesByPlayerId["p1"]!.hand = [];
    state.containers.zonesByPlayerId["p1"]!.arena = ["source1"];
    const sourceSnapshot = snapshotObject(state, "source1", "p1", "arena");
    const options = {
      triggerContext: { evaluateStateCondition: () => true },
      legalTargets: () => [],
      evaluateAmount: (_state: Readonly<FabMatchState>, amount: unknown) =>
        typeof amount === "number" ? amount : null,
      randomIndex: () => 0,
    } as const;
    const transact = (input: FabMatchState) =>
      executeFabEventTransaction(
        input,
        (processId) => [
          {
            name: "gain-assets",
            processId,
            cause: { kind: "rule", rule: "stage-cursor-test", controllerId: "p1" },
            controllerId: "p1",
            source: sourceSnapshot,
            affected: [],
            bindings: {},
            data: {
              playerId: "p1",
              resources: 0,
              chi: 0,
              actionPoints: 1,
              amp: 0,
              origin: "procedure" as const,
            },
          },
        ],
        options,
      ).state;

    const first = transact(state);
    const ref = {
      instanceId: first.objects.source1!.instanceId,
      incarnation: first.objects.source1!.incarnation,
    };
    const nested = first.continuousEffectInstances.find(
      (instance) => instance.origin === "static" && instance.abilityId === nestedStaticAbility.id,
    );

    expect(nested).toMatchObject({
      introducedDuringProcessId: "process-1",
      introducedAtStage: 6,
    });
    expect(buildFabRulesView(first).object(ref)?.current.names[0]).toBe("Base Name");
    expect(buildFabRulesView(first).object(ref)?.current.numeric.power).toBe(3);
    expect(nested?.applications).toHaveLength(1);

    const second = transact(structuredClone(first));

    expect(buildFabRulesView(second).object(ref)?.current.names).toEqual(
      expect.arrayContaining(["Base Name", "Evaluated Later"]),
    );
    expect(
      second.continuousEffectInstances.find(
        (instance) => instance.origin === "static" && instance.abilityId === nestedStaticAbility.id,
      )?.applications,
    ).toHaveLength(2);
  });

  it("persists and restores turn-player ordering for simultaneous static effects", () => {
    const source: FabCardDefinitionInput = {
      canonicalId: "simultaneous-source",
      name: "Simultaneous Source",
      types: ["Action", "Aura"],
      power: 1,
      abilities: [5, 7].map((power) => ({
        id: `set-${power}`,
        kind: "static" as const,
        staticKind: "continuous" as const,
        text: `This has ${power} power.`,
        effect: {
          type: "modify-numeric" as const,
          property: "power" as const,
          op: "set" as const,
          amount: power,
          target: { selector: "self" as const },
          duration: "this-turn" as const,
        },
      })),
    };
    const state = FabTestEngine.createStateForRulesTest({
      seed: "continuous-ordering",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { source1: source.canonicalId },
        owners: { p1: ["source1"], p2: [] },
      },
      cardDefinitions: { [source.canonicalId]: source },
    });
    state.containers.zonesByPlayerId["p1"]!.hand = [];
    state.containers.zonesByPlayerId["p1"]!.arena = ["source1"];
    const sourceSnapshot = snapshotObject(state, "source1", "p1", "arena");
    const options = {
      triggerContext: { evaluateStateCondition: () => true },
      legalTargets: () => [],
      evaluateAmount: (_state: Readonly<FabMatchState>, amount: unknown) =>
        typeof amount === "number" ? amount : null,
      randomIndex: () => 0,
    } as const;
    const suspended = executeFabEventTransaction(
      state,
      (processId) => [
        {
          name: "gain-assets",
          processId,
          cause: { kind: "rule", rule: "ordering-test", controllerId: "p1" },
          controllerId: "p1",
          source: sourceSnapshot,
          affected: [],
          bindings: {},
          data: {
            playerId: "p1",
            resources: 0,
            chi: 0,
            actionPoints: 1,
            amp: 0,
            origin: "procedure" as const,
          },
        },
      ],
      options,
    ).state;

    expect(suspended.decision).toMatchObject({
      kind: "ordering",
      actorId: "p1",
      continuation: { kind: "continuous-order" },
    });
    const decision = suspended.decision;
    if (
      !decision ||
      decision.kind !== "ordering" ||
      decision.continuation.kind !== "continuous-order"
    ) {
      throw new Error("expected continuous ordering decision");
    }
    const orderedIds = decision.entries.map((entry) => entry.id).reverse();
    const first = resumeFabContinuousOrdering(
      structuredClone(suspended),
      decision.continuation,
      { kind: "ordering", orderedIds },
      options,
    );
    const restored = resumeFabContinuousOrdering(
      structuredClone(suspended),
      decision.continuation,
      { kind: "ordering", orderedIds },
      options,
    );

    expect(restored).toEqual(first);
    expect(first.continuousOrderingDecisions).toHaveLength(1);
    const object = first.objects.source1!;
    expect(
      buildFabRulesView(first).object({
        instanceId: object.instanceId,
        incarnation: object.incarnation,
      })?.current.numeric.power,
    ).toBe(5);
  });

  it("persists affected-player ordering for continuous application replacements", () => {
    const source: FabCardDefinitionInput = {
      canonicalId: "replaceable-source",
      name: "Replaceable Source",
      types: ["Action", "Aura"],
      power: 1,
      abilities: [
        {
          id: "add-two",
          kind: "static",
          staticKind: "continuous",
          text: "This has +2 power.",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: { selector: "self" },
            duration: "this-turn",
          },
        },
      ],
    };
    const state = FabTestEngine.createStateForRulesTest({
      seed: "continuous-replacement-ordering",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { source1: source.canonicalId },
        owners: { p1: ["source1"], p2: [] },
      },
      cardDefinitions: { [source.canonicalId]: source },
    });
    state.containers.zonesByPlayerId["p1"]!.hand = [];
    state.containers.zonesByPlayerId["p1"]!.arena = ["source1"];
    const sourceSnapshot = snapshotObject(state, "source1", "p1", "arena");
    state.replacementEffects = [
      { replacementId: "multiply-application", op: "multiply" as const, amount: 2 },
      { replacementId: "add-application", op: "add" as const, amount: 1 },
    ].map(({ replacementId, op, amount }) => ({
      replacementId,
      controllerId: "p1",
      source: sourceSnapshot,
      effect: {
        type: "replacement" as const,
        replacementKind: "standard" as const,
        replaces: { name: "continuous-effect-applied" as const, subject: "any" as const },
        modification: {
          type: "modify-numeric" as const,
          property: "count" as const,
          op,
          amount,
          target: { selector: "self" as const },
          duration: "permanent" as const,
        },
        duration: "this-turn" as const,
      },
      createdByEventId: null,
      expiresAt: { kind: "turn" as const, turnNumber: 1 },
      consumptionPolicy: { kind: "never" },
      applicationPolicy: { kind: "mandatory" as const },
    }));
    const options = {
      triggerContext: { evaluateStateCondition: () => true },
      legalTargets: () => [],
      evaluateAmount: (_state: Readonly<FabMatchState>, amount: unknown) =>
        typeof amount === "number" ? amount : null,
      randomIndex: () => 0,
    } as const;
    const suspended = executeFabEventTransaction(
      state,
      (processId) => [
        {
          name: "gain-assets",
          processId,
          cause: { kind: "rule", rule: "continuous-replacement-test", controllerId: "p1" },
          controllerId: "p1",
          source: sourceSnapshot,
          affected: [],
          bindings: {},
          data: {
            playerId: "p1",
            resources: 0,
            chi: 0,
            actionPoints: 1,
            amp: 0,
            origin: "procedure" as const,
          },
        },
      ],
      options,
    ).state;

    expect(suspended.decision).toMatchObject({
      actorId: "p1",
      kind: "ordering",
      continuation: { kind: "continuous-replacement-order" },
    });
    const decision = suspended.decision;
    if (
      !decision ||
      decision.kind !== "ordering" ||
      decision.continuation.kind !== "continuous-replacement-order"
    )
      throw new Error("expected continuous replacement ordering decision");
    const continuation = decision.continuation;
    const resume = (input: FabMatchState) => {
      const restored = structuredClone(input);
      restored.stateID += 1;
      restored.decision = null;
      return resumeFabContinuousReplacementOrdering(
        restored,
        continuation,
        { kind: "ordering", orderedIds: ["multiply-application", "add-application"] },
        options,
      );
    };
    const resumed = resume(suspended);

    expect(resume(suspended)).toEqual(resumed);
    const object = resumed.objects.source1!;
    expect(
      buildFabRulesView(resumed).object({
        instanceId: object.instanceId,
        incarnation: object.incarnation,
      })?.current.numeric.power,
    ).toBe(7);
    expect(resumed.continuousEffectInstances[0]?.applications[0]?.contribution).toMatchObject({
      kind: "numeric",
      previousValue: 1,
      value: 7,
      delta: 6,
    });

    // Schema-v3 snapshots retain only the continuation's active batch. A
    // runtime restored at this point must take the exact same ordering answer
    // and settle to the same bounded continuous fact, without completed state
    // history leaking back into the snapshot.
    const restoredRuntime = new FabMatchRuntime(structuredClone(suspended));
    const restoredDecision = restoredRuntime.getState().decision;
    expect(restoredRuntime.getState()).not.toHaveProperty("committedEvents");
    expect(restoredRuntime.getState()).not.toHaveProperty("log");
    expect(restoredDecision).toMatchObject({
      kind: "ordering",
      continuation: { kind: "continuous-replacement-order" },
    });
    if (!restoredDecision || restoredDecision.kind !== "ordering") {
      throw new Error("Expected restored continuous replacement ordering decision.");
    }
    const restoredResult = dispatchTestCommand(restoredRuntime, "answer-decision", "p1", {
      decisionId: restoredDecision.decisionId,
      stateVersion: restoredDecision.stateVersion,
      answer: { kind: "ordering", orderedIds: ["multiply-application", "add-application"] },
    });
    expect(restoredResult).toMatchObject({ accepted: true });
    const restoredObject = restoredRuntime.getState().objects.source1!;
    expect(
      buildFabRulesView(restoredRuntime.getState()).object({
        instanceId: restoredObject.instanceId,
        incarnation: restoredObject.incarnation,
      })?.current.numeric.power,
    ).toBe(7);
    expect(restoredRuntime.getState().rulesProcess).toBeNull();
  });

  it("cancels a continuous application without committing or repeatedly proposing it", () => {
    const source: FabCardDefinitionInput = {
      canonicalId: "cancelled-continuous-source",
      name: "Cancelled Continuous Source",
      types: ["Action", "Aura"],
      power: 1,
      abilities: [
        {
          id: "add-two",
          kind: "static",
          staticKind: "continuous",
          text: "This has +2 power.",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: { selector: "self" },
            duration: "this-turn",
          },
        },
      ],
    };
    const state = FabTestEngine.createStateForRulesTest({
      seed: "continuous-application-cancellation",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { source1: source.canonicalId },
        owners: { p1: ["source1"], p2: [] },
      },
      cardDefinitions: { [source.canonicalId]: source },
    });
    state.containers.zonesByPlayerId["p1"]!.hand = [];
    state.containers.zonesByPlayerId["p1"]!.arena = ["source1"];
    const sourceSnapshot = snapshotObject(state, "source1", "p1", "arena");
    state.replacementEffects = [
      {
        replacementId: "cancel-application",
        controllerId: "p1",
        source: sourceSnapshot,
        effect: {
          type: "replacement",
          replacementKind: "standard",
          replaces: { name: "continuous-effect-applied", subject: "any" },
          modification: { type: "cancel-event" },
          duration: "this-turn",
        },
        createdByEventId: null,
        expiresAt: { kind: "turn", turnNumber: 1 },
        consumptionPolicy: { kind: "never" },
        applicationPolicy: { kind: "mandatory" },
      },
    ];
    const options = {
      triggerContext: { evaluateStateCondition: () => true },
      legalTargets: () => [],
      evaluateAmount: (_state: Readonly<FabMatchState>, amount: unknown) =>
        typeof amount === "number" ? amount : null,
      randomIndex: () => 0,
    } as const;
    const transact = (input: FabMatchState) =>
      executeFabEventTransaction(
        input,
        (processId) => [
          {
            name: "gain-assets",
            processId,
            cause: { kind: "rule", rule: "cancellation-test", controllerId: "p1" },
            controllerId: "p1",
            source: sourceSnapshot,
            affected: [],
            bindings: {},
            data: {
              playerId: "p1",
              resources: 0,
              chi: 0,
              actionPoints: 1,
              amp: 0,
              origin: "procedure" as const,
            },
          },
        ],
        options,
      ).state;

    const first = transact(state);
    const restored = transact(structuredClone(first));
    const ref = {
      instanceId: first.objects.source1!.instanceId,
      incarnation: first.objects.source1!.incarnation,
    };

    expect(first.continuousEffectInstances[0]?.applications).toEqual([]);
    expect(first).not.toHaveProperty("committedEvents");
    expect(buildFabRulesView(first).object(ref)?.current.numeric.power).toBe(1);
    expect(buildFabDesiredRulesView(first).object(ref)?.current.numeric.power).toBe(3);
    expect(restored.continuousEffectInstances[0]?.applications).toEqual([]);
    expect(buildFabRulesView(restored).object(ref)?.current.numeric.power).toBe(1);
  });

  it("keeps the last accepted contribution when a changed application is canceled", () => {
    const source: FabCardDefinitionInput = {
      canonicalId: "change-cancellation-source",
      name: "Change Cancellation Source",
      types: ["Action", "Aura"],
      power: 1,
      abilities: [
        {
          id: "power-per-steam",
          kind: "static",
          staticKind: "continuous",
          text: "This has +1 power for each steam counter on it.",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: {
              type: "count",
              what: "counters-on-source",
              counter: { kind: "named", name: "steam" },
            },
            target: { selector: "self" },
            duration: "this-turn",
          },
        },
      ],
    };
    const state = FabTestEngine.createStateForRulesTest({
      seed: "continuous-change-cancellation",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { source1: source.canonicalId },
        owners: { p1: ["source1"], p2: [] },
      },
      cardDefinitions: { [source.canonicalId]: source },
    });
    state.containers.zonesByPlayerId["p1"]!.hand = [];
    state.containers.zonesByPlayerId["p1"]!.arena = ["source1"];
    const sourceSnapshot = snapshotObject(state, "source1", "p1", "arena");
    const options = {
      triggerContext: { evaluateStateCondition: () => true },
      legalTargets: () => [],
      evaluateAmount: (_state: Readonly<FabMatchState>, amount: unknown) =>
        typeof amount === "number" ? amount : null,
      randomIndex: () => 0,
    } as const;
    const transact = (input: FabMatchState) =>
      executeFabEventTransaction(
        input,
        (processId) => [
          {
            name: "gain-assets",
            processId,
            cause: { kind: "rule", rule: "changed-cancellation-test", controllerId: "p1" },
            controllerId: "p1",
            source: sourceSnapshot,
            affected: [],
            bindings: {},
            data: {
              playerId: "p1",
              resources: 0,
              chi: 0,
              actionPoints: 1,
              amp: 0,
              origin: "procedure" as const,
            },
          },
        ],
        options,
      ).state;
    const initiallyAccepted = transact(state);
    initiallyAccepted.objects.source1 = {
      ...initiallyAccepted.objects.source1!,
      counters: [{ kind: "named", name: "steam", count: 1 }],
    };
    initiallyAccepted.replacementEffects = [
      {
        replacementId: "cancel-application-change",
        controllerId: "p1",
        source: snapshotObject(initiallyAccepted, "source1", "p1", "arena"),
        effect: {
          type: "replacement",
          replacementKind: "standard",
          replaces: { name: "continuous-effect-changed", subject: "any" },
          modification: { type: "cancel-event" },
          duration: "this-turn",
        },
        createdByEventId: null,
        expiresAt: { kind: "turn", turnNumber: 1 },
        consumptionPolicy: { kind: "never" },
        applicationPolicy: { kind: "mandatory" },
      },
    ];

    const canceled = transact(initiallyAccepted);
    const ref = {
      instanceId: canceled.objects.source1!.instanceId,
      incarnation: canceled.objects.source1!.incarnation,
    };
    expect(canceled.continuousEffectInstances[0]?.applications[0]?.contribution).toMatchObject({
      kind: "numeric",
      value: 1,
      delta: 0,
    });
    expect(canceled).not.toHaveProperty("committedEvents");
    expect(buildFabRulesView(canceled).object(ref)?.current.numeric.power).toBe(1);
    expect(buildFabDesiredRulesView(canceled).object(ref)?.current.numeric.power).toBe(2);
  });

  it("applies a self enter-arena replacement from the affected object's boundary snapshot", () => {
    const item: FabCardDefinitionInput = {
      canonicalId: "steam-item",
      name: "Steam Item",
      types: ["Mechanologist", "Action", "Item"],
      abilities: [
        {
          id: "steam-item-a1",
          kind: "static",
          staticKind: "continuous",
          text: "This enters the arena with 2 steam counters.",
          effect: {
            type: "replacement",
            replacementKind: "standard",
            replaces: { name: "enter-arena", subject: "self" },
            modification: {
              type: "add-counter",
              counter: { kind: "named", name: "steam" },
              count: 2,
              target: { selector: "self" },
            },
            duration: "while-in-arena",
          },
        },
      ],
    };
    const state = FabTestEngine.createStateForRulesTest({
      seed: "enter-replacement",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { item1: item.canonicalId },
        owners: { p1: ["item1"], p2: [] },
      },
      cardDefinitions: { [item.canonicalId]: item },
    });
    state.containers.zonesByPlayerId["p1"]!.hand = [];
    state.containers.zonesByPlayerId["p1"]!.deck = [];
    state.containers.zonesByPlayerId["p1"]!.stack = ["item1"];
    const object = snapshotObject(state, "item1", "p1", "stack");
    const result = executeFabEventTransaction(
      state,
      (processId) => [
        {
          name: "enter-arena",
          processId,
          cause: { kind: "rule", rule: "resolve-permanent", controllerId: "p1" },
          controllerId: "p1",
          source: object,
          affected: [object],
          bindings: {},
          data: {
            object,
            destinationRef: null,
            from: "stack",
            to: "permanent",
            reason: "resolve",
          },
        },
      ],
      {
        triggerContext: { evaluateStateCondition: () => true },
        legalTargets: () => [],
        evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
        randomIndex: () => 0,
      },
    );

    expect(result.state.containers.zonesByPlayerId["p1"]!.arena).toEqual(["item1"]);
    expect(result.state.objects.item1?.counters).toContainEqual({
      kind: "named",
      name: "steam",
      count: 2,
    });
    expect(result.batch?.events.map((event) => event.name)).toEqual([
      "counter-added",
      "enter-arena",
    ]);
    expect(
      result.batch?.events.every((event) => event.replacementIds.includes("item1:steam-item-a1")),
    ).toBe(true);
  });

  it("snapshots an arena prevention source and applies it without consuming the static ability", () => {
    const ward: FabCardDefinitionInput = {
      canonicalId: "ward-aura",
      name: "Ward Aura",
      types: ["Generic", "Token", "Aura"],
      abilities: [
        {
          id: "ward-aura-a1",
          kind: "static",
          staticKind: "continuous",
          text: "If you would be dealt damage, prevent 1 of that damage.",
          effect: {
            type: "prevention",
            preventionKind: "fixed",
            amount: 1,
            shielded: { selector: "controller" },
            duration: "while-condition",
          },
        },
      ],
    };
    const state = FabTestEngine.createStateForRulesTest({
      seed: "static-prevention",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { ward1: ward.canonicalId },
        owners: { p1: ["ward1"], p2: [] },
      },
      cardDefinitions: { [ward.canonicalId]: ward },
    });
    state.containers.zonesByPlayerId["p1"]!.hand = [];
    state.containers.zonesByPlayerId["p1"]!.deck = [];
    state.containers.zonesByPlayerId["p1"]!.arena = ["ward1"];
    const source = snapshotObject(state, "ward1", "p1", "arena");
    const before = state.players.p1!.life;
    const result = executeFabEventTransaction(
      state,
      (processId) => [
        {
          name: "deal-damage",
          processId,
          cause: { kind: "rule", rule: "static-prevention-test", controllerId: "p2" },
          controllerId: "p2",
          source,
          affected: [],
          bindings: {},
          data: {
            source,
            target: { kind: "hero", playerId: "p1" },
            amount: 3,
            damageType: "physical",
          },
        },
      ],
      {
        triggerContext: { evaluateStateCondition: () => true },
        legalTargets: () => [],
        evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
        randomIndex: () => 0,
      },
    );

    expect(result.state.players.p1!.life).toBe(before - 2);
    expect(result.state.replacementEffects).toEqual([]);
    expect(result.batch?.events.map((event) => event.name)).toEqual([
      "prevent",
      "deal-damage",
      "dealt-damage",
    ]);
    expect(result.batch?.events[0]?.replacementIds).toContain("ward1:ward-aura-a1");

    const fullyPrevented = executeFabEventTransaction(
      result.state,
      (processId) => [
        {
          name: "deal-damage",
          processId,
          cause: { kind: "rule", rule: "static-full-prevention-test", controllerId: "p2" },
          controllerId: "p2",
          source,
          affected: [],
          bindings: {},
          data: {
            source,
            target: { kind: "hero", playerId: "p1" },
            amount: 1,
            damageType: "physical",
          },
        },
      ],
      {
        triggerContext: { evaluateStateCondition: () => true },
        legalTargets: () => [],
        evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
        randomIndex: () => 0,
      },
    );
    expect(fullyPrevented.state.players.p1!.life).toBe(before - 2);
    expect(fullyPrevented.batch?.events.map((event) => event.name)).toEqual(["prevent"]);
  });

  it("snapshots a self-leaving trigger before commit and pauses at layer declaration", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "self-leaving",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { watcher1: "self-leaving" },
        owners: { p1: ["watcher1"], p2: [] },
      },
      cardDefinitions: { "self-leaving": selfLeavingWatcher },
    });
    state.containers.zonesByPlayerId["p1"]!.hand = [];
    state.containers.zonesByPlayerId["p1"]!.arena = ["watcher1"];
    const object = snapshotObject(state, "watcher1", "p1", "arena");

    const result = executeFabEventTransaction(
      state,
      (processId) => [
        {
          name: "destroy",
          processId,
          cause: { kind: "rule", rule: "process-test", controllerId: "p1" },
          controllerId: "p1",
          source: object,
          affected: [object],
          bindings: {},
          data: {
            object,
            destinationRef: nextFabDestinationRef(state, object),
            from: "arena",
            to: "graveyard",
            reason: "destroy",
          },
        },
      ],
      {
        triggerContext: { evaluateStateCondition: () => true },
        legalTargets: () => [],
        evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
        randomIndex: () => 0,
      },
    );

    expect(result.state.containers.zonesByPlayerId["p1"]!.arena).toEqual([]);
    expect(result.state.containers.zonesByPlayerId["p1"]!.graveyard).toEqual(["watcher1"]);
    expect(result.state.rulesProcess).toBeNull();
    expect(result.state.rulesStack[0]).toMatchObject({
      kind: "triggered",
      abilityId: "self-leaving-a1",
      source: { instanceId: "watcher1", zone: "permanent" },
      triggeringEvent: { name: "leave-arena", eventId: "event-2" },
    });
  });

  it("settles back to priority when no triggers are pending", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "settled",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    const result = executeFabEventTransaction(state, () => [], {
      triggerContext: { evaluateStateCondition: () => true },
      legalTargets: () => [],
      evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
      randomIndex: () => 0,
    });
    expect(result.batch).toBeNull();
    expect(result.state.rulesProcess).toBeNull();
  });

  it("collects sequential event groups in one enclosing process and declares them in order", () => {
    let state = FabTestEngine.createStateForRulesTest({
      seed: "deferred-groups",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { watcher1: "watcher", pitch1: "pitch", pitch2: "pitch" },
        owners: { p1: ["watcher1", "pitch1", "pitch2"], p2: [] },
      },
      cardDefinitions: {
        watcher: {
          canonicalId: "watcher",
          name: "Watcher",
          types: ["Action", "Aura"],
          abilities: [
            {
              kind: "static",
              staticKind: "triggered",
              id: "watcher-a1",
              text: "Whenever you pitch, gain 1 life.",
              trigger: {
                kind: "event",
                event: {
                  name: "pitch",
                  actor: {
                    kind: "player",
                    player: "ability-controller",
                  },
                  observes: {
                    kind: "none",
                  },
                },
              },
              resolution: {
                kind: "effect",
                effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
              },
            },
          ],
        },
        pitch: { canonicalId: "pitch", name: "Pitch", types: ["Action"], pitch: 3 },
      },
    });
    state.containers.zonesByPlayerId["p1"]!.arena = ["watcher1"];
    state.containers.zonesByPlayerId["p1"]!.hand = ["pitch1", "pitch2"];
    const options = {
      triggerContext: { evaluateStateCondition: () => true },
      legalTargets: () => [],
      evaluateAmount: (_state: Readonly<FabMatchState>, amount: unknown) =>
        typeof amount === "number" ? amount : null,
      randomIndex: () => 0,
      deferTriggerDeclaration: true,
    } as const;
    for (const cardId of ["pitch1", "pitch2"]) {
      const object = snapshotObject(state, cardId, "p1", "hand");
      state = executeFabEventTransaction(
        state,
        (processId) => [
          {
            name: "pitch",
            processId,
            cause: { kind: "player-command", actorId: "p1", command: "pitch" },
            controllerId: "p1",
            source: object,
            affected: [object],
            bindings: {},
            data: {
              playerId: "p1",
              object,
              destinationRef: nextFabDestinationRef(state, object),
              resourcesGenerated: 3,
            },
          },
        ],
        options,
      ).state;
    }

    expect(
      state.rulesProcess?.pendingTriggers.map((pending) => pending.simultaneousGroupId),
    ).toEqual(["batch-1", "batch-2"]);
    finishDeferredFabRulesProcess(state, options);
    expect(state.decision).toBeNull();
    expect(state.rulesStack).toHaveLength(2);
    expect(
      state.rulesStack.map((layer) => layer.kind === "triggered" && layer.triggeringEvent?.batchId),
    ).toEqual(["batch-1", "batch-2"]);
  });
});
import { dispatchTestCommand } from "../testing/test-command.ts";
