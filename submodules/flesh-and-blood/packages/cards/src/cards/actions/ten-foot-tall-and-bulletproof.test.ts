import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { tenFootTallAndBulletproofRed } from "./ten-foot-tall-and-bulletproof.ts";

describe("Ten Foot Tall and Bulletproof (ROS217) AAA", () => {
  it("happy: unblocked attack deals printed 10", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [tenFootTallAndBulletproofRed], resourcePoints: 3, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(tenFootTallAndBulletproofRed);
    expectCombat(game).toHaveAttackPower(10);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravo)).toHaveLife(10);
    expectFabCard(Dash, tenFootTallAndBulletproofRed).toBeIn("graveyard");
  });

  it("boundary: insufficient resources cannot play the attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [tenFootTallAndBulletproofRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );

    expect(() => game.as(dash).playAttack(tenFootTallAndBulletproofRed)).toThrow();
    expectFabCard(game.as(dash), tenFootTallAndBulletproofRed).toBeIn("hand");
  });

  it("timing: -2 intellect applies only during the next end phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [tenFootTallAndBulletproofRed], resourcePoints: 3, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(tenFootTallAndBulletproofRed);
    expect(Dash.intellect()).toBe(4);
    game.closeCombat({ optionals: "decline" });
    expect(Dash.intellect()).toBe(4);

    Dash.endTurn();
    expect(Dash.zone("hand")).toHaveLength(2);
    game.as(bravo).endTurn();
    Dash.endTurn();
    expect(Dash.zone("hand")).toHaveLength(4);
  });

  it("timing: the printed attack has no extra keywords and combat closes", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [tenFootTallAndBulletproofRed], resourcePoints: 3, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );

    game.as(dash).playAttack(tenFootTallAndBulletproofRed);
    expectCombat(game).toBeAtStep("defend");
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });
    expectCombat(game).toBeClosed();
  });
});
