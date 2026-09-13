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
import { ironhideGauntlet } from "./ironhide-gauntlet.ts";

describe("Ironhide Gauntlet (MON243) AAA", () => {
  it("happy: paying {r} when defending grants +2{d} and destroys this when the chain closes", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, arms: [ironhideGauntlet], resourcePoints: 1, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(ironhideGauntlet);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, ironhideGauntlet).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: declining the {r} payment leaves this at 0{d} and equipped", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, arms: [ironhideGauntlet], resourcePoints: 1, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(ironhideGauntlet);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, ironhideGauntlet).toBeIn("arms");
    expectFabPlayer(Bravo).toHaveResourceCount(1);
  });

  it("timing: unused gauntlet stays equipped through the end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [ironhideGauntlet], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, ironhideGauntlet).toBeIn("arms");
  });
});
