import { describe, it } from "vitest";
import { FabTestEngine, expectCombat } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { helmOfTheArknight } from "../equipment/helm-of-the-arknight.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { feistyLocalsRed } from "./feisty-locals.ts";

describe("Feisty Locals family AAA", () => {
  it("happy: action defense grants +2 power", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [feistyLocalsRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [brutalAssaultBlue], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(feistyLocalsRed);
    game.as(bravo).defendWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(5);
  });
  it("boundary: an undefended attack keeps printed power", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [feistyLocalsRed], actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
    );
    game.as(dash).playAttack(feistyLocalsRed);
    expectCombat(game).toHaveAttackPower(3);
  });
  it("timing: a non-action defender does not receive the bonus", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [feistyLocalsRed], actionPoints: 1, deck: 6 },
      { hero: bravo, head: [helmOfTheArknight], deck: 6 },
    );
    game.as(dash).playAttack(feistyLocalsRed);
    game.as(bravo).defendWith(helmOfTheArknight);
    expectCombat(game).toHaveAttackPower(3);
  });
});
