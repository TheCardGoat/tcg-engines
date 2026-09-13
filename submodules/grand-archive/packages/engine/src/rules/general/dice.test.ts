import { lesserBoonOfRakko, unstableVoltage } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

const champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "dice-champion",
  slug: "dice-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dice-champion:face:default",
      catalogId: "dice-champion",
      name: "Dice Champion",
      cost: { kind: "memory", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE", "ANOMALY"],
        subtypes: ["MAGE", "ANOMALY"],
      },
      elements: ["ARCANE", "NORM"],
      stats: { level: 0, life: 30 },
      rulesText: "",
      abilities: [],
    },
  },
};

const ally: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "dice-ally",
  slug: "dice-ally",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dice-ally:face:default",
      catalogId: "dice-ally",
      name: "Dice Ally",
      cost: { kind: "reserve", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE"],
      },
      elements: ["NORM"],
      stats: { power: 1, life: 20 },
      rulesText: "",
      abilities: [],
    },
  },
};

const filler: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "dice-filler",
  slug: "dice-filler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dice-filler:face:default",
      catalogId: "dice-filler",
      name: "Dice Filler",
      cost: { kind: "reserve", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
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

function setup(definition: typeof lesserBoonOfRakko | typeof unstableVoltage) {
  const program = createGrandArchiveMatchProgram([champion, ally, filler, definition]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: definition.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: ally.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 9 },
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
      randomSeed: 440,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const source = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === definition.canonicalId,
  );
  const target = Object.values(initial.objects).find(
    (object) => object.ownerId === p2 && object.definitionId === ally.canonicalId,
  );
  if (!source || !target) throw new Error("Missing dice fixture object");
  const paymentIds = Object.values(initial.objects)
    .filter((object) => object.ownerId === p1 && object.definitionId === filler.canonicalId)
    .slice(0, 3)
    .map((object) => object.id);
  const events = [
    {
      type: "object-moved" as const,
      objectId: source.id,
      from: source.zone,
      to: definition === lesserBoonOfRakko ? ("pantheon" as const) : ("hand" as const),
      entryFacing: "face-up" as const,
    },
    {
      type: "object-moved" as const,
      objectId: target.id,
      from: target.zone,
      to: "field" as const,
    },
    ...paymentIds.flatMap((objectId) =>
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
  ];
  const prepared = new GrandArchiveTransactionKernel().transact(initial, events).state;
  return {
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    p1,
    p2,
    sourceId: source.id,
    targetId: target.id,
    paymentIds,
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
  return second;
}

function payments(ids: readonly GrandArchiveObjectId[]) {
  return ids.map((cardId) => ({ kind: "card" as const, cardId }));
}

describe("Grand Archive die calculations", () => {
  it("rolls Unstable Voltage's two D6 independently and deals their recorded total", () => {
    const fixture = setup(unstableVoltage);
    const activated = fixture.runtime.execute(
      {
        move: "activate-card",
        cardId: fixture.sourceId,
        targets: { "target-1": [fixture.targetId] },
        reservePayment: payments(fixture.paymentIds.slice(0, 2)),
      },
      { playerId: fixture.p1 },
    );
    if (!activated.ok) throw new Error(activated.message);
    const resolved = resolveTop(fixture.runtime, fixture.p1, fixture.p2);
    const rolls = resolved.events.flatMap((event) =>
      event.type === "random-state-changed" && event.result?.kind === "die-roll"
        ? [event.result]
        : [],
    );

    expect(rolls).toHaveLength(2);
    expect(rolls.every((roll) => roll.sides === 6 && roll.results.length === 1)).toBe(true);
    expect(fixture.runtime.state.objects[fixture.targetId]?.damage).toBe(
      rolls.reduce((total, roll) => total + roll.total, 0),
    );
    expect(fixture.runtime.state.random.cursor).toBeGreaterThanOrEqual(2);
  });

  it("rolls Lesser Boon of Rakko's D6+D6 once and selects the matching branch", () => {
    const fixture = setup(lesserBoonOfRakko);
    fixture.runtime = new GrandArchiveMatchRuntime(
      createGrandArchiveMatchProgram([champion, ally, filler, lesserBoonOfRakko]),
      { ...fixture.runtime.state, random: { seed: 1, cursor: 0 } },
    );
    const activated = fixture.runtime.execute(
      {
        move: "activate-ability",
        sourceId: fixture.sourceId,
        abilityId: "V8aPGgLyh5-a1",
        reservePayment: payments(fixture.paymentIds),
      },
      { playerId: fixture.p1 },
    );
    if (!activated.ok) throw new Error(activated.message);
    const handBeforeResolution = fixture.runtime.state.zones[fixture.p1].hand.length;
    const resolved = resolveTop(fixture.runtime, fixture.p1, fixture.p2);
    const roll = resolved.events.find(
      (event) => event.type === "random-state-changed" && event.result?.kind === "die-roll",
    );
    if (!roll || roll.type !== "random-state-changed" || !roll.result) {
      throw new Error("Missing Rakko die roll");
    }

    expect(roll.result).toEqual({ kind: "die-roll", sides: 6, results: [4, 5], total: 9 });
    expect(fixture.runtime.state.zones[fixture.p1].hand).toHaveLength(handBeforeResolution + 1);
    expect(fixture.runtime.state.random).toEqual({ seed: 1, cursor: 2 });
  });
});
