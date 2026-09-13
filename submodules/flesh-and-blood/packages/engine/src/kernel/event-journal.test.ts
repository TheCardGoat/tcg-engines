import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { registerFabCardDefinition, toFabCardDefinition } from "../cards.ts";
import {
  appendFabEventGroup,
  createPlayProcedure,
  reduceFabEventJournal,
} from "./event-journal.ts";
import type { FabRulesProcess } from "../rules/process.ts";
import { executeFabEventJournalTransaction } from "./transaction/index.ts";
import {
  resumeFabContinuousOrdering,
  resumeFabJournalReplacementOrdering,
  type FabEventTransactionOptions,
} from "./process-runner/index.ts";
import { nextFabDestinationRef, snapshotObject } from "../rules/snapshots.ts";
import { buildFabRulesView } from "../rules/state-rules-view.ts";

function setup(resourceCost = 2) {
  const state = FabTestEngine.createStateForRulesTest({
    seed: "play-journal",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: {
      canonicalIdsByInstance: { play1: "play", pitch1: "pitch", watcher1: "watcher" },
      owners: { p1: ["play1", "pitch1", "watcher1"], p2: [] },
    },
    cardDefinitions: {
      play: { canonicalId: "play", name: "Play Card", types: ["Action"], cost: resourceCost },
      pitch: { canonicalId: "pitch", name: "Pitch Card", types: ["Action"], pitch: 3 },
      watcher: {
        canonicalId: "watcher",
        name: "Pitch Watcher",
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
    },
  });
  state.containers.zonesByPlayerId["p1"]!.hand = ["play1", "pitch1"];
  state.containers.zonesByPlayerId["p1"]!.arena = ["watcher1"];
  const object = snapshotObject(state, "play1", "p1", "hand");
  const pitched = snapshotObject(state, "pitch1", "p1", "hand");
  const process: FabRulesProcess = {
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
    procedure: createPlayProcedure({
      kind: "play-card",
      actorId: "p1",
      object,
      from: "hand",
      playPermissionId: "base",
      stage: "announce",
      declaredModes: [],
      modesDeclared: false,
      declaredTargets: {},
      attackTarget: null,
      pitchedInstanceIds: ["pitch1"],
      effectCostPaid: false,
      resourceCost,
      actionPointCost: 1,
      playTiming: "action",
      boost: false,
      scrap: false,
      scrapInstanceId: null,
      beatChest: false,
      beatChestInstanceId: null,
      crank: true,
      splitPlayMethod: null,
      fuseInstanceIds: [],
      chargeInstanceId: null,
      banishCostInstanceId: null,
    }),
  };
  appendFabEventGroup(process, [
    {
      name: "announce-card",
      processId: process.processId,
      cause: { kind: "player-command", actorId: "p1", command: "begin-play" },
      controllerId: "p1",
      source: object,
      affected: [object],
      bindings: {},
      data: {
        actorId: "p1",
        object,
        from: "hand",
        destinationRef: null,
        splitPlayMethod: null,
      },
    },
  ]);
  appendFabEventGroup(process, [
    {
      name: "pitch",
      processId: process.processId,
      cause: { kind: "player-command", actorId: "p1", command: "payment-pitch" },
      controllerId: "p1",
      source: pitched,
      affected: [pitched],
      bindings: { pitchedCard: pitched },
      data: {
        playerId: "p1",
        object: pitched,
        destinationRef: nextFabDestinationRef(state, pitched),
        resourcesGenerated: 3,
      },
    },
  ]);
  appendFabEventGroup(process, [
    {
      name: "spend-assets",
      processId: process.processId,
      cause: { kind: "player-command", actorId: "p1", command: "play" },
      controllerId: "p1",
      source: object,
      affected: [],
      bindings: {},
      data: { playerId: "p1", chi: 0, resources: resourceCost, life: 0, actionPoints: 1 },
    },
  ]);
  appendFabEventGroup(process, [
    {
      name: "play",
      processId: process.processId,
      cause: { kind: "player-command", actorId: "p1", command: "play" },
      controllerId: "p1",
      source: object,
      affected: [object],
      bindings: {},
      data: {
        actorId: "p1",
        object,
        destinationRef: null,
        from: "hand",
        role: "action",
        playTiming: "action",
        modes: [],
        targets: {},
        attackTarget: null,
        splitPlayMethod: null,
      },
    },
  ]);
  return { state, process };
}

describe("FAB enclosing procedure event journal", () => {
  it("publishes announce, one-at-a-time pitch, asset payment, and play atomically", () => {
    const { state, process } = setup();
    const result = reduceFabEventJournal(state, process.procedure!.eventGroups);
    expect(result.committed).toBe(true);
    if (!result.committed) return;
    expect(result.state.players.p1).toMatchObject({ resourcePoints: 1, actionPoints: 0 });
    expect(result.state.containers.zonesByPlayerId["p1"]!).toMatchObject({
      hand: [],
      pitch: ["pitch1"],
      stack: ["play1"],
    });
    expect(result.batches.map((batch) => batch.events.map((event) => event.name))).toEqual([
      ["announce-card"],
      ["pitch"],
      ["spend-assets"],
      ["play"],
    ]);
    expect(result.batches.flatMap((batch) => batch.events).map((event) => event.eventId)).toEqual([
      "event-1",
      "event-2",
      "event-3",
      "event-4",
    ]);
  });

  it("discards the entire journal when a required payment event cannot occur", () => {
    const { state, process } = setup(4);
    const receipts: string[] = [];
    const result = reduceFabEventJournal(state, process.procedure!.eventGroups, {
      onCommittedEvents: (events) => receipts.push(...events.map((event) => event.name)),
    });
    expect(result).toMatchObject({
      committed: false,
      failedEventGroupId: "process-1:group-3",
    });
    expect(result.state).toEqual(state);
    expect(state.containers.zonesByPlayerId["p1"]!.hand).toEqual(["play1", "pitch1"]);
    expect(state).not.toHaveProperty("committedEvents");
    expect(receipts).toEqual([]);
  });

  it("publishes journal receipts only after every required group commits", () => {
    const { state, process } = setup();
    const receipts: string[] = [];
    const result = reduceFabEventJournal(state, process.procedure!.eventGroups, {
      onCommittedEvents: (events) => receipts.push(...events.map((event) => event.name)),
    });
    expect(result.committed).toBe(true);
    expect(receipts).toEqual(["announce-card", "pitch", "spend-assets", "play"]);
  });

  it("collects triggers at each journal boundary and adds them above the played card layer", () => {
    const { state, process } = setup();
    state.rulesProcess = process;
    const result = executeFabEventJournalTransaction(state, process.procedure!.eventGroups, {
      triggerContext: { evaluateStateCondition: () => true },
      legalTargets: () => [],
      evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
      randomIndex: () => 0,
    });
    expect(result.committed).toBe(true);
    if (!result.committed) return;
    expect(result.state.rulesProcess).toBeNull();
    expect(result.state.rulesStack.map((layer) => layer.kind)).toEqual(["card", "triggered"]);
    expect(result.state.rulesStack[1]).toMatchObject({
      kind: "triggered",
      abilityId: "watcher-a1",
      triggeringEvent: { name: "pitch", batchId: "batch-2" },
    });
  });

  it("persists replacement ordering without publishing a partial procedure journal", () => {
    const { state, process } = setup();
    state.rulesProcess = process;
    const source = snapshotObject(state, "watcher1", "p1", "arena");
    state.replacementEffects = [1, 2].map((amount) => ({
      replacementId: `journal-prevention-${amount}`,
      controllerId: "p1",
      source,
      effect: {
        type: "prevention" as const,
        preventionKind: "fixed" as const,
        amount,
        shielded: { selector: "controller" as const },
        duration: "this-turn" as const,
      },
      createdByEventId: null,
      expiresAt: { kind: "turn" as const, turnNumber: 1 },
      consumptionPolicy: { kind: "on-application" as const },
      applicationPolicy: { kind: "mandatory" as const },
    }));
    appendFabEventGroup(process, [
      {
        name: "deal-damage",
        processId: process.processId,
        cause: { kind: "rule", rule: "journal-replacement-test", controllerId: "p2" },
        controllerId: "p2",
        source,
        affected: [],
        bindings: {},
        data: {
          source,
          target: { kind: "hero", playerId: "p1" },
          amount: 5,
          damageType: "physical",
        },
      },
    ]);
    const receipts: string[] = [];
    const options: FabEventTransactionOptions = {
      triggerContext: { evaluateStateCondition: () => true },
      legalTargets: () => [],
      evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
      randomIndex: () => 0,
      onCommittedEvents: (events) => receipts.push(...events.map((event) => event.name)),
    };
    const suspended = executeFabEventJournalTransaction(
      state,
      process.procedure!.eventGroups,
      options,
    );
    expect(suspended).toMatchObject({
      committed: false,
      suspendedForReplacementOrder: true,
      state: {
        decision: {
          actorId: "p1",
          kind: "ordering",
          continuation: { kind: "journal-replacement-order", eventGroupId: "process-1:group-5" },
        },
      },
    });
    expect(suspended.state.containers.zonesByPlayerId["p1"]!.hand).toEqual(["play1", "pitch1"]);
    expect(suspended.state).not.toHaveProperty("committedEvents");
    expect(receipts).toEqual([]);
    if (!("suspendedForReplacementOrder" in suspended)) return;
    const decision = suspended.state.decision;
    if (!decision || decision.continuation.kind !== "journal-replacement-order") return;
    const resumedInput = structuredClone(suspended.state);
    resumedInput.stateID += 1;
    resumedInput.decision = null;
    const resumed = resumeFabJournalReplacementOrdering(
      resumedInput,
      decision.continuation,
      { kind: "ordering", orderedIds: ["journal-prevention-2", "journal-prevention-1"] },
      options,
    );
    expect(resumed.players.p1!.life).toBe(state.players.p1!.life - 2);
    expect(resumed.containers.zonesByPlayerId["p1"]!).toMatchObject({
      hand: [],
      pitch: ["pitch1"],
      stack: ["play1"],
    });
    expect(resumed).not.toHaveProperty("committedEvents");
  });

  it("resumes the uncommitted journal tail after a continuous ordering decision", () => {
    const { state, process } = setup();
    state.cardDefinitions.watcher = registerFabCardDefinition(
      toFabCardDefinition({
        canonicalId: "watcher",
        name: "Simultaneous Watcher",
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
      }),
    );
    state.rulesProcess = process;
    const options: FabEventTransactionOptions = {
      triggerContext: { evaluateStateCondition: () => true },
      legalTargets: () => [],
      evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
      randomIndex: () => 0,
    };

    const suspended = executeFabEventJournalTransaction(
      state,
      process.procedure!.eventGroups,
      options,
    );

    expect(suspended).toMatchObject({
      committed: false,
      suspendedForContinuousOrder: true,
      state: {
        decision: {
          actorId: "p1",
          kind: "ordering",
          continuation: { kind: "continuous-order", journalCursor: 1 },
        },
      },
    });
    if (!("suspendedForContinuousOrder" in suspended)) return;
    const decision = suspended.state.decision;
    if (
      !decision ||
      decision.kind !== "ordering" ||
      decision.continuation.kind !== "continuous-order"
    )
      return;
    const continuation = decision.continuation;
    expect(suspended.state.containers.zonesByPlayerId["p1"]!.hand).toEqual(["pitch1"]);
    expect(suspended.state.containers.zonesByPlayerId["p1"]!.pitch).toEqual([]);

    const orderedIds = decision.entries.map((entry) => entry.id).reverse();
    const resume = (input: typeof suspended.state) => {
      const restored = structuredClone(input);
      restored.stateID += 1;
      restored.decision = null;
      return resumeFabContinuousOrdering(
        restored,
        continuation,
        { kind: "ordering", orderedIds },
        options,
      );
    };
    const resumed = resume(suspended.state);
    expect(resume(suspended.state)).toEqual(resumed);
    expect(resumed.containers.zonesByPlayerId["p1"]!).toMatchObject({
      hand: [],
      pitch: ["pitch1"],
      stack: ["play1"],
    });
    const watcher = resumed.objects.watcher1!;
    expect(
      buildFabRulesView(resumed).object({
        instanceId: watcher.instanceId,
        incarnation: watcher.incarnation,
      })?.current.numeric.power,
    ).toBe(5);
  });
});
