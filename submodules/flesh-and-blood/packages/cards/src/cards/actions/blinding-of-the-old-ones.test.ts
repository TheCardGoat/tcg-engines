import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { blindingOfTheOldOnesRed } from "./blinding-of-the-old-ones.ts";

describe("Blinding of the Old Ones (MPG026) AAA", () => {
  it("happy: unblocked 10{p} deals 10 to a Guardian hero", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [blindingOfTheOldOnesRed], resourcePoints: 6, deck: 6 },
      { hero: bravo, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravoShowstopper).attackWith(blindingOfTheOldOnesRed);
    game.as(bravo).defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(bravo)).toHaveLife(10);
  });

  it("boundary: 8{d} of blocks leaves 2 damage (below crush 4)", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [blindingOfTheOldOnesRed], resourcePoints: 6, deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravoShowstopper).attackWith(blindingOfTheOldOnesRed);
    game.as(dash).defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("timing: crush does not strip the defending Guardian's next-turn hero activate", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [blindingOfTheOldOnesRed], resourcePoints: 6, deck: 6 },
      {
        hero: bravo,
        life: 20,
        resourcePoints: 2,
        hand: [nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Showstopper = game.as(bravoShowstopper);
    const Bravo = game.as(bravo);

    Showstopper.attackWith(blindingOfTheOldOnesRed);
    Bravo.defendWith();
    game.helpers.resolveRestOfCombat();
    Showstopper.endTurn();
    game.helpers.resolveUntilIdle();

    Bravo.activate(bravo);
    expectWait(game).toHaveDecision("payment");
  });
});
