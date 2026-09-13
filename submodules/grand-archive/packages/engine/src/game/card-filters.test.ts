import { artOfWar, camilBaskedAbundance, flammeSorcel } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveCardFilter,
  GrandArchivePrintedCost,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import {
  evaluateGrandArchiveCondition,
  matchesGrandArchiveCardFilter,
} from "../procedures/effects/evaluation.ts";
import { grandArchivePlayerId } from "./identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION" | "ITEM",
  options: {
    readonly cost?: GrandArchivePrintedCost;
    readonly abilities?: readonly GrandArchiveAbilityDefinition[];
    readonly subtypes?: readonly string[];
  } = {},
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
        cost: options.cost ?? { kind: "reserve", amount: 0 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["WARRIOR"],
          subtypes: options.subtypes ?? [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { power: 2, life: 3 }
              : {},
        rulesText: "",
        abilities: options.abilities ?? [],
      },
    },
  };
}

const champion = card("card-filter-champion", "CHAMPION", {
  cost: { kind: "memory", amount: 0 },
});
const ally = card("card-filter-ally", "ALLY");
const costTwo = card("card-filter-cost-two", "ACTION", {
  cost: { kind: "reserve", amount: 2 },
});
const costThree = card("card-filter-cost-three", "ACTION", {
  cost: { kind: "reserve", amount: 3 },
});
const allyLinkItem = card("card-filter-ally-link", "ITEM", {
  subtypes: ["VELTECH"],
  abilities: [
    {
      id: "cardFilterAllyLink-a1",
      kind: "static",
      staticKind: "intrinsic",
      text: "Ally Link",
      keyword: { name: "link", target: "ally" },
    },
  ],
});
const championLinkItem = card("card-filter-champion-link", "ITEM", {
  subtypes: ["VELTECH"],
  abilities: [
    {
      id: "cardFilterChampionLink-a1",
      kind: "static",
      staticKind: "intrinsic",
      text: "Champion Link",
      keyword: { name: "link", target: "champion" },
    },
  ],
});

const cards = [
  champion,
  ally,
  costTwo,
  costThree,
  allyLinkItem,
  championLinkItem,
  artOfWar,
  flammeSorcel,
  camilBaskedAbundance,
];

