import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { snatchRed } from "./snatch.ts";
import { adrenalineRushRed } from "./adrenaline-rush.ts";

describe("Adrenaline Rush family AAA", () => {
  it("happy: being behind on life grants +3 power", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [adrenalineRushRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 15,
        deck: 6,
      },
      { hero: azalea, life: 20, deck: 6 },
    );
    game.as(dash).playAttack(adrenalineRushRed);
    expectCombat(game).toHaveAttackPower(7);
  });
  it("boundary: equal life does not grant the buff", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [adrenalineRushRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: azalea, life: 20, deck: 6 },
    );
    game.as(dash).playAttack(adrenalineRushRed);
    expectCombat(game).toHaveAttackPower(4);
  });
  it("timing: the buff does not affect a later attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [adrenalineRushRed],
        arsenal: [snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        life: 15,
        deck: 6,
      },
      { hero: azalea, life: 20, deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(adrenalineRushRed);
    game.closeCombat();
    Dash.playAttack(snatchRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Dash, adrenalineRushRed).toBeIn("graveyard");
  });
});
