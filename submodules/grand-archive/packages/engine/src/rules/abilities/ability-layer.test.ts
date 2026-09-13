import {
  deriveGrandArchiveNumericProperty,
  grandArchiveObjectCurrentCharacteristics,
} from "../state/continuous.ts";
import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import {
  caliburnOfSilencing,
  lightweaversInfiniteShaping,
  mordredFlawlessBlade,
} from "@tcg/grand-archive-cards";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { prepareGrandArchiveRuleBoundEvent } from "../../kernel/event-admission.ts";
import {
  grandArchiveObjectActiveAbilities,
  grandArchiveObjectActiveKeywords,
} from "./intrinsic-keywords.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import {
  collectGrandArchivePendingTriggerProgressEvents,
  collectGrandArchiveTriggeredAbilityEvents,
} from "./triggers.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "ATTACK" | "CHAMPION" | "ITEM",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  lineageName?: string,
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
        ...(lineageName ? { lineageName } : {}),
        cost: { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 3 }
              : type === "ATTACK"
                ? { power: 1 }
                : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("ability-layer-champion", "CHAMPION");
const filler = card("ability-layer-filler", "ACTION");
const copiedSource = card("ability-layer-source", "ITEM", [
  {
    id: "abilityLayerSource-a1",
    kind: "activated",
    activation: "ability",
    text: "Reserve 0: Put a copied counter on this object.",
    cost: { kind: "pay-reserve", amount: 0 },
    effect: {
      kind: "add-counter",
      subject: { kind: "source" },
      counter: { named: "copied" },
      amount: 1,
    },
  },
  {
    id: "abilityLayerSource-a2",
    kind: "static",
    staticKind: "intrinsic",
    text: "Taunt",
    keyword: { name: "taunt" },
    additionalKeywords: [{ name: "stealth" }],
  },
]);
const copier = card("ability-layer-copier", "ALLY", [
  {
    id: "abilityLayerCopier-a1",
    kind: "static",
    staticKind: "effects",
    text: "This object has all activated abilities of items you control.",
    effects: [
      {
        kind: "continuous",
        subjects: { kind: "source" },
        affectedSet: "dynamic",
        duration: { kind: "while-source-in-functional-zone" },
        layer: { layer: "D", modifies: "ability" },
        change: {
          kind: "copy-abilities",
          from: {
            kind: "each",
            collection: {
              zones: ["field"],
              player: "controller",
              filter: { kind: "type", oneOf: ["ITEM"] },
            },
          },
          abilityKinds: ["activated"],
        },
      },
    ],
  },
]);
const keywordCopier = card("ability-layer-keyword-copier", "ALLY", [
  {
    id: "abilityLayerKeywordCopier-a1",
    kind: "static",
    staticKind: "effects",
    text: "This object has all abilities of items you control.",
    effects: [
      {
        kind: "continuous",
        subjects: { kind: "source" },
        affectedSet: "dynamic",
        duration: { kind: "while-source-in-functional-zone" },
        layer: { layer: "D", modifies: "ability" },
        change: {
          kind: "copy-abilities",
          from: {
            kind: "each",
            collection: {
              zones: ["field"],
              player: "controller",
              filter: { kind: "type", oneOf: ["ITEM"] },
            },
          },
        },
      },
    ],
  },
]);
const conditionalAura = card("ability-layer-conditional-aura", "ALLY", [
  {
    id: "abilityLayerConditionalAura-a1",
    kind: "static",
    staticKind: "effects",
    text: "As long as this object has Intercept, allies you control have Taunt.",
    condition: {
      kind: "subject-matches",
      subject: { kind: "source" },
      filter: { kind: "has-keyword", keyword: "intercept" },
    },
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
        duration: { kind: "while-source-in-functional-zone" },
        layer: { layer: "D", modifies: "ability" },
        change: { kind: "grant-keyword", keyword: { name: "taunt" } },
      },
    ],
  },
]);
const potion = card("ability-layer-potion", "ALLY", [
  {
    id: "abilityLayerPotion-a1",
    kind: "activated",
    activation: "ability",
    text: "Reserve 0: Put an animated counter on this object.",
    cost: { kind: "pay-reserve", amount: 0 },
    effect: {
      kind: "add-counter",
      subject: { kind: "source" },
      counter: { named: "animated" },
      amount: 1,
    },
  },
]);
const graveyardAttack = card("ability-layer-graveyard-attack", "ATTACK");

