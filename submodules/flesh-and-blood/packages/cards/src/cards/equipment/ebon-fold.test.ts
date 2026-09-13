import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { seepingShadowsYellow } from "../actions/seeping-shadows.ts";
import { snatchRed } from "../actions/snatch.ts";
import { ebonFold } from "./ebon-fold.ts";

/**
 * Ebon Fold (CHN004) — Shadow Head.
 *
 * Printed:
 *   Instant - {r}, destroy Ebon Fold: Banish a card from your hand. If it's a
 *   Shadow card, draw a card.
 */

describe("Ebon Fold (CHN004) AAA", () => {
  it("happy: destroy this, banish a Shadow card from hand, and draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [ebonFold],
        hand: [seepingShadowsYellow],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(ebonFold);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: seepingShadowsYellow.canonicalId });

    expectFabCard(Bravo, ebonFold).toBeIn("graveyard");
    expectFabCard(Bravo, seepingShadowsYellow).toBeBanished();
    expectFabPlayer(Bravo).toHaveHandCount(1);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: cannot activate without {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [ebonFold],
        hand: [],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(bravo).activate(ebonFold)).toThrow();
    expectFabCard(game.as(bravo), ebonFold).toBeIn("head");
  });

  it("timing: banishing a non-Shadow card does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [ebonFold],
        hand: [snatchRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(ebonFold);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: snatchRed.canonicalId });

    expectFabCard(Bravo, ebonFold).toBeIn("graveyard");
    expectFabCard(Bravo, snatchRed).toBeBanished();
    expectFabPlayer(Bravo).toHaveHandCount(0);
  });
});
