import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { tuffnut } from "../heroes/tuffnut.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { helmOfTheAdored } from "./helm-of-the-adored.ts";

/**
 * Helm of the Adored — Revered Head d1, Blade Break.
 *
 * Printed: "When this defends, the crowd cheers you. Blade Break"
 *
 * The cheer is observed end-to-end through Tuffnut (SUP002): each crowd-cheers
 * event mints a Toughness token.
 */
describe("Helm of the Adored AAA", () => {
  it("happy: when the helm defends, the crowd cheers and Tuffnut mints a Toughness", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: tuffnut, life: 20, head: [helmOfTheAdored], hand: [], deck: 6 },
    );
    const Tuffnut = game.as(tuffnut);

    game.as(dash).attackWith(snatchRed);
    Tuffnut.defendWith(helmOfTheAdored);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 1);
    expectFabPlayer(Tuffnut).toHaveLife(17); // snatch 4 − 1
    // Blade Break: the helm paid for the cheer with its seat.
    expectFabCard(Tuffnut, helmOfTheAdored).toBeIn("graveyard");
  });

  it("boundary: no defense, no cheer — the helm stays seated and silent", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: tuffnut, life: 20, head: [helmOfTheAdored], hand: [], deck: 6 },
    );
    const Tuffnut = game.as(tuffnut);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 0);
    expectFabPlayer(Tuffnut).toHaveLife(16); // snatch 4, undefended
    expectFabCard(Tuffnut, helmOfTheAdored).toBeIn("head");
  });
});
