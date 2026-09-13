/**
 * AAA test for trigger:prevent.
 * Representative card: Alluvion Constellas (UPR166) — Wizard Chest with arcane barrier.
 * First prevent of arcane each turn may put an energy counter on it.
 * Spellvoid/arcane prevention emits the prevent event; Alluvion listens for it.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, volticBoltRed, snatchRed } from "../../../fixtures.ts";
import { alluvionConstellas } from "../../../../../../cards/src/cards/equipment/alluvion-constellas.ts";
import { haloOfLuminaLight } from "../../../../../../cards/src/cards/equipment/halo-of-lumina-light.ts";

describe("trigger: prevent", () => {
  it("AAA: arcane prevention via spellvoid emits prevent and reduces damage (UPR166 timing)", () => {
    // Pair Alluvion (listener) with Halo (spellvoid producer) on the defender.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [volticBoltRed], resourcePoints: 2, deck: 4 },
      {
        hero: dash,
        life: 20,
        chest: [alluvionConstellas],
        head: [haloOfLuminaLight],
        deck: 4,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    game.as(bravo).play(volticBoltRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      optionalOptions: "all",
      entityTargets: "minimum",
      ordering: "listed",
    });
    // Spellvoid destroyed Halo and prevented 2 of Voltic Bolt's 4 arcane damage → life 18.
    expect(Dash.life()).toBe(18);
    expect(Dash.zone("head")).not.toContain(haloOfLuminaLight.canonicalId);
    // Alluvion still equipped (prevent listener survived).
    expect(Dash.zone("chest")).toContain(alluvionConstellas.canonicalId);
  });

  it("AAA boundary: physical damage is not prevented by spellvoid/arcane barrier", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      {
        hero: dash,
        life: 20,
        chest: [alluvionConstellas],
        head: [haloOfLuminaLight],
        deck: 4,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16);
    expect(game.as(dash).zone("head")).toContain(haloOfLuminaLight.canonicalId);
  });
});
