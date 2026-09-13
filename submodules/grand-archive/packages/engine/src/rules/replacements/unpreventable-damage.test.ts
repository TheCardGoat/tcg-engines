import {
  overwhelmingSwing,
  plutusFortunesFavor,
  varuckSmolderingSpire,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveClass,
  GrandArchiveElement,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { proposeGrandArchiveCombatDamage } from "../../procedures/combat/combat.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import {
  chooseGrandArchiveReplacement,
  collectGrandArchiveReplacementCandidates,
} from "./replacements.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  options: {
    readonly abilities?: readonly GrandArchiveAbilityDefinition[];
    readonly classes?: readonly [GrandArchiveClass, ...GrandArchiveClass[]];
    readonly elements?: readonly [GrandArchiveElement, ...GrandArchiveElement[]];
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
          subtypes: [],
        },
        elements: options.elements ?? ["NORM"],
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { power: 2, life: 3 }
              : {},
        rulesText: "",
        abilities: options.abilities ?? [],
      },
    },
  };
}

const warriorChampion = card("unpreventable-warrior-champion", "CHAMPION");
const preventionAbility: GrandArchiveAbilityDefinition = {
  id: "unpreventablePreventingChampion-a1",
  kind: "static",
  staticKind: "effects",
  text: "If damage would be dealt to this champion, prevent 3 of that damage.",
  effects: [
    {
      kind: "replacement",
      event: { name: "damage-dealt", recipient: { kind: "source" } },
      operation: { kind: "prevent", amount: 3 },
      duration: { kind: "while-source-in-functional-zone" },
    },
  ],
};
const preventingChampion = card("unpreventable-preventing-champion", "CHAMPION", {
  abilities: [preventionAbility],
});
const guardianLevelTwoPreventingChampion = card("unpreventable-level-two-guardian", "CHAMPION", {
  classes: ["GUARDIAN"],
  abilities: [
    preventionAbility,
    {
      id: "unpreventableLevelTwoGuardian-a2",
      kind: "static",
      staticKind: "effects",
      text: "This champion gets +2 level.",
      effects: [
        {
          kind: "continuous",
          subjects: { kind: "source" },
          affectedSet: "dynamic",
          duration: { kind: "while-source-in-functional-zone" },
          layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
          change: { kind: "numeric", property: "level", operation: "add", amount: 2 },
        },
      ],
    },
  ],
});
const filler = card("unpreventable-filler", "ACTION");
const fireSource = card("unpreventable-fire-source", "ALLY", {
  elements: ["FIRE"],
});
const waterSource = card("unpreventable-water-source", "ALLY", {
  elements: ["WATER"],
});
const combatOnlySource = card("unpreventable-combat-only-source", "ALLY", {
  abilities: [
    {
      id: "unpreventableCombatOnlySource-a1",
      kind: "static",
      staticKind: "effects",
      text: "Combat damage dealt by this ally can't be prevented.",
      effects: [
        {
          kind: "rule-modification",
          mode: "forbid",
          action: "prevent-damage",
          using: { kind: "source" },
          damageKind: "combat",
          duration: { kind: "while-source-in-functional-zone" },
        },
      ],
    },
  ],
});
const fireRestrictionSource = card("unpreventable-fire-restriction-source", "ALLY", {
  abilities: [
    {
      id: "unpreventableFireRestrictionSource-a1",
      kind: "static",
      staticKind: "effects",
      text: "Damage dealt by fire element sources can't be prevented.",
      effects: [
        {
          kind: "rule-modification",
          mode: "forbid",
          action: "prevent-damage",
          subject: { kind: "player", player: "each-player" },
          sourceFilter: { kind: "element", oneOf: ["FIRE"] },
          duration: { kind: "while-source-in-functional-zone" },
        },
      ],
    },
  ],
});
const criticalUnpreventableSource = card("unpreventable-critical-source", "ALLY", {
  abilities: [
    {
      id: "unpreventableCriticalSource-a1",
      kind: "static",
      staticKind: "intrinsic",
      text: "Critical 1",
      keyword: { name: "critical", value: 1 },
    },
    {
      id: "unpreventableCriticalSource-a2",
      kind: "static",
      staticKind: "effects",
      text: "Combat damage dealt by this ally can't be prevented.",
      effects: [
        {
          kind: "rule-modification",
          mode: "forbid",
          action: "prevent-damage",
          using: { kind: "source" },
          damageKind: "combat",
          duration: { kind: "while-source-in-functional-zone" },
        },
      ],
    },
  ],
});

