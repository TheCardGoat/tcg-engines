import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "./snatch.ts";
import { toothAndClawRed } from "./tooth-and-claw.ts";

/**
 * Tooth and Claw (MST051) — Mystic Ninja Attack, cost 0, 4{p}.
 *
 * Printed: When this attacks, you may reveal any number of Crouching Tigers
 * from your hand. If you reveal 1 or more, this gets go again. 2 or more,
 * this gets +1{p}. 3 or more, draw a card.
 *
 * ENGINE GAP (pinned): after the optional reveal answers, the sequence
 * conditionals throw `unhandled has-status marker: revealed-1-or-more-this-way`.
 */

describe("Tooth and Claw (MST051) AAA", () => {
  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [toothAndClawRed], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    game.as(dash).playAttack(snatchRed);
    game.toReaction();
    expect(() => game.as(katsu).play(toothAndClawRed)).toThrow();
    expectFabCard(game.as(katsu), toothAndClawRed).toBeIn("hand");
  });
});
