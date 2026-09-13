import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { blusterBuffRed } from "./bluster-buff.ts";

describe("Bluster Buff (SUP221) AAA", () => {
  it("happy: paying {r} keeps printed 6{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [blusterBuffRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(blusterBuffRed, { stopAt: "on-attack" });
    Dash.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: declining the payment applies -1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [blusterBuffRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(blusterBuffRed, { stopAt: "on-attack" });
    Dash.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: the -1{p} is only on this attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [blusterBuffRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(blusterBuffRed, { stopAt: "on-attack" });
    Dash.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
    expectFabCard(Dash, blusterBuffRed).toBeIn("graveyard");
  });
});
