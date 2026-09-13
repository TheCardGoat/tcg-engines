import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { enlightenedStrikeRed } from "./enlightened-strike.ts";

/**
 * Enlightened Strike Red (WTR159) — Generic Action Attack.
 *
 * Printed additional cost: put a card from hand on bottom of deck.
 * Choose 1: on-attack draw / +2{p} / go again.
 *
 * Note: DEFAULT_HAND includes a slim Enlightened Strike — always seat the
 * opponent with an explicit `hand: []` so collectDefs does not overwrite the
 * full module definition.
 */

describe("Enlightened Strike (WTR159) AAA", () => {
  it("happy: additional bottom-deck + +2{p} mode attacks for 7", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [enlightenedStrikeRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      // Explicit empty hand — DEFAULT_HAND contains slim Enlightened Strike.
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    // play accepts modal modeIndexes; attackWith's attack-flow options exclude them.
    Bravo.play(enlightenedStrikeRed, { modeIndexes: [1] });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(7);
    // Move-to-deck bottom cost consumed the extra hand card.
    expect(Bravo.zone("hand")).not.toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("hand")).toHaveLength(0);
  });

  it("boundary: no extra hand card cannot pay the move-to-deck additional cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [enlightenedStrikeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.play(enlightenedStrikeRed, { modeIndexes: [1] })).toThrow();
    expectFabCard(Bravo, enlightenedStrikeRed).toBeIn("hand");
  });

  it("timing: go-again mode refunds the action point after the attack resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [enlightenedStrikeRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    // modeIndexes: go again is mode index 2.
    Bravo.play(enlightenedStrikeRed, { modeIndexes: [2] });
    game.passBoth();
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });
});
