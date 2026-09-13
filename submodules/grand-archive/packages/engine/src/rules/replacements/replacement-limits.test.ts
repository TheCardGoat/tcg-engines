import { floodwardSergeant, sacredBarrier, senarisSixOfDiamonds } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveReplacementEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import {
  chooseGrandArchiveReplacement,
  collectGrandArchiveReplacementCandidates,
} from "./replacements.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  id: string,
  type: "ACTION" | "CHAMPION" | "ALLY",
  subtypes: readonly string[] = [],
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
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes },
        elements: ["WATER"],
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { power: 1, life: 5 }
              : {},
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("replacement-limit-champion", "CHAMPION");
const spell = card("replacement-limit-spell", "ACTION", ["SPELL", "SUITED"]);
const filler = card("replacement-limit-filler", "ACTION");
const dummyAlly = card("replacement-limit-ally", "ALLY");

function catalogReplacement(
  definition: typeof floodwardSergeant | typeof sacredBarrier | typeof senarisSixOfDiamonds,
): GrandArchiveReplacementEffect {
  const face =
    definition.layout.kind === "single-faced"
      ? definition.layout.face
      : definition.layout.defaultFace;
  for (const candidate of face.abilities) {
    if (
      (candidate.kind === "card-resolution" || candidate.kind === "activated") &&
      "effect" in candidate &&
      candidate.effect?.kind === "replacement"
    )
      return candidate.effect;
    if (candidate.kind === "static" && candidate.staticKind === "effects") {
      const replacement = candidate.effects.find((effect) => effect.kind === "replacement");
      if (replacement) return replacement;
    }
  }
  throw new Error(`Missing replacement on ${definition.slug}`);
}

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    spell,
    filler,
    floodwardSergeant,
    sacredBarrier,
    senarisSixOfDiamonds,
    dummyAlly,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: spell.canonicalId, count: 2 },
      { definitionId: filler.canonicalId, count: 4 },
      ...(id === "p1"
        ? [
            { definitionId: floodwardSergeant.canonicalId, count: 1 },
            { definitionId: sacredBarrier.canonicalId, count: 1 },
            { definitionId: senarisSixOfDiamonds.canonicalId, count: 1 },
            { definitionId: dummyAlly.canonicalId, count: 1 },
          ]
        : []),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 191,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, state, p1: grandArchivePlayerId("p1"), p2: grandArchivePlayerId("p2") };
}

function objectIds(
  state: GrandArchiveMatchState,
  ownerId: ReturnType<typeof grandArchivePlayerId>,
  definitionId: string,
): GrandArchiveObjectId[] {
  return Object.values(state.objects)
    .filter((object) => object.ownerId === ownerId && object.definitionId === definitionId)
    .map((object) => object.id);
}

function createReplacement(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  effect: GrandArchiveReplacementEffect,
  sourceId: GrandArchiveObjectId,
) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    effect,
    {
      program: fixture.program,
      state,
      controllerId: fixture.p1,
      sourceId,
      abilityBearerId: sourceId,
      bindings: {},
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  ).state;
}

function rulesKernel(program: ReturnType<typeof createGrandArchiveMatchProgram>) {
  return new GrandArchiveTransactionKernel({
    collectReplacements: (state, event) =>
      collectGrandArchiveReplacementCandidates(program, state, event),
    chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
  });
}

