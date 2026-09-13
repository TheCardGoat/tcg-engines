import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { finalActRed } from "./final-act.ts";

/**
 * Final Act (TCC057) — Bard Action - Attack, cost 1, 1{p}/3{d}.
 *
 * Printed: When this attacks, it gets +X{p}, where X is twice the number of
 * cards in all pitch zones.
 */

describe("Final Act (TCC057) AAA", () => {
  it("happy: one card in pitch makes this 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [finalActRed],
        pitch: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(finalActRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: empty pitch leaves this at 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [finalActRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(finalActRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(1);
  });

  it("timing: two pitched cards make this 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [finalActRed],
        pitch: [snatchRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(finalActRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(5);
  });
});
