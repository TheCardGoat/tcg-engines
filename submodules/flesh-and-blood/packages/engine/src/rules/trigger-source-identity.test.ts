import { describe, expect, it } from "vitest";
import type { FabTrigger } from "@tcg/flesh-and-blood-types";
import { normalizeBaseObjectProperties } from "../cards.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { fabPlayerId } from "../game/identity.ts";
import type { CommittedEvent, FabObjectSnapshot } from "./events.ts";
import { createSyntheticFabObjectSnapshot } from "./snapshots.ts";
import { collectEventTriggers, type FabTriggerSource } from "./trigger-matcher.ts";

function attack(instanceId: string): FabObjectSnapshot {
  return createSyntheticFabObjectSnapshot({
    ref: { instanceId, incarnation: 1 },
    canonicalId: "same-canonical-card",
    objectKind: "catalog-card",
    baseSource: { kind: "registered" },
    ownerId: "p1",
    controllerId: "p1",
    zone: "combat-chain",
    zoneRef: { playerId: fabPlayerId("p1"), zone: "combatChain" },
    base: normalizeBaseObjectProperties({
      canonicalId: "same-canonical-card",
      name: "Savage Feast",
      types: ["Brute", "Action", "Attack"],
      power: 6,
    }),
  });
}

function source(
  object: FabObjectSnapshot,
  abilityId: string,
  trigger: FabTrigger,
): FabTriggerSource {
  return {
    abilityId,
    controllerId: "p1",
    source: object,
    trigger,
    resolution: { kind: "effect", effect: { type: "draw", count: 1, player: "controller" } },
    layerKeywords: [],
    functionalZones: ["combat-chain"],
    origin: "static",
  };
}

function attackEvent(object: FabObjectSnapshot, eventNumber: number): CommittedEvent<"attack"> {
  return {
    name: "attack",
    actorId: "p1",
    processId: `process-${eventNumber}`,
    cause: { kind: "player-command", actorId: "p1", command: "begin-play" },
    controllerId: "p1",
    source: object,
    affected: [object],
    bindings: {},
    data: {
      actorId: "p1",
      object,
      target: { kind: "hero", playerId: fabPlayerId("p2") },
      defendingPlayerId: "p2",
    },
    eventId: `event-${eventNumber}`,
    batchId: `batch-${eventNumber}`,
    batchIndex: 0,
    batchSize: 1,
    replacementIds: [],
    turnNumber: 1,
    occurrence: {
      occurrenceId: `occurrence-event-${eventNumber}`,
      kind: "single",
      index: 0,
      size: 1,
      namedEvent: null,
    },
    context: {
      phase: "action",
      combatStep: "attack",
      turnNumber: 1,
      combatNumber: 1,
      chainLinkNumber: eventNumber,
    },
  };
}

const selfAttack: FabTrigger = {
  kind: "event",
  event: {
    name: "attack",
    actor: { kind: "player", player: "ability-controller" },
    observes: { kind: "source", selector: "attack" },
  },
};

const controllerAttacks: FabTrigger = {
  kind: "event",
  event: {
    name: "attack",
    actor: { kind: "player", player: "ability-controller" },
    observes: { kind: "none" },
  },
};

