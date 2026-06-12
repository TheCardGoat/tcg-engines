/**
 * Zedas (GD02-057)
 *
 * 【During Pair】【Attack】You may choose 1 of your other Units. Destroy
 * it. If you do, choose 1 enemy Unit that is Lv.4 or lower. Deal 2
 * damage to it.
 *
 * Exercises the "If you do" inter-directive dependency primitive
 * (`dependsOnPrevious`) against real card data. The `duringPair
 * + attack` event-routing pipeline has its own coverage in
 * `pending-effects-constant-events.test.ts`; this test seeds a
 * `PendingEffect` with Zedas's effect and drives it through
 * `resolveEffect` to validate the directive shape's two branches:
 *
 *   - Controller opts into the destroy → enemy is damaged.
 *   - Controller declines the destroy → enemy is NOT damaged.
 */

import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02Zedas057 } from "./057-zedas.ts";

describe("Zedas (GD02-057)", () => {
  const zedasEffect = gd02Zedas057.effects![0] as CardEffect;

  it("【During Pair】【Attack】optional destroy fires → enemy Lv.4 Unit takes 2 damage", () => {
    const zedasStand = createMockUnit({ ap: 5, hp: 3, level: 5 });
    const otherFriendly = createMockUnit({ ap: 1, hp: 1, level: 1 });
    const enemyLv4 = createMockUnit({ ap: 1, hp: 5, level: 4 });
    const engine = GundamTestEngine.create(
      { play: [zedasStand, otherFriendly] },
      { play: [enemyLv4] },
    );
    const friendlyZone = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    const zedasId = friendlyZone[0]!;
    const otherId = friendlyZone[1]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    engine.getG().pendingEffects.push({
      id: "zedas_1",
      sourceCardId: zedasId,
      effectIndex: 0,
      kind: "activated",
      effect: zedasEffect,
      controllerId: PLAYER_ONE,
      // Zedas chooses both targets up-front; resolveEffect validates
      // them against each directive's filter. The executor applies the
      // chosen set to every counted target in the effect (the engine
      // does not yet split `chosenTargets` per-directive — PR F.x).
      chosenTargets: [otherId, enemyId],
    });

    expectSuccess(
      engine.asPlayer(PLAYER_ONE).resolveEffect({
        optionalAnswers: { 0: true },
      }),
    );

    // Other friendly destroyed → in trash; Zedas itself is untouched.
    expect(engine.asPlayer(PLAYER_ONE).getCardsInZone("trash")).toContain(otherId);
    expect(engine.asPlayer(PLAYER_ONE).getCardsInZone("trash")).not.toContain(zedasId);
    // Enemy Lv.4 took 2 damage (hp 5 → damage 2, still alive).
    expect(engine.getG().damage[enemyId]).toBe(2);
  });

  it("【During Pair】【Attack】optional destroy declined → dependent damage is skipped", () => {
    const zedasStand = createMockUnit({ ap: 5, hp: 3, level: 5 });
    const otherFriendly = createMockUnit({ ap: 1, hp: 1, level: 1 });
    const enemyLv4 = createMockUnit({ ap: 1, hp: 5, level: 4 });
    const engine = GundamTestEngine.create(
      { play: [zedasStand, otherFriendly] },
      { play: [enemyLv4] },
    );
    const friendlyZone = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    const zedasId = friendlyZone[0]!;
    const otherId = friendlyZone[1]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    engine.getG().pendingEffects.push({
      id: "zedas_2",
      sourceCardId: zedasId,
      effectIndex: 0,
      kind: "activated",
      effect: zedasEffect,
      controllerId: PLAYER_ONE,
      chosenTargets: [otherId, enemyId],
    });

    expectSuccess(
      engine.asPlayer(PLAYER_ONE).resolveEffect({
        optionalAnswers: { 0: false },
      }),
    );

    // Declined → other friendly is alive, enemy took no damage.
    expect(engine.asPlayer(PLAYER_ONE).getCardsInZone("trash")).not.toContain(otherId);
    expect(engine.getG().damage[enemyId] ?? 0).toBe(0);
  });
});
