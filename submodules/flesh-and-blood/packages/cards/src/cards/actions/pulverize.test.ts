import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { pulverizeRed } from "./pulverize.ts";

describe("Pulverize (EVR021) AAA", () => {
  it("happy: a hit gives their first attack next turn -4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [pulverizeRed],
        resourcePoints: 10,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(pulverizeRed);
    expectCombat(game).toHaveAttackPower(14);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(26);

    Bravo.endTurn();
    game.untilIdle();
    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(0);
  });

  it("boundary: a miss does not reduce their first attack next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [pulverizeRed],
        resourcePoints: 10,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          snatchRed,
        ],
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(pulverizeRed);
    Dash.defendWith(
      nimblismBlue,
      nimblismBlue,
      nimblismBlue,
      nimblismBlue,
      nimblismBlue,
      nimblismBlue,
      nimblismBlue,
    );
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(40);

    Bravo.endTurn();
    game.untilIdle();
    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
