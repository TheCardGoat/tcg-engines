import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { humbleRed } from "./humble.ts";

describe("Humble family AAA", () => {
  it("happy: a hit applies the hero ability restriction", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [humbleRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: azalea, life: 20, deck: 6 },
    );
    game.as(dash).playAttack(humbleRed);
    game.closeCombat();
    expectFabPlayer(game.as(azalea)).toHaveLife(14);
  });
  it("boundary: a blocked attack does not apply the restriction", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [humbleRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: azalea, life: 20, deck: 6 },
    );
    game.as(dash).playAttack(humbleRed);
    game.closeCombat();
    expectFabPlayer(game.as(azalea)).toHaveLife(14);
  });
  it("timing: the card is a normal printed attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [humbleRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: azalea, life: 20, deck: 6 },
    );
    game.as(dash).playAttack(humbleRed);
    expectCombat(game).toHaveAttackPower(6);
  });
});
