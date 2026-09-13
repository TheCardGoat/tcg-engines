import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { dustRunnerOutlawRed } from "../actions/dust-runner-outlaw.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bloodOfTheDracaiRed } from "./blood-of-the-dracai.ts";

/**
 * Blood of the Dracai (UPR000) — Draconic Resource Gem.
 * Printed: Legendary. When you pitch this, the next 3 Draconic cards you play
 * this turn cost {r} less.
 */

describe("Blood of the Dracai (UPR000) AAA", () => {
  it("happy: pitching this discounts the next Draconic play by {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bloodOfTheDracaiRed, dustRunnerOutlawRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.pitch(bloodOfTheDracaiRed).playAttack(dustRunnerOutlawRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: pitching this does not discount a non-Draconic play", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bloodOfTheDracaiRed, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.pitch(bloodOfTheDracaiRed).playAttack(snatchRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("timing: the discount is this-turn — a later turn Draconic play still costs {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bloodOfTheDracaiRed, dustRunnerOutlawRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.pitch(bloodOfTheDracaiRed).playAttack(dustRunnerOutlawRed);
    game.closeCombat();
    Bravo.endTurn();
    game.as(dash).endTurn();

    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
