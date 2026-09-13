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
import { nockTheDeathwhistleBlue } from "./nock-the-deathwhistle.ts";

/**
 * Nock the Deathwhistle Blue (ARC046) — Azalea Specialization, Ranger Action.
 *
 * Printed:
 *   Search your deck for an arrow card, reveal it, then shuffle your deck
 *   and put it on top of your deck.
 *   Reload. Go again
 *
 * Fragment verdicts:
 * - Search-to-deck-top shuffles the remainder then puts the arrow on top
 *   (CR 8.5.19 / 8.5.20).
 * - Empty-deck-of-arrows boundary (search mayFail).
 * - Reload keyword accept (arrow from hand into arsenal).
 */

describe("Nock the Deathwhistle (ARC046) AAA", () => {
  it("happy: searching an arrow shuffles the rest and puts it on top", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [nockTheDeathwhistleBlue],
        deck: [
          brutalAssaultBlue,
          searingShotRed,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
        ],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(nockTheDeathwhistleBlue);
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargetCanonicalId: searingShotRed.canonicalId,
    });

    expect(Azalea.zone("deck").at(-1)).toBe(searingShotRed.canonicalId);
    expectFabCard(Azalea, nockTheDeathwhistleBlue).toBeIn("graveyard");
  });

  it("boundary: a deck with no arrows searches nothing and still resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [nockTheDeathwhistleBlue],
        deck: [
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
        ],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(nockTheDeathwhistleBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Azalea.zone("deck")).toHaveLength(6);
    expectFabCard(Azalea, nockTheDeathwhistleBlue).toBeIn("graveyard");
  });

  it("boundary: Reload accepts to load an arrow from hand into the arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [nockTheDeathwhistleBlue, searingShotRed],
        deck: [
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
        ],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(nockTheDeathwhistleBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");
    expectFabPlayer(Azalea).toHaveHandCount(0);
  });
});
