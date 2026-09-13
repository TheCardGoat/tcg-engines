import { chateauDeCoeurs, resonatingFugue, stockedOutpost } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchiveCurrentNumericProperty } from "../../game/card-runtime.ts";
import { deriveGrandArchiveNumericProperty } from "../state/continuous.ts";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { prepareGrandArchiveRuleBoundEvent } from "../../kernel/event-admission.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState as createGrandArchiveMatchInitialStateWithDeckValidation,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import {
  chooseGrandArchiveReplacement,
  collectGrandArchiveReplacementCandidates,
} from "../replacements/replacements.ts";
import { collectGrandArchiveStateBasedEvents } from "../state/state-based.ts";

function createGrandArchiveMatchInitialState(
  program: Parameters<typeof createGrandArchiveMatchInitialStateWithDeckValidation>[0],
  input: Parameters<typeof createGrandArchiveMatchInitialStateWithDeckValidation>[1],
) {
  return createGrandArchiveMatchInitialStateWithDeckValidation(program, input, {
    validateDeckConstruction: false,
    skipPregameForTests: true,
  });
}

function rulesCard(
  id: string,
  type: GrandArchivePlayableCardType,
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
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["WARRIOR"], subtypes: [] },
        elements: ["NORM"],
        stats,
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = rulesCard("counter-champion", "CHAMPION", { level: 0, life: 10 });
const ally = rulesCard("counter-ally", "ALLY", { power: 2, life: 3 });
const weapon = rulesCard("counter-weapon", "WEAPON", { power: 1, durability: 2 });

function resonatingFugueEffect(): Extract<GrandArchiveEffect, { readonly kind: "continuous" }> {
  if (resonatingFugue.layout.kind !== "single-faced") {
    throw new Error("Resonating Fugue must be single-faced");
  }
  const ability = resonatingFugue.layout.face.abilities[0];
  if (ability?.kind !== "card-resolution" || ability.effect?.kind !== "continuous") {
    throw new Error("Resonating Fugue must have its catalog continuous effect");
  }
  return ability.effect;
}

