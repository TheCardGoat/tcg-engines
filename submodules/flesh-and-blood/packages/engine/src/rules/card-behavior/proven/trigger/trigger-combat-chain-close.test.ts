/**
 * AAA test for trigger: combat-chain-close.
 * Representative card: Swing Big Red (EVR002) — Brute Action Attack, cost 2, power 8.
 * Triggered ability: "When the combat chain closes, if this didn't hit,
 *   the defending hero creates a Quicken token."
 * Tests that the combat-chain-close trigger fires after the chain resolves,
 * applying its conditional effect only when the attack did not deal damage.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, swingBigRed } from "../../../fixtures.ts";

describe("trigger: combat-chain-close", () => {
  it("AAA: Swing Big creates a Quicken token for the defender when it doesn't hit", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [swingBigRed], deck: 4, resourcePoints: 2 },
      { hero: dash, hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Attack with Swing Big (power 8). Dash blocks with 4× Nimblism Blue (2×4=8 ≥ 8).
    Bravo.attackWith(swingBigRed);
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    // The attack didn't hit → defending hero (Dash) creates a Quicken token.
    expect(Dash.zone("arena").some((id) => /quicken/i.test(id))).toBe(true);
  });

  it("AAA boundary: Swing Big hits unblocked → no Quicken token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [swingBigRed], deck: 4, resourcePoints: 2 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Attack with Swing Big. Dash doesn't block.
    Bravo.attackWith(swingBigRed);
    game.helpers.resolveRestOfCombat();

    // The attack hit (8 damage, no defense) → no Quicken token.
    expect(Dash.zone("arena").some((id) => /quicken/i.test(id))).toBe(false);
  });
});
