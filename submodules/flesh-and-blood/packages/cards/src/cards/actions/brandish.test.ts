import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";

import { nimblismBlue } from "./nimblism.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { brandishRed } from "./brandish.ts";

describe("Brandish family AAA", () => {
  it("happy: a hit buffs the next weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brandishRed],
        weapon1: [cintariSaber],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.playAttack(brandishRed);
    game.closeCombat();
    Dash.activate(cintariSaber);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(3);
  });
  it("boundary: a miss does not buff the weapon", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brandishRed],
        weapon1: [cintariSaber],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.playAttack(brandishRed);
    game.as(bravo).defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat();
    Dash.activate(cintariSaber);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(2);
  });
  it("timing: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brandishRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(dash).playAttack(brandishRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(game.as(dash)).toHaveAP(1);
  });
});
