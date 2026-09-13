import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue, searingShotRed } from "../shared/test-recipients.ts";
import { silverTheTipRed } from "./silver-the-tip.ts";

/**
 * Silver the Tip Red (ARC051) — Ranger Action.
 *
 * Printed:
 *   If you have no cards in your arsenal, look at the top 4 cards of your
 *   deck. You may put an arrow card from among them face up into your
 *   arsenal, then put the rest on the bottom of your deck in any order.
 *   Go again
 *
 * The optional choice is restricted to one Arrow and the remaining looked
 * cards are put on the bottom of the deck.
 */

const DECK = [
  brutalAssaultBlue,
  brutalAssaultBlue,
  brutalAssaultBlue,
  searingShotRed,
  brutalAssaultBlue,
  brutalAssaultBlue,
] as const;

describe("Silver the Tip (ARC051) AAA", () => {
  it("happy: puts one chosen arrow face up into arsenal and bottoms the rest", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [silverTheTipRed],
        deck: [...DECK],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(silverTheTipRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: searingShotRed.canonicalId,
    });

    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");
    expect(Azalea.zone("arsenal")).toHaveLength(1);
    expect(Azalea.zone("deck")).toHaveLength(5);
    expectFabPlayer(Azalea).toHaveAP(1);
    expectFabCard(Azalea, silverTheTipRed).toBeIn("graveyard");
  });

  it("boundary: a non-empty arsenal turns the whole ability off", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [silverTheTipRed],
        arsenal: [brutalAssaultBlue],
        deck: [...DECK],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(silverTheTipRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    // Nothing was looked at or moved: deck intact, arsenal untouched.
    expect(Azalea.zone("deck")).toHaveLength(6);
    expectFabCard(Azalea, brutalAssaultBlue).toBeIn("arsenal");
    expectFabCard(Azalea, silverTheTipRed).toBeIn("graveyard");
  });

  it("boundary: declining the optional leaves the arsenal empty and bottoms all 4", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [silverTheTipRed],
        deck: [...DECK],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(silverTheTipRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Azalea.zone("arsenal")).toHaveLength(0);
    expect(Azalea.zone("deck")).toHaveLength(6);
  });
});
