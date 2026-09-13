import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "./snatch.ts";
import { recklessArithmeticBlue } from "./reckless-arithmetic.ts";

describe("Reckless Arithmetic (PEN006) AAA", () => {
  it("happy: when this attacks it gets +X{p} equal to the die roll", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [recklessArithmeticBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(recklessArithmeticBlue, { stopAt: "on-attack" });
    const face = game.lastDieFace();
    expectCombat(game).toHaveAttackPower(1 + face);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(20 - (1 + face));
  });

  it("boundary: unpaid cost 1 does not play this from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [recklessArithmeticBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    expect(() => Rhinar.playAttack(recklessArithmeticBlue)).toThrow();
    expectFabCard(Rhinar, recklessArithmeticBlue).toBeIn("hand");
    expectCombat(game).toBeClosed();
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: rhinar, hand: [recklessArithmeticBlue], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    game.as(dash).playAttack(snatchRed);
    game.toReaction();
    expect(() => game.as(rhinar).play(recklessArithmeticBlue)).toThrow();
    expectFabCard(game.as(rhinar), recklessArithmeticBlue).toBeIn("hand");
  });
});
