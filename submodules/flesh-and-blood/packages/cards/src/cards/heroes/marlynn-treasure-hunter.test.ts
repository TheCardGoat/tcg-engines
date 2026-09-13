import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  expectFabToken,
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { drillShotRed } from "../actions/drill-shot.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { snatchRed } from "../actions/snatch.ts";
import { marlynnTreasureHunter } from "./marlynn-treasure-hunter.ts";

/**
 * Marlynn, Treasure Hunter (SEA082) — Pirate Ranger Hero.
 *
 * Printed: "Action — {t}, destroy a Gold you control: Create a Goldfin Harpoon
 * in your hand. Go again. / Whenever you draw a card during your action phase,
 * you may put an arrow from your hand face-up into your arsenal."
 */

describe("Marlynn, Treasure Hunter (SEA082) AAA", () => {
  it("happy: tapping and destroying a Gold creates a Goldfin Harpoon in hand, then go again", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynnTreasureHunter,
        arena: [fabToken("gold")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Marlynn = game.as(marlynnTreasureHunter);

    Marlynn.activate(marlynnTreasureHunter);
    game.passBoth();

    // The Gold was destroyed and a Goldfin Harpoon token was created in hand.
    expectFabToken(game, "gold").toHaveCount(0);
    expectFabToken(game, "goldfin-harpoon").toHaveCount(1).toBeIn("hand");
    // −1 AP for the activation, +1 from go again.
    expectFabPlayer(Marlynn).toHaveAP(1);
  });

  it("boundary: without a Gold you control the activation is illegal", () => {
    const game = FabTestEngine.start(
      { hero: marlynnTreasureHunter, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Marlynn = game.as(marlynnTreasureHunter);

    expectFabUnplayable(
      () => Marlynn.activate(marlynnTreasureHunter),
      /destroy cost is unavailable/i,
    );
    expectFabPlayer(Marlynn).toHaveAP(1);
  });

  it("boundary: declining the draw optional leaves arsenal empty", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynnTreasureHunter,
        hand: [tomeOfFyendalYellow],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, drillShotRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynnTreasureHunter);

    Marlynn.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Marlynn.zone("arsenal")).toHaveLength(0);
  });

  it("timing: an action-phase draw may put an Arrow face-up into arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynnTreasureHunter,
        hand: [tomeOfFyendalYellow],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, drillShotRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynnTreasureHunter);

    Marlynn.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    // The drawn-card optional put the Arrow face-up into the arsenal.
    expectFabCard(Marlynn, drillShotRed).toBeIn("arsenal").toBeFaceUp();
  });
});