const zander = card("Zander", "CHAMPION", [], "Zander");
const revealedFirst = card("ability-layer-revealed-first", "ITEM", [
  {
    id: "abilityLayerRevealedFirst-a1",
    kind: "triggered",
    text: "Whenever this card is revealed, put a first counter on it.",
    functionalZones: ["memory"],
    trigger: {
      kind: "event",
      event: { name: "card-revealed", subject: { kind: "source" } },
    },
    effect: {
      kind: "add-counter",
      subject: { kind: "source" },
      counter: { named: "first" },
      amount: 1,
    },
  },
]);
const revealedSecond = card("ability-layer-revealed-second", "ITEM", [
  {
    id: "abilityLayerRevealedSecond-a1",
    kind: "triggered",
    text: "Whenever this card is revealed, put a second counter on it.",
    functionalZones: ["memory"],
    trigger: {
      kind: "event",
      event: { name: "card-revealed", subject: { kind: "source" } },
    },
    effect: {
      kind: "add-counter",
      subject: { kind: "source" },
      counter: { named: "second" },
      amount: 1,
    },
  },
]);

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    copiedSource,
    copier,
    keywordCopier,
    conditionalAura,
    potion,
  ]);
  const player = (id: string): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: copiedSource.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: copier.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: keywordCopier.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: conditionalAura.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: potion.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: filler.canonicalId, count: 4 },
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
      randomSeed: 1618,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const owned = Object.values(initial.objects).filter((object) => object.ownerId === p1);
  const sourceId = owned.find((object) => object.definitionId === copiedSource.canonicalId)!.id;
  const copierId = owned.find((object) => object.definitionId === copier.canonicalId)!.id;
  const potionId = owned.find((object) => object.definitionId === potion.canonicalId)!.id;
  const keywordCopierId = owned.find(
    (object) => object.definitionId === keywordCopier.canonicalId,
  )!.id;
  const conditionalAuraId = owned.find(
    (object) => object.definitionId === conditionalAura.canonicalId,
  )!.id;
  const kernel = new GrandArchiveTransactionKernel({
    prepareEvent: (state, event) => prepareGrandArchiveRuleBoundEvent(program, state, event),
  });
  const positioned = kernel.transact(
    initial,
    [sourceId, copierId, keywordCopierId, conditionalAuraId, potionId].map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: initial.objects[objectId]!.zone,
      to: "field" as const,
    })),
  ).state;
  return {
    program,
    kernel,
    state: positioned,
    p1,
    sourceId,
    copierId,
    keywordCopierId,
    conditionalAuraId,
    potionId,
  };
}

function resolveStack(runtime: GrandArchiveMatchRuntime): void {
  for (let pass = 0; pass < 8 && runtime.state.stack.length > 0; pass += 1) {
    const holderId = runtime.state.opportunity?.holderId;
    if (!holderId) {
      throw new Error(
        `Expected Opportunity while an ability is pending: ${JSON.stringify({
          stack: runtime.state.stack.map((item) => ({ id: item.id, kind: item.kind })),
          pendingTriggers: runtime.state.pendingTriggers.map((trigger) => trigger.ability.id),
          decision: runtime.state.decision?.kind,
        })}`,
      );
    }
    const transition = runtime.execute({ move: "pass" }, { playerId: holderId });
    if (!transition.ok) throw new Error(transition.message);
  }
  expect(runtime.state.stack).toEqual([]);
}

