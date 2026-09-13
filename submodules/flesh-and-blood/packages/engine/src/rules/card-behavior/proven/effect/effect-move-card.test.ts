/**
 * AAA test for effect: move-card.
 * Representative card: Endless Arrow Red (ARC045) — Ranger Action Arrow Attack, cost 0, power 4.
 * Triggered ability: "When this hits, put it into its owner's hand."
 *   → trigger: hit → effect: move-card { target: self, to: hand }.
 *
 * Verifies that a move-card effect relocates the resolving card from the
 * combat chain to the owner's hand when the hit trigger fires, and does NOT
 * move it (it goes to graveyard instead) when the attack is fully blocked.
 *
 * CR 8.2.6a: arrows are played from the arsenal with a bow controlled, so the
 * fixture seats a Ranger hero with a bow (Death Dealer) and the arrow in the
 * arsenal, then plays it from there.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash, deathDealer, endlessArrowRed, nimblismBlue } from "../../../fixtures.ts";
import { azalea } from "../../../../../../cards/src/cards/heroes/azalea.ts";

describe("effect: move-card", () => {
  it("AAA: Endless Arrow returns to hand when it hits a hero", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [endlessArrowRed],
        deck: 4,
        resourcePoints: 0,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);

    // CR 8.2.6a: arrows are played from the arsenal with a bow controlled. Dash does not block → hit.
    Azalea.play(endlessArrowRed, { from: "arsenal" });
    game.helpers.resolveRestOfCombat();

    // The attack hit → Endless Arrow returns to hand, not graveyard.
    expect(Azalea.zone("hand")).toContain(endlessArrowRed.canonicalId);
    expect(Azalea.zone("graveyard")).not.toContain(endlessArrowRed.canonicalId);
  });

  it("AAA boundary: Endless Arrow blocked (no hit) goes to graveyard, not hand", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [endlessArrowRed],
        deck: 4,
        resourcePoints: 0,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 4,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    // CR 8.2.6a: arrows are played from the arsenal with a bow controlled.
    // Dash blocks with 3× Nimblism Blue (2+2+2=6 ≥ 4) → no hit.
    Azalea.attackWith(endlessArrowRed, { from: "arsenal" });
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    // The attack did not hit → Endless Arrow goes to graveyard, NOT hand.
    expect(Azalea.zone("graveyard")).toContain(endlessArrowRed.canonicalId);
    expect(Azalea.zone("hand")).not.toContain(endlessArrowRed.canonicalId);
  });
});
