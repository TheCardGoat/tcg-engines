import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { evasiveLeapRed } from "./evasive-leap.ts";

describe("Evasive Leap family AAA", () => {
  it("is a 3{d} defense reaction", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [evasiveLeapRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    const Bravo = game.as(bravo);
    Bravo.play(evasiveLeapRed);
    game.passBoth();
    expectFabCard(Bravo, evasiveLeapRed).toHaveDefense(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("cannot be played outside the reaction step", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [evasiveLeapRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expectFabUnplayable(
      () => game.as(bravo).play(evasiveLeapRed),
      /not legal in the current reaction step/i,
    );
    expectFabCard(game.as(bravo), evasiveLeapRed).toBeIn("hand");
  });
});