function lightweaverSetup() {
  const program = createGrandArchiveMatchProgram([
    zander,
    filler,
    lightweaversInfiniteShaping,
    revealedFirst,
    revealedSecond,
  ]);
  const player = (id: string): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: lightweaversInfiniteShaping.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: revealedFirst.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: revealedSecond.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: filler.canonicalId, count: 4 },
    ],
    materialDeck: [{ definitionId: zander.canonicalId, count: 1 }],
    startingChampionDefinitionId: zander.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 2718,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const owned = Object.values(initial.objects).filter((object) => object.ownerId === p1);
  const lightweaverId = owned.find(
    (object) => object.definitionId === lightweaversInfiniteShaping.canonicalId,
  )!.id;
  const firstId = owned.find((object) => object.definitionId === revealedFirst.canonicalId)!.id;
  const secondId = owned.find((object) => object.definitionId === revealedSecond.canonicalId)!.id;
  const kernel = new GrandArchiveTransactionKernel();
  const entered = kernel.transact(initial, [
    { type: "object-moved", objectId: firstId, from: "main-deck", to: "memory" },
    { type: "object-moved", objectId: secondId, from: "main-deck", to: "memory" },
    { type: "object-moved", objectId: lightweaverId, from: "main-deck", to: "field" },
  ]);
  const triggerEvents = collectGrandArchiveTriggeredAbilityEvents(
    program,
    entered.state,
    entered.result.events,
  );
  const pending = kernel.transact(entered.state, triggerEvents).state;
  const ready = kernel.transact(
    pending,
    collectGrandArchivePendingTriggerProgressEvents(program, pending),
  ).state;
  return { program, state: ready, p1, firstId, secondId };
}

