import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { sinkerBlue } from "./sinker.ts";

/**
 * Sinker (SEA105) — Ranger Action.
 *
 * Printed:
 *   Look at the top card of your deck. If it's an arrow, you may put it
 *   face-up into your arsenal. If you do, it gets overpower this turn.
 *   Go again
 */

describe("Sinker (SEA105) AAA", () => {
  it("happy: the arsenal'd arrow gets overpower this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [sinkerBlue],
        actionPoints: 1,
        deck: 6,
        deckTop: [searingShotRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(sinkerBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.playAttack(searingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(4).toHaveKeyword("overpower");
  });

  it("boundary: a non-arrow on top stays in the deck and does not grant overpower later", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [sinkerBlue],
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchRed],
        arsenal: [searingShotRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(sinkerBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expect(Azalea.cardsIn("deck", snatchRed)).toHaveLength(1);
    Azalea.playAttack(searingShotRed, { from: "arsenal" });
    expectCombat(game).notToHaveKeyword("overpower");
  });

  it("timing: go again refunds the play AP even when the top card is not an arrow", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [sinkerBlue],
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(sinkerBlue);
    expectFabPlayer(Azalea).toHaveAP(0);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabPlayer(Azalea).toHaveAP(1);
    expectFabCard(Azalea, sinkerBlue).toBeIn("graveyard");
  });
});
