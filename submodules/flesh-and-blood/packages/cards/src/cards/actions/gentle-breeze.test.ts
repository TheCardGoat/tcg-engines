import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { gentleBreezeRed } from "./gentle-breeze.ts";

/**
 * Gentle Breeze (PEN034) — "Your other attacks have 1 base {p}." Printed 3{p}.
 * Seat Bravo so Ira's second-attack static does not stack.
 */

describe("Gentle Breeze (PEN034) AAA", () => {
  it("happy: a later attack on the same chain has 1 base {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [gentleBreezeRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(gentleBreezeRed);
    expectCombat(game).toHaveAttackPower(3);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(1);
  });

  it("boundary: Gentle Breeze itself stays printed 3{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [gentleBreezeRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(gentleBreezeRed);
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: after the chain closes, a new attack is not base 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [gentleBreezeRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(gentleBreezeRed);
    game.closeCombat({ optionals: "decline" });
    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
