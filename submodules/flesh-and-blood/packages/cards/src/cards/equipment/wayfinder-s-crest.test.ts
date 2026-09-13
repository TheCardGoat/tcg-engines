import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { wayfinderSCrest } from "./wayfinder-s-crest.ts";

/**
 * Wayfinder's Crest — Ranger Head d1 Blade Break.
 *
 * Printed: When you defend with this, look at the top card of target hero's
 * deck. Blade Break.
 */

describe("Wayfinder's Crest AAA", () => {
  it("happy: defending looks at a deck top and Blade Breaks", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        head: [wayfinderSCrest],
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const topBefore = Dash.zone("deck").at(-1);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(wayfinderSCrest);
    game.untilIdle({ entityTargets: "pause" });
    Dash.target(Dash.cardIn("deck", snatchRed));
    game.untilIdle();

    expect(game.lastLookedCanonicalId()).toBe(snatchRed.canonicalId);
    expect(Dash.zone("deck").at(-1)).toBe(topBefore);
    expectFabCard(Dash, wayfinderSCrest).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: a hand block does not Blade Break the seated crest", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        head: [wayfinderSCrest],
        hand: [nimblismBlue],
        deck: [snatchRed, snatchRed, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Dash, wayfinderSCrest).toBeIn("head");
    expectFabPlayer(Dash).toHaveLife(18);
    expect(() => game.lastLookedCanonicalId()).toThrow(/No committed look/);
  });
});
