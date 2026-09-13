import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { tremorOfResistance } from "./tremor-of-resistance.ts";
import { seismicSurge } from "../tokens/seismic-surge.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Tremor of Resistance (MPG012) — Guardian Equipment - Off-Hand, Blade Break.
 *
 * Printed: "If you control a Seismic Surge token, this gets +2{d}."
 */
describe("Tremor of Resistance (MPG012) AAA", () => {
  it("happy: controlling a Seismic Surge token boosts the shield to 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        weapon2: [tremorOfResistance],
        arena: [seismicSurge],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(tremorOfResistance);

    // 0{d} base + 2{d} from the controlled Seismic Surge token.
    expectFabCard(Bravo, tremorOfResistance).toHaveDefense(2);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(18);
    // Blade Break: the shield is destroyed after defending.
    expectFabCard(Bravo, tremorOfResistance).toBeIn("graveyard");
  });

  it("boundary: without a Seismic Surge token the shield defends at its printed 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        weapon2: [tremorOfResistance],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(tremorOfResistance);

    expectFabCard(Bravo, tremorOfResistance).toHaveDefense(0);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(16);
  });
});
