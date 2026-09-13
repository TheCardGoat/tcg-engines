import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { snatchRed } from "./snatch.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { fenderBenderRed } from "./fender-bender.ts";
import { polarityReversalScriptRed } from "./polarity-reversal-script.ts";

describe("Polarity Reversal Script (EVO078) AAA", () => {
  it("happy: action cards defending your Mechanologist AAC get -1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: polarityReversalScriptRed, state: { steamCounters: 1 } }],
        hand: [fenderBenderRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(fenderBenderRed, { stopAt: "defend" });
    game.as(bravo).defendWith(brutalAssaultBlue);
    game.closeCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(18);
  });

  it("boundary: defending a non-Mechanologist attack is not reduced", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: polarityReversalScriptRed, state: { steamCounters: 1 } }],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(teklovossen).playAttack(snatchRed, { stopAt: "defend" });
    game.as(bravo).defendWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: start of your turn you may keep this by removing steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: polarityReversalScriptRed, state: { steamCounters: 1 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, polarityReversalScriptRed).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, polarityReversalScriptRed).toBeIn("arena");
  });
});
