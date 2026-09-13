import { chargedManaplate, lesserBoonOfZerusa } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "./kernel.ts";
import { createGrandArchiveMatchProgram } from "./match-program.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";

const champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "event-total-champion",
  slug: "event-total-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "event-total-champion:face:default",
      catalogId: "event-total-champion",
      name: "Event Total Champion",
      cost: { kind: "memory", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN", "GUARDIAN"],
        subtypes: ["ASSASSIN", "GUARDIAN"],
      },
      elements: ["NORM"],
      stats: { level: 0, life: 30 },
      rulesText: "",
      abilities: [],
    },
  },
};

const filler: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "event-total-filler",
  slug: "event-total-filler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "event-total-filler:face:default",
      catalogId: "event-total-filler",
      name: "Event Total Filler",
      cost: { kind: "reserve", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: [],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

function setup(definition: typeof chargedManaplate | typeof lesserBoonOfZerusa) {
  const program = createGrandArchiveMatchProgram([champion, filler, definition]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: definition.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: filler.canonicalId, count: 10 },
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
      randomSeed: 612,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const source = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === definition.canonicalId,
  );
  const p1Champion = Object.values(initial.objects).find(
    (object) =>
      object.ownerId === p1 &&
      object.definitionId === champion.canonicalId &&
      object.zone === "field",
  );
  const p2Champion = Object.values(initial.objects).find(
    (object) =>
      object.ownerId === p2 &&
      object.definitionId === champion.canonicalId &&
      object.zone === "field",
  );
  if (!source || !p1Champion || !p2Champion) throw new Error("Missing event-total fixture object");
  const fillerIds = Object.values(initial.objects)
    .filter((object) => object.ownerId === p1 && object.definitionId === filler.canonicalId)
    .map((object) => object.id);
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    {
      type: "object-moved",
      objectId: source.id,
      from: source.zone,
      to: definition === lesserBoonOfZerusa ? "pantheon" : "field",
      entryFacing: "face-up",
    },
    ...fillerIds.slice(0, 6).flatMap((objectId) =>
      initial.objects[objectId]!.zone === "hand"
        ? []
        : [
            {
              type: "object-moved" as const,
              objectId,
              from: initial.objects[objectId]!.zone,
              to: "hand" as const,
            },
          ],
    ),
  ]).state;
  return {
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    p1,
    p2,
    sourceId: source.id,
    p1ChampionId: p1Champion.id,
    p2ChampionId: p2Champion.id,
    paymentIds: fillerIds.slice(0, 6),
  };
}

function resolveTop(
  runtime: GrandArchiveMatchRuntime,
  p1: ReturnType<typeof grandArchivePlayerId>,
  p2: ReturnType<typeof grandArchivePlayerId>,
) {
  const first = runtime.execute({ move: "pass" }, { playerId: p1 });
  if (!first.ok) throw new Error(first.message);
  const second = runtime.execute({ move: "pass" }, { playerId: p2 });
  if (!second.ok) throw new Error(second.message);
}

function cards(ids: readonly GrandArchiveObjectId[]) {
  return ids.map((cardId) => ({ kind: "card" as const, cardId }));
}

describe("Grand Archive historical event totals", () => {
  it("increases Lesser Boon of Zerusa's activation cost for each prior activation", () => {
    const fixture = setup(lesserBoonOfZerusa);
    const activate = (paymentIds: readonly GrandArchiveObjectId[]) =>
      fixture.runtime.execute(
        {
          move: "activate-ability",
          sourceId: fixture.sourceId,
          abilityId: "UC9byG4aD5-a2",
          reservePayment: cards(paymentIds),
        },
        { playerId: fixture.p1 },
      );

    const first = activate(fixture.paymentIds.slice(0, 2));
    if (!first.ok) throw new Error(first.message);
    resolveTop(fixture.runtime, fixture.p1, fixture.p2);
    expect(fixture.runtime.state.objects[fixture.p1ChampionId]?.counters.preparation).toBe(1);

    expect(activate(fixture.paymentIds.slice(2, 4)).ok).toBe(false);
    const second = activate(fixture.paymentIds.slice(2, 5));
    if (!second.ok) throw new Error(second.message);
    resolveTop(fixture.runtime, fixture.p1, fixture.p2);
    expect(fixture.runtime.state.objects[fixture.p1ChampionId]?.counters.preparation).toBe(2);
    expect(fixture.runtime.state.zones[fixture.p1].memory).toEqual(
      expect.arrayContaining(fixture.paymentIds.slice(0, 5)),
    );
  });

  it("sums only damage dealt to the controller's champion during Charged Manaplate's turn window", () => {
    const fixture = setup(chargedManaplate);
    const kernel = new GrandArchiveTransactionKernel();
    fixture.runtime = new GrandArchiveMatchRuntime(
      createGrandArchiveMatchProgram([champion, filler, chargedManaplate]),
      kernel.transact(fixture.runtime.state, [
        { type: "damage-marked", objectId: fixture.p1ChampionId, amount: 3 },
        { type: "damage-marked", objectId: fixture.p2ChampionId, amount: 8 },
      ]).state,
    );
    const activate = () =>
      fixture.runtime.execute(
        {
          move: "activate-ability",
          sourceId: fixture.sourceId,
          abilityId: "jxhkurfp66-a1",
        },
        { playerId: fixture.p1 },
      );

    expect(activate().ok).toBe(false);
    fixture.runtime = new GrandArchiveMatchRuntime(
      createGrandArchiveMatchProgram([champion, filler, chargedManaplate]),
      kernel.transact(fixture.runtime.state, [
        { type: "damage-marked", objectId: fixture.p1ChampionId, amount: 1 },
      ]).state,
    );
    const handBefore = fixture.runtime.state.zones[fixture.p1].hand.length;
    const activated = activate();
    if (!activated.ok) throw new Error(activated.message);
    expect(fixture.runtime.state.objects[fixture.sourceId]?.zone).toBe("banishment");
    resolveTop(fixture.runtime, fixture.p1, fixture.p2);
    expect(fixture.runtime.state.zones[fixture.p1].hand).toHaveLength(handBefore + 1);
  });
});
