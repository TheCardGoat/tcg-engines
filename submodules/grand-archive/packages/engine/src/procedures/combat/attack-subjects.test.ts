import {
  blazingBowman,
  devastatingBlow,
  dewySlime,
  lorraineBlademaster,
  lurkingAssailant,
  ominousShadow,
  portSmuggler,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveContinuousEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import {
  grandArchiveObjectPower,
  grandArchiveRetaliationCandidates,
  proposeGrandArchiveAttackRedirection,
  proposeGrandArchiveCombatDamage,
} from "./combat.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveCombatState, GrandArchiveMatchState } from "../../game/model.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION" | "WEAPON",
  stats: {
    readonly level?: number;
    readonly power?: number;
    readonly life?: number;
    readonly durability?: number;
  } = {},
  classes: readonly ["ASSASSIN" | "WARRIOR", ...("ASSASSIN" | "WARRIOR")[]] = ["WARRIOR"],
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
          classes,
          subtypes: type === "ALLY" || type === "CHAMPION" ? ["HUMAN"] : [],
        },
        elements: ["NORM"],
        stats,
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const testChampion = card("attack-subject-champion", "CHAMPION", { level: 0, life: 30 });
const assassinChampion = card(
  "attack-subject-assassin-champion",
  "CHAMPION",
  { level: 0, life: 30 },
  ["ASSASSIN"],
);
const testAlly = card("attack-subject-ally", "ALLY", { power: 2, life: 5 });
const testWeapon = card("attack-subject-weapon", "WEAPON", { power: 3, durability: 3 });
const filler = card("attack-subject-filler", "ACTION");

function player(
  id: "p1" | "p2",
  champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  mainDeck: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[],
  materialDeck: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[] = [],
): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...mainDeck.map((definition) => ({ definitionId: definition.canonicalId, count: 1 })),
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...materialDeck.map((definition) => ({ definitionId: definition.canonicalId, count: 1 })),
    ],
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
    ...combat.weaponIds.map((objectId) => ({
      type: "object-state-changed" as const,
      objectId,
      state: "wielded" as const,
      value: true,
    })),
    { type: "combat-started", combat },
  ]).state;
}

function lorraineAttackPowerEffect(): GrandArchiveContinuousEffect {
  if (lorraineBlademaster.layout.kind !== "single-faced") {
    throw new Error("Lorraine, Blademaster must be single-faced");
  }
  const ability = lorraineBlademaster.layout.face.abilities.find(
    (candidate) => candidate.id === "TJTeWcZnsQ-a2",
  );
  const effect =
    ability?.kind === "triggered" && ability.effect?.kind === "sequence"
      ? ability.effect.effects[0]
      : undefined;
  if (effect?.kind !== "continuous") {
    throw new Error("Missing Lorraine, Blademaster attack-power effect");
  }
  return effect;
}

