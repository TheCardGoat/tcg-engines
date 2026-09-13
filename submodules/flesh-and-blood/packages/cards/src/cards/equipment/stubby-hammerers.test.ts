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
import { snatchRed } from "../actions/snatch.ts";
import { woundingBlowYellow } from "../actions/wounding-blow.ts";
import { stubbyHammerers } from "./stubby-hammerers.ts";

describe("Stubby Hammerers (MON239) AAA", () => {
  it("happy: destroy this so a base-3 attack action gets +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [stubbyHammerers],
        hand: [woundingBlowYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(stubbyHammerers);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, stubbyHammerers).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.attackWith(woundingBlowYellow);
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: a base-4 attack action is not buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [stubbyHammerers],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(stubbyHammerers);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: a second qualifying attack this turn also gets +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [stubbyHammerers],
        hand: [woundingBlowYellow, woundingBlowYellow],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(stubbyHammerers);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(woundingBlowYellow);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(36);

    Bravo.attackWith(woundingBlowYellow);
    expectCombat(game).toHaveAttackPower(4);
  });
});
