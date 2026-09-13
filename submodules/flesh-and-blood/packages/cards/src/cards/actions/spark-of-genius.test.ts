import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { sparkOfGeniusYellow } from "./spark-of-genius.ts";

/**
 * Spark of Genius (ARC009) — Dash Specialization, Mechanologist Action (yellow).
 *
 * Printed:
 *   Search your deck for a Mechanologist item card with cost X, put it into
 *   the arena, then shuffle your deck.
 *   If you have boosted this turn, draw a card.
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.1.3a (variable cost including X is declared when playing
 *     the card; card-text references to X read that declared value), CR 1.12.2
 *     (declaration process), CR 8.3 (Boost — boosted-this-turn status).
 *   behaviorConstraints:
 *     - The card's resource cost is the declared X (catalog cost is X-only).
 *     - "cost X" without a qualifier is EXACT equality: the searched card must
 *       be a Mechanologist item whose printed cost equals the declared X.
 *     - The found item is put into the arena (not the hand), then the deck is
 *       shuffled.
 *     - The draw clause is an independent conditional resolution gated on
 *       boosted-this-turn.
 *   MODULE DEFECT RESOLVED (plan §5, W3-FIX3 2026-08-18): the authored search
 *     filter was the literal placeholder name "Mechanologist Item Card With
 *     Cost X" (exact-match, never matches any card). Re-shaped to a real
 *     typeBox (Mechanologist + Item) plus cost eq { type: "x" } bound to the
 *     declared X (CR 5.1.3a) via the play-cost x binding.
 *   testImplications:
 *     - X=1 with Hyper Driver Red (Mechanologist Item, cost 1) in deck: the
 *       search offers exactly the driver and seats it in the arena.
 *     - X=2 with only cost-1 Mechanologist items (plus a cost-2 Generic attack
 *       action that is not an item): nothing is offered (mayFail), the
 *       resolution still completes.
 *     - After a boost this turn, the play draws 1; without a boost it draws 0.
 */

describe("Spark of Genius (ARC009) AAA", () => {
  it("happy: declared X=1 searches a cost-1 Mechanologist item into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [sparkOfGeniusYellow],
        deck: [
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          hyperDriverRed,
        ],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(sparkOfGeniusYellow, { xValue: 1 });
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: hyperDriverRed.canonicalId });

    // The driver was searched out of the deck and seated in the arena.
    expectFabCard(Dash, hyperDriverRed).toBeIn("arena");
    expectFabCard(Dash, sparkOfGeniusYellow).toBeIn("graveyard");
    expect(Dash.zone("deck")).toHaveLength(5);
    // No boost this turn: the conditional draw clause did not fire.
    expectFabPlayer(Dash).toHaveHandCount(0);
  });

  it("boundary: X=2 finds nothing when no Mechanologist item costs 2", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [sparkOfGeniusYellow],
        deck: [
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          hyperDriverRed,
        ],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    // brutalAssaultBlue costs 2 but is a Generic attack action, not a
    // Mechanologist item — only the cost-1 driver is an item, so X=2 matches
    // nothing and the mayFail search no-ops without aborting the resolution.
    Dash.play(sparkOfGeniusYellow, { xValue: 2 });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Dash.zone("arena")).toHaveLength(0);
    expectFabCard(Dash, sparkOfGeniusYellow).toBeIn("graveyard");
    expect(Dash.zone("deck")).toHaveLength(6);
    expectFabPlayer(Dash).toHaveHandCount(0);
  });

  it("timing: boosted this turn, the search resolves and draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [sparkOfGeniusYellow, zeroToSixtyRed],
        deck: [
          brutalAssaultBlue,
          hyperDriverRed,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
        ],
        resourcePoints: 1,
        actionPoints: 2,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    // Boost with Zero to Sixty first: the banish-top-of-deck additional cost
    // stamps boosted-this-turn (CR 8.3).
    Dash.attackWith(zeroToSixtyRed, { boost: true });
    game.helpers.resolveRestOfCombat();

    Dash.play(sparkOfGeniusYellow, { xValue: 1 });
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: hyperDriverRed.canonicalId });

    expectFabCard(Dash, hyperDriverRed).toBeIn("arena");
    // "If you have boosted this turn, draw a card" — exactly one drawn card.
    expectFabPlayer(Dash).toHaveHandCount(1);
  });
});
