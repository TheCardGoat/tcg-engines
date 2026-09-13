import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { evaluateGrandArchiveCondition } from "../../procedures/effects/evaluation.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import { createGrandArchiveMatchInitialState } from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
  elements: readonly ("NORM" | "FIRE")[] = ["NORM"],
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
        cost: { kind: "reserve", amount: 1 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements,
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("condition-champion", "CHAMPION");
const item = card("condition-item", "ITEM");
const action = card("condition-action", "ACTION", ["FIRE"]);
const filler = card("condition-filler", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([champion, item, action, filler]);
  const player = (id: "p1" | "p2") => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: item.canonicalId, count: 1 },
      { definitionId: action.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 6 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1801,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const own = Object.values(initial.objects).filter((object) => object.ownerId === p1);
  const championId = own.find((object) => object.definitionId === champion.canonicalId)!.id;
  const itemId = own.find((object) => object.definitionId === item.canonicalId)!.id;
  const actionId = own.find((object) => object.definitionId === action.canonicalId)!.id;
  const kernel = new GrandArchiveTransactionKernel();
  const positioned = kernel.transact(initial, [
    {
      type: "object-moved",
      objectId: itemId,
      from: "main-deck",
      to: "loaded",
      hostId: championId,
    },
    {
      type: "object-moved",
      objectId: actionId,
      from: "main-deck",
      to: "effects-stack",
    },
  ]).state;
  const context = {
    program,
    state: positioned,
    controllerId: p1,
    sourceId: actionId,
    declaredTargetIds: [itemId],
    bindings: {
      pair: [itemId, championId],
      empty: [],
      "target-player": [p2],
      "moved-item": [itemId],
      "paid-extra": true,
    },
  } as const;
  return { program, kernel, context, itemId, championId };
}

describe("Grand Archive declared condition surface", () => {
  it("evaluates object, player, collection, payment, and activation-zone conditions", () => {
    const { context, itemId, championId } = setup();

    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "shares-characteristic",
          left: { kind: "bound", binding: "moved-item" },
          right: { kind: "champion", player: "controller" },
          characteristic: "element",
        },
        context,
      ),
    ).toBe(true);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "shares-characteristic",
          left: { kind: "bound", binding: "moved-item" },
          right: { kind: "champion", player: "controller" },
          characteristic: "element",
          exclude: ["NORM"],
        },
        context,
      ),
    ).toBe(false);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "subject-matches",
          subject: { kind: "bound", binding: "empty" },
          filter: { kind: "type", oneOf: ["ITEM"] },
        },
        context,
      ),
    ).toBe(false);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "player-relation",
          player: { binding: "target-player" },
          relation: "opponent-of-controller",
        },
        context,
      ),
    ).toBe(true);
    expect(
      evaluateGrandArchiveCondition(
        { kind: "collection-count-parity", collection: { binding: "pair" }, value: "even" },
        context,
      ),
    ).toBe(true);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "collection-has-shared-characteristic",
          collection: { binding: "pair" },
          characteristic: "class",
          minimumMatching: 2,
        },
        context,
      ),
    ).toBe(true);
    expect(
      evaluateGrandArchiveCondition({ kind: "paid-cost", binding: "paid-extra" }, context),
    ).toBe(true);
    expect(
      evaluateGrandArchiveCondition(
        { kind: "effect-result-origin", binding: "moved-item", zone: "main-deck" },
        context,
      ),
    ).toBe(true);
    expect(
      evaluateGrandArchiveCondition(
        { kind: "source-activation-zone", zone: "effects-stack" },
        context,
      ),
    ).toBe(true);
    expect(context.state.objects[itemId]?.hostId).toBe(championId);
  });

  it("evaluates current targets and preserves a destroyed linked object's host through LKI", () => {
    const { program, kernel, context, itemId } = setup();

    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "ability-target-matches",
          ability: "this",
          filter: { kind: "type", oneOf: ["ITEM"] },
          quantifier: "all",
        },
        context,
      ),
    ).toBe(true);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "ability-target-characteristic-in-collection",
          ability: "this",
          characteristic: "class",
          collection: { binding: "pair" },
          quantifier: "all",
        },
        context,
      ),
    ).toBe(true);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "ability-targets-subject",
          ability: "current",
          subject: { kind: "bound", binding: "moved-item" },
          quantifier: "all",
        },
        context,
      ),
    ).toBe(true);

    const destroyed = kernel.transact(context.state, [
      { type: "object-moved", objectId: itemId, from: "loaded", to: "graveyard" },
    ]).state;
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "has-related-object",
          subject: { kind: "bound", binding: "moved-item" },
          relation: "host",
          filter: { kind: "type", oneOf: ["CHAMPION"] },
        },
        { ...context, program, state: destroyed },
      ),
    ).toBe(true);
  });
});
