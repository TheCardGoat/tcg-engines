import { describe, it } from "vitest";
import { FabTestEngine, expectCombat } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { downButNotOutRed } from "./down-but-not-out.ts";

describe("Down But Not Out family AAA", () => {
  it("happy: being behind with fewer resources grants power and overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [downButNotOutRed],
        life: 15,
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, weapon1: [deathDealer], life: 20, deck: 6 },
    );
    game.as(dash).playAttack(downButNotOutRed);
    expectCombat(game).toHaveAttackPower(8).toHaveKeyword("overpower");
  });
  it("boundary: equal life does not grant the bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [downButNotOutRed],
        life: 20,
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, weapon1: [deathDealer], life: 20, deck: 6 },
    );
    game.as(dash).playAttack(downButNotOutRed);
    expectCombat(game).toHaveAttackPower(5);
  });
  it("timing: the attack is still playable without the condition", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [downButNotOutRed], life: 20, actionPoints: 1, deck: 6 },
      { hero: azalea, deck: 6 },
    );
    game.as(dash).playAttack(downButNotOutRed);
    expectCombat(game).toHaveAttackPower(5);
  });
});
