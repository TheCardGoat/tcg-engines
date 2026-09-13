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
import { stonyWoottonhogRed } from "./stony-woottonhog.ts";

describe("Stony Woottonhog (MON284) AAA", () => {
  it("happy: fewer than 2 non-equipment defenders grants +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [stonyWoottonhogRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(dash).play(stonyWoottonhogRed);
    game.passBoth();
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: 2 non-equipment defenders do not grant +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [stonyWoottonhogRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [nimblismBlue, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(dash).play(stonyWoottonhogRed);
    game.passBoth();
    game.advanceCombatTo("defend");
    game.as(azalea).defendWith([nimblismBlue, snatchRed]);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: the +1{p} expires when a second non-equipment defender is added", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [stonyWoottonhogRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [nimblismBlue, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(dash).play(stonyWoottonhogRed);
    game.passBoth();
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
    game.as(azalea).defendWith([nimblismBlue, snatchRed]);
    expectCombat(game).toHaveAttackPower(6);
  });
});
