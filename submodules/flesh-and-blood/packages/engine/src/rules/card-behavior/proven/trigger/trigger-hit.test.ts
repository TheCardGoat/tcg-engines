/**
 * AAA test for trigger: hit.
 * Representative card: Snatch Red (WTR167) — Generic Action Attack, cost 0, power 4.
 * Triggered ability: "When this hits, draw a card."
 * The hit event fires when the attack deals damage to the defending hero.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimbleStrikeRed } from "../../../fixtures.ts";

describe("trigger: hit", () => {
  it("Arrange/Act/Assert: Snatch Red draws 1 card when its unblocked attack hits the defending hero", () => {
    // Arrange — Bravo has Snatch Red (cost 0, power 4) in hand and 4 cards in deck.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const deckBefore = Bravo.zone("deck").length;
    const lifeBefore = Dash.life();

    // Act — Attack with Snatch Red, Dash doesn't block, combat resolves.
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Assert — Attack hit for 4 damage; hit trigger drew 1 card from deck.
    expect(Dash.life()).toBe(lifeBefore - 4);
    expect(Bravo.zone("deck").length).toBe(deckBefore - 1);
  });

  it("AAA boundary: an attack without a hit trigger does not draw on hit", () => {
    // Arrange — Nimble Strike is an Attack with no hit trigger, so no draw on hit.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed], deck: 4, resourcePoints: 1 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;

    // Act — Attack with Nimble Strike (no hit trigger), resolve combat.
    Bravo.attackWith(nimbleStrikeRed);
    game.helpers.resolveRestOfCombat();

    // Assert — No hit trigger, deck size unchanged.
    expect(Bravo.zone("deck").length).toBe(deckBefore);
  });
});
