import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { wreckerRompRed } from "./wrecker-romp.ts";

describe("Wrecker Romp (RNR013) AAA", () => {
  it("happy: discarding an additional card allows the 8-power attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [wreckerRompRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(wreckerRompRed);
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(dash)).toHaveLife(12);
    expectFabCard(Bravo, wreckerRompRed).toBeIn("graveyard");
    expectFabCard(Bravo, snatchRed).toBeIn("graveyard");
  });

  it("boundary: without a card to discard the additional cost cannot be paid", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [wreckerRompRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );

    expect(() => game.as(bravo).playAttack(wreckerRompRed)).toThrow();
    expectFabCard(game.as(bravo), wreckerRompRed).toBeIn("hand");
  });

  it("timing: the attack has no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [wreckerRompRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(bravo).playAttack(wreckerRompRed);
    expectCombat(game).notToHaveKeyword("go-again");
  });
});
