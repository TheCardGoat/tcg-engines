import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { snatchRed } from "./snatch.ts";
import { winterSBiteRed as winterSBite } from "./winter-s-bite.ts";

/**
 * Winter's Bite Red (ELE169) — Ice Action. Go again.
 *
 * Printed: Target hero discards a card unless they pay {r}{r}{r}.
 */

describe("Winter's Bite (ELE169) AAA", () => {
  it("happy: a target who cannot pay discards a card", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [winterSBite],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(winterSBite, { target: Dash.id });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // Dash cannot pay {r}{r}{r}: a hand card is discarded.
    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
    expectFabPlayer(Oldhim).toHaveAP(1); // go again
  });

  it("boundary: a target who pays keeps their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [winterSBite],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(winterSBite, { target: Dash.id });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: true }); // Dash pays

    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabPlayer(Dash).toHaveResourceCount(0); // 3 - 3 paid
  });
});
