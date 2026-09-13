import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { volticImpactRed } from "./voltic-impact.ts";

describe("Voltic Impact (OMN154) AAA", () => {
  it("happy: a hit creates a Lightning Flow token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [volticImpactRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(volticImpactRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabPlayer(Bravo).toHaveTokenCount("lightning-flow", 1);
  });

  it("boundary: a miss does not create Lightning Flow", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [volticImpactRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(volticImpactRed);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveTokenCount("lightning-flow", 0);
  });
});
