import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { testOfStrengthRed } from "./test-of-strength.ts";

/**
 * Test of Strength (FAB199) — Generic Block, 4{d}, Clash.
 *
 * Printed: "When this defends, clash with the attacking hero. The winner
 * creates a Gold token."
 */

describe("Test of Strength (FAB199) AAA", () => {
  it("happy: the clash winner (defender side) creates a Gold token", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue], // reveals 2{p}
      },
      {
        hero: dash,
        hand: [testOfStrengthRed],
        life: 20,
        deck: [snatchRed], // reveals 4{p} — Dash wins the clash
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(testOfStrengthRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 4 vs 4{d} — no damage; Dash won the clash 4 vs 2.
    expectFabPlayer(Dash).toHaveTokenCount("gold", 1).toHaveLife(20);
    expectFabPlayer(Kassai).toHaveTokenCount("gold", 0);
  });

  it("boundary: the attacking hero winning the clash creates the Gold instead", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [snatchRed], // reveals 4{p} — Kassai wins the clash
      },
      {
        hero: dash,
        hand: [testOfStrengthRed],
        life: 20,
        deck: [nimblismBlue], // reveals 2{p}
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(testOfStrengthRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Kassai).toHaveTokenCount("gold", 1);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 0).toHaveLife(20);
  });
});
