import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { thisRoundSOnMeBlue } from "./this-round-s-on-me.ts";

describe("This Round's On Me (EVR160) AAA", () => {
  it("happy: each hero draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [thisRoundSOnMeBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: bravo, hand: [], deck: [snatchRed] },
    );
    const Dash = game.as(dash);

    Dash.play(thisRoundSOnMeBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, thisRoundSOnMeBlue).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabCard(game.as(bravo), snatchRed).toBeIn("hand");
  });

  it("boundary: go again refunds the Action AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [thisRoundSOnMeBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: bravo, hand: [], deck: [snatchRed] },
    );
    const Dash = game.as(dash);

    Dash.play(thisRoundSOnMeBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("timing: a later opposing attack that targets you has -1{p} until your next start", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [thisRoundSOnMeBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: bravo, hand: [snatchRed, snatchRed], actionPoints: 1, deck: 6 },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(thisRoundSOnMeBlue);
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ optionals: "decline" });

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