describe("Grand Archive attack subjects", () => {
  it("finishes an attack reduced to zero power without creating a damage event", () => {
    const program = createGrandArchiveMatchProgram([testChampion, testAlly, filler]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1", testChampion, [testAlly]), player("p2", testChampion, [testAlly])],
        firstPlayerId: "p1",
        randomSeed: 900,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attacker = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === testAlly.canonicalId,
    )!;
    const defender = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === testAlly.canonicalId,
    )!;
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: attacker.id, from: attacker.zone, to: "field" },
      { type: "object-moved", objectId: defender.id, from: defender.zone, to: "field" },
      {
        type: "continuous-effect-created",
        effect: {
          id: `continuous-${initial.nextContinuousOrdinal}`,
          controllerId: p1,
          effect: {
            kind: "continuous",
            subjects: { kind: "bound", binding: "attacker" },
            affectedSet: "locked",
            duration: { kind: "permanent" },
            layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
            change: { kind: "numeric", property: "power", operation: "subtract", amount: 2 },
          },
          affectedObjectIds: [attacker.id],
          affectedObjectIncarnations: { [attacker.id]: attacker.incarnation + 1 },
          bindings: { attacker: [attacker.id] },
          variables: {},
          durationAnchors: {},
          createdAtVersion: initial.stateVersion,
          createdTurnNumber: initial.turn.number,
          createdPhase: initial.turn.phase,
        },
      },
    ]).state;
    const combat = manualCombat(positioned, {
      attackerId: attacker.id,
      attackingPlayerId: p1,
      defendingPlayerIds: [p2],
      targetIds: [defender.id],
      retaliatorIds: [],
      retaliationOrderConfirmed: true,
      weaponIds: [],
      intentIds: [],
      step: "damage",
    });

    const events = proposeGrandArchiveCombatDamage(program, combat);
    expect(events).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ type: "damage-marked" })]),
    );
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "combat-step-changed", step: "end" }),
      ]),
    );
  });

  it("applies Lorraine, Blademaster's attack modifier once to combined combat power", () => {
    const definitions = [lorraineBlademaster, testChampion, testAlly, testWeapon, filler];
    const program = createGrandArchiveMatchProgram(definitions);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", testChampion, [testWeapon], [lorraineBlademaster]),
          player("p2", testChampion, [testAlly]),
        ],
        firstPlayerId: "p1",
        randomSeed: 901,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const find = (playerId: typeof p1, definitionId: string) => {
      const object = Object.values(initial.objects).find(
        (candidate) => candidate.ownerId === playerId && candidate.definitionId === definitionId,
      );
      if (!object) throw new Error(`Missing attack subject object ${definitionId}`);
      return object;
    };
    const lorraine = find(p1, lorraineBlademaster.canonicalId);
    const previousChampionId = initial.zones[p1].field[0]!;
    const weapon = find(p1, testWeapon.canonicalId);
    const defender = find(p2, testAlly.canonicalId);
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: lorraine.id, from: lorraine.zone, to: "field" },
      {
        type: "object-moved",
        objectId: previousChampionId,
        from: "field",
        to: "inner-lineage",
        hostId: lorraine.id,
      },
      { type: "object-moved", objectId: weapon.id, from: weapon.zone, to: "field" },
      { type: "object-moved", objectId: defender.id, from: defender.zone, to: "field" },
      {
        type: "continuous-effect-created",
        effect: {
          id: `continuous-${initial.nextContinuousOrdinal}`,
          sourceId: lorraine.id,
          controllerId: p1,
          effect: lorraineAttackPowerEffect(),
          affectedObjectIds: [],
          affectedObjectIncarnations: {},
          bindings: {},
          variables: {},
          durationAnchors: {},
          createdAtVersion: initial.stateVersion,
          createdTurnNumber: initial.turn.number,
          createdPhase: initial.turn.phase,
        },
      },
    ]).state;
    const combat = manualCombat(positioned, {
      attackerId: lorraine.id,
      attackingPlayerId: p1,
      defendingPlayerIds: [p2],
      targetIds: [defender.id],
      retaliatorIds: [],
      retaliationOrderConfirmed: true,
      weaponIds: [weapon.id],
      intentIds: [],
      step: "damage",
    });

    expect(grandArchiveObjectPower(program, combat, combat.objects[lorraine.id]!)).toBeUndefined();
    expect(grandArchiveObjectPower(program, combat, combat.objects[weapon.id]!)).toBe(3);
    expect(proposeGrandArchiveCombatDamage(program, combat)).toContainEqual(
      expect.objectContaining({
        type: "damage-marked",
        objectId: defender.id,
        amount: 5,
        sourceId: lorraine.id,
        combatDamage: true,
      }),
    );
  });

  it("prevents every retaliation candidate against Blazing Bowman's attack", () => {
    const definitions = [testChampion, testAlly, filler, blazingBowman, lurkingAssailant];
    const program = createGrandArchiveMatchProgram(definitions);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", testChampion, [blazingBowman]),
          player("p2", testChampion, [lurkingAssailant]),
        ],
        firstPlayerId: "p1",
        randomSeed: 902,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const bowman = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === blazingBowman.canonicalId,
    )!;
    const assailant = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === lurkingAssailant.canonicalId,
    )!;
    const defenderId = initial.zones[p2].field[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: bowman.id, from: bowman.zone, to: "field" },
      { type: "object-moved", objectId: assailant.id, from: assailant.zone, to: "field" },
      { type: "counter-changed", objectId: defenderId, counter: "level", delta: 1 },
    ]).state;
    const combat = manualCombat(positioned, {
      attackerId: bowman.id,
      attackingPlayerId: p1,
      defendingPlayerIds: [p2],
      targetIds: [defenderId],
      retaliatorIds: [],
      retaliationOrderConfirmed: false,
      weaponIds: [],
      intentIds: [],
      step: "retaliation",
    });

    expect(grandArchiveRetaliationCandidates(program, combat)).toEqual([]);
  });

  it("allows Lurking Assailant to retaliate while it is not defending at level 1", () => {
    const definitions = [testChampion, testAlly, filler, lurkingAssailant];
    const program = createGrandArchiveMatchProgram(definitions);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", testChampion, [testAlly]),
          player("p2", testChampion, [lurkingAssailant]),
        ],
        firstPlayerId: "p1",
        randomSeed: 903,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attacker = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === testAlly.canonicalId,
    )!;
    const assailant = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === lurkingAssailant.canonicalId,
    )!;
    const defenderId = initial.zones[p2].field[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: attacker.id, from: attacker.zone, to: "field" },
      { type: "object-moved", objectId: assailant.id, from: assailant.zone, to: "field" },
      { type: "counter-changed", objectId: defenderId, counter: "level", delta: 1 },
    ]).state;
    const combat = manualCombat(positioned, {
      attackerId: attacker.id,
      attackingPlayerId: p1,
      defendingPlayerIds: [p2],
      targetIds: [defenderId],
      retaliatorIds: [],
      retaliationOrderConfirmed: false,
      weaponIds: [],
      intentIds: [],
      step: "retaliation",
    });

    expect(grandArchiveRetaliationCandidates(program, combat)).toContain(assailant.id);
  });

  it("applies Devastating Blow's retaliation restriction from the attacker's intent", () => {
    const definitions = [testChampion, testAlly, filler, devastatingBlow];
    const program = createGrandArchiveMatchProgram(definitions);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", testChampion, [devastatingBlow]),
          player("p2", testChampion, [testAlly]),
        ],
        firstPlayerId: "p1",
        randomSeed: 904,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attackerId = initial.zones[p1].field[0]!;
    const attack = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === devastatingBlow.canonicalId,
    )!;
    const defender = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === testAlly.canonicalId,
    )!;
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: attack.id,
        from: attack.zone,
        to: "intent",
        hostId: attackerId,
      },
      { type: "object-moved", objectId: defender.id, from: defender.zone, to: "field" },
      { type: "counter-changed", objectId: attackerId, counter: "level", delta: 3 },
    ]).state;
    const combat = manualCombat(positioned, {
      attackerId,
      attackingPlayerId: p1,
      defendingPlayerIds: [p2],
      targetIds: [defender.id],
      retaliatorIds: [],
      retaliationOrderConfirmed: false,
      weaponIds: [],
      intentIds: [attack.id],
      step: "retaliation",
    });

    expect(grandArchiveRetaliationCandidates(program, combat)).toEqual([]);
  });

  it("blocks Intercept but preserves ordinary redirects against Port Smuggler", () => {
    const definitions = [assassinChampion, testChampion, filler, portSmuggler, dewySlime];
    const program = createGrandArchiveMatchProgram(definitions);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", assassinChampion, [portSmuggler]),
          player("p2", testChampion, [dewySlime]),
        ],
        firstPlayerId: "p1",
        randomSeed: 905,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const smuggler = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === portSmuggler.canonicalId,
    )!;
    const interceptor = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === dewySlime.canonicalId,
    )!;
    const championId = initial.zones[p2].field[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: smuggler.id, from: smuggler.zone, to: "field" },
      {
        type: "object-moved",
        objectId: interceptor.id,
        from: interceptor.zone,
        to: "field",
      },
    ]).state;
    const combat = manualCombat(positioned, {
      attackerId: smuggler.id,
      attackingPlayerId: p1,
      defendingPlayerIds: [p2],
      targetIds: [championId],
      retaliatorIds: [],
      retaliationOrderConfirmed: false,
      weaponIds: [],
      intentIds: [],
      step: "retaliation",
    });

    expect(() =>
      proposeGrandArchiveAttackRedirection(program, combat, championId, interceptor.id, {
        requireNewDefenderObedience: true,
        asIntercept: true,
      }),
    ).toThrow("cannot be intercepted");
    expect(
      proposeGrandArchiveAttackRedirection(program, combat, championId, interceptor.id),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "combat-defender-redirected",
          previousDefenderId: championId,
          newDefenderId: interceptor.id,
        }),
      ]),
    );
  });

  it("blocks Intercept but preserves ordinary redirects against Unblockable", () => {
    const definitions = [testChampion, filler, ominousShadow, dewySlime];
    const program = createGrandArchiveMatchProgram(definitions);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", testChampion, [ominousShadow]),
          player("p2", testChampion, [dewySlime]),
        ],
        firstPlayerId: "p1",
        randomSeed: 906,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attacker = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === ominousShadow.canonicalId,
    )!;
    const interceptor = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === dewySlime.canonicalId,
    )!;
    const championId = initial.zones[p2].field[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: attacker.id, from: attacker.zone, to: "field" },
      {
        type: "object-moved",
        objectId: interceptor.id,
        from: interceptor.zone,
        to: "field",
      },
    ]).state;
    const combat = manualCombat(positioned, {
      attackerId: attacker.id,
      attackingPlayerId: p1,
      defendingPlayerIds: [p2],
      targetIds: [championId],
      retaliatorIds: [],
      retaliationOrderConfirmed: false,
      weaponIds: [],
      intentIds: [],
      step: "retaliation",
    });

    expect(() =>
      proposeGrandArchiveAttackRedirection(program, combat, championId, interceptor.id, {
        requireNewDefenderObedience: true,
        asIntercept: true,
      }),
    ).toThrow("Unblockable attacks cannot be intercepted");
    expect(
      proposeGrandArchiveAttackRedirection(program, combat, championId, interceptor.id),
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: "combat-defender-redirected" })]),
    );
  });
});
