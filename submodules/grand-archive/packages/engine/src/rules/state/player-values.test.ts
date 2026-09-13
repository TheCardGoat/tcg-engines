import { theMajesticSpirit } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAmount,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import {
  evaluateGrandArchiveAmount,
  evaluateGrandArchiveCondition,
  type GrandArchiveEvaluationContext,
} from "../../procedures/effects/evaluation.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";

function card(
  canonicalId: string,
  type: GrandArchivePlayableCardType,
  reserveCost?: number,
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
        cost:
          reserveCost === undefined ? { kind: "none" } : { kind: "reserve", amount: reserveCost },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 15 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("player-values-champion", "CHAMPION");
const reserveOne = card("player-values-one", "ACTION", 1);
const reserveTwo = card("player-values-two", "ACTION", 2);
const reserveThree = card("player-values-three", "ACTION", 3);
const reserveFive = card("player-values-five", "ACTION", 5);
const cards = [
  champion,
  reserveOne,
  reserveTwo,
  reserveThree,
  reserveFive,
  theMajesticSpirit,
] as const;

function majesticSpiritPreventionAmount(): GrandArchiveAmount {
  if (theMajesticSpirit.layout.kind !== "single-faced") {
    throw new Error("The Majestic Spirit must be single-faced");
  }
  const ability = theMajesticSpirit.layout.face.abilities.find(
    (candidate) => candidate.id === "tsvbgl6ffq-a3",
  );
  if (ability?.kind === "static" && ability.staticKind === "effects") {
    const replacement = ability.effects.find((effect) => effect.kind === "replacement");
    if (replacement?.operation.kind === "prevent" && replacement.operation.amount !== undefined)
      return replacement.operation.amount;
  }
  if (
    ability?.kind === "card-resolution" &&
    ability.effect.kind === "replacement" &&
    ability.effect.operation.kind === "prevent" &&
    ability.effect.operation.amount !== undefined
  )
    return ability.effect.operation.amount;
  throw new Error("Missing The Majestic Spirit prevention amount");
}

function player(id: string): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [reserveOne, reserveTwo, reserveThree, reserveFive].map((definition) => ({
      definitionId: definition.canonicalId,
      count: 5,
    })),
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

describe("Grand Archive derived player values", () => {
  it("applies default and explicitly overridden division rounding", () => {
    const program = createGrandArchiveMatchProgram(cards);
    const state = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 71,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const context: GrandArchiveEvaluationContext = {
      program,
      state,
      controllerId: grandArchivePlayerId("p1"),
      bindings: {},
    };

    expect(
      evaluateGrandArchiveAmount(
        { kind: "calculate", operator: "divide", operands: [5, 2] },
        context,
      ),
    ).toBe(2);
    expect(
      evaluateGrandArchiveAmount(
        { kind: "calculate", operator: "divide", operands: [-5, 2] },
        context,
      ),
    ).toBe(-3);
    expect(
      evaluateGrandArchiveAmount(majesticSpiritPreventionAmount(), {
        ...context,
        bindings: { eventAmount: 5 },
      }),
    ).toBe(3);
    expect(() =>
      evaluateGrandArchiveAmount(
        { kind: "calculate", operator: "divide", operands: [5, 0] },
        context,
      ),
    ).toThrow("division by zero");
  });

  it("derives influence, omens, zone quantifiers, and reserve-cost streaks from live state", () => {
    const program = createGrandArchiveMatchProgram(cards);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 72,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const owned = (playerId: typeof p1, definitionId: string) =>
      Object.values(initial.objects)
        .filter((object) => object.ownerId === playerId && object.definitionId === definitionId)
        .map((object) => object.id);
    const p1Ones = owned(p1, reserveOne.canonicalId);
    const p1Twos = owned(p1, reserveTwo.canonicalId);
    const p1Threes = owned(p1, reserveThree.canonicalId);
    const p1Fives = owned(p1, reserveFive.canonicalId);
    const p2Ones = owned(p2, reserveOne.canonicalId);
    const p2Twos = owned(p2, reserveTwo.canonicalId);
    const p2Threes = owned(p2, reserveThree.canonicalId);
    const p2Fives = owned(p2, reserveFive.canonicalId);
    const kernel = new GrandArchiveTransactionKernel();
    const state = kernel.transact(initial, [
      { type: "object-moved", objectId: p1Ones[0]!, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: p1Ones[1]!, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: p1Twos[0]!, from: "main-deck", to: "memory" },
      { type: "object-moved", objectId: p2Ones[0]!, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: p2Twos[0]!, from: "main-deck", to: "memory" },
      { type: "object-moved", objectId: p2Threes[0]!, from: "main-deck", to: "memory" },
      { type: "object-moved", objectId: p2Fives[0]!, from: "main-deck", to: "memory" },
      { type: "object-moved", objectId: p1Threes[0]!, from: "main-deck", to: "banishment" },
      { type: "counter-changed", objectId: p1Threes[0]!, counter: "omen", delta: 1 },
      { type: "object-moved", objectId: p1Threes[1]!, from: "main-deck", to: "banishment" },
      { type: "counter-changed", objectId: p1Threes[1]!, counter: "omen", delta: 2 },
      { type: "object-moved", objectId: p1Threes[2]!, from: "main-deck", to: "banishment" },
      { type: "object-moved", objectId: p2Threes[1]!, from: "main-deck", to: "banishment" },
      { type: "counter-changed", objectId: p2Threes[1]!, counter: "omen", delta: 1 },
      { type: "object-moved", objectId: p1Fives[0]!, from: "main-deck", to: "graveyard" },
    ]).state;
    const context: GrandArchiveEvaluationContext = {
      program,
      state,
      controllerId: p1,
      bindings: {
        "first-streak": [p1Ones[0]!, p1Twos[0]!],
        "second-streak": [p1Twos[1]!, p1Threes[0]!, p1Fives[0]!],
      },
    };

    expect(
      evaluateGrandArchiveAmount(
        { kind: "player-property", player: "controller", property: "influence" },
        context,
      ),
    ).toBe(3);
    const discounted = executeGrandArchiveEffect(
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "discounted-card" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "E", modifies: "cost" },
        change: {
          kind: "numeric",
          property: "reserve-cost",
          operation: "subtract",
          amount: 3,
        },
      },
      {
        ...context,
        bindings: { ...context.bindings, "discounted-card": [p1Twos[0]!] },
      },
      (current, events) => {
        const transaction = kernel.transact(current, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;
    const discountedContext = {
      ...context,
      state: discounted,
      bindings: {
        ...context.bindings,
        "basis-streak-start": [p1Ones[0]!, p1Twos[0]!],
        "basis-streak-end": [p1Threes[0]!],
      },
    };
    const aggregate = (basis: "base" | "current") =>
      evaluateGrandArchiveAmount(
        {
          kind: "aggregate-property",
          operation: "maximum",
          collection: { binding: "first-streak" },
          property: "reserve-cost",
          basis,
          emptyValue: 0,
        },
        discountedContext,
      );
    const longest = (basis: "base" | "current") =>
      evaluateGrandArchiveAmount(
        {
          kind: "longest-consecutive-property-run",
          collections: [{ binding: "basis-streak-start" }, { binding: "basis-streak-end" }],
          property: "reserve-cost",
          basis,
        },
        discountedContext,
      );
    expect(aggregate("base")).toBe(2);
    expect(aggregate("current")).toBe(1);
    expect(longest("base")).toBe(3);
    expect(longest("current")).toBe(2);
    expect(
      evaluateGrandArchiveAmount(
        {
          kind: "property",
          subject: { kind: "bound", binding: "discounted-card" },
          property: "reserve-cost",
          basis: "current",
        },
        {
          ...discountedContext,
          bindings: { ...discountedContext.bindings, "discounted-card": [p1Twos[0]!] },
        },
      ),
    ).toBe(0);
    expect(
      evaluateGrandArchiveAmount(
        { kind: "player-property", player: "controller", property: "omens" },
        context,
      ),
    ).toBe(2);
    expect(
      evaluateGrandArchiveAmount(
        {
          kind: "aggregate-player-property",
          operation: "maximum",
          players: "each-opponent",
          property: "influence",
          emptyValue: 0,
        },
        context,
      ),
    ).toBe(4);
    expect(
      evaluateGrandArchiveAmount(
        {
          kind: "player-zone-count",
          players: "each-player",
          zone: "graveyard",
          comparison: { operator: "eq", value: 0 },
        },
        context,
      ),
    ).toBe(1);
    expect(
      evaluateGrandArchiveAmount(
        {
          kind: "longest-consecutive-property-run",
          collections: [{ binding: "first-streak" }, { binding: "second-streak" }],
          property: "reserve-cost",
          basis: "base",
        },
        context,
      ),
    ).toBe(3);
    expect(
      evaluateGrandArchiveAmount(
        {
          kind: "conditional",
          condition: {
            kind: "compare",
            comparison: {
              left: { kind: "player-property", player: "controller", property: "influence" },
              operator: "eq",
              right: 3,
            },
          },
          then: 7,
          else: 9,
        },
        context,
      ),
    ).toBe(7);
  });

  it("evaluates player property, zone, extreme, and turn-count conditions", () => {
    const program = createGrandArchiveMatchProgram(cards);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 73,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const objects = Object.values(initial.objects).filter(
      (object) => object.definitionId !== champion.canonicalId,
    );
    const p1Cards = objects.filter((object) => object.ownerId === p1);
    const p2Cards = objects.filter((object) => object.ownerId === p2);
    const kernel = new GrandArchiveTransactionKernel();
    let state = kernel.transact(initial, [
      ...p1Cards.slice(0, 3).map((object, index) => ({
        type: "object-moved" as const,
        objectId: object.id,
        from: "main-deck" as const,
        to: index === 2 ? ("memory" as const) : ("hand" as const),
      })),
      ...p2Cards.slice(0, 4).map((object, index) => ({
        type: "object-moved" as const,
        objectId: object.id,
        from: "main-deck" as const,
        to: index === 0 ? ("hand" as const) : ("memory" as const),
      })),
      {
        type: "object-moved",
        objectId: p1Cards[4]!.id,
        from: "main-deck",
        to: "graveyard",
      },
    ]).state;
    const context = (): GrandArchiveEvaluationContext => ({
      program,
      state,
      controllerId: p1,
      bindings: {},
    });

    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "player-property-compare",
          players: "each-opponent",
          quantifier: "all",
          property: "influence",
          operator: "gte",
          value: 4,
        },
        context(),
      ),
    ).toBe(true);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "player-zone-count",
          players: "each-player",
          quantifier: "all",
          zone: "graveyard",
          operator: "eq",
          value: 0,
        },
        context(),
      ),
    ).toBe(false);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "player-property-extreme",
          player: "controller",
          property: "influence",
          extreme: "minimum",
          ties: "disqualify",
        },
        context(),
      ),
    ).toBe(true);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "player-turn-count",
          player: "controller",
          operator: "eq",
          value: 1,
        },
        context(),
      ),
    ).toBe(true);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "player-turn-count",
          player: "opponent",
          operator: "eq",
          value: 0,
        },
        context(),
      ),
    ).toBe(true);

    state = kernel.transact(state, [
      { type: "object-moved", objectId: p2Cards[3]!.id, from: "memory", to: "main-deck" },
      { type: "turn-started", playerId: p2, turnNumber: 2 },
    ]).state;
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "player-property-extreme",
          player: "controller",
          property: "influence",
          extreme: "minimum",
          ties: "qualify",
        },
        context(),
      ),
    ).toBe(true);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "player-property-extreme",
          player: "controller",
          property: "influence",
          extreme: "minimum",
          ties: "disqualify",
        },
        context(),
      ),
    ).toBe(false);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "player-turn-count",
          player: "opponent",
          operator: "eq",
          value: 1,
        },
        context(),
      ),
    ).toBe(true);
  });
});
