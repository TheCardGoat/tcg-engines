import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { plunderRunRed } from "./plunder-run.ts";

describe("Plunder Run Red (ARC170) AAA", () => {
  it("happy: the next attack-action hit draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [plunderRunRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(plunderRunRed);
    game.helpers.resolveUntilIdle();
    Dash.playAttack(brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveHandCount(1);
  });

  it("timing: played from arsenal buffs the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        arsenal: [plunderRunRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(plunderRunRed, { from: "arsenal" });
    game.helpers.resolveUntilIdle();
    Dash.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(7);
  });
});
