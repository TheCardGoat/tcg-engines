import { fulguriteCoordinator, fulminatorRisingStorm } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveElement,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import {
  grandArchivePlayerId,
  type GrandArchiveObjectId,
  type GrandArchivePlayerId,
} from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState, GrandArchivePendingTrigger } from "../../game/model.ts";
import { openGrandArchiveOpportunity } from "../../procedures/game-flow/opportunity.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import {
  collectGrandArchiveTriggeredAbilityEvents,
  createGrandArchiveTriggeredStackItem,
} from "./triggers.ts";

function card(
  canonicalId: string,
  type: "ALLY" | "CHAMPION",
  elements: readonly [GrandArchiveElement, ...GrandArchiveElement[]],
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId,
    slug: canonicalId,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${canonicalId}:face:default`,
        catalogId: canonicalId,
        name: canonicalId,
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 1 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["WARRIOR"],
          subtypes: [],
        },
        elements,
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : { power: 2, life: 10 },
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("static-test-champion", "CHAMPION", ["NORM"]);
const arcaneUnit = card("static-test-arcane-unit", "ALLY", ["ARCANE"]);
const targetUnit = card("static-test-target-unit", "ALLY", ["NORM"]);

interface StaticFixture {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly state: GrandArchiveMatchState;
  readonly p1: GrandArchivePlayerId;
  readonly p2: GrandArchivePlayerId;
  readonly arcaneUnitId: GrandArchiveObjectId;
  readonly p1ChampionId: GrandArchiveObjectId;
  readonly targetId: GrandArchiveObjectId;
  readonly coordinatorId: GrandArchiveObjectId;
  readonly fulminatorId: GrandArchiveObjectId;
}

function findObject(
  state: GrandArchiveMatchState,
  definitionId: string,
  ownerId: GrandArchivePlayerId,
): GrandArchiveObjectId {
  const object = Object.values(state.objects).find(
    (candidate) => candidate.definitionId === definitionId && candidate.ownerId === ownerId,
  );
  if (!object) throw new Error(`Missing Static fixture object ${definitionId}`);
  return object.id;
}

function setup(): StaticFixture {
  const program = createGrandArchiveMatchProgram([
    champion,
    arcaneUnit,
    targetUnit,
    fulguriteCoordinator,
    fulminatorRisingStorm,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: arcaneUnit.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: targetUnit.canonicalId, count: id === "p2" ? 1 : 0 },
      { definitionId: fulguriteCoordinator.canonicalId, count: id === "p1" ? 1 : 0 },
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1" ? [{ definitionId: fulminatorRisingStorm.canonicalId, count: 1 }] : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 641,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const arcaneUnitId = findObject(initial, arcaneUnit.canonicalId, p1);
  const targetId = findObject(initial, targetUnit.canonicalId, p2);
  const coordinatorId = findObject(initial, fulguriteCoordinator.canonicalId, p1);
  const fulminatorId = findObject(initial, fulminatorRisingStorm.canonicalId, p1);
  const state = new GrandArchiveTransactionKernel().transact(initial, [
    ...(initial.opportunity ? ([{ type: "opportunity-closed" }] as const) : []),
    {
      type: "object-moved",
      objectId: arcaneUnitId,
      from: initial.objects[arcaneUnitId]!.zone,
      to: "field",
    },
    {
      type: "object-moved",
      objectId: targetId,
      from: initial.objects[targetId]!.zone,
      to: "field",
    },
    {
      type: "object-moved",
      objectId: coordinatorId,
      from: initial.objects[coordinatorId]!.zone,
      to: "field",
      initialCounters: { static: 3 },
    },
    {
      type: "object-moved",
      objectId: fulminatorId,
      from: initial.objects[fulminatorId]!.zone,
      to: "field",
      initialCounters: { durability: 3, static: 1 },
    },
  ]).state;
  return {
    program,
    state,
    p1,
    p2,
    arcaneUnitId,
    p1ChampionId: findObject(state, champion.canonicalId, p1),
    targetId,
    coordinatorId,
    fulminatorId,
  };
}

function damageAndCollect(fixture: StaticFixture, sourceId = fixture.arcaneUnitId) {
  const damage = new GrandArchiveTransactionKernel().transact(fixture.state, [
    {
      type: "damage-marked",
      objectId: fixture.targetId,
      amount: 2,
      sourceId,
      combatDamage: true,
      combatParticipantIds: [sourceId],
      actorId: fixture.p1,
      cause: { kind: "rule", rule: "static-counter-test-combat-damage" },
    },
  ]);
  const triggerEvents = collectGrandArchiveTriggeredAbilityEvents(
    fixture.program,
    damage.state,
    damage.result.events,
  );
  return { damage, triggerEvents };
}

function pendingStaticTriggers(
  events: ReturnType<typeof collectGrandArchiveTriggeredAbilityEvents>,
): readonly GrandArchivePendingTrigger[] {
  return events.flatMap((event) =>
    event.type === "pending-trigger-added" && event.trigger.ability.id === "game:static-counter-a1"
      ? [event.trigger]
      : [],
  );
}

function runtimeForTrigger(
  fixture: StaticFixture,
  state: GrandArchiveMatchState,
  pending: GrandArchivePendingTrigger,
): GrandArchiveMatchRuntime {
  const item = createGrandArchiveTriggeredStackItem(state, pending, []);
  const ready = new GrandArchiveTransactionKernel().transact(state, [
    { type: "stack-item-added", item },
    {
      type: "opportunity-opened",
      window: openGrandArchiveOpportunity(state, fixture.p1, "stack-item-added"),
    },
  ]).state;
  return new GrandArchiveMatchRuntime(fixture.program, ready);
}

function resolveToOptional(runtime: GrandArchiveMatchRuntime, fixture: StaticFixture): void {
  const first = runtime.execute({ move: "pass" }, { playerId: fixture.p1 });
  if (!first.ok) throw new Error(first.message);
  const second = runtime.execute({ move: "pass" }, { playerId: fixture.p2 });
  if (!second.ok) throw new Error(second.message);
  expect(runtime.state.decision?.kind).toBe("resolve-optional-effect");
}

function answerOptional(runtime: GrandArchiveMatchRuntime, accept: boolean) {
  const decision = runtime.state.decision;
  if (!decision) throw new Error("Expected a Static counter decision");
  return runtime.execute(
    {
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: accept,
    },
    { playerId: decision.playerId },
  );
}

describe("Grand Archive Static counter inherent ability", () => {
  it("triggers once per counter-bearing catalog object, not once per counter", () => {
    const fixture = setup();
    const { triggerEvents } = damageAndCollect(fixture);
    const pending = pendingStaticTriggers(triggerEvents);

    expect(pending).toHaveLength(2);
    expect(pending.map((trigger) => trigger.sourceId).sort()).toEqual(
      [fixture.coordinatorId, fixture.fulminatorId].sort(),
    );

    const nonArcane = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "damage-marked",
        objectId: fixture.targetId,
        amount: 2,
        sourceId: fixture.p1ChampionId,
        combatDamage: true,
      },
    ]);
    expect(
      pendingStaticTriggers(
        collectGrandArchiveTriggeredAbilityEvents(
          fixture.program,
          nonArcane.state,
          nonArcane.result.events,
        ),
      ),
    ).toEqual([]);

    const nonCombat = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "damage-marked",
        objectId: fixture.targetId,
        amount: 2,
        sourceId: fixture.arcaneUnitId,
      },
    ]);
    expect(
      pendingStaticTriggers(
        collectGrandArchiveTriggeredAbilityEvents(
          fixture.program,
          nonCombat.state,
          nonCombat.result.events,
        ),
      ),
    ).toEqual([]);
  });

  it("optionally removes one counter and deals non-combat damage from that object", () => {
    const fixture = setup();
    const { damage, triggerEvents } = damageAndCollect(fixture);
    const pending = pendingStaticTriggers(triggerEvents).find(
      (trigger) => trigger.sourceId === fixture.coordinatorId,
    );
    if (!pending) throw new Error("Missing Fulgurite Static trigger");
    const runtime = runtimeForTrigger(fixture, damage.state, pending);
    resolveToOptional(runtime, fixture);

    const accepted = answerOptional(runtime, true);
    if (!accepted.ok) throw new Error(accepted.message);
    expect(runtime.state.objects[fixture.coordinatorId]?.counters.static).toBe(2);
    expect(runtime.state.objects[fixture.targetId]?.damage).toBe(3);
    expect(
      accepted.events.find(
        (event) =>
          event.type === "damage-marked" &&
          event.sourceId === fixture.coordinatorId &&
          event.objectId === fixture.targetId,
      ),
    ).toMatchObject({ amount: 1, sourceId: fixture.coordinatorId });
  });

  it("deals no damage if its source can no longer remove a Static counter", () => {
    const fixture = setup();
    const { damage, triggerEvents } = damageAndCollect(fixture);
    const pending = pendingStaticTriggers(triggerEvents).find(
      (trigger) => trigger.sourceId === fixture.fulminatorId,
    );
    if (!pending) throw new Error("Missing Fulminator Static trigger");
    const withoutCounter = new GrandArchiveTransactionKernel().transact(damage.state, [
      {
        type: "counter-changed",
        objectId: fixture.fulminatorId,
        counter: "static",
        delta: -1,
      },
    ]).state;
    const runtime = runtimeForTrigger(fixture, withoutCounter, pending);
    const first = runtime.execute({ move: "pass" }, { playerId: fixture.p1 });
    if (!first.ok) throw new Error(first.message);
    const second = runtime.execute({ move: "pass" }, { playerId: fixture.p2 });
    if (!second.ok) throw new Error(second.message);

    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.objects[fixture.fulminatorId]?.counters.static ?? 0).toBe(0);
    expect(runtime.state.objects[fixture.targetId]?.damage).toBe(2);
    expect(
      second.events.some(
        (event) => event.type === "damage-marked" && event.sourceId === fixture.fulminatorId,
      ),
    ).toBe(false);
  });
});
