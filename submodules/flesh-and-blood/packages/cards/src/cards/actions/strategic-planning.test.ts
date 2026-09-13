import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { moneyOrYourLifeRed } from "./money-or-your-life.ts";
import { strategicPlanningRed } from "./strategic-planning.ts";

describe("Strategic Planning (UPR200) AAA", () => {
  it("happy: a cost-2-or-less action from a graveyard goes to the bottom, then the end phase draws", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [strategicPlanningRed],
        graveyard: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(strategicPlanningRed);
    game.helpers.resolveUntilIdle();
    expect(Bravo.zone("deck")).toContain(snatchRed.canonicalId);
    expectFabCard(Bravo, strategicPlanningRed).toBeIn("graveyard");

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    expect(Bravo.zone("hand")).toContain(nimblismBlue.canonicalId);
  });

  it("boundary: a cost-3 action is not a legal recycle target", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [strategicPlanningRed],
        graveyard: [moneyOrYourLifeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(strategicPlanningRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, moneyOrYourLifeRed).toBeIn("graveyard");
  });

  it("timing: go again refunds the play AP and this is not combat", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [strategicPlanningRed],
        graveyard: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(strategicPlanningRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveAP(1);
    expect(game.combat()).toBeNull();
  });
});
