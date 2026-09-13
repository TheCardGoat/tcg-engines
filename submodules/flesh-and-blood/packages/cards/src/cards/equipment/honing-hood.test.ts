import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { endlessArrowRed } from "../actions/endless-arrow.ts";
import { laceWithFrailtyRed } from "../actions/lace-with-frailty.ts";
import { headShotRed } from "../actions/head-shot.ts";
import { honingHood } from "./honing-hood.ts";

/**
 * Honing Hood — Ranger Head d0.
 *
 * Printed: "Instant - Destroy this: Return all cards in your arsenal to your
 * hand, then put a card from your hand face down into your arsenal."
 */
describe("Honing Hood AAA", () => {
  it("happy: returns the whole arsenal to hand, then re-arsenals one card face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        life: 20,
        head: [honingHood],
        arsenal: [laceWithFrailtyRed, endlessArrowRed],
        hand: [headShotRed],
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
    );
    const Azalea = game.as(azalea);

    Azalea.activate(honingHood);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Azalea, honingHood).toBeIn("graveyard");
    // 1 held + 2 returned − 1 re-arsenaled = 2 in hand.
    expectFabPlayer(Azalea).toHaveHandCount(2);
    expect(Azalea.zone("arsenal")).toHaveLength(1);
    expectFabCard(Azalea, headShotRed).toBeFaceDown();
  });

  it("boundary: an empty arsenal still re-arms — the hood places one card face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        life: 20,
        head: [honingHood],
        arsenal: [],
        hand: [headShotRed],
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
    );
    const Azalea = game.as(azalea);

    Azalea.activate(honingHood);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Azalea).toHaveHandCount(0);
    expect(Azalea.zone("arsenal")).toHaveLength(1);
    expectFabCard(Azalea, headShotRed).toBeFaceDown();
  });
});
