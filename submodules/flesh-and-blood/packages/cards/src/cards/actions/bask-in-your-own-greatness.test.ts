import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { snatchRed } from "./snatch.ts";
import { baskInYourOwnGreatnessRed } from "./bask-in-your-own-greatness.ts";

describe("Bask in Your Own Greatness family AAA", () => {
  it("happy: paying 2 resources creates 2 Might", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [baskInYourOwnGreatnessRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.playAttack(baskInYourOwnGreatnessRed, { stopAt: "on-attack" });
    Tuffnut.accept();
    Tuffnut.chooseNumeric(2);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Tuffnut).toHaveTokenCount("might", 2);
  });

  it("boundary: declining the pay creates 0 Might", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [baskInYourOwnGreatnessRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.playAttack(baskInYourOwnGreatnessRed, { stopAt: "on-attack" });
    Tuffnut.decline();
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Tuffnut).toHaveTokenCount("might", 0);
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: tuffnut, hand: [baskInYourOwnGreatnessRed], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    game.as(dash).playAttack(snatchRed);
    game.toReaction();
    expect(() => game.as(tuffnut).play(baskInYourOwnGreatnessRed)).toThrow();
    expectFabCard(game.as(tuffnut), baskInYourOwnGreatnessRed).toBeIn("hand");
  });
});