function setupPlayer(id: string): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: ally.canonicalId, count: 1 },
      { definitionId: weapon.canonicalId, count: 1 },
      { definitionId: stockedOutpost.canonicalId, count: 1 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function fixture() {
  const program = createGrandArchiveMatchProgram([champion, ally, weapon, stockedOutpost]);
  const state = createGrandArchiveMatchInitialState(program, {
    mode: "standard",
    players: [setupPlayer("p1"), setupPlayer("p2")],
    firstPlayerId: "p1",
    randomSeed: 1,
  });
  return { program, state, p1: grandArchivePlayerId("p1") };
}

describe("Grand Archive inherent counter rules", () => {
  it("cancels buff/debuff counters and derives power and life", () => {
    const { program, state, p1 } = fixture();
    const allyId = Object.values(state.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === ally.canonicalId,
    )!.id;
    const kernel = new GrandArchiveTransactionKernel();
    const result = kernel.transact(state, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
      { type: "counter-changed", objectId: allyId, counter: "buff", delta: 2 },
      { type: "counter-changed", objectId: allyId, counter: "debuff", delta: 1 },
    ]).state;
    const object = result.objects[allyId]!;
    expect(object.counters).toMatchObject({ buff: 1, debuff: 0 });
    expect(grandArchiveCurrentNumericProperty(program, object, "power")).toBe(3);
    expect(grandArchiveCurrentNumericProperty(program, object, "life")).toBe(4);
  });

  it("initializes durability and destroys a weapon only after its counters reach zero", () => {
    const { program, state, p1 } = fixture();
    const weaponId = Object.values(state.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === weapon.canonicalId,
    )!.id;
    const kernel = new GrandArchiveTransactionKernel();
    const entered = kernel.transact(state, [
      {
        type: "object-moved",
        objectId: weaponId,
        from: "main-deck",
        to: "field",
        initialCounters: { durability: 2 },
      },
    ]).state;
    expect(collectGrandArchiveStateBasedEvents(program, entered)).toEqual([]);
    const spent = kernel.transact(entered, [
      { type: "counter-changed", objectId: weaponId, counter: "durability", delta: -2 },
    ]).state;
    expect(collectGrandArchiveStateBasedEvents(program, spent)[0]).toMatchObject({
      type: "object-moved",
      objectId: weaponId,
      from: "field",
      to: "graveyard",
    });
  });

  it("initializes durability and destroys a catalog Siegeable domain at zero durability", () => {
    const { program, state, p1 } = fixture();
    const domainId = Object.values(state.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === stockedOutpost.canonicalId,
    )!.id;
    const rulesKernel = new GrandArchiveTransactionKernel({
      collectReplacements: (current, event) =>
        collectGrandArchiveReplacementCandidates(program, current, event),
      chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
    });
    const entered = rulesKernel.transact(state, [
      { type: "object-moved", objectId: domainId, from: "main-deck", to: "field" },
    ]).state;
    expect(entered.objects[domainId]?.counters.durability).toBe(4);
    expect(collectGrandArchiveStateBasedEvents(program, entered)).toEqual([]);

    const spent = rulesKernel.transact(entered, [
      { type: "counter-changed", objectId: domainId, counter: "durability", delta: -4 },
    ]).state;
    expect(collectGrandArchiveStateBasedEvents(program, spent)).toEqual([
      expect.objectContaining({
        type: "object-moved",
        objectId: domainId,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "zero-durability-state-check" },
      }),
    ]);
  });

  it("keeps the Siegeable subtype state check after the reminder keyword is removed", () => {
    const { program, state, p1 } = fixture();
    const domainId = Object.values(state.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === stockedOutpost.canonicalId,
    )!.id;
    const rulesKernel = new GrandArchiveTransactionKernel({
      collectReplacements: (current, event) =>
        collectGrandArchiveReplacementCandidates(program, current, event),
      chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
    });
    const entered = rulesKernel.transact(state, [
      { type: "object-moved", objectId: domainId, from: "main-deck", to: "field" },
    ]).state;
    const withoutSiegeable = executeGrandArchiveEffect(
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "D", modifies: "ability" },
        change: { kind: "remove-keyword", keyword: { name: "siegeable" } },
      },
      {
        program,
        state: entered,
        controllerId: p1,
        sourceId: domainId,
        abilityBearerId: domainId,
        bindings: { target: [domainId] },
      },
      (current, events) => {
        const transaction = rulesKernel.transact(current, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;
    const spent = rulesKernel.transact(withoutSiegeable, [
      { type: "counter-changed", objectId: domainId, counter: "durability", delta: -4 },
    ]).state;

    expect(collectGrandArchiveStateBasedEvents(program, spent)).toEqual([
      expect.objectContaining({
        type: "object-moved",
        objectId: domainId,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "zero-durability-state-check" },
      }),
    ]);
  });

  it("consumes one Bulwark counter to prevent an entire combat-damage instance", () => {
    const { program, state, p1 } = fixture();
    const allyId = Object.values(state.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === ally.canonicalId,
    )!.id;
    const baseKernel = new GrandArchiveTransactionKernel();
    const prepared = baseKernel.transact(state, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
      { type: "counter-changed", objectId: allyId, counter: "bulwark", delta: 1 },
    ]).state;
    const rulesKernel = new GrandArchiveTransactionKernel({
      collectReplacements: (current, event) =>
        collectGrandArchiveReplacementCandidates(program, current, event),
      chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
    });
    const result = rulesKernel.transact(prepared, [
      {
        type: "damage-marked",
        objectId: allyId,
        amount: 7,
        combatDamage: true,
      },
    ]);
    expect(result.state.objects[allyId]?.damage).toBe(0);
    expect(result.state.objects[allyId]?.counters.bulwark).toBe(0);
    expect(result.result.events.map((event) => event.type)).toEqual([
      "damage-prevented",
      "counter-changed",
    ]);
  });

  it("applies static dynamic-set and resolved locked-set continuous modifiers in CR layers", () => {
    const inspiringChampion = rulesCard("continuous-champion", "CHAMPION", { level: 0, life: 10 }, [
      {
        id: "continuousChampion-a1",
        kind: "static",
        staticKind: "effects",
        text: "Allies you control have +1 power.",
        effects: [
          {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: { kind: "type", oneOf: ["ALLY"] },
              },
            },
            affectedSet: "dynamic",
            duration: { kind: "while-source-on-field" },
            layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
            change: { kind: "numeric", property: "power", operation: "add", amount: 1 },
          },
        ],
      },
    ]);
    const program = createGrandArchiveMatchProgram([inspiringChampion, ally, weapon]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: ally.canonicalId, count: 1 }],
      materialDeck: [{ definitionId: inspiringChampion.canonicalId, count: 1 }],
      startingChampionDefinitionId: inspiringChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 2,
    });
    const p1 = grandArchivePlayerId("p1");
    const allyId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === ally.canonicalId,
    )!.id;
    const sourceId = initial.zones[p1].field[0]!;
    const kernel = new GrandArchiveTransactionKernel();
    const onField = kernel.transact(initial, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
    ]).state;
    const evaluation = {
      program,
      state: onField,
      controllerId: p1,
      sourceId,
      abilityBearerId: sourceId,
      bindings: { target: [allyId] },
    };
    expect(deriveGrandArchiveNumericProperty(onField.objects[allyId]!, "power", evaluation)).toBe(
      3,
    );
    const resolved = executeGrandArchiveEffect(
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "target" },
        affectedSet: "locked",
        duration: { kind: "this-turn" },
        layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
        change: { kind: "numeric", property: "power", operation: "add", amount: 2 },
      },
      evaluation,
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(resolved.state.continuousEffects).toHaveLength(1);
    expect(
      deriveGrandArchiveNumericProperty(resolved.state.objects[allyId]!, "power", {
        ...evaluation,
        state: resolved.state,
      }),
    ).toBe(5);
  });

  it("applies Resonating Fugue after modifiers and counters in Layer E's swap sublayer", () => {
    const inspiringChampion = rulesCard("swap-layer-champion", "CHAMPION", { level: 0, life: 10 }, [
      {
        id: "swapLayerChampion-a1",
        kind: "static",
        staticKind: "effects",
        text: "Allies you control have +2 power.",
        effects: [
          {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: { kind: "type", oneOf: ["ALLY"] },
              },
            },
            affectedSet: "dynamic",
            duration: { kind: "while-source-on-field" },
            layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
            change: { kind: "numeric", property: "power", operation: "add", amount: 2 },
          },
        ],
      },
    ]);
    const program = createGrandArchiveMatchProgram([inspiringChampion, ally, resonatingFugue]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: ally.canonicalId, count: 1 }],
      materialDeck: [{ definitionId: inspiringChampion.canonicalId, count: 1 }],
      startingChampionDefinitionId: inspiringChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 3,
    });
    const p1 = grandArchivePlayerId("p1");
    const allyId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === ally.canonicalId,
    )!.id;
    const sourceId = initial.zones[p1].field[0]!;
    const kernel = new GrandArchiveTransactionKernel();
    const onField = kernel.transact(initial, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
      { type: "counter-changed", objectId: allyId, counter: "buff", delta: 1 },
    ]).state;
    const evaluation = {
      program,
      state: onField,
      controllerId: p1,
      sourceId,
      abilityBearerId: sourceId,
      bindings: { "target-1": [allyId] },
    };
    const firstSwap = executeGrandArchiveEffect(
      resonatingFugueEffect(),
      evaluation,
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;
    const firstEvaluation = { ...evaluation, state: firstSwap };
    expect(
      deriveGrandArchiveNumericProperty(firstSwap.objects[allyId]!, "power", firstEvaluation),
    ).toBe(4);
    expect(
      deriveGrandArchiveNumericProperty(firstSwap.objects[allyId]!, "life", firstEvaluation),
    ).toBe(5);

    const secondSwap = executeGrandArchiveEffect(
      resonatingFugueEffect(),
      firstEvaluation,
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;
    const secondEvaluation = { ...evaluation, state: secondSwap };
    expect(
      deriveGrandArchiveNumericProperty(secondSwap.objects[allyId]!, "power", secondEvaluation),
    ).toBe(5);
    expect(
      deriveGrandArchiveNumericProperty(secondSwap.objects[allyId]!, "life", secondEvaluation),
    ).toBe(4);
  });

  it("enforces Chateau de Coeurs across counter effects and entry counters", () => {
    const counterChampion = rulesCard("counter-rule-champion", "CHAMPION", { level: 0, life: 20 }, [
      {
        id: "counterRuleChampion-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        text: "Put a buff counter on each ally you control.",
        effect: {
          kind: "add-counter",
          subject: {
            kind: "each",
            collection: {
              zones: ["field"],
              player: "controller",
              filter: { kind: "type", oneOf: ["ALLY"] },
            },
          },
          counter: "buff",
          amount: 1,
        },
      },
      {
        id: "counterRuleChampion-a2",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        text: "Put a buff counter and a debuff counter on each opposing ally.",
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "add-counter",
              subject: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "each-opponent",
                  filter: { kind: "type", oneOf: ["ALLY"] },
                },
              },
              counter: "buff",
              amount: 1,
            },
            {
              kind: "add-counter",
              subject: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "each-opponent",
                  filter: { kind: "type", oneOf: ["ALLY"] },
                },
              },
              counter: "debuff",
              amount: 1,
            },
          ],
        },
      },
      {
        id: "counterRuleChampion-a3",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        text: "Summon an opposing ally with a buff counter and a debuff counter on it.",
        effect: {
          kind: "summon",
          controller: "each-opponent",
          object: ally.canonicalId,
          entersWithCounters: [
            { counter: "buff", amount: 1 },
            { counter: "debuff", amount: 1 },
          ],
        },
      },
    ]);
    const program = createGrandArchiveMatchProgram([counterChampion, ally, chateauDeCoeurs]);
    const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: ally.canonicalId, count: 3 },
        ...(id === "p1" ? [{ definitionId: chateauDeCoeurs.canonicalId, count: 1 }] : []),
      ],
      materialDeck: [{ definitionId: counterChampion.canonicalId, count: 1 }],
      startingChampionDefinitionId: counterChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 702,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const championId = initial.zones[p1].field[0]!;
    const ownAlly = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === ally.canonicalId,
    );
    const opposingAlly = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === ally.canonicalId,
    );
    const chateau = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === chateauDeCoeurs.canonicalId,
    );
    if (!ownAlly || !opposingAlly || !chateau) throw new Error("Missing Chateau fixture cards");
    const positioned = new GrandArchiveTransactionKernel({
      prepareEvent: (state, event) => prepareGrandArchiveRuleBoundEvent(program, state, event),
      collectReplacements: (state, event) =>
        collectGrandArchiveReplacementCandidates(program, state, event),
      chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
    }).transact(initial, [
      { type: "object-moved", objectId: ownAlly.id, from: ownAlly.zone, to: "field" },
      { type: "object-moved", objectId: opposingAlly.id, from: opposingAlly.zone, to: "field" },
      { type: "object-moved", objectId: chateau.id, from: chateau.zone, to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, positioned);
    const resolveAbility = (abilityId: string): void => {
      const activated = runtime.execute(
        { move: "activate-ability", sourceId: championId, abilityId },
        { playerId: p1 },
      );
      if (!activated.ok) throw new Error(activated.message);
      expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
      expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    };

    resolveAbility("counterRuleChampion-a1");
    expect(runtime.state.objects[ownAlly.id]?.counters.buff).toBe(1);

    resolveAbility("counterRuleChampion-a2");
    expect(runtime.state.objects[opposingAlly.id]?.counters.buff ?? 0).toBe(0);
    expect(runtime.state.objects[opposingAlly.id]?.counters.debuff).toBe(1);

    const opposingAlliesBeforeSummon = runtime.state.zones[p2].field.length;
    resolveAbility("counterRuleChampion-a3");
    const summonedId = runtime.state.zones[p2].field.find(
      (objectId) =>
        objectId !== opposingAlly.id &&
        runtime.state.objects[objectId]?.definitionId === ally.canonicalId,
    );
    expect(runtime.state.zones[p2].field).toHaveLength(opposingAlliesBeforeSummon + 1);
    expect(runtime.state.objects[summonedId!]?.counters.buff ?? 0).toBe(0);
    expect(runtime.state.objects[summonedId!]?.counters.debuff).toBe(1);
  });
});
