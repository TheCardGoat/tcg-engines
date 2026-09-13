import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { snatchRed } from "./snatch.ts";
import { distantRumblingRed } from "./distant-rumbling.ts";

/**
 * Distant Rumbling Red (PEN023) — Guardian Action Aura.
 *
 * Printed: When this enters the arena, draw a card, then put a card from
 * your hand into your deck fifth from the top.
 */

describe("Distant Rumbling (PEN023) AAA", () => {
  it("happy: entering draws a card and sinks one back into the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [distantRumblingRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(distantRumblingRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: snatchRed.canonicalId });

    expectFabCard(Oldhim, distantRumblingRed).toBeIn("arena");
    // Net hand change: drew 1, put 1 back — hand count unchanged (2 held,
    // rumbling resolved away, drew 1, sank snatch).
    expectFabPlayer(Oldhim).toHaveHandCount(1);
    expect(Oldhim.zone("deck")).toContain(snatchRed.canonicalId);
  });
});
