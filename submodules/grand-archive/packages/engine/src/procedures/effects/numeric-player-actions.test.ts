import { heirloomOfLibra, morganSoulGuide } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "./effect-executor.ts";
import type { GrandArchiveObjectId } from "../../game/identity.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { openGrandArchiveOpportunity } from "../game-flow/opportunity.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "CHAMPION",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId,
    slug: canonicalId,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${canonicalId}:face:default`,
        catalogId: canonicalId,
        name: canonicalId,
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["CLERIC"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("numeric-player-action-champion", "CHAMPION", [
  {
    id: "numericChampion-a1",
    kind: "activated",
    activation: "ability",
    text: "Recover 2: No effect.",
    cost: { kind: "recover", amount: 2, requiresExact: true },
    effect: { kind: "no-op" },
  },
]);
const filler = card("numeric-player-action-filler", "ACTION");
const optionalGlimpse = card("numeric-player-action-optional-glimpse", "ACTION", [
  {
    id: "optionalGlimpse-a1",
    kind: "card-resolution",
    text: "You may glimpse 1. If you don't, recover 1.",
    effect: {
      kind: "optional",
      player: "controller",
      allOrNothing: true,
      effect: { kind: "keyword-action", action: "glimpse", amount: 1 },
      otherwise: { kind: "recover", player: "controller", amount: 1 },
    },
  },
]);
const mandatoryGlimpse = card("numeric-player-action-mandatory-glimpse", "ACTION", [
  {
    id: "mandatoryGlimpse-a1",
    kind: "card-resolution",
    text: "Glimpse 1. Draw a card.",
    effect: {
      kind: "sequence",
      effects: [
        { kind: "keyword-action", action: "glimpse", amount: 1 },
        { kind: "draw", player: "controller", amount: 1 },
      ],
    },
  },
]);
const optionalCounterRemoval = card("numeric-player-action-optional-counter", "ACTION", [
  {
    id: "optionalCounterRemoval-a1",
    kind: "card-resolution",
    text: "You may remove two preparation counters from your champion. If you don't, recover 1.",
    effect: {
      kind: "optional",
      player: "controller",
      allOrNothing: true,
      effect: {
        kind: "remove-counter",
        subject: { kind: "champion", player: "controller" },
        counter: "preparation",
        amount: 2,
      },
      otherwise: { kind: "recover", player: "controller", amount: 1 },
    },
  },
]);
const optionalRestAndChoose = card("numeric-player-action-optional-rest-choice", "ACTION", [
  {
    id: "optionalRestAndChoose-a1",
    kind: "card-resolution",
    text: "You may rest your champion and choose an ally. If you don't, recover 1.",
    effect: {
      kind: "optional",
      player: "controller",
      allOrNothing: true,
      effect: {
        kind: "sequence",
        effects: [
          { kind: "rest", subject: { kind: "champion", player: "controller" } },
          {
            kind: "choose",
            selection: {
              id: "chosen-ally",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: { kind: "exactly", amount: 1 },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: { kind: "type", oneOf: ["ALLY"] },
              },
            },
          },
        ],
      },
      otherwise: { kind: "recover", player: "controller", amount: 1 },
    },
  },
]);
const optionalReflexiveChoose = card("numeric-player-action-optional-reflexive-choice", "ACTION", [
  {
    id: "optionalReflexiveChoose-a1",
    kind: "card-resolution",
    text: "You may choose an ally. When you do, draw a card. If you don't, recover 1.",
    effect: {
      kind: "optional",
      player: "controller",
      allOrNothing: true,
      effect: {
        kind: "reflexive",
        action: {
          kind: "choose",
          selection: {
            id: "chosen-ally",
            kind: "choice",
            declared: "resolution",
            chooser: "controller",
            count: { kind: "exactly", amount: 1 },
            candidates: {
              kind: "object",
              zones: ["field"],
              filter: { kind: "type", oneOf: ["ALLY"] },
            },
          },
        },
        consequence: { kind: "draw", player: "controller", amount: 1 },
      },
      otherwise: { kind: "recover", player: "controller", amount: 1 },
    },
  },
]);

const cards = [
  champion,
  filler,
  mandatoryGlimpse,
  optionalCounterRemoval,
  optionalGlimpse,
  optionalReflexiveChoose,
  optionalRestAndChoose,
  heirloomOfLibra,
  morganSoulGuide,
] as const;

function setup() {
  const program = createGrandArchiveMatchProgram(cards);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 12 },
      ...(id === "p2"
        ? [
            { definitionId: mandatoryGlimpse.canonicalId, count: 1 },
            { definitionId: optionalCounterRemoval.canonicalId, count: 1 },
            { definitionId: optionalGlimpse.canonicalId, count: 1 },
            { definitionId: optionalReflexiveChoose.canonicalId, count: 1 },
            { definitionId: optionalRestAndChoose.canonicalId, count: 1 },
            { definitionId: morganSoulGuide.canonicalId, count: 1 },
          ]
        : []),
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1" ? [{ definitionId: heirloomOfLibra.canonicalId, count: 1 }] : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 582,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, state, p1: grandArchivePlayerId("p1"), p2: grandArchivePlayerId("p2") };
}

function objectId(
  state: GrandArchiveMatchState,
  playerId: ReturnType<typeof grandArchivePlayerId>,
  definitionId: string,
): GrandArchiveObjectId {
  const object = Object.values(state.objects).find(
    (candidate) => candidate.ownerId === playerId && candidate.definitionId === definitionId,
  );
  if (!object) throw new Error(`Missing test object ${definitionId}`);
  return object.id;
}

function execute(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  effect: GrandArchiveEffect,
  controllerId = fixture.p1,
  sourceId?: GrandArchiveObjectId,
) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    effect,
    {
      program: fixture.program,
      state,
      controllerId,
      ...(sourceId ? { sourceId } : {}),
      bindings: {},
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

function heirloomGlimpseProhibition(): GrandArchiveEffect {
  if (heirloomOfLibra.layout.kind !== "single-faced") {
    throw new Error("Heirloom of Libra must be single-faced");
  }
  const ability = heirloomOfLibra.layout.face.abilities.find(
    (candidate) => candidate.kind === "activated" && candidate.id === "MRiM1fnOWC-a1",
  );
  if (!ability || ability.kind !== "activated" || ability.effect?.kind !== "select-modes") {
    throw new Error("Heirloom of Libra's mode ability is missing");
  }
  const mode = ability.effect.modes.find((candidate) => candidate.id === "forbid-glimpse");
  if (!mode) throw new Error("Heirloom of Libra's glimpse prohibition is missing");
  return mode.effect;
}

describe("Grand Archive numeric player actions", () => {
  it("enforces Morgan, Soul Guide's recover prohibition", () => {
    const fixture = setup();
    const morganId = objectId(fixture.state, fixture.p2, morganSoulGuide.canonicalId);
    const p1Champion = fixture.state.zones[fixture.p1].field[0]!;
    const p2Champion = fixture.state.zones[fixture.p2].field[0]!;
    const restricted = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: morganId, from: "main-deck", to: "field" },
      { type: "counter-changed", objectId: p2Champion, counter: "level", delta: 2 },
      { type: "damage-marked", objectId: p1Champion, amount: 5 },
    ]).state;

    const forbidden = execute(fixture, restricted, {
      kind: "recover",
      player: "controller",
      amount: 3,
    });
    expect(forbidden.events).toEqual([]);
    expect(forbidden.state.objects[p1Champion]?.damage).toBe(5);

    const ready = new GrandArchiveTransactionKernel().transact(forbidden.state, [
      {
        type: "opportunity-opened",
        window: openGrandArchiveOpportunity(forbidden.state, fixture.p1, "phase-begin"),
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, ready);
    const costAttempt = runtime.execute(
      { move: "activate-ability", sourceId: p1Champion, abilityId: "numericChampion-a1" },
      { playerId: fixture.p1 },
    );
    expect(costAttempt.ok).toBe(false);
    expect(runtime.state.objects[p1Champion]?.damage).toBe(5);
    expect(runtime.state.stack).toEqual([]);

    const inactive = new GrandArchiveTransactionKernel().transact(forbidden.state, [
      { type: "object-moved", objectId: morganId, from: "field", to: "graveyard" },
    ]).state;
    const recovered = execute(fixture, inactive, {
      kind: "recover",
      player: "controller",
      amount: 3,
    });
    expect(recovered.state.objects[p1Champion]?.damage).toBe(2);
    expect(recovered.events).toContainEqual(
      expect.objectContaining({ type: "damage-removed", actorId: fixture.p1, amount: 3 }),
    );
  });

  it("treats positive recovery as performed at zero damage and ignores recover 0", () => {
    const fixture = setup();
    const p1Champion = fixture.state.zones[fixture.p1].field[0]!;

    const zero = execute(fixture, fixture.state, {
      kind: "recover",
      player: "controller",
      amount: 0,
    });
    expect(zero.events).toEqual([]);

    const positive = execute(fixture, zero.state, {
      kind: "recover",
      player: "controller",
      amount: 2,
    });
    expect(positive.state.objects[p1Champion]?.damage).toBe(0);
    expect(positive.events).toContainEqual(
      expect.objectContaining({ type: "damage-removed", objectId: p1Champion, amount: 2 }),
    );
  });

  it("automatically takes an optional fallback when Heirloom forbids glimpse", () => {
    const fixture = setup();
    const actionId = objectId(fixture.state, fixture.p2, optionalGlimpse.canonicalId);
    const heirloomId = objectId(fixture.state, fixture.p1, heirloomOfLibra.canonicalId);
    const p2Champion = fixture.state.zones[fixture.p2].field[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
      { type: "damage-marked", objectId: p2Champion, amount: 2 },
      { type: "turn-started", playerId: fixture.p2, turnNumber: 2 },
      { type: "phase-changed", phase: "main" },
    ]).state;
    const restricted = execute(
      fixture,
      positioned,
      heirloomGlimpseProhibition(),
      fixture.p1,
      heirloomId,
    ).state;
    const ready = new GrandArchiveTransactionKernel().transact(restricted, [
      {
        type: "opportunity-opened",
        window: openGrandArchiveOpportunity(restricted, fixture.p2, "phase-begin"),
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, ready);

    const activation = runtime.execute(
      { move: "activate-card", cardId: actionId },
      { playerId: fixture.p2 },
    );
    if (!activation.ok) throw new Error(activation.message);
    for (let pass = 0; pass < 2; pass += 1) {
      const holderId = runtime.state.opportunity?.holderId;
      if (!holderId) throw new Error("Expected an Opportunity holder");
      const result = runtime.execute({ move: "pass" }, { playerId: holderId });
      if (!result.ok) throw new Error(result.message);
    }

    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.objects[p2Champion]?.damage).toBe(1);
    expect(
      runtime.state.eventHistory.some(
        (event) => event.type === "keyword-action-performed" && event.action === "glimpse",
      ),
    ).toBe(false);
  });

  it("automatically takes an optional fallback when an exact counter removal is impossible", () => {
    const fixture = setup();
    const actionId = objectId(fixture.state, fixture.p2, optionalCounterRemoval.canonicalId);
    const p2Champion = fixture.state.zones[fixture.p2].field[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
      {
        type: "counter-changed",
        objectId: p2Champion,
        counter: "preparation",
        delta: 1,
      },
      { type: "damage-marked", objectId: p2Champion, amount: 2 },
      { type: "turn-started", playerId: fixture.p2, turnNumber: 2 },
      { type: "phase-changed", phase: "main" },
    ]).state;
    const ready = new GrandArchiveTransactionKernel().transact(positioned, [
      {
        type: "opportunity-opened",
        window: openGrandArchiveOpportunity(positioned, fixture.p2, "phase-begin"),
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, ready);

    const activation = runtime.execute(
      { move: "activate-card", cardId: actionId },
      { playerId: fixture.p2 },
    );
    if (!activation.ok) throw new Error(activation.message);
    for (let pass = 0; pass < 2; pass += 1) {
      const holderId = runtime.state.opportunity?.holderId;
      if (!holderId) throw new Error("Expected an Opportunity holder");
      const result = runtime.execute({ move: "pass" }, { playerId: holderId });
      if (!result.ok) throw new Error(result.message);
    }

    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.objects[p2Champion]?.counters.preparation).toBe(1);
    expect(runtime.state.objects[p2Champion]?.damage).toBe(1);
  });

  it("does not partially perform an optional sequence with a missing mandatory choice", () => {
    const fixture = setup();
    const actionId = objectId(fixture.state, fixture.p2, optionalRestAndChoose.canonicalId);
    const p2Champion = fixture.state.zones[fixture.p2].field[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
      { type: "damage-marked", objectId: p2Champion, amount: 2 },
      { type: "turn-started", playerId: fixture.p2, turnNumber: 2 },
      { type: "phase-changed", phase: "main" },
    ]).state;
    const ready = new GrandArchiveTransactionKernel().transact(positioned, [
      {
        type: "opportunity-opened",
        window: openGrandArchiveOpportunity(positioned, fixture.p2, "phase-begin"),
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, ready);

    const activation = runtime.execute(
      { move: "activate-card", cardId: actionId },
      { playerId: fixture.p2 },
    );
    if (!activation.ok) throw new Error(activation.message);
    for (let pass = 0; pass < 2; pass += 1) {
      const holderId = runtime.state.opportunity?.holderId;
      if (!holderId) throw new Error("Expected an Opportunity holder");
      const result = runtime.execute({ move: "pass" }, { playerId: holderId });
      if (!result.ok) throw new Error(result.message);
    }

    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.objects[p2Champion]?.states.has("rested")).toBe(false);
    expect(runtime.state.objects[p2Champion]?.damage).toBe(1);
  });

  it("does not offer an optional reflexive effect whose required action is impossible", () => {
    const fixture = setup();
    const actionId = objectId(fixture.state, fixture.p2, optionalReflexiveChoose.canonicalId);
    const p2Champion = fixture.state.zones[fixture.p2].field[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
      { type: "damage-marked", objectId: p2Champion, amount: 2 },
      { type: "turn-started", playerId: fixture.p2, turnNumber: 2 },
      { type: "phase-changed", phase: "main" },
    ]).state;
    const ready = new GrandArchiveTransactionKernel().transact(positioned, [
      {
        type: "opportunity-opened",
        window: openGrandArchiveOpportunity(positioned, fixture.p2, "phase-begin"),
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, ready);

    const activation = runtime.execute(
      { move: "activate-card", cardId: actionId },
      { playerId: fixture.p2 },
    );
    if (!activation.ok) throw new Error(activation.message);
    for (let pass = 0; pass < 2; pass += 1) {
      const holderId = runtime.state.opportunity?.holderId;
      if (!holderId) throw new Error("Expected an Opportunity holder");
      const result = runtime.execute({ move: "pass" }, { playerId: holderId });
      if (!result.ok) throw new Error(result.message);
    }

    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.objects[p2Champion]?.damage).toBe(1);
  });

  it("skips a forbidden mandatory glimpse and continues the resolution", () => {
    const fixture = setup();
    const actionId = objectId(fixture.state, fixture.p2, mandatoryGlimpse.canonicalId);
    const heirloomId = objectId(fixture.state, fixture.p1, heirloomOfLibra.canonicalId);
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
      { type: "turn-started", playerId: fixture.p2, turnNumber: 2 },
      { type: "phase-changed", phase: "main" },
    ]).state;
    const restricted = execute(
      fixture,
      positioned,
      heirloomGlimpseProhibition(),
      fixture.p1,
      heirloomId,
    ).state;
    const ready = new GrandArchiveTransactionKernel().transact(restricted, [
      {
        type: "opportunity-opened",
        window: openGrandArchiveOpportunity(restricted, fixture.p2, "phase-begin"),
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, ready);

    const activation = runtime.execute(
      { move: "activate-card", cardId: actionId },
      { playerId: fixture.p2 },
    );
    if (!activation.ok) throw new Error(activation.message);
    for (let pass = 0; pass < 2; pass += 1) {
      const holderId = runtime.state.opportunity?.holderId;
      if (!holderId) throw new Error("Expected an Opportunity holder");
      const result = runtime.execute({ move: "pass" }, { playerId: holderId });
      if (!result.ok) throw new Error(result.message);
    }

    expect(runtime.state.decision).toBeNull();
    expect(
      runtime.state.eventHistory.filter(
        (event) => event.type === "keyword-action-performed" && event.action === "glimpse",
      ),
    ).toEqual([]);
    expect(
      runtime.state.eventHistory.filter(
        (event) =>
          event.type === "object-moved" &&
          event.actorId === fixture.p2 &&
          event.cause?.kind === "rule" &&
          event.cause.rule === "draw-effect",
      ),
    ).toHaveLength(1);
  });
});