describe("Grand Archive layer-D ability changes", () => {
  it("applies a resolved ability removal before a dependent static ability grant", () => {
    const mordredFace = mordredFlawlessBlade.layout;
    if (mordredFace.kind !== "single-faced") throw new Error("Mordred must be single-faced");
    const testMordred = card(
      "ability-layer-mordred",
      "CHAMPION",
      mordredFace.face.abilities,
      "Mordred",
    );
    const program = createGrandArchiveMatchProgram([
      champion,
      filler,
      graveyardAttack,
      testMordred,
      caliburnOfSilencing,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: graveyardAttack.canonicalId, count: id === "p1" ? 1 : 0 },
        { definitionId: caliburnOfSilencing.canonicalId, count: id === "p1" ? 1 : 0 },
        { definitionId: filler.canonicalId, count: 4 },
      ],
      materialDeck: [
        {
          definitionId: id === "p1" ? testMordred.canonicalId : champion.canonicalId,
          count: 1,
        },
      ],
      startingChampionDefinitionId: id === "p1" ? testMordred.canonicalId : champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 3141,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const owned = Object.values(initial.objects).filter((object) => object.ownerId === p1);
    const mordredId = owned.find((object) => object.definitionId === testMordred.canonicalId)!.id;
    const attackId = owned.find(
      (object) => object.definitionId === graveyardAttack.canonicalId,
    )!.id;
    const caliburnId = owned.find(
      (object) => object.definitionId === caliburnOfSilencing.canonicalId,
    )!.id;
    const kernel = new GrandArchiveTransactionKernel();
    const positioned = kernel.transact(initial, [
      { type: "object-moved", objectId: attackId, from: "main-deck", to: "graveyard" },
      { type: "object-moved", objectId: caliburnId, from: "main-deck", to: "field" },
    ]).state;

    expect(
      grandArchiveObjectActiveKeywords(program, positioned, positioned.objects[attackId]!),
    ).toEqual(expect.arrayContaining([expect.objectContaining({ name: "floating-memory" })]));

    const caliburnFace = caliburnOfSilencing.layout;
    if (caliburnFace.kind !== "single-faced") throw new Error("Caliburn must be single-faced");
    const trigger = caliburnFace.face.abilities[0];
    if (trigger?.kind !== "triggered" || trigger.effect?.kind !== "continuous") {
      throw new Error("Missing Caliburn ability-removal effect");
    }
    const silenced = executeGrandArchiveEffect(
      trigger.effect,
      {
        program,
        state: positioned,
        controllerId: p1,
        sourceId: caliburnId,
        abilityBearerId: caliburnId,
        bindings: { eventRecipient: [mordredId] },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;

    expect(
      grandArchiveObjectActiveAbilities(program, silenced, silenced.objects[mordredId]!),
    ).toEqual([]);
    expect(
      grandArchiveObjectActiveKeywords(program, silenced, silenced.objects[attackId]!),
    ).toEqual([]);
  });

  it("copies only the requested ability kind and uses the copier as the ability source", () => {
    const fixture = setup();
    const active = grandArchiveObjectActiveAbilities(
      fixture.program,
      fixture.state,
      fixture.state.objects[fixture.copierId]!,
    );
    expect(active).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "abilityLayerSource-a1", kind: "activated" }),
      ]),
    );
    expect(active.some((ability) => ability.id === "abilityLayerCopier-a1")).toBe(true);

    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    const activation = runtime.execute(
      {
        move: "activate-ability",
        sourceId: fixture.copierId,
        abilityId: "abilityLayerSource-a1",
      },
      { playerId: fixture.p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    resolveStack(runtime);
    expect(runtime.state.objects[fixture.copierId]?.counters["named:copied"]).toBe(1);
    expect(runtime.state.objects[fixture.sourceId]?.counters["named:copied"]).toBeUndefined();
  });

  it("exposes copied intrinsic abilities through active keyword queries", () => {
    const fixture = setup();
    expect(
      grandArchiveObjectActiveKeywords(
        fixture.program,
        fixture.state,
        fixture.state.objects[fixture.copierId]!,
      ).some((keyword) => keyword.name === "taunt"),
    ).toBe(false);
    expect(
      grandArchiveObjectActiveKeywords(
        fixture.program,
        fixture.state,
        fixture.state.objects[fixture.keywordCopierId]!,
      ),
    ).toEqual(expect.arrayContaining([expect.objectContaining({ name: "taunt" })]));
  });

  it("derives attack-scoped granted keywords while validating a prospective attacker", () => {
    const fixture = setup();
    const championId = fixture.state.zones[fixture.p1].field[0]!;
    const granted = executeGrandArchiveEffect(
      {
        kind: "continuous",
        subjects: {
          kind: "attacks-by",
          attacker: { kind: "champion", player: "controller" },
        },
        affectedSet: "dynamic",
        duration: { kind: "this-turn" },
        layer: { layer: "D", modifies: "ability" },
        change: { kind: "grant-keyword", keyword: { name: "true-sight" } },
      },
      {
        program: fixture.program,
        state: fixture.state,
        controllerId: fixture.p1,
        sourceId: fixture.sourceId,
        abilityBearerId: fixture.sourceId,
        bindings: {},
      },
      (state, events) => {
        const transaction = fixture.kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;

    expect(
      grandArchiveObjectActiveKeywords(fixture.program, granted, granted.objects[championId]!, {
        prospectiveAttackAttackerId: championId,
      }),
    ).toEqual(expect.arrayContaining([expect.objectContaining({ name: "true-sight" })]));
  });

  it("orders Layer D effects by an actual one-way keyword dependency", () => {
    const fixture = setup();
    const olderGrant = executeGrandArchiveEffect(
      {
        kind: "continuous",
        subjects: {
          kind: "each",
          collection: {
            zones: ["field"],
            filter: { kind: "has-keyword", keyword: "taunt" },
          },
        },
        affectedSet: "dynamic",
        duration: { kind: "permanent" },
        layer: { layer: "D", modifies: "ability" },
        change: { kind: "grant-keyword", keyword: { name: "intercept" } },
      },
      {
        program: fixture.program,
        state: fixture.state,
        controllerId: fixture.p1,
        sourceId: fixture.sourceId,
        abilityBearerId: fixture.sourceId,
        bindings: {},
      },
      (state, events) => {
        const transaction = fixture.kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;
    const newerRemoval = executeGrandArchiveEffect(
      {
        kind: "continuous",
        subjects: {
          kind: "each",
          collection: {
            zones: ["field"],
            filter: { kind: "has-keyword", keyword: "stealth" },
          },
        },
        affectedSet: "dynamic",
        duration: { kind: "permanent" },
        layer: { layer: "D", modifies: "ability" },
        change: { kind: "remove-keyword", keyword: { name: "taunt", anyValue: true } },
      },
      {
        program: fixture.program,
        state: olderGrant,
        controllerId: fixture.p1,
        sourceId: fixture.sourceId,
        abilityBearerId: fixture.sourceId,
        bindings: {},
      },
      (state, events) => {
        const transaction = fixture.kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;
    const keywords = grandArchiveObjectActiveKeywords(
      fixture.program,
      newerRemoval,
      newerRemoval.objects[fixture.sourceId]!,
    );

    expect(keywords.some((keyword) => keyword.name === "taunt")).toBe(false);
    expect(keywords.some((keyword) => keyword.name === "intercept")).toBe(false);
  });

  it("re-evaluates a cross-object static ability gate from its derived source keywords", () => {
    const fixture = setup();
    expect(
      grandArchiveObjectActiveKeywords(
        fixture.program,
        fixture.state,
        fixture.state.objects[fixture.potionId]!,
      ).some((keyword) => keyword.name === "taunt"),
    ).toBe(false);
    const enabled = executeGrandArchiveEffect(
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "aura" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "D", modifies: "ability" },
        change: { kind: "grant-keyword", keyword: { name: "intercept" } },
      },
      {
        program: fixture.program,
        state: fixture.state,
        controllerId: fixture.p1,
        sourceId: fixture.conditionalAuraId,
        abilityBearerId: fixture.conditionalAuraId,
        bindings: { aura: [fixture.conditionalAuraId] },
      },
      (state, events) => {
        const transaction = fixture.kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;

    expect(
      grandArchiveObjectActiveKeywords(
        fixture.program,
        enabled,
        enabled.objects[fixture.potionId]!,
      ),
    ).toEqual(expect.arrayContaining([expect.objectContaining({ name: "taunt" })]));
  });

  it("transforms an activated ability into an On Death trigger without its cost", () => {
    const fixture = setup();
    const transformed = executeGrandArchiveEffect(
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "potion" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "D", modifies: "ability" },
        change: {
          kind: "transform-abilities",
          from: { kind: "activated" },
          to: { kind: "triggered", event: "object-died" },
          preserveActivationCosts: false,
        },
      },
      {
        program: fixture.program,
        state: fixture.state,
        controllerId: fixture.p1,
        sourceId: fixture.potionId,
        abilityBearerId: fixture.potionId,
        bindings: { potion: [fixture.potionId] },
      },
      (state, events) => {
        const transaction = fixture.kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    const active = grandArchiveObjectActiveAbilities(
      fixture.program,
      transformed.state,
      transformed.state.objects[fixture.potionId]!,
    );
    expect(active).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "abilityLayerPotion-a1",
          kind: "triggered",
          trigger: {
            kind: "event",
            event: { name: "object-died", subject: { kind: "source" } },
          },
        }),
      ]),
    );
    expect(active.some((ability) => ability.kind === "activated")).toBe(false);

    const died = fixture.kernel.transact(transformed.state, [
      {
        type: "object-moved",
        objectId: fixture.potionId,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "test-potion-died" },
      },
    ]);
    const triggerEvents = collectGrandArchiveTriggeredAbilityEvents(
      fixture.program,
      died.state,
      died.result.events,
    );
    expect(triggerEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "pending-trigger-added",
          trigger: expect.objectContaining({
            sourceId: fixture.potionId,
            ability: expect.objectContaining({ id: "abilityLayerPotion-a1", kind: "triggered" }),
          }),
        }),
      ]),
    );
    let triggered = fixture.kernel.transact(died.state, triggerEvents).state;
    const progressEvents = collectGrandArchivePendingTriggerProgressEvents(
      fixture.program,
      triggered,
    );
    triggered = fixture.kernel.transact(triggered, progressEvents).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, triggered);
    resolveStack(runtime);
    expect(runtime.state.objects[fixture.potionId]?.counters["named:animated"]).toBe(1);
  });

  it("copies the abilities of every other card revealed during Lightweaver's resolution", () => {
    const fixture = lightweaverSetup();
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    for (let pass = 0; pass < 4 && runtime.state.pendingTriggers.length === 0; pass += 1) {
      const holderId = runtime.state.opportunity?.holderId;
      if (!holderId) throw new Error("Expected Opportunity before Lightweaver resolves");
      const transition = runtime.execute({ move: "pass" }, { playerId: holderId });
      if (!transition.ok) throw new Error(transition.message);
    }

    expect(runtime.state.pendingTriggers).toHaveLength(4);
    expect(runtime.state.pendingTriggers.map((trigger) => trigger.ability.id).sort()).toEqual([
      "abilityLayerRevealedFirst-a1",
      "abilityLayerRevealedFirst-a1",
      "abilityLayerRevealedSecond-a1",
      "abilityLayerRevealedSecond-a1",
    ]);
    for (const sourceId of [fixture.firstId, fixture.secondId]) {
      expect(
        runtime.state.pendingTriggers
          .filter((trigger) => trigger.sourceId === sourceId)
          .map((trigger) => trigger.ability.id)
          .sort(),
      ).toEqual(["abilityLayerRevealedFirst-a1", "abilityLayerRevealedSecond-a1"]);
    }

    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
    );
    expect(restored.pendingTriggers).toEqual(runtime.state.pendingTriggers);
    expect(restored.decision).toEqual(runtime.state.decision);
  });
});

