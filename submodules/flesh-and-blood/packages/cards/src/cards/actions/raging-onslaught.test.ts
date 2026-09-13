import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { ragingOnslaughtRed } from "./raging-onslaught.ts";

describe("Raging Onslaught (WTR188) AAA", () => {
  it("happy: unblocked attack deals printed 7", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [ragingOnslaughtRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );

    game.as(bravo).playAttack(ragingOnslaughtRed);
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });

  it("boundary: insufficient resources cannot play the attack", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [ragingOnslaughtRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );

    expect(() => game.as(bravo).playAttack(ragingOnslaughtRed)).toThrow();
  });

  it("timing: the printed attack has no go again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [ragingOnslaughtRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(bravo).playAttack(ragingOnslaughtRed);
    expectCombat(game).notToHaveKeyword("go-again");
  });
});
