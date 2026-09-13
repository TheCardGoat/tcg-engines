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
import { nimblismBlue } from "./nimblism.ts";
import { bullyTacticsRed } from "./bully-tactics.ts";

describe("Bully Tactics (SUP081) AAA", () => {
  it("happy: paying 1 resource intimidates once", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [bullyTacticsRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.playAttack(bullyTacticsRed, { stopAt: "on-attack" });
    Tuffnut.accept();
    Tuffnut.chooseNumeric(1);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveHandCount(0);
  });

  it("boundary: declining the pay intimidates 0 times", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [bullyTacticsRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.playAttack(bullyTacticsRed, { stopAt: "on-attack" });
    Tuffnut.decline();
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveHandCount(1);
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: tuffnut, hand: [bullyTacticsRed], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    game.as(dash).playAttack(snatchRed);
    game.toReaction();
    expect(() => game.as(tuffnut).play(bullyTacticsRed)).toThrow();
    expectFabCard(game.as(tuffnut), bullyTacticsRed).toBeIn("hand");
  });
});
