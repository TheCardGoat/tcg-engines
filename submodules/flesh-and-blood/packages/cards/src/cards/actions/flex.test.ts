import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { flexRed } from "./flex.ts";

describe("Flex family AAA", () => {
  it("happy: paying two resources grants +2 power", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [flexRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: azalea, deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(flexRed, { stopAt: "on-attack" });
    Dash.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
  });
  it("boundary: declining the payment leaves printed power", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [flexRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: azalea, deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(flexRed, { stopAt: "on-attack" });
    Dash.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
  });
  it("timing: bonus lasts only for this attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [flexRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: azalea, deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(flexRed, { stopAt: "on-attack" });
    Dash.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();
    expectFabCard(Dash, flexRed).toBeIn("graveyard");
  });
});
