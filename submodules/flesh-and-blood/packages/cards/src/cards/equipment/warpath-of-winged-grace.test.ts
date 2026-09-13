import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { engulfingLightYellow } from "../actions/engulfing-light.ts";
import { warpathOfWingedGrace } from "./warpath-of-winged-grace.ts";

/**
 * Warpath of Winged Grace (ASB006) — Light Warrior Equipment Legs.
 * Printed: When this defends, you may charge your hero's soul. If a yellow
 * card is charged this way, create a Quicken token. Blade Break.
 */

describe("Warpath of Winged Grace (ASB006) AAA", () => {
  it("happy: charging a yellow card this way creates a Quicken token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: boltyn,
        legs: [warpathOfWingedGrace],
        hand: [engulfingLightYellow],
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);

    game.as(dash).playAttack(snatchRed);
    Boltyn.defendWith(warpathOfWingedGrace);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Boltyn).toHaveTokenCount("quicken", 1);
  });

  it("boundary: charging a non-yellow card does not create Quicken", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: boltyn,
        legs: [warpathOfWingedGrace],
        hand: [nimblismBlue],
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);

    game.as(dash).playAttack(snatchRed);
    Boltyn.defendWith(warpathOfWingedGrace);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Boltyn).toHaveTokenCount("quicken", 0);
  });

  it("timing: declining the charge creates no Quicken", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: boltyn,
        legs: [warpathOfWingedGrace],
        hand: [engulfingLightYellow],
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);

    game.as(dash).playAttack(snatchRed);
    Boltyn.defendWith(warpathOfWingedGrace);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Boltyn, engulfingLightYellow).toBeIn("hand");
    expectFabPlayer(Boltyn).toHaveTokenCount("quicken", 0);
  });
});
