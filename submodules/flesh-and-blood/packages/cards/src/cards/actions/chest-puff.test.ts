import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { chestPuffRed } from "./chest-puff.ts";

describe("Chest Puff (SUP222) AAA", () => {
  it("happy: paying {r} keeps printed 7{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [chestPuffRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(chestPuffRed, { stopAt: "on-attack" });
    Dash.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: declining the payment applies -1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [chestPuffRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(chestPuffRed, { stopAt: "on-attack" });
    Dash.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: the -1{p} is only on this attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [chestPuffRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(chestPuffRed, { stopAt: "on-attack" });
    Dash.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();
    expectFabCard(Dash, chestPuffRed).toBeIn("graveyard");
  });
});
