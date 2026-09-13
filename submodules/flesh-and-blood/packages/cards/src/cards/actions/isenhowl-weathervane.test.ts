import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { aetherIceveinYellow } from "./aether-icevein.ts";
import { isenhowlWeathervaneRed } from "./isenhowl-weathervane.ts";

/**
 * Isenhowl Weathervane Red (UPR141) — Ice Action. Go again.
 *
 * Printed: The next time you Ice fuse this turn, create 4 Frostbite
 * tokens under target hero's control.
 */

describe("Isenhowl Weathervane (UPR141) AAA", () => {
  it("happy: the next Ice fuse this turn seats 4 Frostbites under the target", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [isenhowlWeathervaneRed, aetherIceveinYellow, weaveIceRed],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(isenhowlWeathervaneRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    // The next Ice fuse (Aether Icevein revealing the Ice card) triggers.
    Oldhim.play(aetherIceveinYellow, {
      fuse: true,
      fuseCards: [weaveIceRed],
      target: Dash.id,
    });
    // Dash (the damaged hero) declines the {r}{r} escape and discards nothing
    // from an empty hand.
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(16); // 20 - 4 arcane from the trigger play
    expectFabPlayer(Oldhim).toHaveTokenCount("frostbite", 4);
  });

  it("boundary: without a later Ice fuse no Frostbites are created", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [isenhowlWeathervaneRed, weaveIceRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(isenhowlWeathervaneRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Oldhim).toHaveTokenCount("frostbite", 0);
  });
});
