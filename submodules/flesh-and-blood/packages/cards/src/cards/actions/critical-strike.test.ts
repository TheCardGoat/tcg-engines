import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { criticalStrikeRed } from "./critical-strike.ts";

describe("Critical Strike (DRO023) AAA", () => {
  it("happy: unblocked vanilla attack deals printed 5", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [criticalStrikeRed], resourcePoints: 1, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(criticalStrikeRed);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravo)).toHaveLife(15);
    expectFabCard(Dash, criticalStrikeRed).toBeIn("graveyard");
  });

  it("boundary: insufficient resources cannot play the attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [criticalStrikeRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );

    expect(() => game.as(dash).playAttack(criticalStrikeRed)).toThrow();
    expectFabCard(game.as(dash), criticalStrikeRed).toBeIn("hand");
  });

  it("timing: printed attack has no extra keywords", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [criticalStrikeRed], resourcePoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );

    game.as(dash).playAttack(criticalStrikeRed);
    expectCombat(game).notToHaveKeyword("go-again");
  });
});
