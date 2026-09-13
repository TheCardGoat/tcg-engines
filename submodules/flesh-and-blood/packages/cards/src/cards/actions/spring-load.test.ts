import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { springLoadRed } from "./spring-load.ts";

describe("Spring Load (ARA015) AAA", () => {
  it("happy: empty hand when this attacks grants +3{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [springLoadRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    game.as(dash).playAttack(springLoadRed);
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: a leftover hand card does not grant the buff", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [springLoadRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
    );
    game.as(dash).playAttack(springLoadRed);
    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: the +3{p} is only on this attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [springLoadRed],
        arsenal: [snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(springLoadRed);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
    expectFabCard(Dash, springLoadRed).toBeIn("graveyard");
    Dash.playAttack(snatchRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(4);
  });
});
