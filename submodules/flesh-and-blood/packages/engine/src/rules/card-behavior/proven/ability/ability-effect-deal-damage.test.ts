/**
 * AAA test for effect:deal-damage.
 * Representative card: Foreboding Bolt Blue (CRU170) — Wizard Action.
 * Cost 1, pitch 3, defense 3, opt 1.
 * Resolution: "Deal 1 damage to target hero."
 *   → effect: deal-damage { damageType: generic, amount: 1, target: { selector: any-hero } }
 *
 * Verifies that playing the card deals exactly 1 damage to the targeted hero.
 * Boundary: targeting self deals 1 damage to self instead.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, forebodingBoltBlue } from "../../../fixtures.ts";

describe("effect: deal-damage (Foreboding Bolt Blue)", () => {
  it("AAA: playing Foreboding Bolt deals 1 damage to the opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [forebodingBoltBlue], deck: 4, resourcePoints: 1 },
      { hero: dash, life: 20, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const dashLifeBefore = Dash.life();

    Bravo.play(forebodingBoltBlue, { target: Dash.id });

    expect(Dash.life()).toBe(dashLifeBefore - 1);
    expect(Bravo.zone("graveyard")).toContain(forebodingBoltBlue.canonicalId);
  });

  it("AAA boundary: targeting self hero deals 1 damage to self", () => {
    const game = FabTestEngine.start(
      { hero: bravo, life: 20, hand: [forebodingBoltBlue], deck: 4, resourcePoints: 1 },
      { hero: dash, life: 20, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const bravoLifeBefore = Bravo.life();

    Bravo.play(forebodingBoltBlue, { target: Bravo.id });

    expect(Bravo.life()).toBe(bravoLifeBefore - 1);
  });
});
