import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { threeOfAKindRed } from "./three-of-a-kind.ts";

/**
 * Three of a Kind Red (ARC044) — Ranger Action.
 *
 * Printed:
 *   Draw 3 cards. Until end of turn, you may only play cards from arsenal.
 *   Go again
 *
 * Fragment verdicts:
 * - RESOLVED: "Draw 3 cards" + go again refund.
 * - RESOLVED: arsenal plays remain legal under the restriction.
 * - BLOCKED (plan §5 engine gap): "you may only play cards from arsenal" —
 *   the require-play playedFromZones rule-modification is not enforced by
 *   play legality, so hand plays still succeed. The boundary test pins that
 *   misbehavior.
 */

describe("Three of a Kind (ARC044) AAA", () => {
  it("happy: draws 3 cards and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [threeOfAKindRed],
        deckTop: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        deck: 3,
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(threeOfAKindRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabPlayer(Azalea).toHaveHandCount(3);
    expectFabPlayer(Azalea).toHaveAP(1);
    expectFabCard(Azalea, threeOfAKindRed).toBeIn("graveyard");
  });

  it("boundary: hand play is not locked out this turn (engine gap)", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [threeOfAKindRed],
        deckTop: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        deck: 3,
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(threeOfAKindRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    expectFabPlayer(Azalea).toHaveAP(1);

    // Misbehavior pin: the printed restriction should make this hand play
    // illegal, but play legality never consults the require-play
    // playedFromZones rule — the play resolves and the hand shrinks.
    Azalea.play(brutalAssaultBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    expectFabPlayer(Azalea).toHaveHandCount(2);
  });

  it("boundary: playing from arsenal remains legal under the restriction", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [threeOfAKindRed],
        arsenal: [brutalAssaultBlue],
        deckTop: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        deck: 3,
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(threeOfAKindRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    Azalea.attackWith(brutalAssaultBlue, { from: "arsenal" });

    // The arsenal play resolved into combat; the drawn hand cards stayed put.
    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Azalea).toHaveHandCount(3);
  });
});
