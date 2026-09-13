import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { pantheonBarrier } from "@tcg/grand-archive-cards";
import { describe, expect, it } from "vitest";
import { grandArchiveRetaliationCandidates } from "./combat.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchivePantheonPlayerSetup,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveCombatState, GrandArchiveMatchState } from "../../game/model.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION" | "GREATER BOON" | "LESSER BOON" | "PHANTASIA",
  stats: { readonly level?: number; readonly power?: number; readonly life?: number },
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
        name: id,
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["WARRIOR"],
          subtypes: [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats,
        rulesText: "",
        abilities,
      },
    },
  };
}

const ordinaryChampion = card("retaliation-scope-champion", "CHAMPION", {
  level: 0,
  life: 30,
});
const ambushChampion = card(
  "retaliation-scope-ambush-champion",
  "CHAMPION",
  { level: 0, power: 2, life: 30 },
  [
    {
      id: "retaliationScopeAmbush-a1",
      kind: "static",
      staticKind: "intrinsic",
      text: "Ambush",
      keyword: { name: "ambush" },
    },
  ],
);
const steadfastChampion = card(
  "retaliation-scope-steadfast-champion",
  "CHAMPION",
  { level: 0, power: 2, life: 30 },
  [
    {
      id: "retaliationScopeSteadfast-a1",
      kind: "static",
      staticKind: "intrinsic",
      text: "Steadfast",
      keyword: { name: "steadfast" },
    },
  ],
);
const attacker = card("retaliation-scope-attacker", "ALLY", { power: 2, life: 3 });
const defender = card("retaliation-scope-defender", "ALLY", { power: 1, life: 3 });
const steadfastAmbusher = card(
  "retaliation-scope-steadfast-ambusher",
  "ALLY",
  { power: 2, life: 3 },
  [
    {
      id: "retaliationScopeSteadfastAmbusher-a1",
      kind: "static",
      staticKind: "intrinsic",
      text: "Ambush",
      keyword: { name: "ambush" },
    },
    {
      id: "retaliationScopeSteadfastAmbusher-a2",
      kind: "static",
      staticKind: "intrinsic",
      text: "Steadfast",
      keyword: { name: "steadfast" },
    },
  ],
);
const filler = card("retaliation-scope-filler", "ACTION", {});
const lesserBoon = card("retaliation-scope-lesser-boon", "LESSER BOON", {});
const greaterBoon = card("retaliation-scope-greater-boon", "GREATER BOON", {});
const barrier = pantheonBarrier;

function player(
  id: "p1" | "p2" | "p3",
  champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      { definitionId: attacker.canonicalId, count: 1 },
      { definitionId: defender.canonicalId, count: 1 },
      { definitionId: steadfastAmbusher.canonicalId, count: 1 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function manualCombat(
  state: GrandArchiveMatchState,
  combat: GrandArchiveCombatState,
): GrandArchiveMatchState {
  return new GrandArchiveTransactionKernel().transact(state, [
    { type: "object-state-changed", objectId: combat.attackerId, state: "attacking", value: true },
    ...combat.targetIds.map((objectId) => ({
      type: "object-state-changed" as const,
      objectId,
      state: "defending" as const,
      value: true,
    })),
    { type: "combat-started", combat },
  ]).state;
}

function setup(defendingChampion: typeof ambushChampion | typeof steadfastChampion) {
  const program = createGrandArchiveMatchProgram([
    ordinaryChampion,
    defendingChampion,
    attacker,
    defender,
    steadfastAmbusher,
    filler,
  ]);
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1", ordinaryChampion), player("p2", defendingChampion)],
      firstPlayerId: "p1",
      randomSeed: defendingChampion === ambushChampion ? 921 : 922,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const attackingObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === attacker.canonicalId,
  )!;
  const defendingObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p2 && object.definitionId === defender.canonicalId,
  )!;
  const defendingChampionId = initial.zones[p2].field[0]!;
  const positioned = new GrandArchiveTransactionKernel().transact(initial, [
    {
      type: "object-moved",
      objectId: attackingObject.id,
      from: attackingObject.zone,
      to: "field",
    },
    {
      type: "object-moved",
      objectId: defendingObject.id,
      from: defendingObject.zone,
      to: "field",
    },
  ]).state;
  return { program, positioned, p1, p2, attackingObject, defendingObject, defendingChampionId };
}

