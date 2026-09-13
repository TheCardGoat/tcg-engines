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
import { helmOfHaloSGrace } from "./helm-of-halo-s-grace.ts";

/**
 * Helm of Halo's Grace (ASB003) — Light Warrior Equipment Head.
 * Printed: When this defends, you may charge your hero's soul. If a yellow
 * card is charged this way, draw a card. Blade Break.
 */

describe("Helm of Halo's Grace (ASB003) AAA", () => {
  it("happy: charging a yellow card this way draws a card", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: boltyn,
        head: [helmOfHaloSGrace],
        hand: [engulfingLightYellow],
        deck: [nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);

    game.as(dash).playAttack(snatchRed);
    Boltyn.defendWith(helmOfHaloSGrace);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Boltyn, engulfingLightYellow).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveHandCount(1);
  });

  it("boundary: charging a non-yellow card does not draw", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: boltyn,
        head: [helmOfHaloSGrace],
        hand: [nimblismBlue],
        deck: [engulfingLightYellow],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);

    game.as(dash).playAttack(snatchRed);
    Boltyn.defendWith(helmOfHaloSGrace);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveHandCount(0);
  });

  it("timing: declining the charge draws nothing", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: boltyn,
        head: [helmOfHaloSGrace],
        hand: [engulfingLightYellow],
        deck: [nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);

    game.as(dash).playAttack(snatchRed);
    Boltyn.defendWith(helmOfHaloSGrace);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Boltyn, engulfingLightYellow).toBeIn("hand");
    expectFabPlayer(Boltyn).toHaveHandCount(1);
  });
});