function player(id: "p1" | "p2"): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: ally.canonicalId, count: 1 },
      { definitionId: costTwo.canonicalId, count: 1 },
      { definitionId: costThree.canonicalId, count: 1 },
      { definitionId: allyLinkItem.canonicalId, count: 1 },
      { definitionId: championLinkItem.canonicalId, count: 1 },
      ...(id === "p1"
        ? [
            { definitionId: flammeSorcel.canonicalId, count: 1 },
            { definitionId: camilBaskedAbundance.canonicalId, count: 1 },
          ]
        : []),
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p2" ? [{ definitionId: artOfWar.canonicalId, count: 1 }] : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function setup() {
  const program = createGrandArchiveMatchProgram(cards);
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 582,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const find = (playerId: typeof p1, definitionId: string) => {
    const object = Object.values(state.objects).find(
      (candidate) => candidate.ownerId === playerId && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing ${definitionId} for ${playerId}`);
    return object;
  };
  return { program, state, p1, p2, find };
}

function flammeCondition() {
  if (flammeSorcel.layout.kind !== "single-faced") throw new Error("Flamme must be single-faced");
  const ability = flammeSorcel.layout.face.abilities[0];
  if (ability?.kind !== "card-resolution" || ability.effect.kind !== "sequence") {
    throw new Error("Missing Flamme resolution sequence");
  }
  const conditional = ability.effect.effects[1];
  if (conditional?.kind !== "conditional") throw new Error("Missing Flamme cost comparison");
  return conditional.condition;
}

function camilLinkFilter(): GrandArchiveCardFilter {
  if (camilBaskedAbundance.layout.kind !== "single-faced") {
    throw new Error("Camil must be single-faced");
  }
  const ability = camilBaskedAbundance.layout.face.abilities[0];
  if (ability?.kind !== "triggered" || ability.effect?.kind !== "sequence") {
    throw new Error("Missing Camil On Attack sequence");
  }
  const choice = ability.effect.effects[0];
  if (
    choice?.kind !== "choose" ||
    choice.selection.candidates.kind !== "card" ||
    !choice.selection.candidates.filter
  ) {
    throw new Error("Missing Camil Link card choice");
  }
  return choice.selection.candidates.filter;
}

describe("Grand Archive catalog card filters", () => {
  it("enforces Art of War only for allies that entered during the current turn", () => {
    const fixture = setup();
    const attacker = fixture.find(fixture.p1, ally.canonicalId);
    const relic = fixture.find(fixture.p2, artOfWar.canonicalId);
    const defenderId = fixture.state.zones[fixture.p2].field[0]!;
    const kernel = new GrandArchiveTransactionKernel();
    const enteredThisTurn = kernel.transact(fixture.state, [
      { type: "object-moved", objectId: attacker.id, from: attacker.zone, to: "field" },
      { type: "object-moved", objectId: relic.id, from: relic.zone, to: "field" },
    ]).state;
    const ready = {
      ...enteredThisTurn,
      players: {
        ...enteredThisTurn.players,
        [fixture.p1]: { ...enteredThisTurn.players[fixture.p1]!, hasTakenFirstTurn: true },
      },
    };
    const currentTurn = new GrandArchiveMatchRuntime(fixture.program, ready);

    const forbidden = currentTurn.execute(
      { move: "declare-attack", attackerId: attacker.id, targetIds: [defenderId] },
      { playerId: fixture.p1 },
    );
    expect(forbidden.ok).toBe(false);
    if (forbidden.ok) throw new Error("Art of War allowed a newly entered ally to attack");
    expect(forbidden.message).toContain("forbids");

    const laterTurn = kernel.transact(ready, [
      { type: "turn-started", playerId: fixture.p1, turnNumber: ready.turn.number + 1 },
      { type: "phase-changed", phase: "main" },
    ]).state;
    const allowed = new GrandArchiveMatchRuntime(fixture.program, laterTurn).execute(
      { move: "declare-attack", attackerId: attacker.id, targetIds: [defenderId] },
      { playerId: fixture.p1 },
    );
    if (!allowed.ok) throw new Error(allowed.message);
    expect(allowed.ok).toBe(true);
  });

  it("resolves Flamme Sorcel's reserve-cost comparison against the discarded card", () => {
    const fixture = setup();
    const source = fixture.find(fixture.p1, flammeSorcel.canonicalId);
    const omen = fixture.find(fixture.p1, costTwo.canonicalId);
    const equalDiscard = fixture.find(fixture.p2, costTwo.canonicalId);
    const unequalDiscard = fixture.find(fixture.p1, costThree.canonicalId);
    const state = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: omen.id, from: omen.zone, to: "banishment" },
      { type: "counter-changed", objectId: omen.id, counter: "omen", delta: 1 },
      {
        type: "object-moved",
        objectId: equalDiscard.id,
        from: equalDiscard.zone,
        to: "graveyard",
      },
      {
        type: "object-moved",
        objectId: unequalDiscard.id,
        from: unequalDiscard.zone,
        to: "graveyard",
      },
    ]).state;
    const evaluation = {
      program: fixture.program,
      state,
      controllerId: fixture.p1,
      sourceId: source.id,
      abilityBearerId: source.id,
      bindings: {},
    };

    expect(
      evaluateGrandArchiveCondition(flammeCondition(), {
        ...evaluation,
        bindings: { "discarded-card": [equalDiscard.id] },
      }),
    ).toBe(true);
    expect(
      evaluateGrandArchiveCondition(flammeCondition(), {
        ...evaluation,
        bindings: { "discarded-card": [unequalDiscard.id] },
      }),
    ).toBe(false);
  });

  it("offers Camil only cards whose active Link keyword targets an ally", () => {
    const fixture = setup();
    const source = fixture.find(fixture.p1, camilBaskedAbundance.canonicalId);
    const allyLink = fixture.find(fixture.p1, allyLinkItem.canonicalId);
    const championLink = fixture.find(fixture.p1, championLinkItem.canonicalId);
    const context = {
      program: fixture.program,
      state: fixture.state,
      controllerId: fixture.p1,
      sourceId: source.id,
      abilityBearerId: source.id,
      bindings: {},
    };
    const filter = camilLinkFilter();

    expect(matchesGrandArchiveCardFilter(allyLink, filter, context)).toBe(true);
    expect(matchesGrandArchiveCardFilter(championLink, filter, context)).toBe(false);
  });
});
