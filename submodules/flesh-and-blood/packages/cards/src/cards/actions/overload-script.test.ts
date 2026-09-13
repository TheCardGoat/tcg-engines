import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { overloadScriptRed } from "./overload-script.ts";

describe("Overload Script (EVO096) AAA", () => {
  it("happy: your Mechanologist attack action cards get overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: overloadScriptRed, state: { steamCounters: 1 } }],
        hand: [zeroToSixtyRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(zeroToSixtyRed, { stopAt: "defend" });

    expectCombat(game).toHaveKeyword("overpower");
  });

  it("boundary: a Generic attack action does not get overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: overloadScriptRed, state: { steamCounters: 1 } }],
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(brutalAssaultBlue, { stopAt: "defend" });

    expectCombat(game).notToHaveKeyword("overpower");
  });

  it("timing: start of your turn you may keep this by removing steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: overloadScriptRed, state: { steamCounters: 1 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, overloadScriptRed).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, overloadScriptRed).toBeIn("arena");
  });
});
