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
import { meteoricRiseRed } from "./meteoric-rise.ts";

describe("Meteoric Rise (OMN153) AAA", () => {
  it("happy: a hit creates a Lightning Flow token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [meteoricRiseRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(meteoricRiseRed);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabPlayer(Bravo).toHaveTokenCount("lightning-flow", 1);
  });

  it("boundary: a miss does not create Lightning Flow", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [meteoricRiseRed],
        resourcePoints: 1,
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

    Bravo.playAttack(meteoricRiseRed);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveTokenCount("lightning-flow", 0);
  });
});
