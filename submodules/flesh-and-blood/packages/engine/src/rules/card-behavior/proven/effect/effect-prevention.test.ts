/**
 * AAA test for effect: prevention.
 * Representative card: Blessing of Serenity Red (CRU041) — Guardian Instant.
 * Resolution: "The next time your hero would be dealt {p} damage this turn,
 * prevent 3 damage that source would deal."
 * Prevention effect: fixed amount 3, physical damage type, controller shielded.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { blessingOfSerenityRed, bravo, dash, snatchRed } from "../../../fixtures.ts";

describe("effect: prevention", () => {
  it("Arrange/Act/Assert: Blessing of Serenity prevents 3 physical damage from an unblocked attack", () => {
    // Arrange — Bravo has Snatch (power 6 physical) and Dash has Blessing of
    // Serenity (prevent next 3 {p} damage). Dash starts at 20 life.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, hand: [blessingOfSerenityRed], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    // Act — Bravo attacks with Snatch (6{p}). Dash plays Blessing of Serenity
    // as an instant to prevent 3 damage, then does not block.
    game.as(bravo).attackWith(snatchRed);
    // Dash plays the instant during the defend step (instants can be played
    // when the controller has priority outside their main phase).
    game.as(dash).defendWith([]);
    game.as(bravo).pass();
    game.as(dash).play(blessingOfSerenityRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    // Assert — 4 power − 3 prevented = 1 damage. 20 − 1 = 19.
    expect(game.as(dash).life()).toBe(19);
  });

  it("AAA boundary: without prevention, full attack damage is dealt", () => {
    // Arrange — Same attack but no prevention instant.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Assert — Full 4 damage. 20 − 4 = 16.
    expect(game.as(dash).life()).toBe(16);
  });
});
