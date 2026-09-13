import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { muscleMuttYellow } from "./muscle-mutt.ts";

describe("Muscle Mutt (RVD018) AAA", () => {
  it("happy: unblocked vanilla attack deals printed 6", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [muscleMuttYellow], resourcePoints: 3, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(muscleMuttYellow);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravo)).toHaveLife(14);
    expectFabCard(Dash, muscleMuttYellow).toBeIn("graveyard");
  });

  it("boundary: insufficient resources cannot play the attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [muscleMuttYellow], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );

    expect(() => game.as(dash).playAttack(muscleMuttYellow)).toThrow();
    expectFabCard(game.as(dash), muscleMuttYellow).toBeIn("hand");
  });

  it("timing: printed attack has no extra keywords and combat closes", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [muscleMuttYellow], resourcePoints: 3, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );

    game.as(dash).playAttack(muscleMuttYellow);
    expectCombat(game).toBeAtStep("defend");
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });
    expectCombat(game).toBeClosed();
  });
});
