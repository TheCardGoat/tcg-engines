import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";

import { kano } from "../heroes/kano.ts";
import { mentalBlockBlue } from "./mental-block.ts";

/**
 * Mental Block (ROS169) — Wizard Block, blue d2.
 *
 * Printed Instant: Discard this: Prevent the next 2 damage that would be
 * dealt to you this turn. The first time you prevent damage this way,
 * create a Ponder token.
 */

describe("Mental Block (ROS169) AAA", () => {
  it("happy: discard this from hand as an Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [mentalBlockBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    Kano.activate(mentalBlockBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Kano, mentalBlockBlue).toBeIn("graveyard");
  });

  it("boundary: the Instant cannot be activated from the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [],
        graveyard: [mentalBlockBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(kano).expectActivationRejected(mentalBlockBlue);
  });

  it("timing: without incoming damage this turn no Ponder is created", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [mentalBlockBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    Kano.activate(mentalBlockBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Kano).toHaveTokenCount("ponder", 0);
  });
});
