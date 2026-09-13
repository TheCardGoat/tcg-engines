import {
  fracturize,
  nullifyingLantern,
  potionInfusionAnimate,
  prismaticSpirit,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
  GrandArchiveElement,
  GrandArchivePlayableCardType,
  GrandArchiveSupertype,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { proposeGrandArchiveAttackDeclaration } from "../../procedures/combat/combat.ts";
import {
  deriveGrandArchiveNumericProperty,
  grandArchiveObjectCurrentCharacteristics,
} from "./continuous.ts";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { matchesGrandArchiveCardFilter } from "../../procedures/effects/evaluation.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { grandArchiveObjectHasActiveKeyword } from "../abilities/intrinsic-keywords.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { collectGrandArchiveStateBasedEvents } from "./state-based.ts";

function card(
  id: string,
  name: string,
  type: GrandArchivePlayableCardType,
  options: {
    readonly cost?: number;
    readonly supertypes?: readonly GrandArchiveSupertype[];
    readonly subtypes?: readonly string[];
    readonly elements?: readonly GrandArchiveElement[];
    readonly power?: number;
    readonly life?: number;
    readonly abilities?: readonly GrandArchiveAbilityDefinition[];
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
        name,
        cost:
          type === "CHAMPION"
            ? { kind: "memory", amount: options.cost ?? 0 }
            : { kind: "reserve", amount: options.cost ?? 0 },
        typeLine: {
          supertypes: options.supertypes ?? [],
          types: [type],
          classes: ["CLERIC"],
          subtypes: options.subtypes ?? [],
        },
        elements: options.elements ?? ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: options.life ?? 20 }
            : {
                ...(options.power !== undefined ? { power: options.power } : {}),
                ...(options.life !== undefined ? { life: options.life } : {}),
              },
        rulesText: "",
        abilities: options.abilities ?? [],
      },
    },
  };
}

const champion = card("characteristic-champion", "Characteristic Champion", "CHAMPION");
const filler = card("characteristic-filler", "Characteristic Filler", "ACTION");
const potion = card("characteristic-potion", "Animated Potion", "ITEM", {
  cost: 4,
  subtypes: ["POTION"],
});
const uniqueRelic = card("characteristic-unique-relic", "Twin Relic", "ITEM", {
  supertypes: ["UNIQUE"],
  subtypes: ["ACCESSORY"],
});
const fireSpell = card("characteristic-fire-spell", "Fire Spell", "ACTION", {
  elements: ["FIRE"],
  subtypes: ["SPELL"],
});
const dependencyAlly = card("continuous-dependency-ally", "Dependency Ally", "ALLY", {
  power: 2,
  life: 2,
});
const conditionalKeywordAlly = card(
  "continuous-conditional-keyword-ally",
  "Conditional Keyword Ally",
  "ALLY",
  {
    power: 1,
    life: 1,
    abilities: [
      {
        id: "continuousConditionalKeywordAlly-a1",
        kind: "static",
        staticKind: "effects",
        text: "As long as this ally has Intercept, it has Taunt.",
        condition: {
          kind: "subject-matches",
          subject: { kind: "source" },
          filter: { kind: "has-keyword", keyword: "intercept" },
        },
        effects: [
          {
            kind: "continuous",
            subjects: { kind: "source" },
            affectedSet: "dynamic",
            duration: { kind: "while-source-in-functional-zone" },
            layer: { layer: "D", modifies: "ability" },
            change: { kind: "grant-keyword", keyword: { name: "taunt" } },
          },
        ],
      },
    ],
  },
);

