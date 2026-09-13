import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "./snatch.ts";
import { chaseTheTailRed } from "./chase-the-tail.ts";

describe("Chase the Tail (MST161) AAA", () => {
  it("happy: after Crouching Tiger, this gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [crouchingTiger, chaseTheTailRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(crouchingTiger);
    game.advanceCombatTo("resolution");
    Katsu.playAttack(chaseTheTailRed, { stopAt: "on-attack" });
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Katsu).toHaveAP(1);
  });

  it("boundary: without Crouching Tiger last, this does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [chaseTheTailRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(chaseTheTailRed);
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Katsu).toHaveAP(0);
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [chaseTheTailRed], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    game.as(dash).playAttack(snatchRed);
    game.toReaction();
    expect(() => game.as(katsu).play(chaseTheTailRed)).toThrow();
    expectFabCard(game.as(katsu), chaseTheTailRed).toBeIn("hand");
  });
});
