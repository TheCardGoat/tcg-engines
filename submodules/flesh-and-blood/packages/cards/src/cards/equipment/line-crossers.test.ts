import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { lyathGoldmane } from "../heroes/lyath-goldmane.ts";
import { dash } from "../heroes/dash.ts";
import { mockingBlowBlue } from "../actions/mocking-blow.ts";
import { lineCrossers } from "./line-crossers.ts";

/**
 * Line Crossers — Reviled Arms d1 Blade Break.
 *
 * Printed: "If you have the same {h} as a hero, it also counts as you having
 * more {h} than them, and them having less {h} than you."
 *
 * Mocking Blow ("When this attacks a hero, if you have more {h} than them, the
 * crowd boos you") is the real life-comparison meter.
 */

describe("Line Crossers AAA", () => {
  it("happy: at equal life, the wearers' life comparison counts as more {h}", () => {
    const game = FabTestEngine.start(
      {
        hero: lyathGoldmane,
        arms: [lineCrossers],
        hand: [mockingBlowBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lyath = game.as(lyathGoldmane);

    Lyath.playAttack(mockingBlowBlue, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectFabPlayer(Lyath).toHaveCrowdBooedThisTurn();
    game.closeCombat({ ordering: "listed" });
  });

  it("boundary: at equal life without the wraps, Mocking Blow does not boo", () => {
    const game = FabTestEngine.start(
      {
        hero: lyathGoldmane,
        hand: [mockingBlowBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lyath = game.as(lyathGoldmane);

    Lyath.playAttack(mockingBlowBlue);

    expectFabPlayer(Lyath).notToHaveCrowdBooedThisTurn();
    game.closeCombat({ ordering: "listed" });
  });
});
