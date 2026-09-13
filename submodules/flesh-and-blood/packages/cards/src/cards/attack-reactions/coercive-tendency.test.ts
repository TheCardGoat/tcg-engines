import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { malignRed } from "../actions/malign.ts";
import { snatchRed } from "../actions/snatch.ts";
import { snatchYellow } from "../actions/snatch.ts";
import { snatchBlue } from "../actions/snatch.ts";
import { coerciveTendencyBlue } from "./coercive-tendency.ts";

/**
 * Coercive Tendency Blue (HVY246) — Assassin Attack Reaction (Arakni specialization).
 *
 * Printed: Look at the top 3 cards of the defending hero's deck. Put them back
 * in any order, then banish the top card of their deck.
 * If you complete a contract this way, your Assassin attacks get go again this
 * combat chain.
 */

describe("Coercive Tendency (HVY246) AAA", () => {
  it("banishing a red card this way completes the contract and grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [malignRed, coerciveTendencyBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: [snatchBlue, snatchYellow, snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(coerciveTendencyBlue);
    game.passBoth();
    Arakni.choosePartition();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Arakni, coerciveTendencyBlue).toBeIn("graveyard");
    expect(Dash.zone("deck")).toHaveLength(2);
  });

  it("boundary: banishing a non-red card does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [malignRed, coerciveTendencyBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: [snatchRed, snatchYellow, snatchBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(coerciveTendencyBlue);
    game.passBoth();
    Arakni.choosePartition();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Arakni, coerciveTendencyBlue).toBeIn("graveyard");
    expect(Dash.zone("deck")).toHaveLength(2);
  });

  it("timing: cannot play Coercive Tendency outside the reaction step", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [coerciveTendencyBlue], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabUnplayable(
      () => game.as(arakni).play(coerciveTendencyBlue),
      /not legal in the current reaction step/,
    );
    expectFabCard(game.as(arakni), coerciveTendencyBlue).toBeIn("hand");
  });
});
