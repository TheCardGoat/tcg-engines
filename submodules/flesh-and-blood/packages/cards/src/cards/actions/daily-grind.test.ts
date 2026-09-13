import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { dailyGrindBlue } from "./daily-grind.ts";

describe("Daily Grind (MPG022) AAA", () => {
  it("happy: a defending attack action you control clashes with the attacking hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [dailyGrindBlue, brutalAssaultBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(dailyGrindBlue);
    game.untilIdle();
    Bravo.endTurn();
    game.untilIdle();
    Dash.playAttack(snatchRed);
    Bravo.defendWith(brutalAssaultBlue);
    game.passBoth();
    game.closeCombat({ ordering: "listed" });
    expectFabCard(Bravo, dailyGrindBlue).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("boundary: defending with a non-attack card does not clash", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [dailyGrindBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(dailyGrindBlue);
    game.untilIdle();
    Bravo.endTurn();
    game.untilIdle();
    Dash.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, dailyGrindBlue).toBeIn("arena");
  });

  it("timing: at the start of your turn this is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [dailyGrindBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(dailyGrindBlue);
    game.untilIdle();
    expectFabCard(Bravo, dailyGrindBlue).toBeIn("arena");
    Bravo.endTurn();
    game.untilIdle();
    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Bravo, dailyGrindBlue).toBeIn("graveyard");
  });
});
