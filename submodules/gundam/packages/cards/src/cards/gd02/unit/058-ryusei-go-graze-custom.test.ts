/**
 * Ryusei-Go (Graze Custom Ⅱ) (GD02-058)
 *
 * 【Deploy】Choose 1 of your Units. Deal 1 damage to it. If you do,
 * draw 1. Then, discard 1.
 *
 * Exercises the generic `dependsOnPrevious` primitive on a **mandatory
 * targeted** predecessor — the damage directive is not optional, but
 * the gate still applies when no friendly Unit is available to damage.
 */

import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import { GundamTestEngine, PLAYER_ONE, createMockUnit, expectSuccess } from "@tcg/gundam-engine";
import { gd02RyuseiGoGrazeCustom058 } from "./058-ryusei-go-graze-custom.ts";

describe("Ryusei-Go (Graze Custom Ⅱ) (GD02-058)", () => {
  const effect = gd02RyuseiGoGrazeCustom058.effects![0] as CardEffect;

  it("deals damage + draws + discards when a friendly target is available", () => {
    const friendly = createMockUnit({ ap: 1, hp: 3, level: 1 });
    const engine = GundamTestEngine.create(
      { play: [friendly], deck: 10, hand: [createMockUnit()] },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const handBefore = p1.getHand().length;

    engine.getG().pendingEffects.push({
      id: "ryusei_1",
      sourceCardId: friendlyId,
      effectIndex: 0,
      kind: "triggered",
      effect,
      controllerId: PLAYER_ONE,
      chosenTargets: [friendlyId],
    });

    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({}));

    expect(engine.getG().damage[friendlyId]).toBe(1);
    // Draw 1 + discard 1: net hand count unchanged, deck -1.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
    expect(p1.getHand().length).toBe(handBefore);
  });

  it("skips the draw when no friendly Unit is available (dependsOnPrevious gate)", () => {
    // No friendly units in play → dealDamage filter (owner: friendly,
    // cardType: unit) finds zero candidates → dependent draw is skipped.
    // Discard still runs (it has no dependsOnPrevious gate).
    const engine = GundamTestEngine.create({ deck: 10, hand: [createMockUnit()] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const handBefore = p1.getHand().length;

    engine.getG().pendingEffects.push({
      id: "ryusei_2",
      sourceCardId: "no-source",
      effectIndex: 0,
      kind: "triggered",
      effect,
      controllerId: PLAYER_ONE,
    });

    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({}));

    // No draw: dealDamage found no target → dependent draw skipped.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
    // Discard still runs — not gated.
    expect(p1.getHand().length).toBe(handBefore - 1);
  });
});
