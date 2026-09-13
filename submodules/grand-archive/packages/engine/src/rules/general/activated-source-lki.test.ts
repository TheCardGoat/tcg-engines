import { aquaVitae, extinguishingSynchron, wildgrowthElixir } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import {
  grandArchiveLastKnownObject,
  grandArchiveObjectCounterCount,
} from "../../procedures/effects/evaluation.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

const champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "activated-source-lki-champion",
  slug: "activated-source-lki-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "activated-source-lki-champion:face:default",
      catalogId: "activated-source-lki-champion",
      name: "Activated Source LKI Champion",
      cost: { kind: "memory", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC"],
      },
      elements: ["NORM"],
      stats: { level: 0, life: 20 },
      rulesText: "",
      abilities: [],
    },
  },
};

const filler: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "activated-source-lki-filler",
  slug: "activated-source-lki-filler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "activated-source-lki-filler:face:default",
      catalogId: "activated-source-lki-filler",
      name: "Activated Source LKI Filler",
      cost: { kind: "reserve", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
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

const ally: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "activated-source-lki-ally",
  slug: "activated-source-lki-ally",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "activated-source-lki-ally:face:default",
      catalogId: "activated-source-lki-ally",
      name: "Activated Source LKI Ally",
      cost: { kind: "reserve", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: [],
      },
      elements: ["NORM"],
      stats: { power: 1, life: 10 },
      rulesText: "",
      abilities: [],
    },
  },
};

function setupSource(
  sourceDefinition: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  counter: string,
  counterCount: number,
) {
  const program = createGrandArchiveMatchProgram([champion, ally, filler, sourceDefinition]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: sourceDefinition.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: ally.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: filler.canonicalId, count: 12 },
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
      randomSeed: 821,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const source = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === sourceDefinition.canonicalId,
  );
  const allyObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === ally.canonicalId,
  );
  const championObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === champion.canonicalId,
  );
  if (!source || !allyObject || !championObject) {
    throw new Error("Missing activated source LKI fixture object");
  }
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    {
      type: "object-moved",
      objectId: source.id,
      from: source.zone,
      to: "field",
      entryFacing: "face-up",
    },
    {
      type: "counter-changed",
      objectId: source.id,
      counter,
      delta: counterCount,
    },
    {
      type: "object-moved",
      objectId: allyObject.id,
      from: allyObject.zone,
      to: "field",
      entryFacing: "face-up",
    },
  ]).state;
  return {
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    p1,
    p2,
    sourceId: source.id,
    allyId: allyObject.id,
    championId: championObject.id,
  };
}

function activateAndResolveAquaVitae(ageCounters: number): number {
  const fixture = setupSource(aquaVitae, "named:age", ageCounters);
  const handBefore = fixture.runtime.state.zones[fixture.p1].hand.length;
  const activated = fixture.runtime.execute(
    {
      move: "activate-ability",
      sourceId: fixture.sourceId,
      abilityId: "y5ttkat9hr-a3",
    },
    { playerId: fixture.p1 },
  );
  if (!activated.ok) throw new Error(activated.message);
  expect(fixture.runtime.state.objects[fixture.sourceId]?.zone).toBe("graveyard");
  const activatedItem = fixture.runtime.state.stack.find(
    (item) => item.kind === "activated-ability" && item.sourceId === fixture.sourceId,
  );
  expect(activatedItem?.sourceLkiEventId).toBeDefined();
  expect(activatedItem?.sourceIncarnation).toBe(
    fixture.runtime.state.objects[fixture.sourceId]?.incarnation,
  );
  const lastKnownSource = grandArchiveLastKnownObject(fixture.runtime.state, fixture.sourceId);
  expect(lastKnownSource).toBeDefined();
  expect(grandArchiveObjectCounterCount(lastKnownSource!, { named: "age" })).toBe(ageCounters);

  for (const playerId of [fixture.p1, fixture.p2]) {
    const passed = fixture.runtime.execute({ move: "pass" }, { playerId });
    if (!passed.ok) throw new Error(passed.message);
  }
  return fixture.runtime.state.zones[fixture.p1].hand.length - handBefore;
}

function resolveTop(
  runtime: GrandArchiveMatchRuntime,
  playerIds: readonly [
    ReturnType<typeof grandArchivePlayerId>,
    ReturnType<typeof grandArchivePlayerId>,
  ],
): void {
  for (const playerId of playerIds) {
    const passed = runtime.execute({ move: "pass" }, { playerId });
    if (!passed.ok) throw new Error(passed.message);
  }
}

describe("Grand Archive activated source last-known information", () => {
  it("uses Aqua Vitae's sacrificed source counters for its resolving threshold", () => {
    expect(activateAndResolveAquaVitae(3)).toBe(2);
  });

  it("does not grant Aqua Vitae's additional draw below its resolving threshold", () => {
    expect(activateAndResolveAquaVitae(2)).toBe(1);
  });

  it("derives Wildgrowth Elixir's buff counters from its sacrificed source", () => {
    const fixture = setupSource(wildgrowthElixir, "named:age", 4);
    const activated = fixture.runtime.execute(
      {
        move: "activate-ability",
        sourceId: fixture.sourceId,
        abilityId: "tjot4nmxqs-a3",
        targets: { "target-1": [fixture.allyId] },
      },
      { playerId: fixture.p1 },
    );
    if (!activated.ok) throw new Error(activated.message);
    resolveTop(fixture.runtime, [fixture.p1, fixture.p2]);

    expect(
      grandArchiveObjectCounterCount(fixture.runtime.state.objects[fixture.allyId]!, "buff"),
    ).toBe(4);
  });

  it("derives Extinguishing Synchron's recovery from its sacrificed source", () => {
    const fixture = setupSource(extinguishingSynchron, "named:refinement", 3);
    fixture.runtime = new GrandArchiveMatchRuntime(
      fixture.runtime.program,
      new GrandArchiveTransactionKernel().transact(fixture.runtime.state, [
        { type: "damage-marked", objectId: fixture.championId, amount: 6 },
      ]).state,
    );
    const activated = fixture.runtime.execute(
      {
        move: "activate-ability",
        sourceId: fixture.sourceId,
        abilityId: "Tx8noEw78s-a2",
      },
      { playerId: fixture.p1 },
    );
    if (!activated.ok) throw new Error(activated.message);
    resolveTop(fixture.runtime, [fixture.p1, fixture.p2]);

    expect(fixture.runtime.state.objects[fixture.championId]?.damage).toBe(1);
  });
});
