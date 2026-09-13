import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sigilOfSolaceRed } from "../instants/sigil-of-solace.ts";
import { lightningGreaves } from "./lightning-greaves.ts";

/**
 * Lightning Greaves (ROS071) — Lightning Legs.
 *
 * Printed:
 *   Instant - {r}, destroy this: Instant cards you play this turn get go again.
 */

describe("Lightning Greaves (ROS071) AAA", () => {
  it("happy: destroy this so a later cost-0 Instant gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [lightningGreaves],
        hand: [sigilOfSolaceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(lightningGreaves);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, lightningGreaves).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveResourceCount(0);

    Bravo.play(sigilOfSolaceRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveLife(23);
    expectFabPlayer(Bravo).toHaveAP(2);
  });

  it("boundary: cannot activate without {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [lightningGreaves],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(bravo).activate(lightningGreaves)).toThrow();
    expectFabCard(game.as(bravo), lightningGreaves).toBeIn("legs");
  });

  it("timing: a non-Instant attack this turn does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [lightningGreaves],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(lightningGreaves);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(snatchRed);

    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveAP(0);
  });
});
