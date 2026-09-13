import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { indefensiblyHonedBlue } from "./indefensibly-honed.ts";
import { sharpInclineRed } from "./sharp-incline.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";

/**
 * Indefensibly Honed (AHA023) — Warrior Action. Go again.
 *
 * Printed: Sharpen target sword you control.
 * If it has 3 or more +1{p} counters, your next attack with it this turn gets
 * "When this is defended by 1 or more cards, deal 1 damage to the defending
 * hero."
 */

describe("Indefensibly Honed (AHA023) AAA", () => {
  it("happy: three sharpenings arm the sword's next attack with the defended-response", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [sharpInclineRed, sharpInclineRed, indefensiblyHonedBlue],
        resourcePoints: 6,
        actionPoints: 4,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Dash = game.as(dash);

    Hala.play(sharpInclineRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    Hala.play(sharpInclineRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    expectFabCard(Hala, zenithBlade).toHaveCounters(2); // below threshold

    // The third sharpen comes from Indefensibly Honed itself; its gte-3 rider
    // evaluates against the same-layer binding stamped by its own sharpen.
    Hala.play(indefensiblyHonedBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    expectFabCard(Hala, zenithBlade).toHaveCounters(3);

    Hala.activate(zenithBlade);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(6); // 3 base + three +1{p}
    game.helpers.resolveRestOfCombat();
    // 6 power vs a 3-block: 3 combat damage, plus the granted trigger deals
    // 1 generic to the defending hero (20 - 3 - 1 = 16).
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
