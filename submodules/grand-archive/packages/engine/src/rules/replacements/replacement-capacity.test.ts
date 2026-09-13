import { protectiveFractal, provokeObstinance } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
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
  type: "ACTION" | "ALLY" | "CHAMPION",
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
        typeLine: { supertypes: [], types: [type], classes: ["CLERIC"], subtypes: [] },
        elements: ["WATER"],
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 10 }
              : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("replacement-capacity-champion", "CHAMPION");
const ally = card("replacement-capacity-ally", "ALLY");
const filler = card("replacement-capacity-filler", "ACTION");

function replacementInside(effect: GrandArchiveEffect): GrandArchiveReplacementEffect {
  if (effect.kind === "replacement") return effect;
  if (effect.kind === "sequence") {
    const replacement = effect.effects.find((child) => child.kind === "replacement");
    if (replacement?.kind === "replacement") return replacement;
  }
  throw new Error("Expected a catalog replacement effect");
}

function catalogReplacement(
  definition: typeof protectiveFractal | typeof provokeObstinance,
): GrandArchiveReplacementEffect {
  const face =
    definition.layout.kind === "single-faced"
      ? definition.layout.face
      : definition.layout.defaultFace;
  const ability = face.abilities.find(
    (candidate) => candidate.kind === "activated" || candidate.kind === "card-resolution",
  );
  if (!ability || !("effect" in ability) || !ability.effect) {
    throw new Error(`Missing effect on ${definition.slug}`);
  }
  return replacementInside(ability.effect);
}

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    ally,
    filler,
    protectiveFractal,
    provokeObstinance,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: ally.canonicalId, count: 2 },
      { definitionId: filler.canonicalId, count: 4 },
      ...(id === "p1"
        ? [
            { definitionId: protectiveFractal.canonicalId, count: 1 },
            { definitionId: provokeObstinance.canonicalId, count: 1 },
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
      randomSeed: 821,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, state, p1: grandArchivePlayerId("p1") };
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
  bindings: Readonly<Record<string, readonly GrandArchiveObjectId[]>>,
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
      bindings,
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  ).state;
}

function replacementKernel(program: ReturnType<typeof createGrandArchiveMatchProgram>) {
  return new GrandArchiveTransactionKernel({
    collectReplacements: (state, event) =>
      collectGrandArchiveReplacementCandidates(program, state, event),
    chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
  });
}

describe("Grand Archive shielding replacement capacity", () => {
  it("locks, consumes, and snapshots Protective Fractal's shared damage buffer", () => {
    const fixture = setup();
    const championId = fixture.state.zones[fixture.p1].field[0]!;
    const sourceId = objectIds(fixture.state, fixture.p1, protectiveFractal.canonicalId)[0]!;
    const created = createReplacement(
      fixture,
      fixture.state,
      catalogReplacement(protectiveFractal),
      sourceId,
      { "target-1": [championId] },
    );
    expect(created.replacementEffects[0]?.capacity).toEqual({
      scope: "replacement-instance",
      initial: 1,
      remaining: 1,
    });

    const kernel = replacementKernel(fixture.program);
    const unpreventable = kernel.transact(created, [
      {
        type: "damage-marked",
        objectId: championId,
        amount: 3,
        sourceId,
        preventable: false,
      },
    ]);
    expect(unpreventable.state.objects[championId]?.damage).toBe(3);
    expect(unpreventable.state.replacementEffects[0]?.capacity).toMatchObject({ remaining: 1 });

    const first = kernel.transact(unpreventable.state, [
      { type: "damage-marked", objectId: championId, amount: 3, sourceId },
    ]);
    expect(first.state.objects[championId]?.damage).toBe(5);
    expect(first.result.events.map((event) => event.type)).toEqual([
      "damage-marked",
      "damage-prevented",
      "replacement-capacity-consumed",
    ]);
    expect(first.state.replacementEffects[0]?.capacity).toMatchObject({ remaining: 0 });

    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(first.state))),
    );
    const second = kernel.transact(restored, [
      { type: "damage-marked", objectId: championId, amount: 2, sourceId },
    ]);
    expect(second.state.objects[championId]?.damage).toBe(7);
    expect(second.result.events.map((event) => event.type)).toEqual(["damage-marked"]);
  });

  it("tracks Provoke Obstinance's two-point buffer independently for every protected unit", () => {
    const fixture = setup();
    const [firstAllyId, secondAllyId] = objectIds(fixture.state, fixture.p1, ally.canonicalId);
    const sourceId = objectIds(fixture.state, fixture.p1, provokeObstinance.canonicalId)[0]!;
    if (!firstAllyId || !secondAllyId) throw new Error("Missing protected allies");
    const staged = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: firstAllyId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: secondAllyId, from: "main-deck", to: "field" },
    ]).state;
    const created = createReplacement(
      fixture,
      staged,
      catalogReplacement(provokeObstinance),
      sourceId,
      { "target-objects": [firstAllyId, secondAllyId] },
    );
    const kernel = replacementKernel(fixture.program);
    const first = kernel.transact(created, [
      { type: "damage-marked", objectId: firstAllyId, amount: 3, sourceId },
      { type: "damage-marked", objectId: secondAllyId, amount: 3, sourceId },
    ]);
    expect(first.state.objects[firstAllyId]?.damage).toBe(1);
    expect(first.state.objects[secondAllyId]?.damage).toBe(1);
    expect(first.state.replacementEffects[0]?.capacity).toMatchObject({
      scope: "per-object",
      initial: 2,
      remainingByObject: {
        [firstAllyId]: { incarnation: 2, remaining: 0 },
        [secondAllyId]: { incarnation: 2, remaining: 0 },
      },
    });

    const second = kernel.transact(first.state, [
      { type: "damage-marked", objectId: firstAllyId, amount: 1, sourceId },
      { type: "damage-marked", objectId: secondAllyId, amount: 1, sourceId },
    ]);
    expect(second.state.objects[firstAllyId]?.damage).toBe(2);
    expect(second.state.objects[secondAllyId]?.damage).toBe(2);
  });
});
