import { aeneanFrozenShunt } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
  GrandArchivePhase,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "./initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "./runtime.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  options: {
    readonly life?: number;
    readonly power?: number;
    readonly speed?: "fast";
    readonly abilities?: readonly GrandArchiveAbilityDefinition[];
  } = {},
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
        cost: { kind: "none" },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["CLERIC"],
          subtypes: [],
        },
        elements: ["WATER"],
        ...(options.speed ? { speed: options.speed } : {}),
        stats: {
          ...(type === "CHAMPION" ? { level: 0, life: options.life ?? 20 } : {}),
          ...(options.life === undefined ? {} : { life: options.life }),
          ...(options.power === undefined ? {} : { power: options.power }),
        },
        rulesText: "",
        abilities: options.abilities ?? [],
      },
    },
  };
}

const champion = card("phase-ending-champion", "CHAMPION");
const attacker = card("phase-ending-attacker", "ALLY", { life: 5, power: 2 });
const defender = card("phase-ending-defender", "ALLY", { life: 5, power: 1 });
const abandonedAction = card("phase-ending-abandoned-action", "ACTION", { speed: "fast" });
const reserveCard = card("phase-ending-reserve-card", "ACTION");

function terminatingAction(canonicalId: string, effect: GrandArchiveEffect) {
  return card(canonicalId, "ACTION", {
    speed: "fast",
    abilities: [
      {
        id: `${canonicalId}-a1`,
        kind: "card-resolution",
        text: canonicalId,
        effect,
      },
    ],
  });
}

function runtimeForTerminationTest(effect: GrandArchiveEffect, phase: GrandArchivePhase) {
  const endingAction = terminatingAction(`end-${phase}-action`, effect);
  const underlyingAction = card(`under-${phase}-action`, "ACTION", { speed: "fast" });
  const filler = card(`filler-${phase}`, "ACTION");
  const program = createGrandArchiveMatchProgram([
    champion,
    endingAction,
    underlyingAction,
    filler,
  ]);
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const setup = (
    id: "p1" | "p2",
    cards: readonly { readonly definitionId: string; readonly count: number }[],
  ): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: cards,
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [
        setup("p1", [
          { definitionId: endingAction.canonicalId, count: 1 },
          { definitionId: underlyingAction.canonicalId, count: 1 },
          { definitionId: filler.canonicalId, count: 4 },
        ]),
        setup("p2", [{ definitionId: filler.canonicalId, count: 4 }]),
      ],
      firstPlayerId: "p1",
      randomSeed: 641,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const endingActionId = objectId(initial, p1, endingAction.canonicalId);
  const underlyingActionId = objectId(initial, p1, underlyingAction.canonicalId);
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: endingActionId, from: "main-deck", to: "hand" },
    { type: "object-moved", objectId: underlyingActionId, from: "main-deck", to: "hand" },
    ...(phase === "main"
      ? []
      : [
          {
            type: "phase-changed" as const,
            phase,
            cause: { kind: "rule" as const, rule: "phase-ending-test-setup" },
          },
        ]),
  ]).state;
  return {
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    p1,
    p2,
    endingActionId,
    underlyingActionId,
  };
}

function resolveTerminatingAction(
  runtime: GrandArchiveMatchRuntime,
  p1: ReturnType<typeof grandArchivePlayerId>,
  p2: ReturnType<typeof grandArchivePlayerId>,
  underlyingActionId: GrandArchiveObjectId,
  endingActionId: GrandArchiveObjectId,
) {
  expect(
    runtime.execute({ move: "activate-card", cardId: underlyingActionId }, { playerId: p1 }).ok,
  ).toBe(true);
  expect(
    runtime.execute({ move: "activate-card", cardId: endingActionId }, { playerId: p1 }).ok,
  ).toBe(true);
  expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
  const result = runtime.execute({ move: "pass" }, { playerId: p2 });
  if (!result.ok) {
    throw new Error(`${result.message}: ${result.diagnostic?.cause ?? result.code}`);
  }
  return result;
}

function objectId(
  state: ReturnType<typeof createGrandArchiveMatchInitialState>,
  ownerId: ReturnType<typeof grandArchivePlayerId>,
  definitionId: string,
  occurrence = 0,
): GrandArchiveObjectId {
  const objects = Object.values(state.objects).filter(
    (object) => object.ownerId === ownerId && object.definitionId === definitionId,
  );
  const object = objects[occurrence];
  if (!object) throw new Error(`Missing ${definitionId} occurrence ${occurrence}`);
  return object.id;
}

