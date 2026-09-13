import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { readTheRunesYellow } from "./read-the-runes.ts";
import { becomeTheArknightBlue } from "./become-the-arknight.ts";

/**
 * Become the Arknight Blue (ARC083) — Viserai Specialization, Runeblade Action.
 *
 * Printed:
 *   You may discard an action card. If you discard an attack action card
 *   this way, search your deck for a Runeblade non-attack action card,
 *   reveal it, and put it into your hand. If you discard a non-attack
 *   action card this way, search your deck for a Runeblade attack action
 *   card, reveal it, and put it into your hand. Shuffle. Go again
 *
 * Fragment verdicts:
 * - RESOLVED: both "If you discard ... this way" conditionals count the
 *   discarded-this-way cohort by type box (compare-amount); the happy path
 *   proves the attack-action branch searches a Runeblade non-attack action.
 * - RESOLVED: declining the optional (no discard, no search, go again).
 */

describe("Become the Arknight (ARC083) AAA", () => {
  it("happy: discarding an attack action searches a Runeblade non-attack action into hand", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [becomeTheArknightBlue, brutalAssaultBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
        deckTop: [readTheRunesYellow],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(becomeTheArknightBlue);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: brutalAssaultBlue.canonicalId,
    });

    // The attack-action discard branch searched the Runeblade non-attack
    // action into hand; the discard itself went to the graveyard.
    expectFabCard(Viserai, brutalAssaultBlue).toBeIn("graveyard");
    expectFabCard(Viserai, readTheRunesYellow).toBeIn("hand");
  });

  it("boundary: declining the optional discards nothing and searches nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [becomeTheArknightBlue, brutalAssaultBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(becomeTheArknightBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabPlayer(Viserai).toHaveHandCount(1);
    expectFabCard(Viserai, brutalAssaultBlue).toBeIn("hand");
    expectFabCard(Viserai, becomeTheArknightBlue).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveAP(1);
    expect(Viserai.zone("deck")).toHaveLength(6);
  });
});
