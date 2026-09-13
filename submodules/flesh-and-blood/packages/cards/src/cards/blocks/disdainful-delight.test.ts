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
import { liarSCharmYellow } from "../instants/liar-s-charm.ts";
import { disdainfulDelightYellow } from "./disdainful-delight.ts";

/**
 * Disdainful Delight Yellow (SUP123) — Reviled Block, 3{d}.
 *
 * Printed: While this is defending, if you've been booed this turn, this
 * gets +1{d}.
 */

describe("Disdainful Delight (SUP123) AAA", () => {
  it("happy: booed this turn, it defends for 4{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [disdainfulDelightYellow, liarSCharmYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(snatchRed);
    Dash.pass();
    Bravo.play(liarSCharmYellow, { modeIndexes: [1] });
    game.passBoth();
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Bravo.defendWith(disdainfulDelightYellow);

    expectFabCard(Bravo, disdainfulDelightYellow).toHaveDefense(4);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("boundary: not booed, it defends for printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [disdainfulDelightYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Bravo.defendWith(disdainfulDelightYellow);

    expectFabCard(Bravo, disdainfulDelightYellow).toHaveDefense(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("timing: a previous-turn boo does not add {d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [liarSCharmYellow, disdainfulDelightYellow],
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

    Bravo.play(liarSCharmYellow, { modeIndexes: [1] });
    game.passBoth();
    Bravo.endTurn();
    game.helpers.untilIdle();

    Dash.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Bravo.defendWith(disdainfulDelightYellow);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
