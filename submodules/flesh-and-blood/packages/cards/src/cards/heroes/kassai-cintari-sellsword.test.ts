import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { kassaiCintariSellsword } from "./kassai-cintari-sellsword.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { hotStreak } from "../weapons/hot-streak.ts";

/**
 * Kassai, Cintari Sellsword (CRU077 / 1HP140) — Young Warrior Hero.
 *
 * Printed: "Your second sword attack each turn costs {r} less to activate.
 * At the beginning of your end phase, if you've attacked 2 or more times with
 * weapons this turn, create a Copper token for each weapon attack that hit."
 *
 * Second-sword discount is Heart of Bladehold `modify-activation-cost`
 * `events:["activate"]` `ordinal:2`. Copper is `weapon-attacks-this-turn` ≥ 2
 * then `weapon-attacks-that-hit-this-turn`.
 */

describe("Kassai, Cintari Sellsword (CRU077) AAA", () => {
  it("happy: the second sword is {r} less, and two hits mint two Copper at end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiCintariSellsword,
        weapon1: [cintariSaber],
        weapon2: [hotStreak],
        hand: [],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiCintariSellsword);

    Kassai.activate(cintariSaber);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Kassai).toHaveResourceCount(1);

    Kassai.activate(hotStreak);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Kassai).toHaveResourceCount(1);
    expectFabPlayer(game.as(dash)).toHaveLife(16);

    Kassai.endTurn();
    game.untilIdle({ ordering: "listed" });
    expectFabPlayer(Kassai).toHaveTokenCount("copper", 2);
  });

  it("boundary: the first sword attack still costs its printed {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiCintariSellsword,
        weapon1: [cintariSaber],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiCintariSellsword);

    Kassai.expectActivationRejected(cintariSaber);
    expectCombat(game).toBeClosed();
  });

  it("timing: one hitting weapon attack does not mint Copper", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiCintariSellsword,
        weapon1: [cintariSaber],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiCintariSellsword);

    Kassai.activate(cintariSaber);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(dash)).toHaveLife(18);
    Kassai.endTurn();
    game.untilIdle({ ordering: "listed" });
    expectFabPlayer(Kassai).toHaveTokenCount("copper", 0);
  });
});
