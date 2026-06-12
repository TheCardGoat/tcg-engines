/**
 * PR F.2 — resolveEffect target & optional-answer validation.
 *
 * Extends the PR F.1 descriptor surface with move-side validation:
 *  - Submitted `targets` are checked against the effect's target filter
 *    (ILLEGAL_TARGET / WRONG_TARGET_COUNT) using the same DSL evaluation
 *    that buildPendingChoicePrompt uses to emit legalTargetIds.
 *  - `optionalAnswers` lets the controller answer "you may" directives
 *    (rule 10-1-3); default-yes preserves pre-F.2 behaviour.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
} from "../../index.ts";
import type { PendingEffect } from "../types.ts";

const restOpponentUnitEffect: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [
    {
      action: {
        action: "rest",
        target: { owner: "opponent", cardType: "unit", count: 1 },
      },
    },
  ],
  sourceText: "Rest 1 enemy unit.",
};

const optionalDrawEffect: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [{ action: { action: "draw", count: 1 }, optional: true }],
  sourceText: "You may draw 1.",
};

const deckLookTopAndBottomEffect: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [
    {
      action: {
        action: "lookAtTopDeck",
        count: 2,
        return: "topAndBottom",
      },
    },
  ],
  sourceText: "Look at the top 2 and return them to the top or bottom.",
};

const optionalDeckLookEffect: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [
    { action: { action: "discard", count: 1 }, optional: true },
    {
      action: {
        action: "lookAtTopDeck",
        count: 2,
        return: "chooseTop",
        remainingDestination: "trash",
      },
      dependsOnPrevious: true,
    },
  ],
  sourceText: "You may discard 1. If you do, look at the top 2.",
};

let peIdCounter = 0;
function makePending(
  overrides: Partial<PendingEffect> & Pick<PendingEffect, "effect" | "controllerId">,
): PendingEffect {
  return {
    id: overrides.id ?? `pcv_${++peIdCounter}`,
    sourceCardId: overrides.sourceCardId ?? "unused",
    effectIndex: overrides.effectIndex ?? 0,
    kind: overrides.kind ?? "activated",
    ...overrides,
  };
}

describe("resolveEffect — target validation (PR F.2)", () => {
  it("accepts a legal opponent target and rests it", () => {
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy] });
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    engine.getG().pendingEffects.push(
      makePending({
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({ targets: [enemyId] }));
    expect(engine.getG().exhausted[enemyId]).toBe(true);
    expect(engine.getG().pendingEffects).toHaveLength(0);
  });

  it("rejects a friendly target with ILLEGAL_TARGET for an opponent-only filter", () => {
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy] });
    const myUnitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    engine.getG().pendingEffects.push(
      makePending({
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectFailure(
      engine.asPlayer(PLAYER_ONE).resolveEffect({ targets: [myUnitId] }),
      "ILLEGAL_TARGET",
    );
    // Queue untouched; the friendly unit was not rested.
    expect(engine.getG().pendingEffects).toHaveLength(1);
    expect(engine.getG().exhausted[myUnitId]).not.toBe(true);
  });

  it("rejects too many targets with WRONG_TARGET_COUNT when filter count is 1", () => {
    const enemyA = createMockUnit({ ap: 1, hp: 1 });
    const enemyB = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({}, { play: [enemyA, enemyB] });
    const p2Cards = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");
    const a = p2Cards[0]!;
    const b = p2Cards[1]!;

    engine.getG().pendingEffects.push(
      makePending({
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectFailure(
      engine.asPlayer(PLAYER_ONE).resolveEffect({ targets: [a, b] }),
      "WRONG_TARGET_COUNT",
    );
    expect(engine.getG().pendingEffects).toHaveLength(1);
    expect(engine.getG().exhausted[a]).not.toBe(true);
    expect(engine.getG().exhausted[b]).not.toBe(true);
  });
});

describe("resolveEffect — optional answers (PR F.2)", () => {
  it("runs a 'you may' directive when answered true", () => {
    const engine = GundamTestEngine.create({ deck: 5 }, {});
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    engine.getG().pendingEffects.push(
      makePending({
        effect: optionalDrawEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({ optionalAnswers: { 0: true } }));
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
    expect(engine.getG().pendingEffects).toHaveLength(0);
  });

  it("skips a 'you may' directive when answered false", () => {
    const engine = GundamTestEngine.create({ deck: 5 }, {});
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    engine.getG().pendingEffects.push(
      makePending({
        effect: optionalDrawEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({ optionalAnswers: { 0: false } }));
    // Deck unchanged — directive was skipped.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
    expect(engine.getG().pendingEffects).toHaveLength(0);
  });

  it("defaults to running the directive when no answer is supplied (backwards-compat)", () => {
    const engine = GundamTestEngine.create({ deck: 5 }, {});
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    engine.getG().pendingEffects.push(
      makePending({
        effect: optionalDrawEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    // No optionalAnswers supplied — the optional prompt still halts the
    // queue (requiresPlayerChoice), so the controller must explicitly
    // call resolveEffect with no args to acknowledge; the directive runs.
    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({}));
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
  });
});

describe("resolveEffect — deck-look answers", () => {
  it("rejects routing to an illegal destination for the return mode", () => {
    const top = createMockUnit({ name: "Top" });
    const second = createMockUnit({ name: "Second" });
    const engine = GundamTestEngine.create({ deck: [top, second] }, {});
    const [topId, secondId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("deck");

    engine.getG().pendingEffects.push(
      makePending({
        effect: deckLookTopAndBottomEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectFailure(
      engine.asPlayer(PLAYER_ONE).resolveEffect({
        deckLookAnswers: { 0: { toTop: [topId!], toTrash: [secondId!] } },
      }),
      "INVALID_DECK_LOOK_ROUTING",
    );
    expect(engine.getG().pendingEffects).toHaveLength(1);
  });

  it("lets an optional prerequisite be declined without a deck-look answer", () => {
    const handCard = createMockUnit({ name: "Discard" });
    const top = createMockUnit({ name: "Top" });
    const second = createMockUnit({ name: "Second" });
    const engine = GundamTestEngine.create({ hand: [handCard], deck: [top, second] }, {});
    const deckBefore = engine.asPlayer(PLAYER_ONE).getCardsInZone("deck");

    engine.getG().pendingEffects.push(
      makePending({
        effect: optionalDeckLookEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectSuccess(
      engine.asPlayer(PLAYER_ONE).resolveEffect({
        optionalAnswers: { 0: false },
      }),
    );
    expect(engine.asPlayer(PLAYER_ONE).getCardsInZone("deck")).toEqual(deckBefore);
  });

  it("requires accepting the optional prerequisite when answering its deck-look rider", () => {
    const handCard = createMockUnit({ name: "Discard" });
    const top = createMockUnit({ name: "Top" });
    const second = createMockUnit({ name: "Second" });
    const engine = GundamTestEngine.create({ hand: [handCard], deck: [top, second] }, {});
    const [topId, secondId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("deck");

    engine.getG().pendingEffects.push(
      makePending({
        effect: optionalDeckLookEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectFailure(
      engine.asPlayer(PLAYER_ONE).resolveEffect({
        deckLookAnswers: { 1: { toTop: [topId!], toTrash: [secondId!] } },
      }),
      "MISSING_DECK_LOOK_OPTIONAL_ACCEPT",
    );
  });

  it("accepts an optional-gated deck-look answer when the prerequisite is accepted", () => {
    const handCard = createMockUnit({ name: "Discard" });
    const top = createMockUnit({ name: "Top" });
    const second = createMockUnit({ name: "Second" });
    const engine = GundamTestEngine.create({ hand: [handCard], deck: [top, second] }, {});
    const [topId, secondId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("deck");

    engine.getG().pendingEffects.push(
      makePending({
        effect: optionalDeckLookEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectSuccess(
      engine.asPlayer(PLAYER_ONE).resolveEffect({
        optionalAnswers: { 0: true },
        deckLookAnswers: { 1: { toTop: [topId!], toTrash: [secondId!] } },
      }),
    );
    expect(engine.asPlayer(PLAYER_ONE).getCardsInZone("deck")).toEqual([topId]);
    expect(engine.asPlayer(PLAYER_ONE).getCardsInZone("trash")).toContain(secondId);
  });
});
