import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { snatchYellow } from "../actions/snatch.ts";
import { leaveNoWitnessesRed } from "../actions/leave-no-witnesses.ts";
import { arakniHuntsman } from "./arakni-huntsman.ts";

/**
 * Arakni, Huntsman (DYN113) — Assassin Hero.
 *
 * Printed: Whenever you play a card with contract, you may look at the top card
 * of target opponent's deck. You may put it on the bottom.
 */

describe("Arakni, Huntsman (DYN113) AAA", () => {
  it("happy: playing a contract card can put the opponent's deck-top on the bottom", () => {
    const game = FabTestEngine.start(
      { hero: arakniHuntsman, hand: [leaveNoWitnessesRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: [snatchYellow, snatchYellow, snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniHuntsman);
    const Dash = game.as(dash);

    Arakni.play(leaveNoWitnessesRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expect(Dash.zone("deck")[Dash.zone("deck").length - 1]).toBe(snatchYellow.canonicalId);
  });

  it("boundary: playing a non-contract card does not look at the opposing deck", () => {
    const game = FabTestEngine.start(
      { hero: arakniHuntsman, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: [snatchYellow, snatchYellow, snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniHuntsman);
    const Dash = game.as(dash);

    Arakni.must.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("deck")[Dash.zone("deck").length - 1]).toBe(snatchRed.canonicalId);
  });

  it("timing: the Adult hero starts at 40 life", () => {
    const game = FabTestEngine.start({ hero: arakniHuntsman, deck: 6 }, { hero: dash, deck: 6 });

    expectFabPlayer(game.as(arakniHuntsman)).toHaveLife(40);
  });
});