function setup(options: {
  readonly champion?:
    | typeof warriorChampion
    | typeof preventingChampion
    | typeof guardianLevelTwoPreventingChampion;
  readonly definitions: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[];
  readonly field: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[];
  readonly bulwark?: boolean;
  readonly memoryCards?: number;
}) {
  const champion = options.champion ?? warriorChampion;
  const definitions = [champion, filler, ...options.definitions];
  const program = createGrandArchiveMatchProgram(definitions);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1"
        ? options.definitions.map((definition) => ({
            definitionId: definition.canonicalId,
            count: 1,
          }))
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
      randomSeed: 951,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const find = (definition: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) => {
    const object = Object.values(initial.objects).find(
      (candidate) => candidate.ownerId === p1 && candidate.definitionId === definition.canonicalId,
    );
    if (!object) throw new Error(`Missing unpreventable test object ${definition.canonicalId}`);
    return object;
  };
  const targetId = initial.zones[p2].field[0]!;
  const memoryCards = Object.values(initial.objects)
    .filter(
      (object) =>
        object.ownerId === p1 &&
        object.definitionId === filler.canonicalId &&
        object.zone === "main-deck",
    )
    .slice(0, options.memoryCards ?? 0);
  const state = new GrandArchiveTransactionKernel().transact(initial, [
    ...options.field.map((definition) => {
      const object = find(definition);
      return {
        type: "object-moved" as const,
        objectId: object.id,
        from: object.zone,
        to: "field" as const,
      };
    }),
    ...memoryCards.map((object) => ({
      type: "object-moved" as const,
      objectId: object.id,
      from: object.zone,
      to: "memory" as const,
    })),
    ...(options.bulwark === false
      ? []
      : [{ type: "counter-changed" as const, objectId: targetId, counter: "bulwark", delta: 1 }]),
  ]).state;
  return { program, state, p1, p2, targetId, find };
}

function replacementKernel(program: ReturnType<typeof createGrandArchiveMatchProgram>) {
  return new GrandArchiveTransactionKernel({
    collectReplacements: (state, event) =>
      collectGrandArchiveReplacementCandidates(program, state, event),
    chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
  });
}

function dealDamage(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  sourceId: ReturnType<typeof fixture.find>["id"],
  options: { readonly combat: boolean; readonly participantIds?: readonly (typeof sourceId)[] },
) {
  return replacementKernel(fixture.program).transact(state, [
    {
      type: "damage-marked",
      objectId: fixture.targetId,
      amount: 3,
      sourceId,
      ...(options.combat
        ? {
            combatDamage: true,
            combatParticipantIds: options.participantIds ?? [sourceId],
          }
        : {}),
    },
  ]);
}

