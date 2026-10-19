import { describe, expect, it } from "vitest";
import { spiritOfWind, woodlandSquirrels } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveCard,
  GrandArchiveSubject,
} from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "../testing/test-engine.ts";
import {
  resolveGrandArchiveCollection,
  resolveGrandArchiveSubjectObjects,
} from "../procedures/effects/evaluation.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { deriveGrandArchiveNumericProperty } from "../rules/state/continuous.ts";

const neighbors: GrandArchiveSubject = {
  kind: "each",
  collection: {
    zones: ["field"],
    host: { kind: "source" },
    relationship: "linked-to",
  },
};

function unit(id: string): GrandArchiveCard<GrandArchiveAbilityDefinition> {
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
        cost: { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: ["ALLY"], classes: ["MAGE"], subtypes: ["MAGE"] },
        elements: ["NORM"],
        stats: { power: 1, life: 10 },
        rulesText: "Unit Link",
        abilities: [
          {
            id: `${id}-a1`,
            kind: "static",
            staticKind: "intrinsic",
            text: "Unit Link",
            keyword: { name: "link", target: "unit" },
          },
          {
            id: `${id}-a2`,
            kind: "activated",
            activation: "ability",
            text: "Mark directly linked objects.",
            cost: { kind: "pay-reserve", amount: 0 },
            effect: {
              kind: "add-counter",
              subject: neighbors,
              counter: { named: "neighbor" },
              amount: 1,
            },
          },
          {
            id: `${id}-a3`,
            kind: "activated",
            activation: "ability",
            text: "Mark the designated linked object.",
            cost: { kind: "pay-reserve", amount: 0 },
            effect: {
              kind: "add-counter",
              subject: { kind: "linked-object" },
              counter: { named: "designated" },
              amount: 1,
            },
          },
          {
            id: `${id}-a4`,
            kind: "static",
            staticKind: "effects",
            text: "Gets +1 power per directly linked object.",
            effects: [
              {
                kind: "continuous",
                subjects: { kind: "source" },
                affectedSet: "dynamic",
                duration: { kind: "while-source-in-functional-zone" },
                layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
                change: {
                  kind: "numeric",
                  property: "power",
                  operation: "add",
                  amount: {
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      host: { kind: "source" },
                      relationship: "linked-to",
                    },
                  },
                },
              },
            ],
          },
        ],
      },
    },
  };
}
const aCard = unit("linked-a"),
  bCard = unit("linked-b"),
  dCard = unit("linked-d");

function passStack(game: GrandArchiveTestEngine) {
  for (let step = 0; game.state.stack.length > 0 && step < 16; step++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
  expect(game.state.stack).toHaveLength(0);
}

function setup() {
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: spiritOfWind,
      zones: { hand: [aCard, bCard, dCard, woodlandSquirrels] },
    },
    playerTwo: { champion: spiritOfWind },
  });
  const player = game.player("player-one");
  const a = player.card(aCard),
    b = player.card(bCard),
    c = player.card(spiritOfWind),
    d = player.card(dCard);
  player.activate(b, { targets: { "intrinsic-link-target": [c.objectId] } });
  passStack(game);
  player.activate(a, { targets: { "intrinsic-link-target": [b.objectId] } });
  passStack(game);
  return { game, player, a, b, c, d };
}

describe("Linked / Linked to rules 1–2", () => {
  it("supports continuous characteristic evaluation without following a second link", () => {
    const { game, player, a, b } = setup();
    const context = {
      program: game.program,
      state: game.state,
      controllerId: player.id,
      bindings: {},
    };
    expect(
      deriveGrandArchiveNumericProperty(game.state.objects[a.objectId]!, "power", context),
    ).toBe(2);
    expect(
      deriveGrandArchiveNumericProperty(game.state.objects[b.objectId]!, "power", context),
    ).toBe(3);
  });

  it.each(["field", "loaded", "inner-lineage", "intent"] as const)(
    "does not mistake a hosted card in %s for a legal Link",
    (zone) => {
      const { game, player, a, b, c } = setup();
      const filler = player.card(woodlandSquirrels);
      const state = new GrandArchiveTransactionKernel().transact(game.state, [
        {
          type: "object-moved",
          objectId: filler.objectId,
          from: "hand",
          to: zone,
          hostId: b.objectId,
        },
      ]).state;
      const context = {
        program: game.program,
        state,
        controllerId: player.id,
        sourceId: b.objectId,
        bindings: {},
      };
      expect(
        resolveGrandArchiveCollection(
          { host: { kind: "source" }, relationship: "linked-to" },
          context,
        )
          .map((object) => object.id)
          .sort(),
      ).toEqual([a.objectId, c.objectId].sort());
    },
  );

  it("resolves both direct neighbors through public actions without creating a transitive link", () => {
    const { game, player, a, b, c } = setup();
    player.activateAbility(b, "linked-b-a2");
    passStack(game);
    expect(game.state.objects[a.objectId]?.counters["named:neighbor"]).toBe(1);
    expect(game.state.objects[c.objectId]?.counters["named:neighbor"]).toBe(1);
    expect(game.state.objects[b.objectId]?.counters["named:neighbor"] ?? 0).toBe(0);
    player.activateAbility(a, "linked-a-a2");
    passStack(game);
    expect(game.state.objects[b.objectId]?.counters["named:neighbor"]).toBe(1);
    expect(game.state.objects[c.objectId]?.counters["named:neighbor"]).toBe(1);
    player.activateAbility(b, "linked-b-a3");
    passStack(game);
    expect(game.state.objects[c.objectId]?.counters["named:designated"]).toBe(1);
    expect(game.state.objects[a.objectId]?.counters["named:designated"] ?? 0).toBe(0);
  });

  it("supports several incoming links, membership filtering, and the designated outgoing subject", () => {
    const { game, player, a, b, c, d } = setup();
    player.activate(d, { targets: { "intrinsic-link-target": [b.objectId] } });
    passStack(game);
    const context = {
      program: game.program,
      state: game.state,
      controllerId: player.id,
      sourceId: b.objectId,
      bindings: {},
    };
    const collection = { host: { kind: "source" as const }, relationship: "linked-to" as const };
    expect(
      resolveGrandArchiveCollection(collection, context)
        .map((object) => object.id)
        .sort(),
    ).toEqual([a.objectId, c.objectId, d.objectId].sort());
    expect(
      resolveGrandArchiveCollection(collection, context, c.objectId).map((object) => object.id),
    ).toEqual([c.objectId]);
    expect(
      resolveGrandArchiveSubjectObjects({ kind: "linked-object" }, context).map(
        (object) => object.id,
      ),
    ).toEqual([c.objectId]);
  });

  it("does not keep an old link when its target leaves and returns before the next state-based check", () => {
    const { game, player, a, b, c } = setup();
    const state = new GrandArchiveTransactionKernel().transact(game.state, [
      { type: "object-moved", objectId: b.objectId, from: "field", to: "hand" },
      { type: "object-moved", objectId: b.objectId, from: "hand", to: "field", hostId: c.objectId },
    ]).state;
    const context = {
      program: game.program,
      state,
      controllerId: player.id,
      sourceId: b.objectId,
      bindings: {},
    };
    const collection = { host: { kind: "source" as const }, relationship: "linked-to" as const };
    expect(resolveGrandArchiveCollection(collection, context).map((object) => object.id)).toEqual([
      c.objectId,
    ]);
    expect(resolveGrandArchiveCollection(collection, { ...context, sourceId: a.objectId })).toEqual(
      [],
    );
  });
});
