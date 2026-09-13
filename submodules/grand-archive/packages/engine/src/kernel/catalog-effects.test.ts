import {
  ardusFloodborneDeacon,
  floodborneSwing,
  lorraineAscendantWings,
  starlitApothecary,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../procedures/effects/effect-executor.ts";
import { deriveGrandArchiveNumericProperty } from "../rules/state/continuous.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "./kernel.ts";
import { grandArchiveObjectActiveAbilities } from "../rules/abilities/intrinsic-keywords.ts";
import { createGrandArchiveMatchProgram } from "./match-program.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";

function generatedSwordsEffect(): Extract<
  GrandArchiveEffect,
  { readonly kind: "generate-selected" }
> {
  if (lorraineAscendantWings.layout.kind !== "single-faced") {
    throw new Error("Lorraine, Ascendant Wings must be single-faced");
  }
  const ability = lorraineAscendantWings.layout.face.abilities[1];
  if (ability?.kind !== "activated" || !ability.effect || ability.effect.kind !== "sequence") {
    throw new Error("Missing Lorraine Ascendant ability");
  }
  const effect = ability.effect.effects[0];
  if (effect?.kind !== "generate-selected") throw new Error("Missing Lorraine generation effect");
  return effect;
}

function brewedStateEffect(): Extract<
  GrandArchiveEffect,
  { readonly kind: "set-activation-state" }
> {
  if (starlitApothecary.layout.kind !== "single-faced") {
    throw new Error("Starlit Apothecary must be single-faced");
  }
  const ability = starlitApothecary.layout.face.abilities[0];
  if (ability?.kind !== "triggered" || !ability.effect || ability.effect.kind !== "sequence") {
    throw new Error("Missing Starlit Apothecary ability");
  }
  const conditional = ability.effect.effects[1];
  if (conditional?.kind !== "conditional" || conditional.then.kind !== "set-activation-state") {
    throw new Error("Missing Starlit Apothecary brewed state effect");
  }
  return conditional.then;
}

function card(
  id: string,
  type: "ACTION" | "CHAMPION" | "ITEM" | "WEAPON",
  options: {
    readonly abilities?: readonly GrandArchiveAbilityDefinition[];
    readonly supertypes?: readonly "REGALIA"[];
    readonly subtypes?: readonly string[];
  } = {},
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
          supertypes: options.supertypes ?? [],
          types: [type],
          classes: ["WARRIOR"],
          subtypes: options.subtypes ?? [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "WEAPON"
              ? { power: 1, durability: 1 }
              : {},
        rulesText: "",
        abilities: options.abilities ?? [],
      },
    },
  };
}

const champion = card("catalog-effect-champion", "CHAMPION", {
  abilities: [
    {
      id: "catalogEffectChampion-a1",
      kind: "activated",
      activation: "ability",
      text: "Generate selected Sword regalia.",
      cost: { kind: "pay-reserve", amount: 0 },
      effect: generatedSwordsEffect(),
    },
  ],
});
const sword = card("catalog-effect-sword", "WEAPON", {
  supertypes: ["REGALIA"],
  subtypes: ["SWORD"],
});
const potion = card("catalog-effect-potion", "ITEM", { subtypes: ["POTION"] });
const filler = card("catalog-effect-filler", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([champion, sword, potion, filler]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1" ? [{ definitionId: potion.canonicalId, count: 1 }] : []),
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
      randomSeed: 664,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const championId = state.zones[p1].field[0]!;
  const potionObject = Object.values(state.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === potion.canonicalId,
  );
  if (!potionObject) throw new Error("Missing Potion test object");
  return { program, state, p1, championId, potionId: potionObject.id };
}

describe("Grand Archive catalog-backed atomic effects", () => {
  it("lets Lorraine's catalog choice generate every selected Sword onto the field", () => {
    const fixture = setup();
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId: fixture.championId,
          abilityId: "catalogEffectChampion-a1",
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: grandArchivePlayerId("p2") }).ok).toBe(
      true,
    );

    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected Lorraine's catalog card choice");
    }
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: [sword.canonicalId, sword.canonicalId],
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    expect(
      runtime.state.zones[fixture.p1].field.filter(
        (objectId) => runtime.state.objects[objectId]?.definitionId === sword.canonicalId,
      ),
    ).toHaveLength(2);
  });

  it("applies Starlit Apothecary's brewed activation state to its summoned Potion", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const onField = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.potionId,
        from: fixture.state.objects[fixture.potionId]!.zone,
        to: "field",
      },
    ]).state;
    const result = executeGrandArchiveEffect(
      brewedStateEffect(),
      {
        program: fixture.program,
        state: onField,
        controllerId: fixture.p1,
        sourceId: fixture.championId,
        abilityBearerId: fixture.championId,
        bindings: { "summoned-token": [fixture.potionId] },
      },
      (effectState, events) => {
        const transaction = kernel.transact(effectState, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(result.state.objects[fixture.potionId]?.activationStates.has("brewed")).toBe(true);
  });

  it("gives Ardus-controlled cards an additional instance of each Deluge ability", () => {
    const program = createGrandArchiveMatchProgram([
      champion,
      filler,
      ardusFloodborneDeacon,
      floodborneSwing,
    ]);
    const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: filler.canonicalId, count: 6 },
        ...(id === "p1"
          ? [
              { definitionId: ardusFloodborneDeacon.canonicalId, count: 1 },
              { definitionId: floodborneSwing.canonicalId, count: 4 },
            ]
          : []),
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
        randomSeed: 445,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const ardus = Object.values(initial.objects).find(
      (object) =>
        object.ownerId === p1 && object.definitionId === ardusFloodborneDeacon.canonicalId,
    );
    const swings = Object.values(initial.objects).filter(
      (object) => object.ownerId === p1 && object.definitionId === floodborneSwing.canonicalId,
    );
    if (!ardus || swings.length !== 4) throw new Error("Missing Ardus Deluge fixture cards");
    const championId = initial.zones[p1].field[0]!;
    const active = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: ardus.id, from: ardus.zone, to: "field" },
      {
        type: "object-moved",
        objectId: swings[0]!.id,
        from: swings[0]!.zone,
        to: "intent",
        hostId: championId,
      },
      ...swings.slice(1).map((object) => ({
        type: "object-moved" as const,
        objectId: object.id,
        from: object.zone,
        to: "graveyard" as const,
      })),
    ]).state;
    expect(
      grandArchiveObjectActiveAbilities(program, active, active.objects[swings[0]!.id]!),
    ).toHaveLength(2);
    expect(
      deriveGrandArchiveNumericProperty(active.objects[swings[0]!.id]!, "power", {
        program,
        state: active,
        controllerId: p1,
        sourceId: swings[0]!.id,
        abilityBearerId: swings[0]!.id,
        bindings: {},
      }),
    ).toBe(9);
  });
});
