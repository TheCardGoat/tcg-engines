import { dahliaIdyllicDreamer, swornWindhand } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveElement,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import {
  grandArchiveObjectPower,
  proposeGrandArchiveCombatDamage,
} from "../../procedures/combat/combat.ts";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  elements: readonly [GrandArchiveElement, ...GrandArchiveElement[]] = ["NORM"],
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
        ...(type === "CHAMPION" ? { lineageName: id } : {}),
        cost: { kind: type === "CHAMPION" ? "memory" : "reserve", amount: 0 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["RANGER", "GUARDIAN"],
          subtypes: [],
        },
        elements,
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { power: 2, life: 20 }
              : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("keyword-provenance-champion", "CHAMPION");
const ordinaryAlly = card("keyword-provenance-ally", "ALLY");
const waterCard = card("keyword-provenance-water", "ACTION", ["WATER"]);
const omenCard = card("keyword-provenance-omen", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    ordinaryAlly,
    waterCard,
    omenCard,
    dahliaIdyllicDreamer,
    swornWindhand,
  ]);
  const player = (id: string): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: ordinaryAlly.canonicalId, count: 1 },
      { definitionId: waterCard.canonicalId, count: 2 },
      { definitionId: omenCard.canonicalId, count: 2 },
      { definitionId: dahliaIdyllicDreamer.canonicalId, count: 1 },
      { definitionId: swornWindhand.canonicalId, count: 1 },
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
      randomSeed: 2612,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const owned = (playerId: typeof p1, definitionId: string) =>
    Object.values(state.objects).filter(
      (object) => object.ownerId === playerId && object.definitionId === definitionId,
    );
  return { program, state, p1, p2, owned };
}

describe("Grand Archive keyword value provenance", () => {
  it("evaluates catalog Dahlia's derived Ranged value in its static ability context", () => {
    const fixture = setup();
    const dahlia = fixture.owned(fixture.p1, dahliaIdyllicDreamer.canonicalId)[0]!;
    const waters = fixture.owned(fixture.p1, waterCard.canonicalId);
    const defender = fixture.owned(fixture.p2, ordinaryAlly.canonicalId)[0]!;
    const state = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: dahlia.id, from: dahlia.zone, to: "field" },
      ...waters.map((object) => ({
        type: "object-moved" as const,
        objectId: object.id,
        from: object.zone,
        to: "graveyard" as const,
      })),
      { type: "object-moved", objectId: defender.id, from: defender.zone, to: "field" },
      { type: "object-state-changed", objectId: dahlia.id, state: "distant", value: true },
      { type: "object-state-changed", objectId: dahlia.id, state: "attacking", value: true },
      { type: "object-state-changed", objectId: defender.id, state: "defending", value: true },
      {
        type: "combat-started",
        combat: {
          attackerId: dahlia.id,
          attackingPlayerId: fixture.p1,
          defendingPlayerIds: [fixture.p2],
          targetIds: [defender.id],
          retaliatorIds: [],
          retaliationOrderConfirmed: true,
          weaponIds: [],
          intentIds: [],
          step: "damage",
        },
      },
    ]).state;

    expect(proposeGrandArchiveCombatDamage(fixture.program, state)).toContainEqual(
      expect.objectContaining({
        type: "damage-marked",
        objectId: defender.id,
        sourceId: dahlia.id,
        amount: 3,
      }),
    );
  });

  it("evaluates catalog Sworn Windhand's derived Retort value from its controller's omens", () => {
    const fixture = setup();
    const attacker = fixture.owned(fixture.p1, ordinaryAlly.canonicalId)[0]!;
    const windhand = fixture.owned(fixture.p2, swornWindhand.canonicalId)[0]!;
    const omens = fixture.owned(fixture.p2, omenCard.canonicalId);
    const state = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: attacker.id, from: attacker.zone, to: "field" },
      { type: "object-moved", objectId: windhand.id, from: windhand.zone, to: "field" },
      ...omens.flatMap((object) => [
        {
          type: "object-moved" as const,
          objectId: object.id,
          from: object.zone,
          to: "banishment" as const,
        },
        {
          type: "counter-changed" as const,
          objectId: object.id,
          counter: "omen" as const,
          delta: 1,
        },
      ]),
      { type: "object-state-changed", objectId: attacker.id, state: "attacking", value: true },
      { type: "object-state-changed", objectId: windhand.id, state: "defending", value: true },
      { type: "object-state-changed", objectId: windhand.id, state: "retaliating", value: true },
      {
        type: "combat-started",
        combat: {
          attackerId: attacker.id,
          attackingPlayerId: fixture.p1,
          defendingPlayerIds: [fixture.p2],
          targetIds: [windhand.id],
          retaliatorIds: [windhand.id],
          retaliationOrderConfirmed: true,
          weaponIds: [],
          intentIds: [],
          step: "damage",
        },
      },
    ]).state;

    expect(proposeGrandArchiveCombatDamage(fixture.program, state)).toContainEqual(
      expect.objectContaining({
        type: "damage-marked",
        objectId: attacker.id,
        sourceId: windhand.id,
        amount: 5,
      }),
    );
  });

  it("preserves resolution variables on a duration-bearing numeric effect", () => {
    const fixture = setup();
    const sourceId = fixture.state.zones[fixture.p1].field[0]!;
    const target = fixture.owned(fixture.p1, ordinaryAlly.canonicalId)[0]!;
    const kernel = new GrandArchiveTransactionKernel();
    const field = kernel.transact(fixture.state, [
      { type: "object-moved", objectId: target.id, from: target.zone, to: "field" },
    ]).state;
    const result = executeGrandArchiveEffect(
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "chosen-ally" },
        affectedSet: "locked",
        duration: { kind: "this-turn" },
        layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
        change: {
          kind: "numeric",
          property: "power",
          operation: "add",
          amount: { kind: "variable", symbol: "X" },
        },
      },
      {
        program: fixture.program,
        state: field,
        controllerId: fixture.p1,
        sourceId,
        abilityBearerId: sourceId,
        bindings: { "chosen-ally": [target.id] },
        variables: { X: 4 },
      },
      (effectState, events) => {
        const transaction = kernel.transact(effectState, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );

    expect(result.state.continuousEffects[0]?.variables).toEqual({ X: 4 });
    expect(
      grandArchiveObjectPower(fixture.program, result.state, result.state.objects[target.id]!),
    ).toBe(6);
  });
});
