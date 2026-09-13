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
import { ironhideLegs } from "./ironhide-legs.ts";

describe("Ironhide Legs (MON244) AAA", () => {
  it("happy: paying {r} when defending grants +2{d} and destroys this when the chain closes", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, legs: [ironhideLegs], resourcePoints: 1, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(ironhideLegs);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, ironhideLegs).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: declining the {r} payment leaves this at 0{d} and equipped", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, legs: [ironhideLegs], resourcePoints: 1, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(ironhideLegs);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, ironhideLegs).toBeIn("legs");
    expectFabPlayer(Bravo).toHaveResourceCount(1);
  });

  it("timing: unused legs stay equipped through the end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [ironhideLegs], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, ironhideLegs).toBeIn("legs");
  });
});
