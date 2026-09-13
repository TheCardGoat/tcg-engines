import { astralShard, greaterBoonOfLuxera } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { declareGrandArchiveResolutionChoice } from "../activation/activation.ts";
import { executeGrandArchiveEffect } from "./effect-executor.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function card(
  id: string,
  name: string,
  type: "ACTION" | "CHAMPION",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
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
        name,
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const generatedCardsSelection: Extract<GrandArchiveEffect, { readonly kind: "generate-selected" }> =
  {
    kind: "generate-selected",
    player: "controller",
    selection: {
      id: "generated-actions",
      kind: "choice",
      declared: "resolution",
      chooser: "controller",
      count: { kind: "any-number" },
      candidates: {
        kind: "catalog-card",
        filter: { kind: "type", oneOf: ["ACTION"] },
      },
    },
    destination: { zone: "field" },
  };

const champion = card("generation-champion", "Generation Champion", "CHAMPION", [
  {
    id: "generationChampion-a1",
    kind: "activated",
    activation: "ability",
    cost: { kind: "pay-reserve", amount: 0 },
    text: "Generate any amount of Action cards and put them onto the field.",
    effect: generatedCardsSelection,
  },
]);
const forbiddenCard = card("generation-forbidden", "Forbidden Formula", "ACTION");
const allowedCard = card("generation-allowed", "Allowed Formula", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    forbiddenCard,
    allowedCard,
    astralShard,
    greaterBoonOfLuxera,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: forbiddenCard.canonicalId, count: 3 },
      { definitionId: allowedCard.canonicalId, count: 3 },
      ...(id === "p1" ? [{ definitionId: greaterBoonOfLuxera.canonicalId, count: 1 }] : []),
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
      randomSeed: 617,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const boon = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === greaterBoonOfLuxera.canonicalId,
  );
  if (!boon) throw new Error("Missing Greater Boon of Luxera fixture card");
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: boon.id, from: boon.zone, to: "pantheon" },
    { type: "object-facing-changed", objectId: boon.id, facing: "face-up" },
    {
      type: "object-characteristic-tracked",
      objectId: boon.id,
      key: "chosen-card-name",
      values: ["Forbidden Formula"],
    },
  ]).state;
  return {
    program,
    prepared,
    p1,
    p2,
    boonId: boon.id,
    championId: prepared.zones[p1].field[0]!,
  };
}

function definitionCount(
  state: ReturnType<typeof setup>["prepared"],
  definitionId: string,
): number {
  return Object.values(state.objects).filter((object) => object.definitionId === definitionId)
    .length;
}

