/**
 * "If you do" inter-directive dependency primitive.
 *
 * `EffectDirective.dependsOnPrevious` encodes the card-text connective
 * "If you do, ..." — the following directive only fires when the
 * immediately preceding directive actually **resolved**:
 *   - Optional that was opted-in AND produced an effect.
 *   - Mandatory that had ≥1 legal target (or was non-targeted).
 *
 * Covers:
 *  - Optional opted-in on a non-targeted action → dependent runs.
 *  - Optional declined → dependent skipped.
 *  - Mandatory targeted with no legal target → dependent skipped.
 *  - Mandatory targeted with a legal target → dependent runs.
 *  - No prior directive → dependent still runs (card-data bug tolerant;
 *    executor warns but does not throw).
 */

import { describe, it, expect, vi } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "../../index.ts";
import type { PendingEffect } from "../types.ts";

const optionalDrawThenDrawEffect: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [
    { action: { action: "draw", count: 1 }, optional: true },
    { action: { action: "draw", count: 1 }, dependsOnPrevious: true },
  ],
  sourceText: "You may draw 1. If you do, draw 1.",
};

const bareDependentEffect: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [
    // No prior directive — card-data bug tolerance: the dependent still
    // runs + warns.
    { action: { action: "draw", count: 1 }, dependsOnPrevious: true },
  ],
  sourceText: "(bug) If you do, draw 1.",
};

const mandatoryNonTargetedDependentEffect: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [
    // Non-targeted mandatory predecessor always resolves — dependent runs.
    { action: { action: "draw", count: 1 } },
    { action: { action: "draw", count: 1 }, dependsOnPrevious: true },
  ],
  sourceText: "Draw 1. If you do, draw 1.",
};

const mandatoryShortDiscardEffect: CardEffect = {
  type: "triggered",
  activation: { timing: ["deploy"] },
  directives: [
    { action: { action: "discard", count: 2 } },
    { action: { action: "draw", count: 1 }, dependsOnPrevious: true },
  ],
  sourceText: "Discard 2. If you do, draw 1.",
};

const mandatoryShortQueuedDiscardEffect: CardEffect = {
  type: "triggered",
  activation: { timing: ["deploy"] },
  directives: [
    {
      action: {
        action: "resolveThenQueue",
        first: { action: "discard", count: 2 },
        followUp: {
          type: "triggered",
          activation: { timing: [] },
          directives: [{ action: { action: "draw", count: 1 } }],
          sourceText: "Draw 1.",
        },
      },
    },
  ],
  sourceText: "Discard 2. If you do, draw 1.",
};

// Mandatory TARGETED predecessor — "If you do" gating on whether the
// triggered effect can legally choose and affect its target.
const mandatoryTargetedDependentEffect: CardEffect = {
  type: "triggered",
  activation: { timing: ["deploy"] },
  directives: [
    {
      action: {
        action: "dealDamage",
        amount: 1,
        target: { owner: "opponent", cardType: "unit", count: 1 },
      },
    },
    { action: { action: "draw", count: 1 }, dependsOnPrevious: true },
  ],
  sourceText: "Deal 1 damage to an enemy unit. If you do, draw 1.",
};

let peIdCounter = 0;
function makePending(
  overrides: Partial<PendingEffect> & Pick<PendingEffect, "effect" | "controllerId">,
): PendingEffect {
  return {
    id: overrides.id ?? `iyd_${++peIdCounter}`,
    sourceCardId: overrides.sourceCardId ?? "unused",
    effectIndex: overrides.effectIndex ?? 0,
    kind: overrides.kind ?? "activated",
    ...overrides,
  };
}

describe("executeDirectives — dependsOnPrevious", () => {
  it("runs the dependent directive when the preceding optional is opted-in", () => {
    const engine = GundamTestEngine.create({ deck: 10 }, {});
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    engine.getG().pendingEffects.push(
      makePending({
        effect: optionalDrawThenDrawEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({ optionalAnswers: { 0: true } }));
    // Both draws fired.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before - 2);
  });

  it("skips the dependent directive when the preceding optional is declined", () => {
    const engine = GundamTestEngine.create({ deck: 10 }, {});
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    engine.getG().pendingEffects.push(
      makePending({
        effect: optionalDrawThenDrawEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({ optionalAnswers: { 0: false } }));
    // Neither draw fired: optional was declined, dependent was skipped.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before);
  });

  it("runs a bare dependent directive (no prior) and warns", () => {
    const engine = GundamTestEngine.create({ deck: 10 }, {});
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    engine.getG().pendingEffects.push(
      makePending({
        effect: bareDependentEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({}));
    // Draw ran (card-data bug tolerant).
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before - 1);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("dependsOnPrevious"));
    warn.mockRestore();
  });

  it("runs a dependent directive after a mandatory non-targeted predecessor", () => {
    const engine = GundamTestEngine.create({ deck: 10 }, {});
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    engine.getG().pendingEffects.push(
      makePending({
        effect: mandatoryNonTargetedDependentEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({}));
    // Both draws ran — non-targeted mandatory always resolves.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before - 2);
  });

  it("discards as much as possible from a short hand without resolving If you do", () => {
    const discard = createMockUnit({ name: "Only Card In Hand" });
    const source = createMockUnit({
      name: "Mandatory Discard Source",
      effects: [mandatoryShortDiscardEffect],
    });
    const engine = GundamTestEngine.create({
      hand: [source, discard],
      resourceArea: activeResources(1),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [sourceId, discardId] = p1.getHand();
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p1.deployUnit(sourceId!));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [discardId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [discardId!] }));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getCardZone(discardId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
  });

  it("does not publish an empty discard prompt when a mandatory discard has no cards", () => {
    const source = createMockUnit({
      name: "Empty Hand Discard Source",
      effects: [mandatoryShortDiscardEffect],
    });
    const engine = GundamTestEngine.create({
      hand: [source],
      resourceArea: activeResources(1),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getHand()[0]!;
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p1.deployUnit(sourceId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
    expectSuccess(p1.passPhase());
  });

  it("does not queue a staged If you do continuation after a partial discard", () => {
    const discard = createMockUnit({ name: "Only Card For Staged Discard" });
    const source = createMockUnit({
      name: "Staged Mandatory Discard Source",
      effects: [mandatoryShortQueuedDiscardEffect],
    });
    const engine = GundamTestEngine.create({
      hand: [source, discard],
      resourceArea: activeResources(1),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [sourceId, discardId] = p1.getHand();
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p1.deployUnit(sourceId!));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [discardId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [discardId!] }));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getCardZone(discardId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
  });

  it("runs the dependent after a mandatory targeted predecessor that hit", () => {
    const enemy = createMockUnit({ ap: 1, hp: 3, level: 1 });
    const triggerUnit = createMockUnit({
      name: "Targeted Trigger",
      cost: 0,
      effects: [mandatoryTargetedDependentEffect],
    });
    const engine = GundamTestEngine.create(
      { hand: [triggerUnit], deck: 10, resourceArea: activeResources(1) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const triggerUnitId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(triggerUnitId));
    expect(p1.getBoardView().pendingChoice?.kind).toBe("targetSelection");
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(1);
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before - 1);
  });

  it("does not activate the targeted trigger when no legal target exists", () => {
    const triggerUnit = createMockUnit({
      name: "Targetless Trigger",
      cost: 0,
      effects: [mandatoryTargetedDependentEffect],
    });
    const engine = GundamTestEngine.create({
      hand: [triggerUnit],
      deck: 10,
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const triggerUnitId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(triggerUnitId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before);
  });
});
