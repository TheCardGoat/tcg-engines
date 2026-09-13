import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tradeInYellow } from "../actions/trade-in.ts";
import { thatAllYouGotYellow } from "./that-all-you-got.ts";

/**
 * That All You Got? Yellow (UPR189) — Generic Defense Reaction.
 *
 * Printed: While this is defending an attack with 2 or less {p}, when the
 * combat chain closes, draw a card.
 */

describe("That All You Got? (UPR189) AAA", () => {
  it("happy: defending a power-2 attack draws a card when the chain closes", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [tradeInYellow], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [thatAllYouGotYellow],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(tradeInYellow);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Dash.play(thatAllYouGotYellow);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, thatAllYouGotYellow).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: defending a power-4 attack does not draw", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [thatAllYouGotYellow],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Dash.play(thatAllYouGotYellow);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Dash, thatAllYouGotYellow).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("regression: an earlier power-2 link still draws when a later link has 4 power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tradeInYellow, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [thatAllYouGotYellow],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(tradeInYellow, { optionals: "decline" });
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Dash.play(thatAllYouGotYellow);
    game.advanceUntil({ stopAt: "resolution", ordering: "listed" });

    Bravo.playAttack(snatchRed);
    Dash.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveHandCount(1).toHaveLife(16);
    expectFabCard(Dash, thatAllYouGotYellow).toBeIn("graveyard");
  });
});
