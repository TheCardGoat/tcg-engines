import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { numbskullCharmYellow } from "../instants/numbskull-charm.ts";
import { darlingOfTheCrowdYellow } from "./darling-of-the-crowd.ts";

/**
 * Darling of the Crowd Yellow (SUP061) — Revered Block, 3{d}.
 *
 * Printed: While this is defending, if you've been cheered this turn, it
 * gets +1{d}.
 */

describe("Darling of the Crowd (SUP061) AAA", () => {
  it("happy: cheered this turn, it defends for 4{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [darlingOfTheCrowdYellow, numbskullCharmYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(snatchRed);
    Dash.pass();
    Bravo.play(numbskullCharmYellow, { modeIndexes: [1] });
    game.passBoth();
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Bravo.defendWith(darlingOfTheCrowdYellow);

    expectFabCard(Bravo, darlingOfTheCrowdYellow).toHaveDefense(4);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("boundary: not cheered, it defends for printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [darlingOfTheCrowdYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Bravo.defendWith(darlingOfTheCrowdYellow);

    expectFabCard(Bravo, darlingOfTheCrowdYellow).toHaveDefense(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("timing: a previous-turn cheer does not add {d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [numbskullCharmYellow, darlingOfTheCrowdYellow],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(numbskullCharmYellow, { modeIndexes: [1] });
    game.passBoth();
    Bravo.endTurn();
    game.helpers.untilIdle();

    Dash.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Bravo.defendWith(darlingOfTheCrowdYellow);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
