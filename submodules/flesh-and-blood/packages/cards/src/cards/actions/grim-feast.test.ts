import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { grimFeastRed } from "./grim-feast.ts";

/**
 * Grim Feast Red (DTD175) — Shadow Action. Blood Debt.
 *
 * Printed: You may play this from your banished zone. If you do, it costs
 * {r}{r} less to play.
 * Gain 3{h}
 */

describe("Grim Feast (DTD175) AAA", () => {
  it("happy+pin: playable from banishment (gain 3{h}); the {r}{r} discount never applies (DTD178 §5 family)", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        banished: [grimFeastRed],
        resourcePoints: 3, // PIN: printed cost charged in full — the from-banished {r}{r} discount is dropped (same defect family as DTD178 vile-inquisition, plan §5)
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(grimFeastRed, { from: "banished" });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Chane).toHaveLife(23); // 20 + 3
    expectFabCard(Chane, grimFeastRed).toBeIn("graveyard");
  });

  it("boundary: from hand it costs the full 3 resources", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [grimFeastRed],
        resourcePoints: 2, // not enough without the discount
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    expect(() => Chane.play(grimFeastRed)).toThrow(/reject/i);
    expectFabCard(Chane, grimFeastRed).toBeIn("hand");
  });
});
