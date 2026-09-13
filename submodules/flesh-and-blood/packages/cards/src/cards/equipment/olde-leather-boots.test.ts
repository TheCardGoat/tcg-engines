import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { oldeLeatherBoots } from "./olde-leather-boots.ts";

/**
 * Olde Leather Boots — Generic Legs d0 Blade Break.
 *
 * Printed: "If you've been attacked 2 or more times this turn, this gets
 * +2{d}. Blade Break"
 */

describe("Olde Leather Boots AAA", () => {
  it("boundary: after only one attack this turn, the boots defend with 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
      { hero: bravo, legs: [oldeLeatherBoots], hand: [], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(brutalAssaultBlue);
    Bravo.defendWith(oldeLeatherBoots);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(16);
    // Blade Break still destroys the boots after they defend for their base 0{d}.
    expectFabCard(Bravo, oldeLeatherBoots).toBeIn("graveyard");
  });

  it("happy: after a second attack this turn, the boots defend with 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed, brutalAssaultBlue], actionPoints: 2, deck: 6 },
      { hero: bravo, legs: [oldeLeatherBoots], hand: [], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // First attack of the turn: the boots are still +0{d}, Bravo declines.
    Dash.playAttack(snatchRed);
    Bravo.defendWith();
    game.closeCombat({ ordering: "listed" });

    // Second attack this turn: the boots get +2{d} and block 2 of 4.
    Dash.playAttack(brutalAssaultBlue);
    Bravo.defendWith(oldeLeatherBoots);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(14); // 4 taken on attack 1, then 4{p} - 2{d}
    // Blade Break: the boots that defended are destroyed afterwards.
    expectFabCard(Bravo, oldeLeatherBoots).toBeIn("graveyard");
  });
});
