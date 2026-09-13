import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { turningPointBlue } from "./turning-point.ts";

/**
 * Turning Point (APS030) — Revered Guardian Block, 2{d}.
 *
 * Printed: "When this defends, if you have less {h} than the attacking hero,
 * the crowd cheers you.
 * While this is defending, if you've been cheered this turn, it gets +3{d}."
 */

describe("Turning Point (APS030) AAA", () => {
  it("happy: defending from behind cheers the defender and the block gets +3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [turningPointBlue], life: 15, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(turningPointBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 4 power vs 2 + 3 = 5{d} — fully blocked.
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: at equal life there is no cheer and the printed 2{d} only", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [turningPointBlue], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(turningPointBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 4 power vs 2{d} — 2 damage.
    expectFabPlayer(Dash).toHaveLife(18);
  });
});
