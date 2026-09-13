import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { proposeGrandArchiveAttackDeclaration } from "./combat.ts";
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
  type: "ACTION" | "ALLY" | "ATTACK" | "CHAMPION" | "WEAPON",
  stats: {
    readonly level?: number;
    readonly power?: number;
    readonly life?: number;
    readonly durability?: number;
  },
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

const champion = card("attack-legality-champion", "CHAMPION", { level: 0, life: 30 });
const filler = card("attack-legality-filler", "ACTION", {});
const noPowerAlly = card("attack-legality-no-power", "ALLY", { life: 3 });
const zeroPowerAlly = card("attack-legality-zero-power", "ALLY", { power: 0, life: 3 });
const negativePowerAlly = card("attack-legality-negative-power", "ALLY", {
  power: -1,
  life: 3,
});
const attackBoostedNoPowerAlly = card(
  "attack-legality-attack-boosted-no-power",
  "ALLY",
  { power: 0, life: 3 },
  [
    {
      id: "attackLegalityAttackBoost-a1",
      kind: "static",
      staticKind: "effects",
      text: "This ally's attacks get +2 POWER.",
      effects: [
        {
          kind: "continuous",
          subjects: { kind: "attacks-by", attacker: { kind: "source" } },
          affectedSet: "dynamic",
          duration: { kind: "while-source-in-functional-zone" },
          layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
          change: { kind: "numeric", property: "power", operation: "add", amount: 2 },
        },
      ],
    },
  ],
);
const positiveWeapon = card("attack-legality-positive-weapon", "WEAPON", {
  power: 2,
  durability: 1,
});
const zeroPowerWeapon = card("attack-legality-zero-weapon", "WEAPON", {
  power: 0,
  durability: 1,
});
const resolvedAttack = card("attack-legality-resolved-attack", "ATTACK", { power: 0 });

function player(
  id: "p1" | "p2",
  mainDeck: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[],
): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...mainDeck.map((definition) => ({ definitionId: definition.canonicalId, count: 1 })),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function attemptAllyAttack(
  attackerDefinition: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  weaponDefinition?: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
) {
  const definitions = [
    champion,
    filler,
    attackerDefinition,
    ...(weaponDefinition ? [weaponDefinition] : []),
  ];
  const program = createGrandArchiveMatchProgram(definitions);
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [
        player("p1", [attackerDefinition, ...(weaponDefinition ? [weaponDefinition] : [])]),
        player("p2", []),
      ],
      firstPlayerId: "p1",
      randomSeed: 911,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const attacker = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === attackerDefinition.canonicalId,
  )!;
  const weapon = weaponDefinition
    ? Object.values(initial.objects).find(
        (object) => object.ownerId === p1 && object.definitionId === weaponDefinition.canonicalId,
      )
    : undefined;
  const positioned = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: attacker.id, from: attacker.zone, to: "field" },
    ...(weapon
      ? [
          {
            type: "object-moved" as const,
            objectId: weapon.id,
            from: weapon.zone,
            to: "field" as const,
          },
          {
            type: "counter-changed" as const,
            objectId: weapon.id,
            counter: "durability",
            delta: 1,
          },
        ]
      : []),
  ]).state;
  const ready = {
    ...positioned,
    players: {
      ...positioned.players,
      [p1]: { ...positioned.players[p1]!, hasTakenFirstTurn: true },
    },
  };
  const runtime = new GrandArchiveMatchRuntime(program, ready);
  return runtime.execute(
    {
      move: "declare-attack",
      attackerId: attacker.id,
      targetIds: [ready.zones[p2].field[0]!],
      ...(weapon ? { weaponIds: [weapon.id] } : {}),
    },
    { playerId: p1 },
  );
}

describe("Grand Archive attack declaration eligibility", () => {
  it("does not let an attack-wide power modifier satisfy positive-power attack eligibility", () => {
    expect(attemptAllyAttack(attackBoostedNoPowerAlly).ok).toBe(false);
  });

  it("rejects a printed ally without its mandatory power stat", () => {
    expect(() =>
      createGrandArchiveMatchProgram([champion, filler, noPowerAlly, positiveWeapon]),
    ).toThrow(/requires a power stat/);
  });

  it("does not let a negative-power ally use the zero-power weapon exception", () => {
    expect(attemptAllyAttack(negativePowerAlly, positiveWeapon).ok).toBe(false);
  });

  it("does not let a zero-power ally wield a weapon without explicit permission", () => {
    expect(attemptAllyAttack(zeroPowerAlly, positiveWeapon).ok).toBe(false);
  });

  it("does not let a zero-power ally attack when its weapon leaves total power at zero", () => {
    expect(attemptAllyAttack(zeroPowerAlly, zeroPowerWeapon).ok).toBe(false);
  });

  it("lets a champion without power attack through a weapon regardless of weapon power", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, zeroPowerWeapon]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1", [zeroPowerWeapon]), player("p2", [])],
        firstPlayerId: "p1",
        randomSeed: 912,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attackerId = initial.zones[p1].field[0]!;
    const weapon = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === zeroPowerWeapon.canonicalId,
    )!;
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: weapon.id, from: weapon.zone, to: "field" },
      { type: "counter-changed", objectId: weapon.id, counter: "durability", delta: 1 },
    ]).state;
    const ready = {
      ...positioned,
      players: {
        ...positioned.players,
        [p1]: { ...positioned.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const runtime = new GrandArchiveMatchRuntime(program, ready);

    expect(
      runtime.execute(
        {
          move: "declare-attack",
          attackerId,
          targetIds: [ready.zones[p2].field[0]!],
          weaponIds: [weapon.id],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
  });

  it("lets a champion without power declare a resolving Attack card", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, resolvedAttack]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1", [resolvedAttack]), player("p2", [])],
        firstPlayerId: "p1",
        randomSeed: 913,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attackerId = initial.zones[p1].field[0]!;
    const attack = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === resolvedAttack.canonicalId,
    )!;
    const intent = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: attack.id,
        from: attack.zone,
        to: "intent",
        hostId: attackerId,
      },
    ]).state;
    const ready = {
      ...intent,
      players: {
        ...intent.players,
        [p1]: { ...intent.players[p1]!, hasTakenFirstTurn: true },
      },
    };

    expect(
      proposeGrandArchiveAttackDeclaration(
        program,
        ready,
        p1,
        {
          move: "declare-attack",
          attackerId,
          attackCardId: attack.id,
          targetIds: [ready.zones[p2].field[0]!],
          weaponIds: [],
        },
        { resolvedAttack: true },
      ),
    ).toEqual(expect.arrayContaining([expect.objectContaining({ type: "combat-started" })]));
  });
});
