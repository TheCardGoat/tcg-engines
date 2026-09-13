import { diablerie, ordainedCharisma, pangTongYoungPhoenix } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
  GrandArchivePlayableCardType,
  GrandArchiveSupertype,
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
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import {
  chooseGrandArchiveReplacement,
  collectGrandArchiveReplacementCandidates,
} from "../replacements/replacements.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { collectGrandArchiveStateBasedEvents } from "./state-based.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
  supertypes: readonly GrandArchiveSupertype[] = [],
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
        typeLine: {
          supertypes,
          types: [type],
          classes: ["CLERIC"],
          subtypes: [],
        },
        elements: ["NORM"],
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 2, life: 10 }
              : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("control-champion", "CHAMPION");
const ally = card("control-ally", "ALLY");
const regalia = card("control-regalia", "ITEM", ["REGALIA"]);

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    ally,
    regalia,
    ordainedCharisma,
    diablerie,
    pangTongYoungPhoenix,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: ally.canonicalId, count: 2 },
      { definitionId: regalia.canonicalId, count: 2 },
      { definitionId: ordainedCharisma.canonicalId, count: 1 },
      { definitionId: diablerie.canonicalId, count: 1 },
      { definitionId: pangTongYoungPhoenix.canonicalId, count: 1 },
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
      randomSeed: 911,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return {
    program,
    state,
    p1: grandArchivePlayerId("p1"),
    p2: grandArchivePlayerId("p2"),
  };
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

