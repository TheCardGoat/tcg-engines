import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { surgingMilitiaRed } from "./surging-militia.ts";

describe("Surging Militia (MON287) AAA", () => {
  it("happy: +1{p} for one non-equipment defender", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [surgingMilitiaRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(dash).play(surgingMilitiaRed);
    game.passBoth();
    game.advanceCombatTo("defend");
    game.as(azalea).defendWith(nimblismBlue);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: no defenders leaves printed 5{p}; equipment does not count", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [surgingMilitiaRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], chest: [ironrotPlate], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(dash).play(surgingMilitiaRed);
    game.passBoth();
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
    game.as(azalea).defendWith(ironrotPlate);
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: a second non-equipment defender adds another +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [surgingMilitiaRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [nimblismBlue, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(dash).play(surgingMilitiaRed);
    game.passBoth();
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
    game.as(azalea).defendWith([nimblismBlue, snatchRed]);
    expectCombat(game).toHaveAttackPower(7);
  });
});
