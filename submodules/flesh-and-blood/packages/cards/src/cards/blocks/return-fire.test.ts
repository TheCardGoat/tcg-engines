import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { ridgeRiderShotRed } from "../actions/ridge-rider-shot.ts";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { returnFireRed } from "./return-fire.ts";

/**
 * Return Fire, Red (SEA099) — Ranger Block, 4{d}.
 * Printed: When this defends, you may banish an arrow from your hand. If you
 * do, at the start of your next turn, put it face-up into your arsenal and it
 * gets +3{p} until end of turn.
 */

describe("Return Fire (SEA099) AAA", () => {
  it("happy: the banished arrow returns face-up at the controller's next start phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: azalea,
        hand: [returnFireRed, ridgeRiderShotRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.attackWith(snatchRed);
    Azalea.defendWith(returnFireRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Azalea.target(ridgeRiderShotRed);

    expectFabCard(Azalea, ridgeRiderShotRed).toBeIn("banished");
    Bravo.endTurn();
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Azalea, ridgeRiderShotRed).toBeIn("arsenal").toBeFaceUp();
    expectFabPlayer(Azalea).toHaveLife(20);
  });

  it("boundary: declining the banish leaves the arrow in hand", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: azalea,
        hand: [returnFireRed, ridgeRiderShotRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.attackWith(snatchRed);
    Azalea.defendWith(returnFireRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Azalea, ridgeRiderShotRed).toBeIn("hand");
    Bravo.endTurn();
    expectFabCard(Azalea, ridgeRiderShotRed).toBeIn("hand");
    expectFabPlayer(Azalea).toHaveLife(20);
  });

  it("timing: with no arrow the optional cannot load arsenal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: azalea, hand: [returnFireRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.attackWith(snatchRed);
    Azalea.defendWith(returnFireRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    Bravo.endTurn();

    expect(Azalea.zone("arsenal")).toHaveLength(0);
    expectFabPlayer(Azalea).toHaveLife(20);
  });
});
