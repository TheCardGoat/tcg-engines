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
import { quicksilverDagger } from "../weapons/quicksilver-dagger.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { stonewallGauntlet } from "./stonewall-gauntlet.ts";

describe("Stonewall Gauntlet (MST190) AAA", () => {
  it("happy: defending an attack with {p} greater than its base gives opposing attacks −1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimblismBlue, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, arms: [stonewallGauntlet], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
    Bravo.defendWith(stonewallGauntlet);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveUntilIdle();

    // Buffed Snatch 5 − 1{p} − d1 = 3 damage.
    expectFabPlayer(Bravo).toHaveLife(17);
    expectFabCard(Bravo, stonewallGauntlet).toBeIn("graveyard");
  });

  it("boundary: a 1-power weapon at its printed base does not get −1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [quicksilverDagger],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, arms: [stonewallGauntlet], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.activate(quicksilverDagger);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(1);
    Bravo.defendWith(stonewallGauntlet);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(1);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: the −1{p} lasts this combat chain only", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimblismBlue, snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, arms: [stonewallGauntlet], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(stonewallGauntlet);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveLife(17);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    Bravo.defendWith();
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveLife(13);
  });
});
