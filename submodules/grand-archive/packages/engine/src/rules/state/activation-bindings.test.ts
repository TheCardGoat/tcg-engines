import {
  aqueousArmor,
  automatedGardener,
  palatialConcourse,
  smashWithObelisk,
} from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";

import { grandArchivePlayerId } from "../../game/identity.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { createGrandArchiveMatchInitialState } from "../../procedures/game-flow/initialize.ts";
import { deriveGrandArchiveNumericProperty } from "./continuous.ts";

const champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "activation-binding-champion",
  slug: "activation-binding-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "activation-binding-champion:face:default",
      catalogId: "activation-binding-champion",
      name: "Activation Binding Champion",
      cost: { kind: "memory", amount: 0 },
      typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["GUARDIAN"], subtypes: [] },
      elements: ["NEOS"],
      stats: { level: 0, life: 20 },
      rulesText: "",
      abilities: [],
    },
  },
};

function standardPlayers(...mainDeckDefinitionIds: readonly string[]) {
  const player = (id: "p1" | "p2") => ({
    id,
    name: id,
    mainDeck: mainDeckDefinitionIds.map((definitionId) => ({
      definitionId,
      count: id === "p1" ? 1 : 0,
    })),
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });

  return [player("p1"), player("p2")] as const;
}

describe("Grand Archive activation bindings in continuous effects", () => {
  it("derives power from an object selected and sacrificed during activation", () => {
    const program = createGrandArchiveMatchProgram([champion, palatialConcourse, smashWithObelisk]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: standardPlayers(palatialConcourse.canonicalId, smashWithObelisk.canonicalId),
        firstPlayerId: "p1",
        randomSeed: 947,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const owned = Object.values(initial.objects).filter((object) => object.ownerId === p1);
    const domainId = owned.find(
      (object) => object.definitionId === palatialConcourse.canonicalId,
    )!.id;
    const attackId = owned.find(
      (object) => object.definitionId === smashWithObelisk.canonicalId,
    )!.id;
    const state = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: domainId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: domainId, from: "field", to: "graveyard" },
      {
        type: "object-moved",
        objectId: attackId,
        from: "main-deck",
        to: "intent",
        hostId: initial.zones[p1].field[0],
        entryActivationBindings: { "sacrificed-object": [domainId] },
      },
    ]).state;

    expect(
      deriveGrandArchiveNumericProperty(state.objects[attackId]!, "power", {
        program,
        state,
        controllerId: p1,
        sourceId: attackId,
        abilityBearerId: attackId,
        bindings: {},
      }),
    ).toBe(8);
  });

  it("evaluates a hosted effect's static restrictions against its printed source", () => {
    const program = createGrandArchiveMatchProgram([champion, aqueousArmor, automatedGardener]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: standardPlayers(automatedGardener.canonicalId, aqueousArmor.canonicalId),
        firstPlayerId: "p1",
        randomSeed: 948,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const owned = Object.values(initial.objects).filter((object) => object.ownerId === p1);
    const allyId = owned.find(
      (object) => object.definitionId === automatedGardener.canonicalId,
    )!.id;
    const armorId = owned.find((object) => object.definitionId === aqueousArmor.canonicalId)!.id;
    const state = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
      {
        type: "object-moved",
        objectId: armorId,
        from: "main-deck",
        to: "field",
        hostId: allyId,
      },
    ]).state;

    expect(
      deriveGrandArchiveNumericProperty(state.objects[allyId]!, "life", {
        program,
        state,
        controllerId: p1,
        sourceId: allyId,
        abilityBearerId: allyId,
        bindings: {},
      }),
    ).toBe(5);
  });
});