describe("Grand Archive phase-ending effects", () => {
  it.each([
    ["wake-up", "materialize", "p1"],
    ["materialize", "recollection", "p1"],
    ["recollection", "main", "p1"],
    ["draw", "main", "p1"],
    ["main", "end", "p1"],
    ["end", "main", "p2"],
  ] as const)(
    "ends the %s phase after its effect resolves, banishes the older stack, and continues to %s",
    (phase, expectedPhase, expectedPlayer) => {
      const { runtime, p1, p2, endingActionId, underlyingActionId } = runtimeForTerminationTest(
        { kind: "end-phase", phase },
        phase,
      );

      resolveTerminatingAction(runtime, p1, p2, underlyingActionId, endingActionId);

      expect(runtime.state.pendingTermination).toBeNull();
      expect(runtime.state.stack).toEqual([]);
      expect(runtime.state.objects[endingActionId]?.zone).toBe("graveyard");
      expect(runtime.state.objects[underlyingActionId]?.zone).toBe("banishment");
      expect(runtime.state.turn.phase).toBe(expectedPhase);
      expect(runtime.state.turn.playerId).toBe(expectedPlayer === "p1" ? p1 : p2);
    },
  );

  it("ends the turn by abandoning the stack and entering cleanup without beginning the End phase", () => {
    const { runtime, p1, p2, endingActionId, underlyingActionId } = runtimeForTerminationTest(
      { kind: "end-turn" },
      "main",
    );

    const result = resolveTerminatingAction(runtime, p1, p2, underlyingActionId, endingActionId);

    expect(runtime.state.pendingTermination).toBeNull();
    expect(runtime.state.objects[endingActionId]?.zone).toBe("graveyard");
    expect(runtime.state.objects[underlyingActionId]?.zone).toBe("banishment");
    expect(runtime.state.turn.number).toBe(2);
    expect(runtime.state.turn.playerId).toBe(p2);
    expect(runtime.state.turn.phase).toBe("main");
    expect(
      result.events.some((event) => event.type === "turn-cleanup-pending-changed" && event.value),
    ).toBe(true);
    expect(
      result.events.some((event) => event.type === "phase-changed" && event.phase === "end"),
    ).toBe(false);
  });

  it("ends an active combat, cleans its participants, and skips the Main Opportunity on the way to turn cleanup", () => {
    const endTurnAction = terminatingAction("combat-end-turn-action", { kind: "end-turn" });
    const program = createGrandArchiveMatchProgram([
      champion,
      attacker,
      defender,
      abandonedAction,
      endTurnAction,
    ]);
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const setup = (
      id: "p1" | "p2",
      cards: readonly { readonly definitionId: string; readonly count: number }[],
    ): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: cards,
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          setup("p1", [
            { definitionId: attacker.canonicalId, count: 1 },
            { definitionId: abandonedAction.canonicalId, count: 1 },
          ]),
          setup("p2", [
            { definitionId: defender.canonicalId, count: 1 },
            { definitionId: endTurnAction.canonicalId, count: 1 },
          ]),
        ],
        firstPlayerId: "p1",
        randomSeed: 642,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const attackerId = objectId(initial, p1, attacker.canonicalId);
    const defenderId = objectId(initial, p2, defender.canonicalId);
    const abandonedId = objectId(initial, p1, abandonedAction.canonicalId);
    const endTurnId = objectId(initial, p2, endTurnAction.canonicalId);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "player-first-turn-completed", playerId: p1 },
      { type: "player-first-turn-completed", playerId: p2 },
      { type: "object-moved", objectId: attackerId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: defenderId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: abandonedId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: endTurnId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(
      runtime.execute(
        { move: "declare-attack", attackerId, targetIds: [defenderId] },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(
      runtime.execute({ move: "activate-card", cardId: abandonedId }, { playerId: p1 }).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "activate-card", cardId: endTurnId }, { playerId: p2 }).ok).toBe(
      true,
    );
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const result = runtime.execute({ move: "pass" }, { playerId: p1 });
    if (!result.ok) {
      throw new Error(`${result.message}: ${result.diagnostic?.cause ?? result.code}`);
    }

    expect(runtime.state.combat).toBeNull();
    expect(runtime.state.objects[attackerId]?.states.has("attacking")).toBe(false);
    expect(runtime.state.objects[defenderId]?.states.has("defending")).toBe(false);
    expect(runtime.state.objects[endTurnId]?.zone).toBe("graveyard");
    expect(runtime.state.objects[abandonedId]?.zone).toBe("banishment");
    expect(runtime.state.turn.number).toBe(2);
    expect(runtime.state.turn.playerId).toBe(p2);
    expect(runtime.state.turn.phase).toBe("materialize");
    expect(runtime.state.opportunity).toBeNull();
    expect(
      result.events.some(
        (event) =>
          event.type === "opportunity-opened" &&
          event.cause?.kind === "rule" &&
          event.cause.rule === "combat-cleanup-main-phase",
      ),
    ).toBe(false);
  });

  it("lets Aenean Frozen Shunt finish normally before abandoning and banishing the rest of combat's stack", () => {
    const program = createGrandArchiveMatchProgram([
      champion,
      attacker,
      defender,
      abandonedAction,
      reserveCard,
      aeneanFrozenShunt,
    ]);
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const player = (
      id: "p1" | "p2",
      ally: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
      actions: readonly { readonly definitionId: string; readonly count: number }[],
    ): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: ally.canonicalId, count: 1 }, ...actions],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", attacker, [{ definitionId: abandonedAction.canonicalId, count: 1 }]),
          player("p2", defender, [
            { definitionId: aeneanFrozenShunt.canonicalId, count: 1 },
            { definitionId: reserveCard.canonicalId, count: 2 },
          ]),
        ],
        firstPlayerId: "p1",
        randomSeed: 640,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const attackerId = objectId(initial, p1, attacker.canonicalId);
    const defenderId = objectId(initial, p2, defender.canonicalId);
    const abandonedId = objectId(initial, p1, abandonedAction.canonicalId);
    const shuntId = objectId(initial, p2, aeneanFrozenShunt.canonicalId);
    const paymentIds = [
      objectId(initial, p2, reserveCard.canonicalId, 0),
      objectId(initial, p2, reserveCard.canonicalId, 1),
    ] as const;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "player-first-turn-completed", playerId: p1 },
      { type: "player-first-turn-completed", playerId: p2 },
      { type: "object-moved", objectId: attackerId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: defenderId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: abandonedId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: shuntId, from: "main-deck", to: "hand" },
      ...paymentIds.map((cardId) => ({
        type: "object-moved" as const,
        objectId: cardId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(
      runtime.execute(
        { move: "declare-attack", attackerId, targetIds: [defenderId] },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(
      runtime.execute({ move: "activate-card", cardId: abandonedId }, { playerId: p1 }).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: shuntId,
          reservePayment: paymentIds.map((cardId) => ({ kind: "card" as const, cardId })),
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const result = runtime.execute({ move: "pass" }, { playerId: p1 });
    if (!result.ok) {
      throw new Error(`${result.message}: ${result.diagnostic?.cause ?? result.code}`);
    }

    expect(runtime.state.pendingTermination).toBeNull();
    expect(runtime.state.turn.phase).toBe("main");
    expect(runtime.state.combat).toBeNull();
    expect(runtime.state.stack).toEqual([]);
    expect(runtime.state.objects[shuntId]?.zone).toBe("graveyard");
    expect(runtime.state.objects[abandonedId]?.zone).toBe("banishment");
    expect(runtime.state.objects[attackerId]?.states.has("attacking")).toBe(false);
    expect(runtime.state.objects[defenderId]?.states.has("defending")).toBe(false);
    expect(runtime.state.opportunity?.holderId).toBe(p1);

    const shuntDispositionIndex = result.events.findIndex(
      (event) =>
        event.type === "object-moved" && event.objectId === shuntId && event.to === "graveyard",
    );
    const phaseEndIndex = result.events.findIndex((event) => event.type === "phase-end-requested");
    const abandonedIndex = result.events.findIndex(
      (event) =>
        event.type === "object-moved" &&
        event.objectId === abandonedId &&
        event.to === "banishment",
    );
    expect(phaseEndIndex).toBeGreaterThanOrEqual(0);
    expect(shuntDispositionIndex).toBeGreaterThan(phaseEndIndex);
    expect(abandonedIndex).toBeGreaterThan(shuntDispositionIndex);
  });
});
