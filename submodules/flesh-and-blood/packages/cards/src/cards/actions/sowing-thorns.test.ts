import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { snatchRed } from "./snatch.ts";
import { sowingThornsRed } from "./sowing-thorns.ts";

/**
 * Sowing of Thorns Red (PEN214) — Earth Wizard Action.
 *
 * Printed: Gain 1{h}
 * Decompose - You may banish 2 Earth cards and an action card from your
 * graveyard. If you do, you may search your deck for an Earth aura with
 * cost less than the {h} you've gained this turn...
 */

describe("Sowing of Thorns (PEN214) AAA", () => {
  it("happy: gains 1{h}; declining Decompose leaves the graveyard intact", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [sowingThornsRed],
        graveyard: [autumnSTouchBlue, autumnSTouchBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(sowingThornsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Oldhim).toHaveLife(21); // 20 + 1
    expectFabCard(Oldhim, sowingThornsRed).toBeIn("graveyard");
    expect(Oldhim.zone("banished")).toHaveLength(0);
  });
});
