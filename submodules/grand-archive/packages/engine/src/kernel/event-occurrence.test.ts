import { pantheonBarrier, surveillanceStone } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEventPattern,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { matchesGrandArchiveEventPattern } from "../procedures/effects/evaluation.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchivePantheonPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "./kernel.ts";
import { createGrandArchiveMatchProgram } from "./match-program.ts";
import type { GrandArchiveCardInstance, GrandArchiveMatchState } from "../game/model.ts";
import {
  observeGrandArchiveCommittedEvent,
  type GrandArchiveObservedEvent,
} from "./observed-events.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "../rules/abilities/triggers.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION" | "GREATER BOON" | "ITEM" | "LESSER BOON",
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        cost: { kind: "none" },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["MAGE"],
          subtypes: type === "ALLY" ? ["HUMAN"] : [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { life: 3, power: 1 }
              : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("event-occurrence-champion", "CHAMPION");
const attacker = card("event-occurrence-attacker", "ALLY");
const filler = card("event-occurrence-filler", "ACTION");
const lesserBoon = card("event-occurrence-lesser-boon", "LESSER BOON");
const greaterBoon = card("event-occurrence-greater-boon", "GREATER BOON");
const barrier = pantheonBarrier;

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    attacker,
    barrier,
    filler,
    greaterBoon,
    lesserBoon,
    surveillanceStone,
  ]);
  const player = (id: "p1" | "p2" | "p3"): GrandArchivePantheonPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1" ? [{ definitionId: surveillanceStone.canonicalId, count: 1 }] : []),
      ...(id !== "p1" ? [{ definitionId: attacker.canonicalId, count: 1 }] : []),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
    pantheon: {
      lesserBoonDefinitionId: lesserBoon.canonicalId,
      greaterBoonDefinitionId: greaterBoon.canonicalId,
      barrierDefinitionId: barrier.canonicalId,
    },
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "pantheon",
      players: [player("p1"), player("p2"), player("p3")],
      firstPlayerId: "p1",
      randomSeed: 320,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const p3 = grandArchivePlayerId("p3");
  const objectFor = (ownerId: typeof p1, definitionId: string): GrandArchiveCardInstance => {
    const object = Object.values(initial.objects).find(
      (candidate) => candidate.ownerId === ownerId && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing occurrence object ${ownerId}:${definitionId}`);
    return object;
  };
  const stone = objectFor(p1, surveillanceStone.canonicalId);
  const p2Attacker = objectFor(p2, attacker.canonicalId);
  const p3Attacker = objectFor(p3, attacker.canonicalId);
  const ready = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: stone.id, from: stone.zone, to: "field" },
    { type: "object-moved", objectId: p2Attacker.id, from: p2Attacker.zone, to: "field" },
    { type: "object-moved", objectId: p3Attacker.id, from: p3Attacker.zone, to: "field" },
  ]).state;
  return {
    program,
    ready,
    p1,
    p2,
    p3,
    stoneId: stone.id,
    p1ChampionId: ready.zones[p1].field.find(
      (id) => ready.objects[id]?.definitionId === champion.canonicalId,
    )!,
    p2AttackerId: p2Attacker.id,
    p3AttackerId: p3Attacker.id,
  };
}

function surveillancePattern(): GrandArchiveEventPattern {
  if (surveillanceStone.layout.kind !== "single-faced") {
    throw new Error("Surveillance Stone must be single-faced");
  }
  const ability = surveillanceStone.layout.face.abilities[0];
  const trigger = ability?.kind === "triggered" ? ability.trigger : undefined;
  if (!trigger || trigger.kind !== "event" || "anyOf" in trigger.event) {
    throw new Error("Missing Surveillance Stone event trigger");
  }
  return trigger.event;
}

function attackEvents(
  attackerId: GrandArchiveObjectId,
  attackingPlayerId: ReturnType<typeof grandArchivePlayerId>,
  targetId: GrandArchiveObjectId,
) {
  return [
    {
      type: "combat-started" as const,
      combat: {
        attackerId,
        attackingPlayerId,
        defendingPlayerIds: [grandArchivePlayerId("p1")],
        targetIds: [targetId],
        retaliatorIds: [],
        retaliationOrderConfirmed: false,
        weaponIds: [],
        intentIds: [],
        step: "declaration" as const,
      },
    },
    { type: "combat-ended" as const },
  ];
}

function observedAttacks(
  events: readonly import("./events.ts").GrandArchiveCommittedEvent[],
): readonly GrandArchiveObservedEvent[] {
  return events
    .flatMap(observeGrandArchiveCommittedEvent)
    .filter(
      (observed): observed is GrandArchiveObservedEvent & { readonly name: "attack-declared" } =>
        observed.name === "attack-declared",
    );
}

function patternMatches(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  observed: GrandArchiveObservedEvent,
): boolean {
  const source = state.objects[fixture.stoneId];
  if (!source) throw new Error("Missing Surveillance Stone source");
  return matchesGrandArchiveEventPattern(surveillancePattern(), observed, source, {
    program: fixture.program,
    state,
    controllerId: fixture.p1,
    sourceId: source.id,
    abilityBearerId: source.id,
    abilityId: "kk46Whz7CJ-a1",
    bindings: {},
  });
}

describe("Grand Archive event occurrence windows", () => {
  it("counts the printed third attack per player rather than across opponents", () => {
    const fixture = setup();
    const transaction = new GrandArchiveTransactionKernel().transact(fixture.ready, [
      ...attackEvents(fixture.p2AttackerId, fixture.p2, fixture.p1ChampionId),
      ...attackEvents(fixture.p3AttackerId, fixture.p3, fixture.p1ChampionId),
      ...attackEvents(fixture.p2AttackerId, fixture.p2, fixture.p1ChampionId),
      ...attackEvents(fixture.p2AttackerId, fixture.p2, fixture.p1ChampionId),
    ]);
    const attacks = observedAttacks(transaction.result.events);

    expect(attacks).toHaveLength(4);
    expect(patternMatches(fixture, transaction.state, attacks[0]!)).toBe(false);
    expect(patternMatches(fixture, transaction.state, attacks[1]!)).toBe(false);
    expect(patternMatches(fixture, transaction.state, attacks[2]!)).toBe(false);
    expect(patternMatches(fixture, transaction.state, attacks[3]!)).toBe(true);
    expect(
      collectGrandArchiveTriggeredAbilityEvents(
        fixture.program,
        transaction.state,
        transaction.result.events,
      ).filter(
        (event) =>
          event.type === "pending-trigger-added" && event.trigger.ability.id === "kk46Whz7CJ-a1",
      ),
    ).toHaveLength(1);
  });

  it("resets at the turn boundary and does not count later events in the same transaction", () => {
    const fixture = setup();
    const oldTurn = new GrandArchiveTransactionKernel().transact(fixture.ready, [
      ...attackEvents(fixture.p2AttackerId, fixture.p2, fixture.p1ChampionId),
      ...attackEvents(fixture.p2AttackerId, fixture.p2, fixture.p1ChampionId),
      ...attackEvents(fixture.p2AttackerId, fixture.p2, fixture.p1ChampionId),
    ]).state;
    const transaction = new GrandArchiveTransactionKernel().transact(oldTurn, [
      { type: "turn-started", playerId: fixture.p3, turnNumber: oldTurn.turn.number + 1 },
      ...attackEvents(fixture.p2AttackerId, fixture.p2, fixture.p1ChampionId),
      ...attackEvents(fixture.p2AttackerId, fixture.p2, fixture.p1ChampionId),
      ...attackEvents(fixture.p2AttackerId, fixture.p2, fixture.p1ChampionId),
    ]);
    const attacks = observedAttacks(transaction.result.events);

    expect(attacks).toHaveLength(3);
    expect(patternMatches(fixture, transaction.state, attacks[0]!)).toBe(false);
    expect(patternMatches(fixture, transaction.state, attacks[1]!)).toBe(false);
    expect(patternMatches(fixture, transaction.state, attacks[2]!)).toBe(true);
    expect(
      collectGrandArchiveTriggeredAbilityEvents(
        fixture.program,
        transaction.state,
        transaction.result.events,
      ).filter(
        (event) =>
          event.type === "pending-trigger-added" && event.trigger.ability.id === "kk46Whz7CJ-a1",
      ),
    ).toHaveLength(1);
  });
});