function executeGenerate(
  fixture: ReturnType<typeof setup>,
  cardId: string,
  state = fixture.prepared,
) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    { kind: "generate", card: cardId, player: "controller" },
    {
      program: fixture.program,
      state,
      controllerId: fixture.p1,
      sourceId: fixture.championId,
      abilityBearerId: fixture.championId,
      bindings: {},
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

describe("Grand Archive generation prohibitions", () => {
  it("excludes non-card representations from card-name and catalog-card choices", () => {
    const fixture = setup();
    const face =
      greaterBoonOfLuxera.layout.kind === "single-faced"
        ? greaterBoonOfLuxera.layout.face
        : greaterBoonOfLuxera.layout.defaultFace;
    const ability = face.abilities.find((candidate) => candidate.id === "Klb4tguLek-a2");
    if (!ability || ability.kind !== "triggered") {
      throw new Error("Missing Greater Boon of Luxera name-choice ability");
    }
    const boonEffect = ability.effect;
    if (!boonEffect || boonEffect.kind !== "sequence") {
      throw new Error("Missing Greater Boon of Luxera name-choice effect");
    }
    const chooseName = boonEffect.effects.find((effect) => effect.kind === "choose-value");
    if (!chooseName) throw new Error("Missing Greater Boon of Luxera name choice");

    const evaluation = {
      program: fixture.program,
      state: fixture.prepared,
      controllerId: fixture.p1,
      sourceId: fixture.boonId,
      abilityBearerId: fixture.boonId,
      bindings: {},
    };
    expect(() =>
      declareGrandArchiveResolutionChoice(chooseName.selection, "Astral Shard", evaluation),
    ).toThrow("Characteristic choice is not available");
    expect(
      declareGrandArchiveResolutionChoice(chooseName.selection, "Allowed Formula", evaluation),
    ).toBe("Allowed Formula");

    const catalogChoice = {
      id: "non-champion-card",
      kind: "choice",
      declared: "resolution",
      chooser: "controller",
      count: { kind: "exactly", amount: 1 },
      candidates: {
        kind: "catalog-card",
        filter: { kind: "not", filter: { kind: "type", oneOf: ["CHAMPION"] } },
      },
    } as const;
    expect(() =>
      declareGrandArchiveResolutionChoice(catalogChoice, [astralShard.canonicalId], evaluation),
    ).toThrow("Catalog card choice contains a non-card representation");
    expect(
      declareGrandArchiveResolutionChoice(catalogChoice, [allowedCard.canonicalId], evaluation),
    ).toEqual([allowedCard.canonicalId]);

    const allCatalogCards = { ...catalogChoice, count: { kind: "all" } } as const;
    expect(
      declareGrandArchiveResolutionChoice(
        allCatalogCards,
        [forbiddenCard.canonicalId, allowedCard.canonicalId, greaterBoonOfLuxera.canonicalId],
        evaluation,
      ),
    ).toEqual([
      forbiddenCard.canonicalId,
      allowedCard.canonicalId,
      greaterBoonOfLuxera.canonicalId,
    ]);
  });

  it("applies Greater Boon of Luxera's chosen-name restriction to direct generation", () => {
    const fixture = setup();
    const forbiddenBefore = definitionCount(fixture.prepared, forbiddenCard.canonicalId);
    const forbidden = executeGenerate(fixture, forbiddenCard.canonicalId);
    expect(forbidden.events).toEqual([]);
    expect(definitionCount(forbidden.state, forbiddenCard.canonicalId)).toBe(forbiddenBefore);

    const allowedBefore = definitionCount(fixture.prepared, allowedCard.canonicalId);
    const allowed = executeGenerate(fixture, allowedCard.canonicalId);
    expect(definitionCount(allowed.state, allowedCard.canonicalId)).toBe(allowedBefore + 1);
    expect(
      Object.values(allowed.state.objects).some(
        (object) =>
          object.definitionId === allowedCard.canonicalId &&
          object.ownerId === fixture.p1 &&
          object.zone === "hand",
      ),
    ).toBe(true);

    const inactive = new GrandArchiveTransactionKernel().transact(fixture.prepared, [
      { type: "object-facing-changed", objectId: fixture.boonId, facing: "face-down" },
    ]).state;
    const noLongerForbidden = executeGenerate(fixture, forbiddenCard.canonicalId, inactive);
    expect(definitionCount(noLongerForbidden.state, forbiddenCard.canonicalId)).toBe(
      forbiddenBefore + 1,
    );
  });

  it("removes forbidden names from generate-selected choices and rejects forged answers", () => {
    const fixture = setup();
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.prepared);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId: fixture.championId,
          abilityId: "generationChampion-a1",
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);

    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected a generated-card catalog choice");
    }
    const forged = runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: [forbiddenCard.canonicalId],
      },
      { playerId: fixture.p1 },
    );
    expect(forged.ok).toBe(false);
    if (forged.ok) throw new Error("Forbidden generated-card answer unexpectedly succeeded");
    expect(forged.message).toContain("ineligible definition");

    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: [allowedCard.canonicalId],
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    expect(
      runtime.state.zones[fixture.p1].field.filter(
        (objectId) => runtime.state.objects[objectId]?.definitionId === allowedCard.canonicalId,
      ),
    ).toHaveLength(1);
    expect(
      runtime.state.zones[fixture.p1].field.some(
        (objectId) => runtime.state.objects[objectId]?.definitionId === forbiddenCard.canonicalId,
      ),
    ).toBe(false);
  });
});
