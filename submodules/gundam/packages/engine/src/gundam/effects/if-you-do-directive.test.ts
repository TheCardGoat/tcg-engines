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

// Mandatory TARGETED predecessor — "If you do" gating on whether the
// targeted action actually found a legal target. `type: "triggered"`
// so the executor auto-picks candidates instead of halting for a
// `targetSelection` prompt (which would otherwise block the "no legal
// target" path behind a `MISSING_TARGETS` validation error).
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

  it("runs the dependent after a mandatory targeted predecessor that hit", () => {
    const enemy = createMockUnit({ ap: 1, hp: 3, level: 1 });
    const engine = GundamTestEngine.create({ deck: 10 }, { play: [enemy] });
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    engine.getG().pendingEffects.push(
      makePending({
        effect: mandatoryTargetedDependentEffect,
        controllerId: PLAYER_ONE,
        kind: "triggered",
      }),
    );

    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({}));
    // Damage landed (triggered auto-picks the lone enemy) + draw fired.
    expect(engine.getG().damage[enemyId]).toBe(1);
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before - 1);
  });

  it("skips the dependent after a mandatory targeted predecessor that found no target", () => {
    // No enemy units → dealDamage finds no target → dependent skipped.
    const engine = GundamTestEngine.create({ deck: 10 }, {});
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    engine.getG().pendingEffects.push(
      makePending({
        effect: mandatoryTargetedDependentEffect,
        controllerId: PLAYER_ONE,
        kind: "triggered",
      }),
    );

    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({}));
    // No draw — predecessor had no legal target, dependent gated off.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before);
  });
});