describe("Grand Archive unpreventable damage rules", () => {
  it("makes Plutus's damage unpreventable while its class and influence bonuses apply", () => {
    const fixture = setup({
      definitions: [plutusFortunesFavor],
      field: [plutusFortunesFavor],
    });
    const plutus = fixture.find(plutusFortunesFavor);
    const result = dealDamage(fixture, fixture.state, plutus.id, { combat: true });

    expect(result.state.objects[fixture.targetId]?.damage).toBe(3);
    expect(result.state.objects[fixture.targetId]?.counters.bulwark).toBe(0);
    expect(result.result.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "damage-marked",
          amount: 3,
          preventable: false,
        }),
        expect.objectContaining({ type: "counter-changed", counter: "bulwark", delta: -1 }),
      ]),
    );
    expect(result.result.events.some((event) => event.type === "damage-prevented")).toBe(false);
  });

  it("allows prevention when Plutus's influence condition is no longer satisfied", () => {
    const fixture = setup({
      definitions: [plutusFortunesFavor],
      field: [plutusFortunesFavor],
      memoryCards: 5,
    });
    const plutus = fixture.find(plutusFortunesFavor);
    const result = dealDamage(fixture, fixture.state, plutus.id, { combat: true });

    expect(result.state.objects[fixture.targetId]?.damage).toBe(0);
    expect(result.result.events).toContainEqual(
      expect.objectContaining({ type: "damage-prevented", amount: 3 }),
    );
  });

  it("uses Varuck's controller and fire-source filter for non-combat damage", () => {
    const fireFixture = setup({
      champion: preventingChampion,
      definitions: [varuckSmolderingSpire, fireSource, waterSource],
      field: [varuckSmolderingSpire, fireSource, waterSource],
      bulwark: false,
    });
    const fire = fireFixture.find(fireSource);
    const fireResult = dealDamage(fireFixture, fireFixture.state, fire.id, { combat: false });
    expect(fireResult.state.objects[fireFixture.targetId]?.damage).toBe(3);
    expect(fireResult.result.events).toContainEqual(
      expect.objectContaining({ type: "damage-marked", preventable: false }),
    );

    const waterFixture = setup({
      champion: preventingChampion,
      definitions: [varuckSmolderingSpire, fireSource, waterSource],
      field: [varuckSmolderingSpire, fireSource, waterSource],
      bulwark: false,
    });
    const water = waterFixture.find(waterSource);
    const waterResult = dealDamage(waterFixture, waterFixture.state, water.id, { combat: false });
    expect(waterResult.state.objects[waterFixture.targetId]?.damage).toBe(0);
    expect(waterResult.result.events).toContainEqual(
      expect.objectContaining({ type: "damage-prevented", amount: 3 }),
    );
  });

  it("applies a combat-only prevention restriction only to combat damage", () => {
    const combatFixture = setup({
      champion: preventingChampion,
      definitions: [combatOnlySource],
      field: [combatOnlySource],
      bulwark: false,
    });
    const combatSource = combatFixture.find(combatOnlySource);
    const combat = dealDamage(combatFixture, combatFixture.state, combatSource.id, {
      combat: true,
    });
    expect(combat.state.objects[combatFixture.targetId]?.damage).toBe(3);

    const nonCombatFixture = setup({
      champion: preventingChampion,
      definitions: [combatOnlySource],
      field: [combatOnlySource],
      bulwark: false,
    });
    const nonCombatSource = nonCombatFixture.find(combatOnlySource);
    const nonCombat = dealDamage(nonCombatFixture, nonCombatFixture.state, nonCombatSource.id, {
      combat: false,
    });
    expect(nonCombat.state.objects[nonCombatFixture.targetId]?.damage).toBe(0);
    expect(nonCombat.result.events).toContainEqual(
      expect.objectContaining({ type: "damage-prevented", amount: 3 }),
    );
  });

  it("matches prevention restrictions against the actual damage source", () => {
    const fixture = setup({
      champion: preventingChampion,
      definitions: [fireRestrictionSource, fireSource, waterSource],
      field: [fireRestrictionSource, fireSource, waterSource],
      bulwark: false,
    });
    const fire = fixture.find(fireSource);
    const fireResult = dealDamage(fixture, fixture.state, fire.id, { combat: false });
    expect(fireResult.state.objects[fixture.targetId]?.damage).toBe(3);

    const waterFixture = setup({
      champion: preventingChampion,
      definitions: [fireRestrictionSource, fireSource, waterSource],
      field: [fireRestrictionSource, fireSource, waterSource],
      bulwark: false,
    });
    const water = waterFixture.find(waterSource);
    const waterResult = dealDamage(waterFixture, waterFixture.state, water.id, { combat: false });
    expect(waterResult.state.objects[waterFixture.targetId]?.damage).toBe(0);
    expect(waterResult.result.events).toContainEqual(
      expect.objectContaining({ type: "damage-prevented", amount: 3 }),
    );
  });

  it("recognizes an unpreventable Attack card among the combat participants", () => {
    const fixture = setup({
      champion: guardianLevelTwoPreventingChampion,
      definitions: [overwhelmingSwing],
      field: [],
      bulwark: false,
    });
    const attack = fixture.find(overwhelmingSwing);
    const attackerId = fixture.state.zones[fixture.p1].field[0]!;
    const intent = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: attack.id,
        from: attack.zone,
        to: "intent",
        hostId: attackerId,
      },
    ]).state;
    const result = dealDamage(fixture, intent, attackerId, {
      combat: true,
      participantIds: [attackerId, attack.id],
    });

    expect(result.state.objects[fixture.targetId]?.damage).toBe(3);
    expect(result.result.events).toContainEqual(
      expect.objectContaining({ type: "damage-marked", preventable: false }),
    );

    const missingParticipantFixture = setup({
      champion: guardianLevelTwoPreventingChampion,
      definitions: [overwhelmingSwing],
      field: [],
      bulwark: false,
    });
    const missingAttack = missingParticipantFixture.find(overwhelmingSwing);
    const missingAttackerId =
      missingParticipantFixture.state.zones[missingParticipantFixture.p1].field[0]!;
    const missingIntent = new GrandArchiveTransactionKernel().transact(
      missingParticipantFixture.state,
      [
        {
          type: "object-moved",
          objectId: missingAttack.id,
          from: missingAttack.zone,
          to: "intent",
          hostId: missingAttackerId,
        },
      ],
    ).state;
    const preventable = dealDamage(missingParticipantFixture, missingIntent, missingAttackerId, {
      combat: true,
      participantIds: [missingAttackerId],
    });
    expect(preventable.state.objects[missingParticipantFixture.targetId]?.damage).toBe(0);
    expect(preventable.result.events).toContainEqual(
      expect.objectContaining({ type: "damage-prevented", amount: 3 }),
    );
  });

  it("applies a this-attack unpreventable rule to the current attacking unit", () => {
    const fixture = setup({
      champion: preventingChampion,
      definitions: [],
      field: [],
      bulwark: false,
    });
    const attackerId = fixture.state.zones[fixture.p1].field[0]!;
    const combat = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-state-changed",
        objectId: attackerId,
        state: "attacking",
        value: true,
      },
      {
        type: "object-state-changed",
        objectId: fixture.targetId,
        state: "defending",
        value: true,
      },
      {
        type: "combat-started",
        combat: {
          attackerId,
          attackingPlayerId: fixture.p1,
          defendingPlayerIds: [fixture.p2],
          targetIds: [fixture.targetId],
          retaliatorIds: [],
          retaliationOrderConfirmed: true,
          weaponIds: [],
          intentIds: [],
          step: "damage",
        },
      },
      {
        type: "rule-modification-created",
        modification: {
          id: "unpreventable-this-attack-rule",
          controllerId: fixture.p1,
          affectedObjectIds: [],
          affectedObjectIncarnations: {},
          effect: {
            kind: "rule-modification",
            mode: "forbid",
            action: "prevent-damage",
            subject: { kind: "current-attack" },
            damageKind: "combat",
            duration: { kind: "this-attack" },
          },
          bindings: {},
          variables: {},
          durationAnchors: {},
          createdAtVersion: fixture.state.stateVersion,
          createdTurnNumber: fixture.state.turn.number,
          createdPhase: fixture.state.turn.phase,
        },
      },
    ]).state;
    const result = dealDamage(fixture, combat, attackerId, { combat: true });

    expect(result.state.objects[fixture.targetId]?.damage).toBe(3);
    expect(result.result.events).toContainEqual(
      expect.objectContaining({ type: "damage-marked", preventable: false }),
    );
  });

  it("applies the unpreventable marker before offering Critical replacement ordering", () => {
    const fixture = setup({
      definitions: [criticalUnpreventableSource],
      field: [criticalUnpreventableSource],
      bulwark: false,
    });
    const attacker = fixture.find(criticalUnpreventableSource);
    const combat = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-state-changed",
        objectId: attacker.id,
        state: "attacking",
        value: true,
      },
      {
        type: "object-state-changed",
        objectId: fixture.targetId,
        state: "defending",
        value: true,
      },
      {
        type: "combat-started",
        combat: {
          attackerId: attacker.id,
          attackingPlayerId: fixture.p1,
          defendingPlayerIds: [fixture.p2],
          targetIds: [fixture.targetId],
          retaliatorIds: [],
          retaliationOrderConfirmed: true,
          weaponIds: [],
          intentIds: [],
          step: "damage",
        },
      },
    ]).state;

    const damage = proposeGrandArchiveCombatDamage(fixture.program, combat).find(
      (event) => event.type === "damage-marked",
    );
    if (!damage || damage.type !== "damage-marked") throw new Error("Expected combat damage");
    const initialCandidates = collectGrandArchiveReplacementCandidates(
      fixture.program,
      combat,
      damage,
    );
    const marker = chooseGrandArchiveReplacement(initialCandidates);
    expect(marker?.id).toMatch(/^game:unpreventable-damage:/);
    const marked = marker?.apply(damage);
    if (!marked || marked.kind !== "replaced") {
      throw new Error("Expected unpreventable damage marker replacement");
    }
    const markedDamage = marked.events.find((event) => event.type === "damage-marked");
    if (!markedDamage || markedDamage.type !== "damage-marked") {
      throw new Error("Expected marked combat damage");
    }
    expect(markedDamage).toMatchObject({ amount: 2, preventable: false });
    expect(
      collectGrandArchiveReplacementCandidates(fixture.program, combat, markedDamage).some(
        (candidate) => candidate.id.startsWith(`game:critical:${attacker.id}:`),
      ),
    ).toBe(true);
  });
});
