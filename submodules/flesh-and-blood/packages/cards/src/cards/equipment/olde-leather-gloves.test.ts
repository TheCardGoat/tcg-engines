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
import { throttleRed } from "../actions/throttle.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { oldeLeatherGloves } from "./olde-leather-gloves.ts";

/**
 * Olde Leather Gloves — Generic Arms d0 Blade Break.
 *
 * Printed: "If you've been attacked 2 or more times this turn, this gets
 * +2{d}. Blade Break"
 */

describe("Olde Leather Gloves AAA", () => {
  it("boundary: on the first attack of the turn the gloves block 0", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, arms: [oldeLeatherGloves], hand: [], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(brutalAssaultBlue);
    Bravo.defendWith(oldeLeatherGloves); // attacked only once: +0{d}
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(16); // 4{p} - 0{d}
    expectFabCard(Bravo, oldeLeatherGloves).toBeIn("graveyard"); // Blade Break
  });

  it("timing: two attacks last turn do not carry over — one attack this turn is +0{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, brutalAssaultBlue, throttleRed, nimblismBlue],
        actionPoints: 3,
        deck: 6,
      },
      { hero: bravo, arms: [oldeLeatherGloves], hand: [], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Turn 1: two attacks put Bravo at "attacked 2 or more times"...
    Dash.playAttack(snatchRed);
    Bravo.defendWith();
    game.closeCombat({ ordering: "listed" });
    Dash.playAttack(brutalAssaultBlue);
    Bravo.defendWith();
    game.closeCombat({ ordering: "listed" });

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    game.as(bravo).endTurn();
    game.helpers.resolveUntilIdle();

    // ...but the counter resets: the single turn-2 attack is below the threshold.
    Dash.playAttack(throttleRed, { pitch: nimblismBlue });
    Bravo.defendWith(oldeLeatherGloves);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(6); // took 8 on turn 1, then 6{p} - 0{d}; a leaked +2{d} would leave 8
  });
});
