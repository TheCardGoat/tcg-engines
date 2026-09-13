import { describe, it } from "vitest";
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
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { monkeyPowderRed } from "./monkey-powder.ts";

/**
 * Monkey Powder (SEA102) — Ranger Action.
 *
 * Printed:
 *   Your next arrow attack this turn gets +1{p} and overpower.
 *   Draw a card.
 *   Go again
 */

describe("Monkey Powder (SEA102) AAA", () => {
  it("happy: draws, then the next arrow attack gets +1{p} and overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [monkeyPowderRed],
        arsenal: [searingShotRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(monkeyPowderRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Azalea, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.playAttack(searingShotRed, { from: "arsenal" });
    // Searing Shot base 4 + 1 = 5.
    expectCombat(game).toHaveAttackPower(5).toHaveKeyword("overpower");
  });

  it("boundary: a non-arrow attack does not get +1{p} or overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [monkeyPowderRed, snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(monkeyPowderRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    Azalea.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(4).notToHaveKeyword("overpower");
  });

  it("timing: go again refunds the play AP when the layer resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [monkeyPowderRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(monkeyPowderRed);
    expectFabPlayer(Azalea).toHaveAP(0);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Azalea).toHaveAP(1);
    expectFabCard(Azalea, monkeyPowderRed).toBeIn("graveyard");
  });
});
