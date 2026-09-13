import { intrepidSpearman } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveElement,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import {
  chooseGrandArchiveReplacement,
  collectGrandArchiveReplacementCandidates,
} from "../../rules/replacements/replacements.ts";

function card(
  id: string,
  type: "ACTION" | "CHAMPION",
  elements: readonly GrandArchiveElement[],
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
        typeLine: { supertypes: [], types: [type], classes: ["WARRIOR"], subtypes: [] },
        elements,
        stats: type === "CHAMPION" ? { level: 0, life: 30 } : {},
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("intrepid-test-champion", "CHAMPION", ["WIND"]);
const windCard = card("intrepid-test-wind-card", "ACTION", ["WIND"]);
const nonWindCard = card("intrepid-test-fire-card", "ACTION", ["FIRE"]);

function setup(memoryDefinitionId: string) {
  const program = createGrandArchiveMatchProgram([
    champion,
    windCard,
    nonWindCard,
    intrepidSpearman,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck:
      id === "p1"
        ? [
            { definitionId: intrepidSpearman.canonicalId, count: 1 },
            { definitionId: windCard.canonicalId, count: 1 },
            { definitionId: nonWindCard.canonicalId, count: 1 },
          ]
        : [{ definitionId: nonWindCard.canonicalId, count: 1 }],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 223,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const objectId = (definitionId: string): GrandArchiveObjectId => {
    const object = Object.values(state.objects).find(
      (candidate) => candidate.ownerId === p1 && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing ${definitionId}`);
    return object.id;
  };
  const sourceId = objectId(intrepidSpearman.canonicalId);
  const memoryCardId = objectId(memoryDefinitionId);
  const championId = state.zones[p1].field[0]!;
  const staged = new GrandArchiveTransactionKernel().transact(state, [
    { type: "counter-changed", objectId: championId, counter: "level", delta: 1 },
    { type: "object-moved", objectId: sourceId, from: "main-deck", to: "field" },
    { type: "object-moved", objectId: memoryCardId, from: "main-deck", to: "memory" },
  ]).state;
  return { program, state: staged, sourceId, memoryCardId };
}

function rulesKernel(program: ReturnType<typeof createGrandArchiveMatchProgram>) {
  return new GrandArchiveTransactionKernel({
    collectReplacements: (state, event) =>
      collectGrandArchiveReplacementCandidates(program, state, event),
    chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
  });
}

function damage(
  kernel: GrandArchiveTransactionKernel,
  state: GrandArchiveMatchState,
  sourceId: GrandArchiveObjectId,
  amount: number,
) {
  return kernel.transact(state, [
    { type: "damage-marked", objectId: sourceId, amount, combatDamage: true },
  ]);
}

describe("Intrepid Spearman", () => {
  it("binds the randomly revealed Wind card before evaluating its prevention", () => {
    const fixture = setup(windCard.canonicalId);
    const kernel = rulesKernel(fixture.program);
    const first = damage(kernel, fixture.state, fixture.sourceId, 4);

    expect(first.state.objects[fixture.sourceId]).toMatchObject({ zone: "field", damage: 1 });
    expect(first.result.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "card-revealed", objectId: fixture.memoryCardId }),
        expect.objectContaining({ type: "damage-marked", objectId: fixture.sourceId, amount: 1 }),
        expect.objectContaining({
          type: "damage-prevented",
          objectId: fixture.sourceId,
          amount: 3,
        }),
        expect.objectContaining({ type: "replacement-limit-used" }),
      ]),
    );

    const second = damage(kernel, first.state, fixture.sourceId, 1);
    expect(second.result.events.some((event) => event.type === "card-revealed")).toBe(false);
    expect(second.result.events.some((event) => event.type === "replacement-limit-used")).toBe(
      false,
    );
  });

  it("still consumes its once-per-turn application when the random card is not Wind", () => {
    const fixture = setup(nonWindCard.canonicalId);
    const kernel = rulesKernel(fixture.program);
    const first = damage(kernel, fixture.state, fixture.sourceId, 1);

    expect(first.state.objects[fixture.sourceId]).toMatchObject({ zone: "field", damage: 1 });
    expect(first.result.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "card-revealed", objectId: fixture.memoryCardId }),
        expect.objectContaining({ type: "damage-marked", objectId: fixture.sourceId, amount: 1 }),
        expect.objectContaining({
          type: "damage-prevented",
          objectId: fixture.sourceId,
          amount: 0,
        }),
        expect.objectContaining({ type: "replacement-limit-used" }),
      ]),
    );

    const second = damage(kernel, first.state, fixture.sourceId, 1);
    expect(second.result.events.some((event) => event.type === "card-revealed")).toBe(false);
    expect(second.result.events.some((event) => event.type === "replacement-limit-used")).toBe(
      false,
    );
  });
});
