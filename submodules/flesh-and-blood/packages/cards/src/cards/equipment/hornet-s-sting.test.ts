import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { lexi } from "../heroes/lexi.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { endlessArrowRed } from "../actions/endless-arrow.ts";
import { laceWithFrailtyRed } from "../actions/lace-with-frailty.ts";
import { hornetSSting } from "./hornet-s-sting.ts";

/**
 * Hornet's Sting (DYN152) — Ranger Arms d1, Blade Break.
 *
 * Printed: "Whenever Hornet's Sting defends, reveal the top card of your
 * deck. If it's an arrow, deal 1 damage to the attacking hero or ally.
 * Otherwise, put it on the bottom of your deck. Blade Break"
 */
describe("Hornet's Sting (DYN152) AAA", () => {
  it("happy: defending over an arrow-top deck zaps the attacker for 1", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: lexi, life: 20, arms: [hornetSSting], deckTop: [endlessArrowRed], deck: 6 },
    );
    const Lexi = game.as(lexi);

    game.as(bravo).attackWith(snatchRed);
    Lexi.defendWith(hornetSSting);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(bravo)).toHaveLife(19); // the reveal zapped the attacker
    expectFabPlayer(Lexi).toHaveLife(17); // snatch 4 − 1
    // An arrow reveal leaves the card on top (only the else-branch moves it).
    expect(Lexi.zone("deck").at(-1)).toBe(endlessArrowRed.canonicalId);
    // Blade Break: the sting is spent after defending.
    expectFabCard(Lexi, hornetSSting).toBeIn("graveyard");
  });

  it("boundary: a non-arrow top card is not revealed into damage — it goes to the bottom", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: lexi, life: 20, arms: [hornetSSting], deckTop: [laceWithFrailtyRed], deck: 6 },
    );
    const Lexi = game.as(lexi);

    game.as(bravo).attackWith(snatchRed);
    Lexi.defendWith(hornetSSting);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(bravo)).toHaveLife(20); // no zap
    expectFabPlayer(Lexi).toHaveLife(17);
    expect(Lexi.zone("deck")[0]).toBe(laceWithFrailtyRed.canonicalId); // bottomed
    expectFabCard(Lexi, hornetSSting).toBeIn("graveyard");
  });
});
