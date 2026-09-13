import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { disableRed } from "./disable.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { emergingDominanceRed } from "./emerging-dominance.ts";

describe("Emerging Dominance (CRU038) AAA", () => {
  it("happy: your action-phase start destroys this then the next Guardian AAC gains +3{p} and dominate", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [emergingDominanceRed],
        hand: [disableRed, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Bravo, emergingDominanceRed).toBeIn("graveyard");

    Bravo.playAttack(disableRed);
    expectCombat(game).toHaveAttackPower(12);
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("boundary: a Generic attack does not gain +3{p} or dominate", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [emergingDominanceRed],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();

    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("timing: opponent action-phase start does not destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [emergingDominanceRed],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.untilIdle();
    expectFabCard(Bravo, emergingDominanceRed).toBeIn("arena");
  });
});
