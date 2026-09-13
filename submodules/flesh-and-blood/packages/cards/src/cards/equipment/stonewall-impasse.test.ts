import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { stonewallImpasse } from "./stonewall-impasse.ts";
import { snatchRed, snatchYellow } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";

/**
 * Stonewall Impasse (HVY052) — Guardian Equipment - Off-Hand, Temper.
 *
 * Printed: "When this defends, clash with the attacking hero. If you win,
 * this gets +1{d} until end of turn. Temper"
 */
describe("Stonewall Impasse (HVY052) AAA", () => {
  it("happy: winning the clash with the attacking hero gives the shield +1{d}", () => {
    const game = FabTestEngine.start(
      // Bravo's top deck (4{p} Snatch) beats Dash's top deck (0{p} Nimblism).
      {
        hero: dash,
        hand: [snatchYellow],
        deckTop: [nimblismBlue],
        deck: 6,
      },
      {
        hero: bravo,
        weapon2: [stonewallImpasse],
        life: 20,
        deckTop: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchYellow); // 3{p}
    Bravo.defendWith(stonewallImpasse);
    game.helpers.resolveRestOfCombat();

    // The won clash lifted the shield from 1{d} to 2{d}: 3{p} - 2{d} = 1 damage.
    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("boundary: losing the clash leaves the shield at its printed 1{d}", () => {
    const game = FabTestEngine.start(
      // Dash's top deck (4{p} Snatch) beats Bravo's top deck (0{p} Nimblism).
      {
        hero: dash,
        hand: [snatchYellow],
        deckTop: [snatchRed],
        deck: 6,
      },
      {
        hero: bravo,
        weapon2: [stonewallImpasse],
        life: 20,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchYellow); // 3{p}
    Bravo.defendWith(stonewallImpasse);
    game.helpers.resolveRestOfCombat();

    // The lost clash leaves the shield at 1{d}: 3{p} - 1{d} = 2 damage.
    expectFabPlayer(Bravo).toHaveLife(18);
  });
});
