import { aeneanSwellingGusts, elysianOrphan } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

const champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "elysian-aura-test-champion",
  slug: "elysian-aura-test-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "elysian-aura-test-champion:face:default",
      catalogId: "elysian-aura-test-champion",
      name: "Elysian Aura Test Champion",
      cost: { kind: "none" },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE"],
        subtypes: ["MAGE"],
      },
      elements: ["WIND"],
      stats: { level: 0, life: 30 },
      rulesText: "",
      abilities: [],
    },
  },
};

const levelAura: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "elysian-aura-test-level-aura",
  slug: "elysian-aura-test-level-aura",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "elysian-aura-test-level-aura:face:default",
      catalogId: "elysian-aura-test-level-aura",
      name: "Elysian Aura Test Level Aura",
      cost: { kind: "none" },
      typeLine: { supertypes: [], types: ["ITEM"], classes: ["MAGE"], subtypes: [] },
      elements: ["NORM"],
      stats: {},
      rulesText: "Your champion gets +3 level.",
      abilities: [
        {
          id: "elysianAuraTestLevelAura-a1",
          kind: "static",
          staticKind: "effects",
          text: "Your champion gets +3 level.",
          effects: [
            {
              kind: "continuous",
              subjects: { kind: "champion", player: "controller" },
              affectedSet: "dynamic",
              duration: { kind: "while-source-in-functional-zone" },
              layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
              change: { kind: "numeric", property: "level", operation: "add", amount: 3 },
            },
          ],
        },
      ],
    },
  },
};

const filler: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "elysian-aura-test-filler",
  slug: "elysian-aura-test-filler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "elysian-aura-test-filler:face:default",
      catalogId: "elysian-aura-test-filler",
      name: "Elysian Aura Test Filler",
      cost: { kind: "none" },
      typeLine: { supertypes: [], types: ["ACTION"], classes: ["MAGE"], subtypes: [] },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

function setup(withElysianAura: boolean) {
  const program = createGrandArchiveMatchProgram([
    champion,
    levelAura,
    filler,
    aeneanSwellingGusts,
    elysianOrphan,
  ]);
  const player = (id: string, includeSupport: boolean): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      ...(includeSupport ? [{ definitionId: aeneanSwellingGusts.canonicalId, count: 1 }] : []),
      { definitionId: filler.canonicalId, count: includeSupport ? 5 : 6 },
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(includeSupport
        ? [
            { definitionId: levelAura.canonicalId, count: 1 },
            { definitionId: elysianOrphan.canonicalId, count: 1 },
          ]
        : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1", true), player("p2", false)],
      firstPlayerId: "p1",
      randomSeed: withElysianAura ? 271 : 272,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const spellId = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === aeneanSwellingGusts.canonicalId,
  )!.id;
  const paymentIds = Object.values(initial.objects)
    .filter((object) => object.ownerId === p1 && object.definitionId === filler.canonicalId)
    .slice(0, 2)
    .map((object) => object.id);
  const levelAuraId = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === levelAura.canonicalId,
  )!.id;
  const elysianAuraId = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === elysianOrphan.canonicalId,
  )!.id;
  const targetChampionId = initial.zones[p2].field[0]!;
  const positioned = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: spellId, from: "main-deck", to: "hand" },
    ...paymentIds.map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: "main-deck" as const,
      to: "hand" as const,
    })),
    { type: "object-moved", objectId: levelAuraId, from: "material-deck", to: "field" },
    ...(withElysianAura
      ? [
          {
            type: "object-moved" as const,
            objectId: elysianAuraId,
            from: "material-deck" as const,
            to: "field" as const,
          },
        ]
      : []),
  ]).state;
  const runtime = new GrandArchiveMatchRuntime(program, positioned);
  expect(
    runtime.execute(
      {
        move: "activate-card",
        cardId: spellId,
        reservePayment: paymentIds.map((cardId) => ({ kind: "card", cardId })),
        targets: { "target-1": [targetChampionId] },
      },
      { playerId: p1 },
    ).ok,
  ).toBe(true);
  expect(runtime.state.zones[p1].memory).toHaveLength(2);
  return { program, runtime, p1, p2, elysianAuraId };
}

function resolveTopStackItem(
  runtime: GrandArchiveMatchRuntime,
  p1: ReturnType<typeof grandArchivePlayerId>,
  p2: ReturnType<typeof grandArchivePlayerId>,
) {
  expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
  expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
}

describe("Elysian Aura", () => {
  it("loses a catalog Level 5+ resolution paragraph when Aura is lost before resolution", () => {
    const { program, runtime, p1, p2, elysianAuraId } = setup(true);
    const withoutAura = new GrandArchiveTransactionKernel().transact(runtime.state, [
      { type: "object-moved", objectId: elysianAuraId, from: "field", to: "graveyard" },
    ]).state;
    const resolvingRuntime = new GrandArchiveMatchRuntime(program, withoutAura);

    resolveTopStackItem(resolvingRuntime, p1, p2);

    expect(resolvingRuntime.state.zones[p1].memory).toHaveLength(2);
  });

  it("gains a catalog Level 5+ resolution paragraph when Aura is gained before resolution", () => {
    const { program, runtime, p1, p2, elysianAuraId } = setup(false);
    const withAura = new GrandArchiveTransactionKernel().transact(runtime.state, [
      { type: "object-moved", objectId: elysianAuraId, from: "material-deck", to: "field" },
    ]).state;
    const resolvingRuntime = new GrandArchiveMatchRuntime(program, withAura);

    resolveTopStackItem(resolvingRuntime, p1, p2);

    expect(resolvingRuntime.state.zones[p1].memory).toHaveLength(3);
  });
});
