import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { hyperInflationRed } from "./hyper-inflation.ts";

/**
 * Hyper Inflation (PEN282) — Chaos Action - Attack, cost 0, 4{p}/3{d}, go again.
 *
 * Printed: When this attacks, cards cost {r} more to play this turn.
 */

describe("Hyper Inflation family AAA", () => {
  it("happy: after this attacks, Snatch costs 1 more", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hyperInflationRed, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(hyperInflationRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Bravo, snatchRed).toHaveCost(1);
  });

  it("boundary: this itself still plays for 0", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hyperInflationRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(hyperInflationRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("timing: the surcharge lasts through a later attack this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hyperInflationRed, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(hyperInflationRed);
    game.closeCombat({ optionals: "decline" });
    expect(() => Bravo.playAttack(snatchRed)).toThrow();
    expectFabCard(Bravo, snatchRed).toBeIn("hand");
  });
});
