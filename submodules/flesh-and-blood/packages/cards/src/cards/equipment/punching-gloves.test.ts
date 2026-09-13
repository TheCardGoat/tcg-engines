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
import { punchingGloves } from "./punching-gloves.ts";

describe("Punching Gloves (SUP213) AAA", () => {
  it("happy: pay {r}{r} and destroy this so the next attack card gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [punchingGloves],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(punchingGloves);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, punchingGloves).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(1);
    expectFabPlayer(Dash).toHaveResourceCount(0);

    Dash.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: without activating, Snatch stays at printed 4", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [punchingGloves],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Dash, punchingGloves).toBeIn("arms");
  });

  it("timing: go again refunds the Action AP", () => {
    const game = FabTestEngine.start(
      { hero: dash, arms: [punchingGloves], resourcePoints: 2, actionPoints: 1, hand: [], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(punchingGloves);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveAP(1);
    expectFabCard(Dash, punchingGloves).toBeIn("graveyard");
  });
});