it("resolves granted abilities alongside unrelated characteristic-dependent cost restrictions", () => {
  const grantItem = card("ability-layer-grant-item", "ITEM", [
    {
      id: "abilityLayerGrantItem-a1",
      kind: "activated",
      activation: "ability",
      text: "Gain an activated draw ability.",
      cost: { kind: "pay-reserve", amount: 0 },
      effect: {
        kind: "continuous",
        subjects: { kind: "source" },
        affectedSet: "locked",
        duration: { kind: "this-turn" },
        layer: { layer: "D", modifies: "ability" },
        change: {
          kind: "grant-ability",
          ability: {
            id: "abilityLayerGrantedDraw-a1",
            kind: "activated",
            activation: "ability",
            text: "Draw a card.",
            cost: { kind: "rest", subject: { kind: "source" } },
            effect: { kind: "draw", player: "controller", amount: 1 },
          },
        },
      },
    },
  ]);
  const discounted = card("ability-layer-discounted-action", "ACTION", [
    {
      id: "abilityLayerDiscountedAction-a1",
      kind: "static",
      staticKind: "effects",
      text: "Class Bonus: This costs less.",
      restrictions: [
        {
          kind: "static",
          name: "class-bonus",
          condition: { kind: "champion-matches-source", characteristic: "class" },
        },
      ],
      effects: [
        {
          kind: "rule-modification",
          mode: "modify-cost",
          action: "activate",
          subject: { kind: "source" },
          costKind: "reserve",
          costOperation: "subtract",
          amount: 1,
          duration: { kind: "while-source-in-functional-zone" },
        },
      ],
    },
  ]);
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: { field: [grantItem], hand: [discounted], "main-deck": [filler] },
    },
    playerTwo: { champion },
  });
  const p = game.player("player-one");
  const settle = () => {
    while (game.state.stack.length) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error("Expected opportunity");
      game.player(wait.playerId).pass();
    }
  };
  p.activateAbility(grantItem, "abilityLayerGrantItem-a1");
  settle();
  expect(p.zone("hand")).toHaveLength(1);
  p.activateAbility(grantItem, "abilityLayerGrantedDraw-a1");
  expect(game.state.objects[p.card(grantItem).objectId]!.states.has("rested")).toBe(true);
  settle();
  expect(p.card(filler, { zone: "hand" })).toBeDefined();
  expect(p.card(discounted, { zone: "hand" })).toBeDefined();
  expect(() => p.activateAbility(grantItem, "abilityLayerGrantedDraw-a1")).toThrow();
});

