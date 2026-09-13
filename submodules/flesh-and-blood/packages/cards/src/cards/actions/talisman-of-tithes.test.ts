import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { thisRoundSOnMeBlue } from "./this-round-s-on-me.ts";
import { talismanOfTithesBlue } from "./talisman-of-tithes.ts";

/**
 * Talisman of Tithes (EVR192) — Generic Item, go again.
 *
 * Printed: If an opponent would draw 1 or more cards during your action phase,
 * instead destroy Talisman of Tithes and they draw that many cards minus 1.
 */

describe("Talisman of Tithes (EVR192) AAA", () => {
  it("happy: an opponent drawing 1 during your action phase destroys this and they draw 0", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [talismanOfTithesBlue],
        hand: [thisRoundSOnMeBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: bravo, hand: [], deck: [snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(thisRoundSOnMeBlue);
    game.untilIdle();

    expectFabCard(Dash, talismanOfTithesBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabPlayer(Bravo).toHaveHandCount(0);
  });

  it("boundary: your own draw does not destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [talismanOfTithesBlue],
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.closeCombat();

    expectFabCard(Dash, talismanOfTithesBlue).toBeIn("arena");
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });

  it("timing: after it is destroyed a later opposing draw is unreduced", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [talismanOfTithesBlue],
        hand: [thisRoundSOnMeBlue, thisRoundSOnMeBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [], deck: [snatchRed, snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(thisRoundSOnMeBlue);
    game.untilIdle();
    expectFabCard(Dash, talismanOfTithesBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveHandCount(0);

    Dash.play(thisRoundSOnMeBlue);
    game.untilIdle();
    expectFabPlayer(Bravo).toHaveHandCount(1);
  });
});
