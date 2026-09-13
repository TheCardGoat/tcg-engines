import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { autumnSTouchBlue } from "../actions/autumn-s-touch.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { snatchRed } from "../actions/snatch.ts";
import { pulseOfIsenloftBlue } from "./pulse-of-isenloft.ts";

/**
 * Pulse of Isenloft Blue (ELE114) — Ice Earth Defense Reaction.
 *
 * Printed: Legendary. Earth, Ice, and Elemental action cards have +1{d}
 * while defending this turn.
 */

describe("Pulse of Isenloft (ELE114) AAA", () => {
  it("happy: Earth action cards get +1 defense while defending this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      {
        hero: oldhim,
        hand: [pulseOfIsenloftBlue, autumnSTouchBlue],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oldhim = game.as(oldhim);

    Dash.attackWith(Dash.cardsIn("hand", snatchRed)[0]!);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Oldhim.play(pulseOfIsenloftBlue);
    game.helpers.resolveRestOfCombat();

    Dash.attackWith(Dash.cardsIn("hand", snatchRed)[0]!);
    game.advanceCombatTo("defend");
    Oldhim.defendWith(autumnSTouchBlue);
    expectFabCard(Oldhim, autumnSTouchBlue).toHaveDefense(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Oldhim).toHaveLife(20);
    expectFabCard(Oldhim, pulseOfIsenloftBlue).toBeIn("graveyard");
  });

  it("boundary: a Generic action does not gain the +1 defense", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      {
        hero: oldhim,
        hand: [pulseOfIsenloftBlue, snatchRed],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oldhim = game.as(oldhim);

    Dash.attackWith(Dash.cardsIn("hand", snatchRed)[0]!);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Oldhim.play(pulseOfIsenloftBlue);
    game.helpers.resolveRestOfCombat();

    Dash.attackWith(Dash.cardsIn("hand", snatchRed)[0]!);
    game.advanceCombatTo("defend");
    Oldhim.defendWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Oldhim).toHaveLife(18);
    expectFabCard(Oldhim, snatchRed).toHaveDefense(2);
  });

  it("timing: the +1{d} is this-turn, not only the Pulse chain link", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      {
        hero: oldhim,
        hand: [pulseOfIsenloftBlue, autumnSTouchBlue],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oldhim = game.as(oldhim);

    Dash.attackWith(Dash.cardsIn("hand", snatchRed)[0]!);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Oldhim.play(pulseOfIsenloftBlue);
    game.helpers.resolveRestOfCombat();
    Dash.endTurn();
    Oldhim.endTurn();
    game.helpers.untilIdle();

    Dash.attackWith(Dash.cardsIn("hand", snatchRed)[0]!);
    game.advanceCombatTo("defend");
    Oldhim.defendWith(autumnSTouchBlue);
    expectFabCard(Oldhim, autumnSTouchBlue).toHaveDefense(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Oldhim).toHaveLife(19);
  });
});