function setup(
  definitions: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[],
  p1MainDeck: GrandArchiveStandardPlayerSetup["mainDeck"],
  p1MaterialDeck: GrandArchiveStandardPlayerSetup["materialDeck"] = [
    { definitionId: champion.canonicalId, count: 1 },
  ],
  p1ChampionDefinitionId = champion.canonicalId,
) {
  const program = createGrandArchiveMatchProgram([champion, filler, ...definitions]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: id === "p1" ? p1MainDeck : [{ definitionId: filler.canonicalId, count: 6 }],
    materialDeck: id === "p1" ? p1MaterialDeck : [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: id === "p1" ? p1ChampionDefinitionId : champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 415,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return {
    program,
    state,
    p1: grandArchivePlayerId("p1"),
    p2: grandArchivePlayerId("p2"),
  };
}

function objectId(
  state: GrandArchiveMatchState,
  ownerId: ReturnType<typeof grandArchivePlayerId>,
  definitionId: string,
  occurrence = 0,
): GrandArchiveObjectId {
  const object = Object.values(state.objects).filter(
    (candidate) => candidate.ownerId === ownerId && candidate.definitionId === definitionId,
  )[occurrence];
  if (!object) throw new Error(`Missing ${definitionId} occurrence ${occurrence}`);
  return object.id;
}

function executeEffect(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  controllerId: ReturnType<typeof grandArchivePlayerId>,
  effect: GrandArchiveEffect,
  bindings: Readonly<Record<string, readonly GrandArchiveObjectId[]>>,
  sourceId?: GrandArchiveObjectId,
) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    effect,
    {
      program,
      state,
      controllerId,
      ...(sourceId ? { sourceId, abilityBearerId: sourceId } : {}),
      bindings,
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

function resolutionEffect(
  definition: typeof fracturize | typeof potionInfusionAnimate,
): GrandArchiveEffect {
  if (definition.layout.kind !== "single-faced") {
    throw new Error(`${definition.slug} must be single-faced`);
  }
  const face = definition.layout.face;
  const resolution = face.abilities.find((ability) => ability.kind === "card-resolution");
  if (!resolution?.effect) throw new Error(`Missing ${definition.slug} resolution`);
  return resolution.effect;
}

describe("Grand Archive Layer B/C characteristics", () => {
  it("lets Potion Infusion's catalog effect turn an Item into a lethal, attack-capable Ally", () => {
    const fixture = setup(
      [potion, potionInfusionAnimate],
      [
        { definitionId: potion.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 5 },
      ],
    );
    const potionId = objectId(fixture.state, fixture.p1, potion.canonicalId);
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: potionId, from: "main-deck", to: "field" },
    ]).state;
    const printed = resolutionEffect(potionInfusionAnimate);
    if (printed.kind !== "reflexive") throw new Error("Potion Infusion must be reflexive");
    const animated = executeEffect(fixture.program, entered, fixture.p1, printed.consequence, {
      "target-potion": [potionId],
    }).state;
    const animatedPotion = animated.objects[potionId]!;
    expect(
      grandArchiveObjectCurrentCharacteristics(fixture.program, animated, animatedPotion),
    ).toMatchObject({
      types: ["ITEM", "ALLY"],
      subtypes: ["POTION"],
    });
    expect(
      deriveGrandArchiveNumericProperty(animatedPotion, "power", {
        program: fixture.program,
        state: animated,
        controllerId: fixture.p1,
        sourceId: potionId,
        abilityBearerId: potionId,
        bindings: {},
      }),
    ).toBe(4);
    expect(
      deriveGrandArchiveNumericProperty(animatedPotion, "life", {
        program: fixture.program,
        state: animated,
        controllerId: fixture.p1,
        sourceId: potionId,
        abilityBearerId: potionId,
        bindings: {},
      }),
    ).toBe(4);

    const attackState: GrandArchiveMatchState = {
      ...animated,
      players: {
        ...animated.players,
        [fixture.p1]: { ...animated.players[fixture.p1]!, hasTakenFirstTurn: true },
      },
      opportunity: {
        holderId: fixture.p1,
        startedById: fixture.p1,
        passedPlayerIds: [],
        reason: "phase-begin",
      },
    };
    const defendingChampionId = attackState.zones[fixture.p2].field[0]!;
    expect(() =>
      proposeGrandArchiveAttackDeclaration(fixture.program, attackState, fixture.p1, {
        move: "declare-attack",
        attackerId: potionId,
        targetIds: [defendingChampionId],
      }),
    ).not.toThrow();

    const damaged = new GrandArchiveTransactionKernel().transact(animated, [
      { type: "damage-marked", objectId: potionId, amount: 4 },
    ]).state;
    expect(collectGrandArchiveStateBasedEvents(fixture.program, damaged)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "object-moved",
          objectId: potionId,
          from: "field",
          to: "graveyard",
        }),
      ]),
    );
  });

  it("applies Fracturize's type setting, retained subtypes, and loss of Unique to state checks", () => {
    const fixture = setup(
      [uniqueRelic, fracturize],
      [
        { definitionId: uniqueRelic.canonicalId, count: 2 },
        { definitionId: filler.canonicalId, count: 4 },
      ],
    );
    const firstId = objectId(fixture.state, fixture.p1, uniqueRelic.canonicalId, 0);
    const secondId = objectId(fixture.state, fixture.p1, uniqueRelic.canonicalId, 1);
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: firstId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: secondId, from: "main-deck", to: "field" },
    ]).state;
    expect(collectGrandArchiveStateBasedEvents(fixture.program, entered)[0]).toMatchObject({
      type: "decision-created",
      decision: { kind: "choose-unique-object" },
    });

    const changed = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      resolutionEffect(fracturize),
      { "target-object": [firstId] },
    ).state;
    const first = changed.objects[firstId]!;
    expect(grandArchiveObjectCurrentCharacteristics(fixture.program, changed, first)).toMatchObject(
      {
        supertypes: [],
        types: ["PHANTASIA"],
        subtypes: ["ACCESSORY", "CLERIC", "FRACTAL"],
      },
    );
    expect(
      matchesGrandArchiveCardFilter(
        first,
        { kind: "type", oneOf: ["ITEM"] },
        {
          program: fixture.program,
          state: changed,
          controllerId: fixture.p1,
          sourceId: firstId,
          abilityBearerId: firstId,
          bindings: {},
        },
      ),
    ).toBe(false);
    expect(collectGrandArchiveStateBasedEvents(fixture.program, changed)).toEqual([]);
  });

  it("applies Unique to any current name shared by controlled Unique objects", () => {
    const aliasedRelic = card("characteristic-aliased-unique-relic", "Other Relic", "ITEM", {
      supertypes: ["UNIQUE"],
    });
    const fixture = setup(
      [uniqueRelic, aliasedRelic],
      [
        { definitionId: uniqueRelic.canonicalId, count: 1 },
        { definitionId: aliasedRelic.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 4 },
      ],
    );
    const originalId = objectId(fixture.state, fixture.p1, uniqueRelic.canonicalId);
    const aliasId = objectId(fixture.state, fixture.p1, aliasedRelic.canonicalId);
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: originalId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: aliasId, from: "main-deck", to: "field" },
    ]).state;
    expect(collectGrandArchiveStateBasedEvents(fixture.program, entered)).toEqual([]);

    const renamed = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "B", modifies: "type" },
        change: {
          kind: "add-characteristic",
          characteristic: { kind: "name", value: "Twin Relic" },
        },
      },
      { target: [aliasId] },
    ).state;
    expect(collectGrandArchiveStateBasedEvents(fixture.program, renamed)).toEqual([
      expect.objectContaining({
        type: "decision-created",
        decision: expect.objectContaining({
          kind: "choose-unique-object",
          name: "Twin Relic",
          candidates: [originalId, aliasId],
        }),
      }),
    ]);
  });

  it("gives an absent stat a provisional value of zero while applying a stat setter", () => {
    const fixture = setup(
      [potion],
      [
        { definitionId: potion.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 5 },
      ],
    );
    const potionId = objectId(fixture.state, fixture.p1, potion.canonicalId);
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: potionId, from: "main-deck", to: "field" },
    ]).state;
    const established = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "A", modifies: "base-stats" },
        change: {
          kind: "numeric",
          property: "power",
          operation: "set",
          amount: {
            kind: "property",
            subject: { kind: "bound", binding: "target" },
            property: "power",
            basis: "current",
          },
        },
      },
      { target: [potionId] },
    ).state;

    expect(
      deriveGrandArchiveNumericProperty(established.objects[potionId]!, "power", {
        program: fixture.program,
        state: established,
        controllerId: fixture.p1,
        sourceId: potionId,
        abilityBearerId: potionId,
        bindings: { target: [potionId] },
      }),
    ).toBe(0);
  });

  it("dynamically applies Nullifying Lantern to cards entering graveyards later", () => {
    const fixture = setup(
      [fireSpell, nullifyingLantern],
      [
        { definitionId: fireSpell.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 5 },
      ],
      [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: nullifyingLantern.canonicalId, count: 1 },
      ],
    );
    const lanternId = objectId(fixture.state, fixture.p1, nullifyingLantern.canonicalId);
    const spellId = objectId(fixture.state, fixture.p1, fireSpell.canonicalId);
    const active = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: lanternId, from: "material-deck", to: "field" },
      { type: "object-moved", objectId: spellId, from: "main-deck", to: "graveyard" },
    ]).state;
    expect(
      grandArchiveObjectCurrentCharacteristics(fixture.program, active, active.objects[spellId]!)
        .elements,
    ).toEqual(["NORM"]);
  });

  it("applies same-layer dependencies before timestamp order", () => {
    const fixture = setup(
      [potion],
      [
        { definitionId: potion.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 5 },
      ],
    );
    const potionId = objectId(fixture.state, fixture.p1, potion.canonicalId);
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: potionId, from: "main-deck", to: "field" },
    ]).state;
    const olderDependent: GrandArchiveEffect = {
      kind: "continuous",
      subjects: {
        kind: "each",
        collection: {
          zones: ["field"],
          filter: { kind: "type", oneOf: ["ALLY"] },
        },
      },
      affectedSet: "dynamic",
      duration: { kind: "permanent" },
      layer: { layer: "B", modifies: "type" },
      change: {
        kind: "add-characteristic",
        characteristic: { kind: "subtype", value: "SPIRIT" },
      },
    };
    const newerIndependent: GrandArchiveEffect = {
      kind: "continuous",
      subjects: { kind: "bound", binding: "target" },
      affectedSet: "locked",
      duration: { kind: "permanent" },
      layer: { layer: "B", modifies: "type" },
      change: {
        kind: "add-characteristic",
        characteristic: { kind: "type", value: "ALLY" },
      },
    };
    const dependentCreated = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      olderDependent,
      {},
    ).state;
    const independentCreated = executeEffect(
      fixture.program,
      dependentCreated,
      fixture.p1,
      newerIndependent,
      { target: [potionId] },
    ).state;

    expect(
      grandArchiveObjectCurrentCharacteristics(
        fixture.program,
        independentCreated,
        independentCreated.objects[potionId]!,
      ),
    ).toMatchObject({ types: ["ITEM", "ALLY"], subtypes: ["POTION", "SPIRIT"] });
  });

  it("orders a same-layer dependency expressed by an effect condition", () => {
    const fixture = setup(
      [potion],
      [
        { definitionId: potion.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 5 },
      ],
    );
    const potionId = objectId(fixture.state, fixture.p1, potion.canonicalId);
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: potionId, from: "main-deck", to: "field" },
    ]).state;
    const olderConditional = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        condition: {
          kind: "subject-matches",
          subject: { kind: "bound", binding: "target" },
          filter: { kind: "type", oneOf: ["ALLY"] },
        },
        duration: { kind: "permanent" },
        layer: { layer: "B", modifies: "type" },
        change: {
          kind: "add-characteristic",
          characteristic: { kind: "subtype", value: "SPIRIT" },
        },
      },
      { target: [potionId] },
    ).state;
    const newerIndependent = executeEffect(
      fixture.program,
      olderConditional,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "B", modifies: "type" },
        change: {
          kind: "add-characteristic",
          characteristic: { kind: "type", value: "ALLY" },
        },
      },
      { target: [potionId] },
    ).state;

    expect(
      grandArchiveObjectCurrentCharacteristics(
        fixture.program,
        newerIndependent,
        newerIndependent.objects[potionId]!,
      ),
    ).toMatchObject({ types: ["ITEM", "ALLY"], subtypes: ["POTION", "SPIRIT"] });
  });

  it("reconsiders a pending effect when another same-layer effect changes its subject set", () => {
    const fixture = setup(
      [potion],
      [
        { definitionId: potion.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 5 },
      ],
    );
    const potionId = objectId(fixture.state, fixture.p1, potion.canonicalId);
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: potionId, from: "main-deck", to: "field" },
    ]).state;
    const olderPending = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      {
        kind: "continuous",
        subjects: {
          kind: "each",
          collection: { zones: ["field"], filter: { kind: "type", oneOf: ["ALLY"] } },
        },
        affectedSet: "dynamic",
        duration: { kind: "permanent" },
        layer: { layer: "B", modifies: "type" },
        change: { kind: "set-types", types: ["ITEM"] },
      },
      {},
    ).state;
    const newerEnabler = executeEffect(
      fixture.program,
      olderPending,
      fixture.p1,
      {
        kind: "continuous",
        subjects: {
          kind: "each",
          collection: { zones: ["field"], filter: { kind: "type", oneOf: ["ITEM"] } },
        },
        affectedSet: "dynamic",
        duration: { kind: "permanent" },
        layer: { layer: "B", modifies: "type" },
        change: { kind: "set-types", types: ["ALLY"] },
      },
      {},
    ).state;

    expect(
      grandArchiveObjectCurrentCharacteristics(
        fixture.program,
        newerEnabler,
        newerEnabler.objects[potionId]!,
      ).types,
    ).toEqual(["ITEM"]);
  });

  it("applies a newer Layer B prerequisite before an older still-applicable dependent effect", () => {
    const fixture = setup(
      [potion],
      [
        { definitionId: potion.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 5 },
      ],
    );
    const potionId = objectId(fixture.state, fixture.p1, potion.canonicalId);
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: potionId, from: "main-deck", to: "field" },
    ]).state;
    const olderDependent = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      {
        kind: "continuous",
        subjects: {
          kind: "each",
          collection: { zones: ["field"], filter: { kind: "type", oneOf: ["ITEM"] } },
        },
        affectedSet: "dynamic",
        duration: { kind: "permanent" },
        layer: { layer: "B", modifies: "type" },
        change: {
          kind: "add-characteristic",
          characteristic: { kind: "subtype", value: "SPIRIT" },
        },
      },
      {},
    ).state;
    const newerPrerequisite = executeEffect(
      fixture.program,
      olderDependent,
      fixture.p1,
      {
        kind: "continuous",
        subjects: {
          kind: "each",
          collection: { zones: ["field"], filter: { kind: "subtype", oneOf: ["POTION"] } },
        },
        affectedSet: "dynamic",
        duration: { kind: "permanent" },
        layer: { layer: "B", modifies: "type" },
        change: {
          kind: "remove-characteristic",
          characteristic: { kind: "type", value: "ITEM" },
        },
      },
      {},
    ).state;

    expect(
      grandArchiveObjectCurrentCharacteristics(
        fixture.program,
        newerPrerequisite,
        newerPrerequisite.objects[potionId]!,
      ),
    ).toMatchObject({ types: [], subtypes: ["POTION"] });
  });

  it("evaluates a dependent Layer E amount after independent modifiers", () => {
    const fixture = setup(
      [dependencyAlly],
      [
        { definitionId: dependencyAlly.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 5 },
      ],
    );
    const allyId = objectId(fixture.state, fixture.p1, dependencyAlly.canonicalId);
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
    ]).state;
    const olderDependent = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
        change: {
          kind: "numeric",
          property: "power",
          operation: "add",
          amount: {
            kind: "property",
            subject: { kind: "bound", binding: "target" },
            property: "power",
            basis: "current",
          },
        },
      },
      { target: [allyId] },
    ).state;
    const newerIndependent = executeEffect(
      fixture.program,
      olderDependent,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
        change: { kind: "numeric", property: "power", operation: "add", amount: 3 },
      },
      { target: [allyId] },
    ).state;

    expect(
      deriveGrandArchiveNumericProperty(newerIndependent.objects[allyId]!, "power", {
        program: fixture.program,
        state: newerIndependent,
        controllerId: fixture.p1,
        sourceId: allyId,
        abilityBearerId: allyId,
        bindings: {},
      }),
    ).toBe(10);
  });

  it("orders two dependency-shaped modifiers by their actual one-way dependency", () => {
    const fixture = setup(
      [dependencyAlly],
      [
        { definitionId: dependencyAlly.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 5 },
      ],
    );
    const allyId = objectId(fixture.state, fixture.p1, dependencyAlly.canonicalId);
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
    ]).state;
    const olderDependent = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
        change: {
          kind: "numeric",
          property: "power",
          operation: "add",
          amount: {
            kind: "property",
            subject: { kind: "bound", binding: "target" },
            property: "power",
            basis: "current",
          },
        },
      },
      { target: [allyId] },
    ).state;
    const newerConditionallyApplicable = executeEffect(
      fixture.program,
      olderDependent,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        condition: {
          kind: "compare",
          comparison: {
            left: {
              kind: "property",
              subject: { kind: "bound", binding: "target" },
              property: "power",
              basis: "current",
            },
            operator: "gt",
            right: 0,
          },
        },
        duration: { kind: "permanent" },
        layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
        change: { kind: "numeric", property: "power", operation: "add", amount: 2 },
      },
      { target: [allyId] },
    ).state;

    expect(
      deriveGrandArchiveNumericProperty(newerConditionallyApplicable.objects[allyId]!, "power", {
        program: fixture.program,
        state: newerConditionallyApplicable,
        controllerId: fixture.p1,
        sourceId: allyId,
        abilityBearerId: allyId,
        bindings: {},
      }),
    ).toBe(8);
  });

  it("falls back to timestamp order for a numeric dependency loop", () => {
    const fixture = setup(
      [dependencyAlly],
      [
        { definitionId: dependencyAlly.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 5 },
      ],
    );
    const allyId = objectId(fixture.state, fixture.p1, dependencyAlly.canonicalId);
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
    ]).state;
    const currentPower = {
      kind: "property" as const,
      subject: { kind: "bound" as const, binding: "target" },
      property: "power" as const,
      basis: "current" as const,
    };
    const olderDouble = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
        change: { kind: "numeric", property: "power", operation: "add", amount: currentPower },
      },
      { target: [allyId] },
    ).state;
    const newerAddCurrentPlusOne = executeEffect(
      fixture.program,
      olderDouble,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
        change: {
          kind: "numeric",
          property: "power",
          operation: "add",
          amount: { kind: "calculate", operator: "add", operands: [currentPower, 1] },
        },
      },
      { target: [allyId] },
    ).state;

    expect(
      deriveGrandArchiveNumericProperty(newerAddCurrentPlusOne.objects[allyId]!, "power", {
        program: fixture.program,
        state: newerAddCurrentPlusOne,
        controllerId: fixture.p1,
        sourceId: allyId,
        abilityBearerId: allyId,
        bindings: {},
      }),
    ).toBe(9);
  });

  it("reconsiders pending numeric effects when their dependency status changes", () => {
    const fixture = setup(
      [dependencyAlly],
      [
        { definitionId: dependencyAlly.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 5 },
      ],
    );
    const allyId = objectId(fixture.state, fixture.p1, dependencyAlly.canonicalId);
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
    ]).state;
    const currentPower = {
      kind: "property" as const,
      subject: { kind: "bound" as const, binding: "target" },
      property: "power" as const,
      basis: "current" as const,
    };
    const olderDependent = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
        change: { kind: "numeric", property: "power", operation: "add", amount: currentPower },
      },
      { target: [allyId] },
    ).state;
    const thresholdModifier = executeEffect(
      fixture.program,
      olderDependent,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        condition: {
          kind: "compare",
          comparison: { left: currentPower, operator: "gte", right: 5 },
        },
        duration: { kind: "permanent" },
        layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
        change: { kind: "numeric", property: "power", operation: "add", amount: 2 },
      },
      { target: [allyId] },
    ).state;
    const thresholdReached = executeEffect(
      fixture.program,
      thresholdModifier,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
        change: { kind: "numeric", property: "power", operation: "add", amount: 3 },
      },
      { target: [allyId] },
    ).state;

    expect(
      deriveGrandArchiveNumericProperty(thresholdReached.objects[allyId]!, "power", {
        program: fixture.program,
        state: thresholdReached,
        controllerId: fixture.p1,
        sourceId: allyId,
        abilityBearerId: allyId,
        bindings: {},
      }),
    ).toBe(14);
  });

  it("reconsiders a Layer D effect after another effect changes its keyword subject set", () => {
    const fixture = setup(
      [potion],
      [
        { definitionId: potion.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 5 },
      ],
    );
    const potionId = objectId(fixture.state, fixture.p1, potion.canonicalId);
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: potionId, from: "main-deck", to: "field" },
    ]).state;
    const dependent = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      {
        kind: "continuous",
        subjects: {
          kind: "each",
          collection: {
            zones: ["field"],
            filter: { kind: "has-keyword", keyword: "intercept" },
          },
        },
        affectedSet: "dynamic",
        duration: { kind: "permanent" },
        layer: { layer: "D", modifies: "ability" },
        change: { kind: "grant-keyword", keyword: { name: "taunt" } },
      },
      {},
    ).state;
    const enabled = executeEffect(
      fixture.program,
      dependent,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "D", modifies: "ability" },
        change: { kind: "grant-keyword", keyword: { name: "intercept" } },
      },
      { target: [potionId] },
    ).state;
    const object = enabled.objects[potionId]!;

    expect(grandArchiveObjectHasActiveKeyword(fixture.program, enabled, object, "intercept")).toBe(
      true,
    );
    expect(grandArchiveObjectHasActiveKeyword(fixture.program, enabled, object, "taunt")).toBe(
      true,
    );
  });

  it("reconsiders a static ability's Layer D condition after a keyword grant", () => {
    const fixture = setup(
      [conditionalKeywordAlly],
      [
        { definitionId: conditionalKeywordAlly.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 5 },
      ],
    );
    const allyId = objectId(fixture.state, fixture.p1, conditionalKeywordAlly.canonicalId);
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
    ]).state;
    const enabled = executeEffect(
      fixture.program,
      entered,
      fixture.p1,
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "D", modifies: "ability" },
        change: { kind: "grant-keyword", keyword: { name: "intercept" } },
      },
      { target: [allyId] },
    ).state;
    const object = enabled.objects[allyId]!;

    expect(grandArchiveObjectHasActiveKeyword(fixture.program, enabled, object, "intercept")).toBe(
      true,
    );
    expect(grandArchiveObjectHasActiveKeyword(fixture.program, enabled, object, "taunt")).toBe(
      true,
    );
  });

  it("uses Prismatic Spirit's granted static ability to apply both tracked elements", () => {
    const fixture = setup(
      [prismaticSpirit],
      [{ definitionId: filler.canonicalId, count: 6 }],
      [{ definitionId: prismaticSpirit.canonicalId, count: 1 }],
      prismaticSpirit.canonicalId,
    );
    const spiritId = fixture.state.zones[fixture.p1].field[0]!;
    const tracked = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-characteristic-tracked",
        objectId: spiritId,
        key: "chosen-elements",
        values: ["FIRE", "WATER"],
      },
    ]).state;
    if (prismaticSpirit.layout.kind !== "single-faced") {
      throw new Error("Prismatic Spirit must be single-faced");
    }
    const resolution = prismaticSpirit.layout.face.abilities.find(
      (ability) => ability.kind === "triggered",
    );
    if (!resolution?.effect || resolution.effect.kind !== "sequence") {
      throw new Error("Missing Prismatic Spirit On Enter sequence");
    }
    const grant = resolution.effect.effects[2];
    if (!grant || grant.kind !== "continuous") {
      throw new Error("Missing Prismatic Spirit inherited-effect grant");
    }
    const inherited = executeEffect(
      fixture.program,
      tracked,
      fixture.p1,
      grant,
      {},
      spiritId,
    ).state;
    expect(
      grandArchiveObjectCurrentCharacteristics(
        fixture.program,
        inherited,
        inherited.objects[spiritId]!,
      ).elements,
    ).toEqual(["NORM", "FIRE", "WATER"]);
  });
});
