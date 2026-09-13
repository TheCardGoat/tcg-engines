import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { smashingGroundBlue } from "./smashing-ground.ts";

describe("Smashing Ground (SUP132) AAA", () => {
  it("boundary: at printed 5{p} a hit does not destroy arsenal", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [smashingGroundBlue], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);
    Rhinar.playAttack(smashingGroundBlue);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("happy: when this has 6 or more {p}, a hit destroys arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [smashingGroundBlue, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);
    Rhinar.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Rhinar.playAttack(smashingGroundBlue);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Dash, snatchRed).toBeIn("arsenal");
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [smashingGroundBlue], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Rhinar.defendWith([smashingGroundBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Rhinar).toHaveLife(19);
  });
});