describe("Grand Archive retaliation keyword scope", () => {
  it("lets a champion with Ambush retaliate while another unit is defending", () => {
    const fixture = setup(ambushChampion);
    const combat = manualCombat(fixture.positioned, {
      attackerId: fixture.attackingObject.id,
      attackingPlayerId: fixture.p1,
      defendingPlayerIds: [fixture.p2],
      targetIds: [fixture.defendingObject.id],
      retaliatorIds: [],
      retaliationOrderConfirmed: false,
      weaponIds: [],
      intentIds: [],
      step: "retaliation",
    });

    expect(grandArchiveRetaliationCandidates(fixture.program, combat)).toContain(
      fixture.defendingChampionId,
    );
  });

  it("does not extend ally-only Steadfast to a rested champion", () => {
    const fixture = setup(steadfastChampion);
    const rested = new GrandArchiveTransactionKernel().transact(fixture.positioned, [
      {
        type: "object-state-changed",
        objectId: fixture.defendingChampionId,
        state: "rested",
        value: true,
      },
    ]).state;
    const combat = manualCombat(rested, {
      attackerId: fixture.attackingObject.id,
      attackingPlayerId: fixture.p1,
      defendingPlayerIds: [fixture.p2],
      targetIds: [fixture.defendingChampionId],
      retaliatorIds: [],
      retaliationOrderConfirmed: false,
      weaponIds: [],
      intentIds: [],
      step: "retaliation",
    });

    expect(grandArchiveRetaliationCandidates(fixture.program, combat)).not.toContain(
      fixture.defendingChampionId,
    );
  });

  it("requires an Ambush unit to be awake even when it also has Steadfast", () => {
    const fixture = setup(ambushChampion);
    const ambusher = Object.values(fixture.positioned.objects).find(
      (object) =>
        object.ownerId === fixture.p2 && object.definitionId === steadfastAmbusher.canonicalId,
    )!;
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.positioned, [
      { type: "object-moved", objectId: ambusher.id, from: ambusher.zone, to: "field" },
      { type: "object-state-changed", objectId: ambusher.id, state: "rested", value: true },
    ]).state;
    const combat = manualCombat(positioned, {
      attackerId: fixture.attackingObject.id,
      attackingPlayerId: fixture.p1,
      defendingPlayerIds: [fixture.p2],
      targetIds: [fixture.defendingObject.id],
      retaliatorIds: [],
      retaliationOrderConfirmed: false,
      weaponIds: [],
      intentIds: [],
      step: "retaliation",
    });

    expect(grandArchiveRetaliationCandidates(fixture.program, combat)).not.toContain(ambusher.id);
  });

  it("lets a third player's Ambush unit retaliate when one opponent attacks another", () => {
    const program = createGrandArchiveMatchProgram([
      ordinaryChampion,
      ambushChampion,
      attacker,
      defender,
      steadfastAmbusher,
      filler,
      lesserBoon,
      greaterBoon,
      barrier,
    ]);
    const pantheonPlayer = (
      id: "p1" | "p2" | "p3",
      champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
    ): GrandArchivePantheonPlayerSetup => ({
      ...player(id, champion),
      sideboard: undefined,
      pantheon: {
        lesserBoonDefinitionId: lesserBoon.canonicalId,
        greaterBoonDefinitionId: greaterBoon.canonicalId,
        barrierDefinitionId: barrier.canonicalId,
      },
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "pantheon",
        players: [
          pantheonPlayer("p1", ordinaryChampion),
          pantheonPlayer("p2", ordinaryChampion),
          pantheonPlayer("p3", ambushChampion),
        ],
        firstPlayerId: "p1",
        randomSeed: 923,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const p3 = grandArchivePlayerId("p3");
    const attackingObject = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === attacker.canonicalId,
    )!;
    const defendingObject = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === defender.canonicalId,
    )!;
    const thirdPlayerAmbusherId = initial.zones[p3].field[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: attackingObject.id,
        from: attackingObject.zone,
        to: "field",
      },
      {
        type: "object-moved",
        objectId: defendingObject.id,
        from: defendingObject.zone,
        to: "field",
      },
    ]).state;
    const combat = manualCombat(positioned, {
      attackerId: attackingObject.id,
      attackingPlayerId: p1,
      defendingPlayerIds: [p2],
      targetIds: [defendingObject.id],
      retaliatorIds: [],
      retaliationOrderConfirmed: false,
      weaponIds: [],
      intentIds: [],
      step: "retaliation",
    });

    // Keywords and Abilities — Ambush rule 1.1.2.
    expect(grandArchiveRetaliationCandidates(program, combat)).toContain(thirdPlayerAmbusherId);
  });
});
