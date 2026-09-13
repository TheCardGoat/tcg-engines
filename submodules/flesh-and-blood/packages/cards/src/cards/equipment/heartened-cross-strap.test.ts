import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { heartenedCrossStrap } from "./heartened-cross-strap.ts";

describe("Heartened Cross Strap (KSU006) AAA", () => {
  it("happy: destroy this so the next attack action costs 2 less", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heartenedCrossStrap],
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(heartenedCrossStrap);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, heartenedCrossStrap).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.attackWith(brutalAssaultRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: without the strap a cost-2 attack is illegal at 0 resources", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(bravo).attackWith(brutalAssaultRed)).toThrow();
  });

  it("timing: go again refunds the action point spent to activate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heartenedCrossStrap],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(heartenedCrossStrap);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, heartenedCrossStrap).toBeIn("graveyard");
  });
});