function executeEffect(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  controllerId: ReturnType<typeof grandArchivePlayerId>,
  effect: GrandArchiveEffect,
  sourceId?: GrandArchiveObjectId,
  bindings: Readonly<Record<string, readonly GrandArchiveObjectId[]>> = {},
) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    effect,
    {
      program,
      state,
      controllerId,
      ...(sourceId ? { sourceId, abilityBearerId: sourceId } : {}),
      bindings,
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

function settleStateBased(program: GrandArchiveMatchProgram, state: GrandArchiveMatchState) {
  const kernel = new GrandArchiveTransactionKernel();
  let settled = state;
  for (let pass = 0; pass < 32; pass += 1) {
    const events = collectGrandArchiveStateBasedEvents(program, settled);
    if (events.length === 0) return settled;
    settled = kernel.transact(settled, events).state;
  }
  throw new Error("State-based control settlement did not converge");
}

function cardResolutionEffect(
  definition: typeof ordainedCharisma | typeof diablerie | typeof pangTongYoungPhoenix,
) {
  const face =
    definition.layout.kind === "single-faced"
      ? definition.layout.face
      : definition.layout.defaultFace;
  const resolution = face.abilities.find((ability) => ability.kind === "card-resolution");
  if (resolution) return resolution.effect;
  const staticAbility = face.abilities.find(
    (ability) => ability.kind === "static" && ability.staticKind === "effects",
  );
  const replacement = staticAbility?.effects.find((effect) => effect.kind === "replacement");
  if (replacement) return replacement;
  throw new Error(`Missing resolution ability for ${definition.slug}`);
}

describe("Grand Archive control and replacement effects", () => {
  it("applies Ordained Charisma as temporary control without changing ownership", () => {
    const fixture = setup();
    const targetId = objectIds(fixture.state, fixture.p2, ally.canonicalId)[0]!;
    const sourceId = objectIds(fixture.state, fixture.p1, ordainedCharisma.canonicalId)[0]!;
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: targetId, from: "main-deck", to: "field" },
      { type: "object-state-changed", objectId: targetId, state: "rested", value: true },
    ]).state;
    const resolved = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      cardResolutionEffect(ordainedCharisma),
      sourceId,
      { "target-1": [targetId] },
    );
    const controlled = settleStateBased(fixture.program, resolved.state);
    expect(controlled.objects[targetId]).toMatchObject({
      ownerId: fixture.p2,
      baseControllerId: fixture.p2,
      controllerId: fixture.p1,
    });
    expect(controlled.objects[targetId]?.states.has("rested")).toBe(false);

    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(controlled))),
    );
    expect(restored.objects[targetId]?.controllerId).toBe(fixture.p1);
    const nextTurn = new GrandArchiveTransactionKernel().transact(restored, [
      { type: "turn-started", playerId: fixture.p2, turnNumber: 2 },
    ]).state;
    const reverted = settleStateBased(fixture.program, nextTurn);
    expect(reverted.objects[targetId]).toMatchObject({
      ownerId: fixture.p2,
      baseControllerId: fixture.p2,
      controllerId: fixture.p2,
    });
    expect(reverted.continuousEffects).toEqual([]);
  });

  it("layers control by timestamp and restores the underlying permanent controller", () => {
    const fixture = setup();
    const targetId = objectIds(fixture.state, fixture.p2, ally.canonicalId)[0]!;
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: targetId, from: "main-deck", to: "field" },
    ]).state;
    const permanentlyChanged = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      {
        kind: "change-control",
        subject: { kind: "bound", binding: "target" },
        controller: "controller",
      },
      undefined,
      { target: [targetId] },
    ).state;
    expect(permanentlyChanged.objects[targetId]).toMatchObject({
      ownerId: fixture.p2,
      baseControllerId: fixture.p1,
      controllerId: fixture.p1,
    });

    const older = executeEffect(
      fixture.program,
      permanentlyChanged,
      fixture.p2,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "control", modifies: "control" },
        change: { kind: "control", controller: "controller" },
      },
      undefined,
      { target: [targetId] },
    );
    const newer = executeEffect(
      fixture.program,
      older.state,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "this-turn" },
        layer: { layer: "control", modifies: "control" },
        change: { kind: "control", controller: "controller" },
      },
      undefined,
      { target: [targetId] },
    );
    const newestWins = settleStateBased(fixture.program, newer.state);
    expect(newestWins.objects[targetId]?.controllerId).toBe(fixture.p1);

    const nextTurn = new GrandArchiveTransactionKernel().transact(newestWins, [
      { type: "turn-started", playerId: fixture.p2, turnNumber: 2 },
    ]).state;
    const olderRestored = settleStateBased(fixture.program, nextTurn);
    expect(olderRestored.objects[targetId]).toMatchObject({
      ownerId: fixture.p2,
      baseControllerId: fixture.p1,
      controllerId: fixture.p2,
    });
    expect(olderRestored.continuousEffects).toHaveLength(1);
  });

  it("applies control effects that read later characteristic layers after independent control", () => {
    const fixture = setup();
    const targetId = objectIds(fixture.state, fixture.p2, ally.canonicalId)[0]!;
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: targetId, from: "main-deck", to: "field" },
    ]).state;
    const olderCharacteristicDependent = executeEffect(fixture.program, entered, fixture.p1, {
      kind: "continuous",
      subjects: {
        kind: "each",
        collection: { zones: ["field"], filter: { kind: "type", oneOf: ["ALLY"] } },
      },
      affectedSet: "dynamic",
      duration: { kind: "permanent" },
      layer: { layer: "control", modifies: "control" },
      change: { kind: "control", controller: "controller" },
    }).state;
    const newerIndependent = executeEffect(
      fixture.program,
      olderCharacteristicDependent,
      fixture.p2,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "control", modifies: "control" },
        change: { kind: "control", controller: "controller" },
      },
      undefined,
      { target: [targetId] },
    ).state;

    expect(
      settleStateBased(fixture.program, newerIndependent).objects[targetId]?.controllerId,
    ).toBe(fixture.p1);
  });

  it("does not follow a locked control effect across a zone-change incarnation", () => {
    const fixture = setup();
    const targetId = objectIds(fixture.state, fixture.p2, ally.canonicalId)[0]!;
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: targetId, from: "main-deck", to: "field" },
    ]).state;
    const temporary = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "this-turn" },
        layer: { layer: "control", modifies: "control" },
        change: { kind: "control", controller: "controller" },
      },
      undefined,
      { target: [targetId] },
    );
    const controlled = settleStateBased(fixture.program, temporary.state);
    expect(controlled.objects[targetId]?.controllerId).toBe(fixture.p1);
    const returned = new GrandArchiveTransactionKernel().transact(controlled, [
      { type: "object-moved", objectId: targetId, from: "field", to: "graveyard" },
      { type: "object-moved", objectId: targetId, from: "graveyard", to: "field" },
    ]).state;
    const settled = settleStateBased(fixture.program, returned);
    expect(settled.objects[targetId]).toMatchObject({
      ownerId: fixture.p2,
      baseControllerId: fixture.p2,
      controllerId: fixture.p2,
      objectVersion: 4,
    });
    expect(settled.continuousEffects).toHaveLength(1);
  });

  it("keeps an object's resolved replacement active only while its source is on the field", () => {
    const fixture = setup();
    const sourceId = objectIds(fixture.state, fixture.p1, pangTongYoungPhoenix.canonicalId)[0]!;
    const allyId = objectIds(fixture.state, fixture.p1, ally.canonicalId)[0]!;
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: sourceId,
        from: "main-deck",
        to: "field",
        newControllerId: fixture.p1,
      },
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
    ]).state;
    const active = settleStateBased(fixture.program, entered);
    const rulesKernel = new GrandArchiveTransactionKernel({
      collectReplacements: (state, event) =>
        collectGrandArchiveReplacementCandidates(fixture.program, state, event),
      chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
    });
    const reduced = rulesKernel.transact(active, [
      { type: "damage-marked", objectId: allyId, amount: 5 },
    ]).state;
    expect(reduced.objects[allyId]?.damage).toBe(3);

    const departed = rulesKernel.transact(reduced, [
      { type: "object-moved", objectId: sourceId, from: "field", to: "graveyard" },
    ]).state;
    const expired = settleStateBased(fixture.program, departed);
    expect(expired.replacementEffects).toEqual([]);
    const unmodified = rulesKernel.transact(expired, [
      { type: "damage-marked", objectId: allyId, amount: 5 },
    ]).state;
    expect(unmodified.objects[allyId]?.damage).toBe(8);
  });

  it("persists, applies, and consumes Diablerie's next-entry replacement", () => {
    const fixture = setup();
    const sourceId = objectIds(fixture.state, fixture.p1, diablerie.canonicalId)[0]!;
    const [unrelatedId] = objectIds(fixture.state, fixture.p2, ally.canonicalId);
    const [firstRegaliaId, secondRegaliaId] = objectIds(
      fixture.state,
      fixture.p2,
      regalia.canonicalId,
    );
    const created = executeEffect(
      fixture.program,
      fixture.state,
      fixture.p1,
      cardResolutionEffect(diablerie),
      sourceId,
    ).state;
    expect(created.replacementEffects).toHaveLength(1);
    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(created))),
    );
    const rulesKernel = new GrandArchiveTransactionKernel({
      collectReplacements: (state, event) =>
        collectGrandArchiveReplacementCandidates(fixture.program, state, event),
      chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
    });
    const unrelated = rulesKernel.transact(restored, [
      {
        type: "object-moved",
        objectId: unrelatedId!,
        from: "main-deck",
        to: "field",
      },
    ]).state;
    expect(unrelated.replacementEffects).toHaveLength(1);
    const replaced = rulesKernel.transact(unrelated, [
      {
        type: "object-moved",
        objectId: firstRegaliaId!,
        from: "main-deck",
        to: "field",
      },
    ]);
    expect(replaced.state.objects[firstRegaliaId!]).toMatchObject({
      ownerId: fixture.p2,
      baseControllerId: fixture.p1,
      controllerId: fixture.p1,
    });
    expect(replaced.result.events.map((event) => event.type)).toEqual([
      "object-moved",
      "replacement-effect-consumed",
    ]);
    expect(replaced.state.replacementEffects).toEqual([]);

    const later = rulesKernel.transact(replaced.state, [
      {
        type: "object-moved",
        objectId: secondRegaliaId!,
        from: "main-deck",
        to: "field",
      },
    ]).state;
    expect(later.objects[secondRegaliaId!]).toMatchObject({
      ownerId: fixture.p2,
      baseControllerId: fixture.p2,
      controllerId: fixture.p2,
    });
  });
});