describe("resolved entry ability copies", () => {
  for (const grouped of [false, true])
    it(`captures abilities across entry and later source movement, grouped=${grouped}`, () => {
      const original = card("captured-original", "ITEM", [
        {
          id: "capturedOriginal-a1",
          kind: "activated",
          activation: "ability",
          text: "Put a buff counter on this item.",
          cost: { kind: "pay-reserve", amount: 0 },
          effect: { kind: "add-counter", subject: { kind: "source" }, counter: "buff", amount: 1 },
        },
      ]);
      const copyEffect = {
        kind: "continuous",
        subjects: { kind: "source" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "D", modifies: "ability" },
        change: {
          kind: "copy-abilities",
          from: {
            kind: "each",
            collection: {
              zones: ["banishment"],
              player: "controller",
              filter: { kind: "name", value: "captured-original", match: "exact" },
            },
          },
        },
      } as const;
      const copy = card("captured-copy", "ITEM", [
        {
          id: "capturedCopy-a1",
          kind: "static",
          staticKind: "effects",
          text: "Enter with the original's abilities.",
          effects: [
            {
              kind: "replacement",
              event: { name: "object-entered-field", subject: { kind: "source" } },
              operation: grouped
                ? {
                    kind: "sequence",
                    operations: [
                      { kind: "perform-before-commit", effect: copyEffect },
                      {
                        kind: "perform-before-commit",
                        effect: { kind: "draw", player: "controller", amount: 1 },
                      },
                    ],
                  }
                : { kind: "perform-before-commit", effect: copyEffect },
              duration: { kind: "while-source-in-functional-zone" },
            },
          ],
        },
      ]);
      const retrieve = card("captured-retrieve", "ACTION", [
        {
          id: "capturedRetrieve-a1",
          kind: "card-resolution",
          text: "Return the original to hand.",
          effect: {
            kind: "move",
            subject: {
              kind: "each",
              collection: {
                zones: ["banishment"],
                player: "controller",
                filter: { kind: "name", value: "captured-original", match: "exact" },
              },
            },
            destination: { zone: "hand" },
          },
        },
      ]);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { hand: [copy, retrieve], banishment: [original], "main-deck": [filler] },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        source = p.card(copy),
        book = p.card(original);
      const settle = () => {
        while (game.state.stack.length) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error("Expected opportunity");
          game.player(wait.playerId).pass();
        }
      };
      p.activate(source);
      settle();
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      if (grouped) expect(p.card(filler, { zone: "hand" })).toBeDefined();
      p.activateAbility(source, "capturedOriginal-a1");
      settle();
      expect(game.state.objects[source.objectId]!.counters.buff).toBe(1);
      p.activate(retrieve);
      settle();
      expect(game.state.objects[book.objectId]!.zone).toBe("hand");
      p.activateAbility(source, "capturedOriginal-a1");
      settle();
      expect(game.state.objects[source.objectId]!.counters.buff).toBe(2);
      expect(game.state.objects[book.objectId]!.counters.buff ?? 0).toBe(0);
    });
});

