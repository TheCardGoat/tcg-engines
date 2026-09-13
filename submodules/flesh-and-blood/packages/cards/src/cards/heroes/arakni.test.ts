import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { snatchYellow } from "../actions/snatch.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { leaveNoWitnessesRed } from "../actions/leave-no-witnesses.ts";
import { arakni } from "./arakni.ts";

/**
 * Arakni (DYN114) — Assassin Hero Young.
 *
 * Printed: Whenever you play a card with contract, you may look at the top
 * card of target opponent's deck. You may put it on the bottom.
 */

describe("Arakni (DYN114) AAA", () => {
  it("happy: playing a contract card can put the opponent's deck-top on the bottom", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [leaveNoWitnessesRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: [brutalAssaultBlue, snatchYellow, snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(leaveNoWitnessesRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expect(Dash.zone("deck")[0]).toBe(snatchRed.canonicalId);
  });

  it("boundary: playing a non-contract card does not look at the opposing deck", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: [brutalAssaultBlue, snatchYellow, snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.must.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("deck").at(-1)).toBe(snatchRed.canonicalId);
    expect(Dash.zone("deck")[0]).toBe(brutalAssaultBlue.canonicalId);
  });

  it("timing: the look fires on playing the contract, before combat damage", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [leaveNoWitnessesRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: [brutalAssaultBlue, snatchYellow, snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);
    const instanceId = Arakni.findCardInZone("hand", leaveNoWitnessesRed);

    game.playInstance(Arakni.id, instanceId, {}, "explicit");
    game.passBoth();
    expectWait(game).toHaveDecision("boolean");
    Arakni.accept();
    expectWait(game).toHaveDecision("boolean");
    Arakni.accept();

    expect(Dash.zone("deck")[0]).toBe(snatchRed.canonicalId);
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
