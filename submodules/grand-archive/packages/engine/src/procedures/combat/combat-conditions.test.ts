import {
  crimsonTear,
  piccardaNightRider,
  shardforgedBlade,
  siphoningStab,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveClass,
  GrandArchiveCondition,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchiveObjectPower } from "./combat.ts";
import { evaluateGrandArchiveCondition } from "../effects/evaluation.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { grandArchiveObjectActiveAbilities } from "../../rules/abilities/intrinsic-keywords.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveCombatState, GrandArchiveMatchState } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION" | "WEAPON",
  options: {
    readonly classes?: readonly [GrandArchiveClass, ...GrandArchiveClass[]];
    readonly subtypes?: readonly string[];
    readonly level?: number;
    readonly power?: number;
    readonly life?: number;
    readonly durability?: number;
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
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: options.classes ?? ["WARRIOR"],
          subtypes: options.subtypes ?? [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats: {
          ...(options.level !== undefined ? { level: options.level } : {}),
          ...(options.power !== undefined ? { power: options.power } : {}),
          ...(options.life !== undefined ? { life: options.life } : {}),
          ...(options.durability !== undefined ? { durability: options.durability } : {}),
        },
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("combat-condition-champion", "CHAMPION", {
  classes: ["WARRIOR"],
  subtypes: ["HUMAN"],
  level: 0,
  life: 30,
});
const humanAlly = card("combat-condition-human", "ALLY", {
  subtypes: ["HUMAN"],
  power: 2,
  life: 4,
});
const beastAlly = card("combat-condition-beast", "ALLY", {
  subtypes: ["BEAST"],
  power: 2,
  life: 4,
});
const polearm = card("combat-condition-polearm", "WEAPON", {
  subtypes: ["POLEARM"],
  power: 1,
  durability: 3,
});
const filler = card("combat-condition-filler", "ACTION");

const definitions = [
  champion,
  humanAlly,
  beastAlly,
  polearm,
  filler,
  crimsonTear,
  piccardaNightRider,
  shardforgedBlade,
  siphoningStab,
];

function setup() {
  const program = createGrandArchiveMatchProgram(definitions);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: humanAlly.canonicalId, count: 1 },
      { definitionId: beastAlly.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1"
        ? [
            { definitionId: crimsonTear.canonicalId, count: 1 },
            { definitionId: piccardaNightRider.canonicalId, count: 1 },
            { definitionId: polearm.canonicalId, count: 1 },
            { definitionId: shardforgedBlade.canonicalId, count: 1 },
            { definitionId: siphoningStab.canonicalId, count: 1 },
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
      randomSeed: 882,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const find = (playerId: typeof p1, definitionId: string) => {
    const object = Object.values(state.objects).find(
      (candidate) => candidate.ownerId === playerId && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing combat condition card ${definitionId}`);
    return object;
  };
  return { program, state, p1, p2, find };
}

function manualCombat(
  state: GrandArchiveMatchState,
  combat: GrandArchiveCombatState,
): GrandArchiveMatchState {
  return new GrandArchiveTransactionKernel().transact(state, [
    {
      type: "object-state-changed",
      objectId: combat.attackerId,
      state: "attacking",
      value: true,
    },
    ...combat.targetIds.map((objectId) => ({
      type: "object-state-changed" as const,
      objectId,
      state: "defending" as const,
      value: true,
    })),
    ...combat.retaliatorIds.map((objectId) => ({
      type: "object-state-changed" as const,
      objectId,
      state: "retaliating" as const,
      value: true,
    })),
    { type: "combat-started", combat },
  ]).state;
}

function shardforgedTargetCondition(): GrandArchiveCondition {
  if (shardforgedBlade.layout.kind !== "single-faced") {
    throw new Error("Shardforged Blade must be single-faced");
  }
  const ability = shardforgedBlade.layout.face.abilities[1];
  const effect =
    ability?.kind === "static" && ability.staticKind === "effects" ? ability.effects[0] : undefined;
  if (effect?.kind !== "continuous" || !effect.condition) {
    throw new Error("Missing Shardforged target condition");
  }
  return effect.condition;
}

describe("Grand Archive combat relationship conditions", () => {
  it("applies Piccarda's catalog bonus while she attacks a champion", () => {
    const fixture = setup();
    const piccarda = fixture.find(fixture.p1, piccardaNightRider.canonicalId);
    const defenderId = fixture.state.zones[fixture.p2].field[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: piccarda.id, from: piccarda.zone, to: "field" },
    ]).state;
    const ready = {
      ...positioned,
      players: {
        ...positioned.players,
        [fixture.p1]: { ...positioned.players[fixture.p1]!, hasTakenFirstTurn: true },
      },
    };
    const runtime = new GrandArchiveMatchRuntime(fixture.program, ready);

    expect(
      grandArchiveObjectPower(fixture.program, runtime.state, runtime.state.objects[piccarda.id]!),
    ).toBe(3);
    const declaration = runtime.execute(
      { move: "declare-attack", attackerId: piccarda.id, targetIds: [defenderId] },
      { playerId: fixture.p1 },
    );
    if (!declaration.ok) throw new Error(declaration.message);
    expect(
      grandArchiveObjectPower(fixture.program, runtime.state, runtime.state.objects[piccarda.id]!),
    ).toBe(7);
  });

  it("applies Crimson Tear's catalog bonus while it retaliates against a Human", () => {
    const fixture = setup();
    const tear = fixture.find(fixture.p1, crimsonTear.canonicalId);
    const attacker = fixture.find(fixture.p2, humanAlly.canonicalId);
    const championId = fixture.state.zones[fixture.p1].field[0]!;
    const field = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: tear.id, from: tear.zone, to: "field" },
      { type: "object-moved", objectId: attacker.id, from: attacker.zone, to: "field" },
      { type: "counter-changed", objectId: championId, counter: "level", delta: 1 },
    ]).state;
    const combat = manualCombat(field, {
      attackerId: attacker.id,
      attackingPlayerId: fixture.p2,
      defendingPlayerIds: [fixture.p1],
      targetIds: [tear.id],
      retaliatorIds: [tear.id],
      retaliationOrderConfirmed: true,
      weaponIds: [],
      intentIds: [],
      step: "damage",
    });

    expect(grandArchiveObjectPower(fixture.program, combat, combat.objects[tear.id]!)).toBe(3);
  });

  it("grants Siphoning Stab's On Hit only while a Polearm is used", () => {
    const fixture = setup();
    const attack = fixture.find(fixture.p1, siphoningStab.canonicalId);
    const weapon = fixture.find(fixture.p1, polearm.canonicalId);
    const attacker = fixture.state.objects[fixture.state.zones[fixture.p1].field[0]!]!;
    const defender = fixture.state.objects[fixture.state.zones[fixture.p2].field[0]!]!;
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: attack.id,
        from: attack.zone,
        to: "intent",
        hostId: attacker.id,
      },
      { type: "object-moved", objectId: weapon.id, from: weapon.zone, to: "field" },
    ]).state;
    const combat = manualCombat(positioned, {
      attackerId: attacker.id,
      attackingPlayerId: fixture.p1,
      defendingPlayerIds: [fixture.p2],
      targetIds: [defender.id],
      retaliatorIds: [],
      retaliationOrderConfirmed: false,
      weaponIds: [weapon.id],
      intentIds: [attack.id],
      step: "retaliation",
    });
    const withoutPolearm = { ...combat, combat: { ...combat.combat!, weaponIds: [] } };

    expect(
      grandArchiveObjectActiveAbilities(
        fixture.program,
        withoutPolearm,
        withoutPolearm.objects[attack.id]!,
      ).some((ability) => ability.id === "granted-zjtwd7-a1"),
    ).toBe(false);
    expect(
      grandArchiveObjectActiveAbilities(fixture.program, combat, combat.objects[attack.id]!).some(
        (ability) => ability.id === "granted-zjtwd7-a1",
      ),
    ).toBe(true);
  });

  it("does not treat Cleave defenders as current attack targets", () => {
    const fixture = setup();
    const weapon = fixture.find(fixture.p1, shardforgedBlade.canonicalId);
    const target = fixture.find(fixture.p2, beastAlly.canonicalId);
    const attacker = fixture.state.objects[fixture.state.zones[fixture.p1].field[0]!]!;
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: weapon.id, from: weapon.zone, to: "field" },
      { type: "object-moved", objectId: target.id, from: target.zone, to: "field" },
      { type: "counter-changed", objectId: target.id, counter: "named:sheen", delta: 1 },
    ]).state;
    const combat = manualCombat(positioned, {
      attackerId: attacker.id,
      attackingPlayerId: fixture.p1,
      defendingPlayerIds: [fixture.p2],
      targetIds: [target.id],
      retaliatorIds: [],
      retaliationOrderConfirmed: false,
      weaponIds: [weapon.id],
      intentIds: [],
      step: "retaliation",
    });
    const context = {
      program: fixture.program,
      state: combat,
      controllerId: fixture.p1,
      sourceId: weapon.id,
      abilityBearerId: weapon.id,
      bindings: {},
    };

    expect(evaluateGrandArchiveCondition(shardforgedTargetCondition(), context)).toBe(true);
    const cleave = {
      ...combat,
      combat: { ...combat.combat!, cleavePlayerId: fixture.p2 },
    };
    expect(
      evaluateGrandArchiveCondition(shardforgedTargetCondition(), {
        ...context,
        state: cleave,
      }),
    ).toBe(false);
  });
});