describe("CR 2.12.3a / CR 7 source identity", () => {
  it("does not retrigger a resolved same-name source on a later chain link", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "trigger-source-identity",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    const first = attack("first-instance");
    const second = attack("second-instance");
    const sources = [
      source(first, "self-first", selfAttack),
      source(second, "self-second", selfAttack),
      source(first, "global-observer", controllerAttacks),
    ];

    const firstResult = collectEventTriggers(
      state,
      { batchId: "batch-1", processId: "process-1", events: [attackEvent(first, 1)] },
      sources,
      { evaluateStateCondition: () => true },
    );
    expect(firstResult.pendingTriggers.map((entry) => entry.abilityId).sort()).toEqual([
      "global-observer",
      "self-first",
    ]);

    const secondResult = collectEventTriggers(
      state,
      { batchId: "batch-2", processId: "process-2", events: [attackEvent(second, 2)] },
      sources,
      { evaluateStateCondition: () => true },
    );
    expect(secondResult.pendingTriggers.map((entry) => entry.abilityId).sort()).toEqual([
      "global-observer",
      "self-second",
    ]);
    expect(secondResult.pendingTriggers.some((entry) => entry.abilityId === "self-first")).toBe(
      false,
    );
  });

  it("does not equate a new incarnation of the same physical instance", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "trigger-source-incarnation",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    const old = attack("physical-card");
    const reset = { ...old, ref: { ...old.ref, incarnation: 2 } };
    const result = collectEventTriggers(
      state,
      { batchId: "batch-1", processId: "process-1", events: [attackEvent(reset, 1)] },
      [source(old, "old-incarnation", selfAttack)],
      { evaluateStateCondition: () => true },
    );
    expect(result.pendingTriggers).toEqual([]);
  });

  it("separates transaction batching from CR multi-event identity", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "trigger-occurrences",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    const observer = attack("observer");
    const firstAttack = attack("attack-a");
    const secondAttack = attack("attack-b");
    const firstEvent = { ...attackEvent(firstAttack, 1), batchId: "batch-9" as const };
    const secondEvent = { ...attackEvent(secondAttack, 2), batchId: "batch-9" as const };
    const independent = collectEventTriggers(
      state,
      { batchId: "batch-9", processId: "process-1", events: [firstEvent, secondEvent] },
      [source(observer, "global-observer", controllerAttacks)],
      { evaluateStateCondition: () => true },
    );
    expect(independent.pendingTriggers).toHaveLength(2);

    const multiOccurrence = {
      occurrenceId: "occurrence-one-multi" as const,
      kind: "multi" as const,
      size: 2,
      namedEvent: "representative-multi",
    };
    const multi = collectEventTriggers(
      state,
      {
        batchId: "batch-9",
        processId: "process-1",
        events: [
          { ...firstEvent, occurrence: { ...multiOccurrence, index: 0 } },
          { ...secondEvent, occurrence: { ...multiOccurrence, index: 1 } },
        ],
      },
      [source(observer, "global-observer", controllerAttacks)],
      { evaluateStateCondition: () => true },
    );
    expect(multi.pendingTriggers).toHaveLength(1);
    expect(multi.pendingTriggers[0]?.bindings["event-amount"]).toBe(0);
  });

  it("matches and binds explicitly selected plural event objects", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "trigger-plural-observation",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    const fusedCard = attack("fused-card");
    const matchingReveal = attack("matching-reveal");
    const otherReveal = {
      ...attack("other-reveal"),
      current: { ...attack("other-reveal").current, names: ["Not Savage Feast"] },
    };
    const base = attackEvent(fusedCard, 4);
    const event: CommittedEvent<"fuse"> = {
      ...base,
      name: "fuse",
      affected: [fusedCard, matchingReveal, otherReveal],
      data: { actorId: "p1", object: fusedCard, revealed: [matchingReveal, otherReveal] },
    };
    const anyReveal: FabTrigger = {
      kind: "event",
      event: {
        name: "fuse",
        actor: { kind: "player", player: "ability-controller" },
        observes: {
          kind: "event-objects",
          selector: "revealed-cards",
          relationship: { kind: "any" },
          filter: { name: "Savage Feast" },
          quantifier: "any",
          bindAllAs: "revealed",
        },
      },
    };
    const anyResult = collectEventTriggers(
      state,
      { batchId: event.batchId, processId: event.processId, events: [event] },
      [source(fusedCard, "plural-any", anyReveal)],
      { evaluateStateCondition: () => true },
    );
    expect(anyResult.pendingTriggers).toHaveLength(1);
    expect(anyResult.pendingTriggers[0]?.bindings.revealed).toEqual([matchingReveal, otherReveal]);

    const allReveal: FabTrigger = {
      kind: "event",
      event: {
        name: "fuse",
        actor: { kind: "player", player: "ability-controller" },
        observes: {
          kind: "event-objects",
          selector: "revealed-cards",
          relationship: { kind: "any" },
          filter: { name: "Savage Feast" },
          quantifier: "all",
        },
      },
    };
    const allResult = collectEventTriggers(
      state,
      { batchId: event.batchId, processId: event.processId, events: [event] },
      [source(fusedCard, "plural-all", allReveal)],
      { evaluateStateCondition: () => true },
    );
    expect(allResult.pendingTriggers).toHaveLength(0);
  });
});