it("removing a static ability stops its later power bonus but retains earlier subtype changes", () => {
  const subject = card("silenced-subject", "ALLY", [
    {
      id: "silencedSubject-a1",
      kind: "static",
      staticKind: "effects",
      text: "This is a Beast and gets +2 power.",
      effects: [
        {
          kind: "continuous",
          subjects: { kind: "source" },
          affectedSet: "dynamic",
          duration: { kind: "while-source-in-functional-zone" },
          layer: { layer: "B", modifies: "type" },
          change: {
            kind: "add-characteristic",
            characteristic: { kind: "subtype", value: "BEAST" },
          },
        },
        {
          kind: "continuous",
          subjects: { kind: "source" },
          affectedSet: "dynamic",
          duration: { kind: "while-source-in-functional-zone" },
          layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
          change: { kind: "numeric", property: "power", operation: "add", amount: 2 },
        },
      ],
    },
  ]);
  const silence = card("silence-static", "ACTION", [
    {
      id: "silenceStatic-a1",
      kind: "card-resolution",
      text: "Remove this ally's abilities.",
      effect: {
        kind: "continuous",
        subjects: {
          kind: "each",
          collection: {
            zones: ["field"],
            player: "controller",
            filter: { kind: "type", oneOf: ["ALLY"] },
          },
        },
        affectedSet: "locked",
        duration: { kind: "this-turn" },
        layer: { layer: "D", modifies: "ability" },
        change: { kind: "remove-abilities" },
      },
    },
  ]);
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: { champion, zones: { hand: [silence], field: [subject] } },
    playerTwo: { champion },
  });
  const p = game.player("player-one"),
    id = p.card(subject).objectId;
  const power = () =>
    deriveGrandArchiveNumericProperty(game.state.objects[id]!, "power", {
      program: game.program,
      state: game.state,
      controllerId: p.id,
      bindings: {},
    });
  expect(power()).toBe(3);
  p.activate(silence);
  while (game.state.stack.length) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error("Expected opportunity");
    game.player(wait.playerId).pass();
  }
  expect(power()).toBe(1);
  expect(
    grandArchiveObjectCurrentCharacteristics(game.program, game.state, game.state.objects[id]!)
      .subtypes,
  ).toContain("BEAST");
});
