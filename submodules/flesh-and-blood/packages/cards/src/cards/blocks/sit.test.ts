import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { poundTownBlue } from "../actions/pound-town.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sitRed } from "./sit.ts";

/**
 * Sit!, Red (SUP210) — Guardian Block, 2{d}.
 * Printed: When this defends a Brute attack, this gets +3{d}.
 */

describe("Sit! (SUP210) AAA", () => {
  it("happy: defending a Brute attack grants +3{d}", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [poundTownBlue], resourcePoints: 3, deck: 6 },
      { hero: bravo, hand: [sitRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(rhinar).playAttack(poundTownBlue);
    Bravo.defendWith(sitRed);
    game.passBoth();

    expectFabCard(Bravo, sitRed).toHaveDefense(5);
    expectCombat(game).toBeOpen();
  });

  it("boundary: defending a non-Brute attack stays printed 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [snatchRed], deck: 6 },
      { hero: bravo, hand: [sitRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(rhinar).playAttack(snatchRed);
    Bravo.defendWith(sitRed);
    game.passBoth();

    expectFabCard(Bravo, sitRed).toHaveDefense(2);
  });

  it("timing: +3{d} this turn still applies through chain close", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [poundTownBlue], resourcePoints: 3, deck: 6 },
      { hero: bravo, hand: [sitRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(rhinar).playAttack(poundTownBlue);
    Bravo.defendWith(sitRed);
    game.passBoth();
    expectFabCard(Bravo, sitRed).toHaveDefense(5);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toBeClosed();
    expectFabPlayer(Bravo).toHaveLife(20);
  });
});
