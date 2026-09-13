import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { quantumProcessorYellow } from "./quantum-processor.ts";
import { fastAndFuriousRed } from "./fast-and-furious.ts";

/**
 * Fast and Furious (AIO009) — Mechanologist Action Attack, 3{p}/3{d}.
 *
 * Printed: Boost
 * If you've cranked this turn, this gets +1{p}.
 * When this is banished from boosting, put a steam counter on an item you
 * control with crank.
 */

describe("Fast and Furious (AIO009) AAA", () => {
  it("happy: boosting banishes the Mechanologist deck-top and refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fastAndFuriousRed],
        actionPoints: 1,
        deck: 6,
        deckTop: [quantumProcessorYellow],
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(fastAndFuriousRed, { boost: true });
    game.closeCombat({ ordering: "listed" });

    expect(Dash.zone("banished")).toContain(quantumProcessorYellow.canonicalId);
    expectFabPlayer(Dash).toHaveAP(1);
    expectFabPlayer(game.as(bravo)).toHaveLife(17);
  });

  it("boundary: without boost, the deck-top stays and AP is spent", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fastAndFuriousRed],
        actionPoints: 1,
        deck: 6,
        deckTop: [quantumProcessorYellow],
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(fastAndFuriousRed, { boost: false });
    game.closeCombat();

    expect(Dash.zone("deck")).toContain(quantumProcessorYellow.canonicalId);
    expectFabPlayer(Dash).toHaveAP(0);
  });

  it("timing: unboosted printed 3{p} hits for 3 without a crank this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fastAndFuriousRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).playAttack(fastAndFuriousRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(17);
  });
});
