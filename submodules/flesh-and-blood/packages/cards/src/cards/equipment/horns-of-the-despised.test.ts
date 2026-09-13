import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { lyathGoldmane } from "../heroes/lyath-goldmane.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { hornsOfTheDespised } from "./horns-of-the-despised.ts";

/**
 * Horns of the Despised — Reviled Head d1, Blade Break.
 *
 * Printed: "When this defends, the crowd boos you. Blade Break"
 *
 * The boo is observed end-to-end through Lyath Goldmane (SUP072): each
 * crowd-boos event mints a Might token.
 */
describe("Horns of the Despised AAA", () => {
  it("happy: when the horns defend, the crowd boos and Lyath mints a Might", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: lyathGoldmane, life: 20, head: [hornsOfTheDespised], hand: [], deck: 6 },
    );
    const Lyath = game.as(lyathGoldmane);

    game.as(dash).attackWith(snatchRed);
    Lyath.defendWith(hornsOfTheDespised);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Lyath).toHaveCrowdBooedThisTurn();
    expectFabPlayer(Lyath).toHaveTokenCount("might", 1);
    expectFabPlayer(Lyath).toHaveLife(17); // snatch 4 − 1
    // Blade Break: the horns paid for the boo with their seat.
    expectFabCard(Lyath, hornsOfTheDespised).toBeIn("graveyard");
  });

  it("boundary: no defense, no boo — the horns stay seated and silent", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: lyathGoldmane, life: 20, head: [hornsOfTheDespised], hand: [], deck: 6 },
    );
    const Lyath = game.as(lyathGoldmane);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Lyath).notToHaveCrowdBooedThisTurn();
    expectFabPlayer(Lyath).toHaveTokenCount("might", 0);
    expectFabPlayer(Lyath).toHaveLife(16); // snatch 4, undefended
    expectFabCard(Lyath, hornsOfTheDespised).toBeIn("head");
  });
});
