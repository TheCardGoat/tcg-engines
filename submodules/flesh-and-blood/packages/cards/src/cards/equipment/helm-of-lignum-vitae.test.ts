import { describe, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { earthFormRed } from "../actions/earth-form.ts";
import { autumnSTouchBlue } from "../actions/autumn-s-touch.ts";
import { burgeoningRed } from "../actions/burgeoning.ts";
import { evergreenRed } from "../actions/evergreen.ts";
import { snatchRed } from "../actions/snatch.ts";
import { helmOfLignumVitae } from "./helm-of-lignum-vitae.ts";

/**
 * Helm of Lignum Vitae — Earth Head d1, Blade Break.
 *
 * Printed: "If there are 4 or more Earth cards in your banished zone, this
 * gets +1{d}. Blade Break"
 *
 * The continuous +1{d} is proven through the defend math: the same 4{p} snatch
 * attack deals 2 with the helm buffed and 3 without it.
 */
describe("Helm of Lignum Vitae AAA", () => {
  it("happy: with 4+ Earth cards banished, the helm defends for 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        head: [helmOfLignumVitae],
        banished: [earthFormRed, autumnSTouchBlue, burgeoningRed, evergreenRed],
        hand: [],
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(helmOfLignumVitae);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(18); // snatch 4 − (1 printed + 1 Earth)
  });

  it("boundary: with only 3 Earth cards banished, the helm defends for its printed 1{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        head: [helmOfLignumVitae],
        banished: [earthFormRed, autumnSTouchBlue, burgeoningRed],
        hand: [],
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(helmOfLignumVitae);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(17); // snatch 4 − 1
  });
});
