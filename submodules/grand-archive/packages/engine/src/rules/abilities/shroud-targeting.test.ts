import {
  corhaziInfiltrator,
  smokeBombs,
  staggeringStrike,
  swordOfSeeking,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { proposeGrandArchiveAttackDeclaration } from "../../procedures/combat/combat.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
  stats: Readonly<Record<string, number>>,
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
        typeLine: { supertypes: [], types: [type], classes: ["WARRIOR"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats,
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("shroud-targeting-champion", "CHAMPION", {
  level: 0,
  life: 20,
  power: 2,
});
const attacker = card("shroud-targeting-attacker", "ALLY", { life: 8, power: 3 });
const defender = card("shroud-targeting-defender", "ALLY", { life: 8, power: 2 });
const filler = card("shroud-targeting-filler", "ACTION", {});

interface Fixture {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly state: GrandArchiveMatchState;
  readonly p1: ReturnType<typeof grandArchivePlayerId>;
  readonly p2: ReturnType<typeof grandArchivePlayerId>;
  readonly championId: GrandArchiveObjectId;
  readonly attackerId: GrandArchiveObjectId;
  readonly defenderId: GrandArchiveObjectId;
  readonly stealthId: GrandArchiveObjectId;
  readonly weaponId: GrandArchiveObjectId;
  readonly smokeBombsId: GrandArchiveObjectId;
  readonly strikeId: GrandArchiveObjectId;
}

function setup(): Fixture {
  const program = createGrandArchiveMatchProgram([
    champion,
    attacker,
    defender,
    filler,
    corhaziInfiltrator,
    smokeBombs,
    staggeringStrike,
    swordOfSeeking,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 4 },
      ...(id === "p1"
        ? [
            { definitionId: attacker.canonicalId, count: 1 },
            { definitionId: staggeringStrike.canonicalId, count: 1 },
          ]
        : [
            { definitionId: defender.canonicalId, count: 1 },
            { definitionId: corhaziInfiltrator.canonicalId, count: 1 },
          ]),
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1"
        ? [{ definitionId: swordOfSeeking.canonicalId, count: 1 }]
        : [{ definitionId: smokeBombs.canonicalId, count: 1 }]),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 977,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const find = (ownerId: typeof p1, definitionId: string): GrandArchiveObjectId => {
    const object = Object.values(initial.objects).find(
      (candidate) => candidate.ownerId === ownerId && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing shroud fixture object ${definitionId}`);
    return object.id;
  };
  const championId = initial.zones[p1].field[0]!;
  const attackerId = find(p1, attacker.canonicalId);
  const defenderId = find(p2, defender.canonicalId);
  const stealthId = find(p2, corhaziInfiltrator.canonicalId);
  const weaponId = find(p1, swordOfSeeking.canonicalId);
  const smokeBombsId = find(p2, smokeBombs.canonicalId);
  const strikeId = find(p1, staggeringStrike.canonicalId);
  const positioned = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: attackerId, from: "main-deck", to: "field" },
    { type: "object-moved", objectId: defenderId, from: "main-deck", to: "field" },
    { type: "object-moved", objectId: stealthId, from: "main-deck", to: "field" },
    {
      type: "object-moved",
      objectId: weaponId,
      from: "material-deck",
      to: "field",
      initialCounters: { durability: 2 },
    },
    { type: "object-moved", objectId: smokeBombsId, from: "material-deck", to: "field" },
  ]).state;
  return {
    program,
    state: {
      ...positioned,
      players: {
        ...positioned.players,
        [p1]: { ...positioned.players[p1]!, hasTakenFirstTurn: true },
      },
    },
    p1,
    p2,
    championId,
    attackerId,
    defenderId,
    stealthId,
    weaponId,
    smokeBombsId,
    strikeId,
  };
}

function passCurrentOpportunity(runtime: GrandArchiveMatchRuntime): void {
  const holderId = runtime.state.opportunity?.holderId;
  if (!holderId) throw new Error("Expected an Opportunity holder");
  const result = runtime.execute({ move: "pass" }, { playerId: holderId });
  if (!result.ok) throw new Error(result.message);
}

describe("Grand Archive shroud and True Sight targeting", () => {
  it("uses catalog True Sight from a wielded weapon to target a Stealth unit", () => {
    const fixture = setup();
    const withoutWeapon = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    expect(
      withoutWeapon.execute(
        {
          move: "declare-attack",
          attackerId: fixture.championId,
          targetIds: [fixture.stealthId],
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(false);

    const withWeapon = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    const result = withWeapon.execute(
      {
        move: "declare-attack",
        attackerId: fixture.championId,
        targetIds: [fixture.stealthId],
        weaponIds: [fixture.weaponId],
      },
      { playerId: fixture.p1 },
    );
    if (!result.ok) throw new Error(result.message);
    expect(withWeapon.state.combat?.targetIds).toEqual([fixture.stealthId]);
  });

  it("uses catalog True Sight from a resolved Attack in intent", () => {
    const fixture = setup();
    const intent = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.strikeId,
        from: "main-deck",
        to: "intent",
        hostId: fixture.championId,
      },
    ]).state;

    expect(() =>
      proposeGrandArchiveAttackDeclaration(fixture.program, intent, fixture.p1, {
        move: "declare-attack",
        attackerId: fixture.championId,
        targetIds: [fixture.stealthId],
      }),
    ).toThrow("legal attack target");
    expect(
      proposeGrandArchiveAttackDeclaration(
        fixture.program,
        intent,
        fixture.p1,
        {
          move: "declare-attack",
          attackerId: fixture.championId,
          attackCardId: fixture.strikeId,
          targetIds: [fixture.stealthId],
        },
        { resolvedAttack: true },
      ),
    ).toEqual(expect.arrayContaining([expect.objectContaining({ type: "combat-started" })]));
  });

  it("removes a late-Stealth defender but preserves its declared retaliation", () => {
    const fixture = setup();
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    expect(
      runtime.execute(
        {
          move: "declare-attack",
          attackerId: fixture.attackerId,
          targetIds: [fixture.defenderId],
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    passCurrentOpportunity(runtime);
    passCurrentOpportunity(runtime);

    const retaliation = runtime.state.decision;
    if (!retaliation || retaliation.kind !== "choose-retaliators") {
      throw new Error("Expected a retaliation decision");
    }
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: retaliation.id,
          stateVersion: retaliation.stateVersion,
          answer: [fixture.defenderId],
        },
        { playerId: fixture.p2 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.combat?.step).toBe("damage");

    passCurrentOpportunity(runtime);
    expect(runtime.state.opportunity?.holderId).toBe(fixture.p2);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId: fixture.smokeBombsId,
          abilityId: "ScGcOmkoQt-a1",
          targets: { "target-1": [fixture.defenderId] },
        },
        { playerId: fixture.p2 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.opportunity?.holderId).toBe(fixture.p2);
    for (let pass = 0; runtime.state.stack.length > 0 && pass < 8; pass += 1) {
      passCurrentOpportunity(runtime);
    }
    expect(runtime.state.stack).toEqual([]);
    expect(runtime.state.objects[fixture.defenderId]?.states.has("defending")).toBe(false);
    expect(runtime.state.objects[fixture.defenderId]?.states.has("retaliating")).toBe(true);

    for (let step = 0; runtime.state.combat && step < 8; step += 1) {
      passCurrentOpportunity(runtime);
    }
    expect(runtime.state.combat).toBeNull();
    expect(runtime.state.objects[fixture.defenderId]?.damage).toBe(0);
    expect(runtime.state.objects[fixture.attackerId]?.damage).toBe(2);
  });
});
