import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { nimblismBlue } from "./nimblism.ts";
import { wreckingBallRed } from "./wrecking-ball.ts";

describe("Wrecking Ball (RVD013) AAA", () => {
  it("happy: discarding a 6+{p} card this way intimidates", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [wreckingBallRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [commandAndConquerRed],
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(wreckingBallRed, { stopAt: "on-attack" });
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Rhinar, commandAndConquerRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(0);
  });

  it("boundary: discarding a sub-6{p} card does not intimidate", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [wreckingBallRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: dash, hand: [commandAndConquerRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(wreckingBallRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveHandCount(1);
  });

  it("timing: unpaid cost 3 does not play this from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [wreckingBallRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    expect(() => Rhinar.playAttack(wreckingBallRed)).toThrow();
    expectFabCard(Rhinar, wreckingBallRed).toBeIn("hand");
    expectCombat(game).toBeClosed();
  });
});
