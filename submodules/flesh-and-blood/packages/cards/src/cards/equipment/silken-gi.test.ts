import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { silkenGi } from "./silken-gi.ts";

describe("Silken Gi (BEN004) AAA", () => {
  it("happy: next attack action costs 1 less and has -1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [silkenGi],
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(silkenGi);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, silkenGi).toBeIn("graveyard");

    Bravo.attackWith(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(5);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: without the gi a cost-2 attack is illegal at 1 resource", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(bravo).attackWith(brutalAssaultRed)).toThrow();
  });

  it("timing: only the next attack action this turn gets the discount", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [silkenGi],
        hand: [brutalAssaultRed, brutalAssaultRed],
        actionPoints: 2,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(silkenGi);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(brutalAssaultRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveResourceCount(2);

    Bravo.attackWith(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(6);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });
});