describe("Grand Archive replacement application limits", () => {
  it("applies Floodward Sergeant's prevention once each turn and persists usage in snapshots", () => {
    const fixture = setup();
    const sourceId = objectIds(fixture.state, fixture.p1, floodwardSergeant.canonicalId)[0]!;
    const onField = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "field" },
    ]).state;
    const kernel = rulesKernel(fixture.program);
    const first = kernel.transact(onField, [
      { type: "damage-marked", objectId: sourceId, amount: 2 },
      { type: "damage-marked", objectId: sourceId, amount: 2 },
    ]);
    expect(first.state.objects[sourceId]?.damage).toBe(2);
    expect(
      first.result.events.filter((event) => event.type === "replacement-limit-used"),
    ).toHaveLength(1);

    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(first.state))),
    );
    const nextTurn = kernel.transact(restored, [
      { type: "turn-started", playerId: fixture.p2, turnNumber: 2 },
      { type: "damage-marked", objectId: sourceId, amount: 2 },
    ]);
    expect(nextTurn.state.objects[sourceId]?.damage).toBe(2);
    expect(
      Object.values(nextTurn.state.replacementLimitUsages).reduce((total, uses) => total + uses, 0),
    ).toBe(2);
  });

  it("tracks Senaris's three modifications independently for each damage source instance", () => {
    const fixture = setup();
    const championId = fixture.state.zones[fixture.p1].field[0]!;
    const sourceId = objectIds(fixture.state, fixture.p1, senarisSixOfDiamonds.canonicalId)[0]!;
    const [firstSpellId, secondSpellId] = objectIds(fixture.state, fixture.p1, spell.canonicalId);
    if (!firstSpellId || !secondSpellId) throw new Error("Missing spell sources");
    const staged = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: firstSpellId, from: "main-deck", to: "effects-stack" },
      { type: "object-moved", objectId: secondSpellId, from: "main-deck", to: "effects-stack" },
    ]).state;
    const created = createReplacement(
      fixture,
      staged,
      catalogReplacement(senarisSixOfDiamonds),
      sourceId,
    );
    const kernel = rulesKernel(fixture.program);
    const result = kernel.transact(created, [
      ...Array.from({ length: 4 }, () => ({
        type: "damage-marked" as const,
        objectId: championId,
        amount: 1,
        sourceId: firstSpellId,
      })),
      { type: "damage-marked", objectId: championId, amount: 1, sourceId: secondSpellId },
    ]);

    expect(result.state.objects[championId]?.damage).toBe(17);
    expect(
      result.result.events.filter((event) => event.type === "replacement-limit-used"),
    ).toHaveLength(4);
    expect(Object.values(result.state.replacementLimitUsages).sort()).toEqual([1, 3]);
  });

  it("applies Sacred Barrier once for each protected object instance", () => {
    const fixture = setup();
    const firstAllyId = objectIds(fixture.state, fixture.p1, dummyAlly.canonicalId)[0];
    const sourceId = objectIds(fixture.state, fixture.p1, sacredBarrier.canonicalId)[0]!;
    const secondAllyId = objectIds(fixture.state, fixture.p1, senarisSixOfDiamonds.canonicalId)[0]!;
    if (!firstAllyId || !secondAllyId) throw new Error("Missing protected allies");
    const staged = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: firstAllyId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: secondAllyId, from: "main-deck", to: "field" },
    ]).state;
    const created = createReplacement(fixture, staged, catalogReplacement(sacredBarrier), sourceId);
    const kernel = rulesKernel(fixture.program);
    const result = kernel.transact(created, [
      { type: "damage-marked", objectId: firstAllyId, amount: 5, combatDamage: false },
      { type: "damage-marked", objectId: secondAllyId, amount: 5, combatDamage: false },
      { type: "damage-marked", objectId: firstAllyId, amount: 2, combatDamage: false },
      { type: "damage-marked", objectId: secondAllyId, amount: 2, combatDamage: false },
    ]);

    expect(result.state.objects[firstAllyId]?.damage).toBe(3);
    expect(result.state.objects[secondAllyId]?.damage).toBe(3);
    expect(
      result.result.events.filter((event) => event.type === "replacement-limit-used"),
    ).toHaveLength(2);
    expect(Object.values(result.state.replacementLimitUsages).sort()).toEqual([1, 1]);

    const reentered = kernel.transact(result.state, [
      { type: "object-moved", objectId: firstAllyId, from: "field", to: "graveyard" },
      { type: "object-moved", objectId: firstAllyId, from: "graveyard", to: "field" },
      { type: "damage-marked", objectId: firstAllyId, amount: 5, combatDamage: false },
    ]);
    expect(reentered.state.objects[firstAllyId]?.damage).toBe(1);
    expect(Object.values(reentered.state.replacementLimitUsages).sort()).toEqual([1, 1, 1]);
  });
});
