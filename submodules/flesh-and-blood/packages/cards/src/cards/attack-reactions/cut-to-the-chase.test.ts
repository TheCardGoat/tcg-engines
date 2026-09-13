import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { snatchRed } from "../actions/snatch.ts";
import { leaveNoWitnessesRed } from "../actions/leave-no-witnesses.ts";
import { cutToTheChaseRed } from "./cut-to-the-chase.ts";

describe("Cut to the Chase (DYN148) AAA", () => {
  it("happy: target Assassin contract attack gains +3", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [leaveNoWitnessesRed, cutToTheChaseRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.attackWith(leaveNoWitnessesRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(cutToTheChaseRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: cannot target a non-contract attack", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [snatchRed, cutToTheChaseRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    expect(() => Arakni.must.playReaction(cutToTheChaseRed)).toThrow();
    expectFabCard(Arakni, cutToTheChaseRed).toBeIn("hand");
  });

  it("timing: the +3 is on the chain before damage", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [leaveNoWitnessesRed, cutToTheChaseRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.attackWith(leaveNoWitnessesRed);
    expectCombat(game).toHaveAttackPower(4);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(cutToTheChaseRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(7);
  });
});
